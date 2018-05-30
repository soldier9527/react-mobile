import React, { Component } from 'react';
import Navbar from '../../common/navbar';
import  message from 'antd/lib/message';
import Api from '../../api';
import MaskLoading from '../../common/maskLoading';
import Trace from "./trace"
import Calc from '../components/calc';
import ConfirmModal from '../components/ConfirmModal';

export default class TraceSingle extends Component {
    constructor(props) {

        super(props);
        let data =JSON.parse(props.location.query.data);
        this.state={
            lottery_id:data.lottery_id,
            issue:[],//彩种期号
            data:data,
            mid:"",
            rebate: 0,//基础赔率
            zhushu:1,
            tableList:[{"title":"五星定位","method_id":48,"content":["3","","","",""],"zhushu":1,"money":2,"mode":1}],
            beishu:1,
            mode:1,//模式  元1  角0.1 分0.01
            total_zhushu:1,
            total_money:0,
            // 以下追号相关
            showTrace: false,
            baseMoney:0,//基础金额
            traceIssues: [],    // 追号期数
            traceBeishu: 1,     // 追号倍数
            traceQishu: 1,      // 追号期数
            stopOnWin: 0,       // 中奖即停
            traceStart: 0,      // 追号起始期序号
            traceAllChecked: true,   // 追号全选 反选
            traceList: [],      // 追号数据
            sliderValue:parseFloat(data.rebate),
            showConfirmModal:false,
        };
        // 追号相关
        this.startTrace = this.startTrace.bind(this);   // 开始追号
        this.stopOnWinChange = this.stopOnWinChange.bind(this); // 中奖即停
        this.traceBeishuChange = this.traceBeishuChange.bind(this); // 倍数更改
        this.traceBeishuOnBlur = this.traceBeishuOnBlur.bind(this); // 倍数更改
        this.traceQishuChange = this.traceQishuChange.bind(this); // 期数更改
        this.traceQishuOnBlur = this.traceQishuOnBlur.bind(this); // 期数更改
        this.traceStartChange = this.traceStartChange.bind(this); // 起始期数更改
        this.traceSelectChange = this.traceSelectChange.bind(this); // 追号列表 选中/取消 当前期
        this.traceSelectAllChange = this.traceSelectAllChange.bind(this); // 追号列表 选中/取消 当前期
        this.traceSingleBeishuChange = this.traceSingleBeishuChange.bind(this); // 追号列表 单条倍数更改
        this.traceListUpdate = this.traceListUpdate.bind(this); // 追号列表更新
        this.traceSubmit = this.traceSubmit.bind(this); // 确认追号
    }
    componentWillMount(){
        let data = this.state.data;
        let tableList=[];
        let total_money=0;
        let total_zhushu=0;
        // debugger
        data.oreder_detail.map((item,i)=>{
            item.comment.map((content,j)=>{
                let col = {
                    "method_id": item.mid,
                    "content": content.code.replace(/\s+/g,"").split("|"),
                    "zhushu":item.num,
                    "money": item.amount,
                    "mode": data.betting_factor,
                };

                tableList.push(col);
            });
            total_money+=parseFloat(item.amount);
            total_zhushu+=item.num;
        });
        let mode =Calc.getCurentMode(data.betting_mode);
        this.setState({
            mode:mode,
            tableList:tableList,
            total_money:parseFloat(total_money),
            total_zhushu:total_zhushu,
        })
    }
    componentDidMount(){
        this.startTrace();
    }

    // 开始追号
    startTrace() {
        let mids = [];

        const tableList = this.state.tableList;
        tableList.forEach((t) => {
            mids.push(t.method_id);
        });
        Api('c=game&a=play', {
            op: 'getTracePage',
            lotteryId: this.state.lottery_id,
            mids: mids.join(','),
        }, (res) => {
            if(res.data) {
                let beishu=1;
                let baseMoney=this.state.total_money/beishu;
                this.setState({
                    traceBeishu:beishu,
                    traceIssues: res.data.issues,
                    baseMoney:baseMoney,
                    traceList: [{
                        checked: true,
                        issue: res.data.issues[0],
                        beishu: beishu,
                        money: baseMoney*beishu,
                        amount: baseMoney*beishu
                    }]
                }, () => {

                    this.setState({showTrace: true});
                });
            }
        });
    }

    //开奖即停
    stopOnWinChange(e) {
        this.setState({stopOnWin: e.target.checked ? 1 : 0});
    }
    //倍数改变
    traceBeishuChange(e) {
        let beishu =e.target.value;
        if(beishu===""){
            this.setState({traceBeishu: beishu});
            return false;
        }else if(beishu==="0"){
            beishu=1;
        }else{
            beishu = parseInt(beishu) < 0 ? 0 : parseInt(beishu);
        }
        if(beishu !=="0"&&beishu!==""){
            const traceList = this.state.traceList;

            const baseMoney = this.state.baseMoney;

            traceList.forEach((t, i) => {
                this.state.traceList[i]['beishu'] = beishu;
                this.state.traceList[i]['money'] = baseMoney * beishu;
                this.state.traceList[i]['amount'] = baseMoney * beishu * (i + 1);
            });

        }


        this.setState({traceBeishu: beishu});
    }

    traceBeishuOnBlur(e) {
        let beishu =e.target.value;

        if(beishu==="0"||beishu===""){
            beishu=1;
        }

        let traceList = this.state.traceList;

        let baseMoney = this.state.baseMoney;

        traceList.forEach((t, i) => {
            this.state.traceList[i]['beishu'] = beishu;
            this.state.traceList[i]['money'] = baseMoney * beishu;
            this.state.traceList[i]['amount'] = baseMoney * beishu * (i + 1);
        });

        this.setState({traceBeishu: beishu});
    }
    //修改期数
    traceQishuChange(e) {
        let qishu =e.target.value;
        if(qishu===""||qishu==0){
            this.setState({traceQishu: qishu});
            return false;
        }else{
            qishu = parseInt(qishu) < 0 ? 1 : parseInt(qishu);
        }
        if(qishu!=="0"&&qishu!=="") {
            const issues = this.state.traceIssues;
            const traceStart = Number(this.state.traceStart);
            const baseMoney = this.state.baseMoney;
            const beishu = this.state.traceBeishu;
            let list = [];
            let flag = 0;

            for (let i = traceStart; i < qishu + traceStart; i++) {
                if (issues[i] === undefined) {
                    break;
                }
                list.push({
                    checked: true,
                    issue: issues[i],
                    beishu: beishu,
                    money: baseMoney * beishu,
                    amount: baseMoney * beishu * (flag + 1),
                });
                flag++;
            }
            this.setState({traceQishu: qishu > list.length ? list.length : qishu, traceList: list});

        }
        if(qishu!=="0"){
            this.setState({traceQishu: qishu });
        }
    }
    traceQishuOnBlur(e) {
        let qishu = e.target.value;
        if(qishu==0||qishu===""){
            qishu=1;
        }else{
            qishu = parseInt(qishu) < 0 ? 1 : parseInt(qishu);
        }
        const issues = this.state.traceIssues;
        const traceStart = Number(this.state.traceStart);
        const baseMoney = this.state.baseMoney;
        const beishu = this.state.traceBeishu;
        let list = [];
        let flag = 0;

        for (let i = traceStart; i < qishu + traceStart; i++) {
            if(issues[i] === undefined) {
                break;
            }
            list.push({
                checked: true,
                issue: issues[i],
                beishu: beishu,
                money: baseMoney * beishu,
                amount: baseMoney * beishu * (flag + 1),
            });
            flag++;
        }
        this.setState({traceQishu: qishu > list.length ? list.length : qishu, traceList: list});
    }
    //
    traceStartChange(val) {
        this.setState({traceStart: val}, () => {
            this.traceQishuChange({
                target: {value: this.state.traceQishu}
            });
        });
    }

    //勾选某一期 不买
    traceSelectChange(i) {
        let traceList = JSON.parse(JSON.stringify(this.state.traceList));
        traceList[i]['checked'] = !this.state.traceList[i]['checked'];
        this.setState({
            traceList:traceList
        });
        this.traceListUpdate(traceList);
    }
    traceSelectAllChange() {
        const list = JSON.parse(JSON.stringify(this.state.traceList));
        const checked = !this.state.traceAllChecked;
        list.forEach((l) => {
            l['checked'] = checked;
        });
        this.setState({traceAllChecked: checked});

        this.traceListUpdate(list);
    }
    traceSingleBeishuChange(i, evt) {
        let beishu =evt.target.value;
        let traceList = JSON.parse(JSON.stringify(this.state.traceList));

        if(beishu===""){
            traceList[i]['beishu']="";
        }else{
            traceList[i]['beishu'] = parseInt(beishu) < 0 ? 0 : parseInt(beishu);
        }
        this.setState({
            traceList:traceList
        });
        this.traceListUpdate(traceList);
    }
    traceListUpdate(traceList) {
        const baseMoney = this.state.baseMoney;
        let sum = 0;
        traceList.forEach((item, i) => {
            if(item['checked']) {
                sum += Number(item['beishu']);
                item['money'] = item['beishu'] * baseMoney;
                item['amount'] = sum * baseMoney;
            } else {
                item['money'] = 0;
                item['amount'] = 0;
            }
        });
        this.setState({
            traceList:traceList
        });
    }
    traceSubmit() {
        let data = this.state.tableList;
        let traceList = this.state.traceList;
        if(this.state.traceList[this.state.traceList.length-1].amount<=0){
            message.error("至少选择一注");
            return false;
        }
        const getRandChar = (len) => {
            len = len || 36;
            const timestamp = new Date().getTime();
            const x = "0123456789qwertyuiopasdfghjklzxcvbnm";
            let random = '';
            for (let i = 0; i < len; i++) {
                random += x.charAt(Math.floor(Math.random() * x.length));
            }

            return timestamp + random;
        };

        let codes = "";
        data.map((item,i)=>{
            codes += item.method_id + ':' + item.content +"#"
        });
        codes=codes.substr(0,codes.length-1);
        let postObj = {
            op: 'buy',
            lotteryId: parseInt(this.state.lottery_id),
            curRebate:  (this.state.sliderValue/this.state.mode/2).toFixed(4),
            codes: codes,
            modes: this.state.mode,
            stopOnWin: this.state.stopOnWin,
            token: getRandChar(32),
            traceData:[]
        };
        for (let i = 0,index=0; i < traceList.length; i++) {
            if(traceList[i].checked){

                let t = traceList[i];
                if(t.checked&&t.beishu) {
                    postObj["traceData"].push({
                        "issue":t.issue,
                        "multiple":t.beishu+"",
                    });
                    // postObj['traceData[' + index + '][issue]'] = t.issue;
                    // postObj['traceData[' + index + '][multiple]'] = t.beishu;
                }

                index++
            }

        }
        postObj['issue']=postObj['traceData'][0]["issue"];
        MaskLoading(5);
        Api('c=game&a=play', postObj, (res) => {
            MaskLoading(false);
            if(res.errno === 0) {
                message.success('购买成功', 2);
                this.props.history.goBack();
            } else {
                message.error(res.msg);
            }
        });
    }
    handleShowConfirm(){

        if(this.state.traceList[this.state.traceList.length-1].amount<=0){
            message.error("至少选择一注");
            return false;
        }
        this.setState({
            showConfirmModal:true,
            showConfirmType:"z"
        });
    }
    render() {
        let traceList=this.state.traceList;
        let issue="";
        for (let i = 0,index=0; i < traceList.length; i++) {
            if(traceList[i].checked&&traceList[i].beishu){
                issue=traceList[i].issue;
                i=traceList.length;
            }

        }

        return (
            <div>
                <Navbar  title="追号管理" back="back"/>
                <div>
                    <Trace
                        zhushu={this.state.total_zhushu}
                        baseMoney={this.state.total_money}
                        traceIssues={this.state.traceIssues}
                        traceBeishu={this.state.traceBeishu}
                        traceQishu={this.state.traceQishu}
                        stopOnWinChange={this.stopOnWinChange}
                        traceBeishuChange={this.traceBeishuChange}
                        traceBeishuOnBlur={this.traceBeishuOnBlur}
                        traceQishuChange={this.traceQishuChange}
                        traceQishuOnBlur={this.traceQishuOnBlur}
                        traceStartChange={this.traceStartChange}
                        traceSelectChange={this.traceSelectChange}
                        traceSelectAllChange={this.traceSelectAllChange}
                        traceAllChecked={this.state.traceAllChecked}
                        traceSingleBeishuChange={this.traceSingleBeishuChange}
                        traceList={this.state.traceList}
                        traceSubmit={()=>{this.handleShowConfirm()}} />

                    <ConfirmModal
                        visible={this.state.showConfirmModal}
                        confirmtype="z"
                        issue={issue}
                        total_zhushu={this.state.total_zhushu}
                        mode={this.state.mode}
                        beishu={this.state.traceBeishu}
                        total_money={this.state.total_money}

                        //{/*追号*/}
                        traceList={this.state.traceList}
                        onOk={()=>{this.traceSubmit()}}
                        onCancel={()=>{this.setState({"showConfirmModal":false})}}
                    />
                </div>
            </div>
        );
    }
}
