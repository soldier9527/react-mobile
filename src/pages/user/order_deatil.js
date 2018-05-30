import React, { Component} from 'react';
import { Link} from 'react-router-dom';
import Navbar from '../common/navbar';
import Modal from 'antd/lib/modal';
import  Table from 'antd/lib/table';
import  message from 'antd/lib/message';
const confirm = Modal.confirm;
import Api from '../api';
import MaskLoading from '../common/maskLoading';// 防止重复点击
// import Game from '../lottery/components/game';
export default class Order_Deatil extends Component {
    constructor(props) {
        super(props);
        this.state={
            show_status:"",
            order_data:[],
            allSelect:false,
            winSelect:false,
            SelectAll:false,
            winList:false,
            winingList:[],
            wrap_id:"",
            trace_no:"",
            lottery_status:"",
        };
    }
//彩种禁用
    czForbidden(e){
        message.config({
            top: 200
        });
        message.warn('此彩种不存在或已被禁用',2);
    }
// 普通撤单
    biHhowConfirm() {//弹窗
        let _this=this;
        let wrap_id=this.state.wrap_id;
        confirm({
            title: '提示',
            content: '您确定撤销此订单?',
            onOk() {
                MaskLoading(5);
                Api("c=game&a=cancelPackage",{wrap_id:wrap_id},(res)=>{
                    MaskLoading(false);
                    _this.getOrderDetails();
                })
            },
            onCancel() {}
        });
    }
    // 追号撤单
    AfterHhowConfirm() {//弹窗
        let _this=this;
        let trace_no=this.state.trace_no;
        let item_isue=document.getElementsByName('item-isue');
        let order_data=this.state.order_data;
        let length=order_data.length;
        let cancelList={
            'wrap_id':trace_no,
            'pkids':[]

        };//订单期号数组
        let isNull=true;//判断选择的订单期号是否为空
        for(let i=0;i<length;i++){
            if(item_isue[i].checked==true){
                cancelList.pkids.push(order_data[i].package_id);
                // cancelList['pkids['+ i +']'] = order_data[i].package_id;
                isNull=false;
            }
        }
        // cancelList['wrap_id'] = trace_no;

        if(isNull){

            message.config({
                top: 50,
                duration: 1,
            });
            message.warn('请选择想要撤销的追单号',2,()=>{});
        }else{
            confirm({
                title: '提示',
                content: '您确定撤销此追号订单?',
                onOk() {
                    MaskLoading(5);
                    let all_check=document.getElementsByName('all-check')[0];
                    if(all_check.checked){
                        Api("c=game&a=cancelAllTrace",{wrap_id:trace_no},(res)=>{
                            MaskLoading(false);
                            _this.getOrderDetails();
                            for(let j=0;j<length;j++){
                                item_isue[j].checked=false;
                            }

                        })
                    }else{
                        Api("c=game&a=cancelTrace",cancelList,(res)=>{
                            MaskLoading(false);
                            _this.getOrderDetails();//刷新
                            for(let j=0;j<length;j++){
                                item_isue[j].checked=false;
                            }

                        })
                    }

                },
                onCancel() {},
            });
        }
    }
    componentWillMount(){
        this.getOrderDetails();
    };
    getOrderDetails(){
        let query=JSON.parse(this.props.location.query.query);
        let status=query.status;
        if(this.props.location.query.page==3){
            status=1
        }else{
            status=2
        }
        // 0:未开奖 1:已中奖 2:未中奖 3:个人撤单
        Api("c=game&a=packageDetail&type="+status+"&wrap_id="+query.wrap_id,null,(res)=>{
            this.setState({show_status:res.data,
                wrap_id:res.data.wrap_id,
                trace_no:res.data.trace_no,
                lottery_status:res.data.lottery_status
            })
            let  data=res.data;
            let ListData=data.issue_detail;
            let lottery_status=data.lottery_status
            this.setState({
                order_data:ListData
            })
        })
    }

    //路径判断
    fiflerPath(lottery_id){
        let path = '';
        if([1, 4,11,18, 8,24].indexOf(lottery_id) !== -1) {
            path = 'ssc/' + lottery_id;
        } else if([2, 5, 6, 7,16].indexOf(lottery_id) !== -1) {
            path = '11x5/' + lottery_id;
        }else if([9].indexOf(lottery_id) !== -1) {
            path = 'fc3d/' + lottery_id;
        }else if([12,13,19,20,27,28,29,30].indexOf(lottery_id) !== -1) {
            path = 'k3/' + lottery_id;
        }else if([21,25].indexOf(lottery_id) !== -1) {
            path = 'lhc/' + lottery_id;
        } else if([14].indexOf(lottery_id) !== -1) {
            path = 'klpk/' + lottery_id;
        }else if([10].indexOf(lottery_id) !== -1) {
            path = 'p3p5/' + lottery_id;
        }else if([22].indexOf(lottery_id) !== -1) {
            path = 'ssq/' + lottery_id;
        }else if([23].indexOf(lottery_id) !== -1) {
            path = 'xy28/' + lottery_id;
        }else if([17,26].indexOf(lottery_id) !== -1) {
            path = 'pk10/' + lottery_id;
        }else if([15].indexOf(lottery_id) !== -1){
            path = 'mmc/' + lottery_id;
        }
        return path;
    }
    //全选和全不选
    handleAllSelect(e){
        // if(e.target.value){
        //     this.setState({
        //         winSelect:false
        //     })
        // }
        let item_isue=document.getElementsByName('item-isue');
        let all_check=document.getElementsByName('all-check')[0];
        let win_check=document.getElementsByName('win-check')[0];
        let length=this.state.order_data.length;
        let allChecked=e.target.checked;
        let data=this.state.show_status;
        if(win_check.checked){
            all_check.checked=false;
        }
        if(data.show_status==="未中奖"||data.show_status==="已中奖"||data.show_status==="已完成"){
            all_check.checked=false;
            message.config({
                top: 200
            });
            message.warn('抱歉，没有可撤销的期号');
        }
        for(let i=0;i<length;i++){
            if(this.state.order_data[i].can_cancel===1 && item_isue.length>0){
                item_isue[i].checked=allChecked;
            }
        }
        if(allChecked){
            win_check.checked=false;
        }
        this.setState({winList:false})
        // this.setState({
        //         allSelect:!this.state.allSelect
        // })
    }
    // haveWinning(e){
    // 	if(this.state.winList){
    // 		this.setState({winList:false})
    // 	}else{
    //
    //               this.setState({winList:true})
    // 		}
    // 	}
    handleWinSelect(e){
        // if(e.target.value){
        //     this.setState({
        //         allSelect:false
        //     })
        // }
        let all_check=document.getElementsByName('all-check')[0];
        if(e.target.checked){
            all_check.checked=false;
            this.setState({winList:true})
        }else{
            this.setState({winList:false})
        }

    }
 //保留四位小数
    toFixed (value, n) {
        // value = value.toFixed(8);
        var f = parseInt(value*Math.pow(10,n))/Math.pow(10,n);
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            s += '.';
        }
        for(var i = s.length - s.indexOf('.'); i <= n; i++){
            s += "0";
        }
        return s;
    }
   
    //单个期号的onChange事件
    selectItem(e){
        let self_check=e.target.checked;
        let all_check=document.getElementsByName('all-check')[0];
        let item_isue=document.getElementsByName('item-isue');
        let length=this.state.order_data.length;
        if(length==0){
            return;
        }

        for(let i=0;i<length;i++){
            item_isue[i].index=i;
            if(this.state.order_data[i].can_cancel==0){
                item_isue[i].checked=false;
            }
        }
        let index=e.target.index;
        if(this.state.order_data[index].can_cancel==0){
            message.config({
                top: 200
            });
            message.warn('抱歉，当前期号不能撤销',2,()=>{});
        }
        for(let i=0;i<length;i++){
            if(this.state.order_data[i].can_cancel==1){
                //如果所有的勾选状态都相同，全选按钮也与此相同
                if(item_isue[i].checked!==self_check){
                    //有不同的，全选按钮不勾选
                    all_check.checked=false;
                    return;
                }else{
                    all_check.checked=self_check;
                }
            }
        }

    }
    render() {
        
         let _this=this;
        if(!this.state.show_status){
            return null
        }
        let data= this.state.show_status;
        const columns = [
            { title: '玩法名称', dataIndex: 'gamename', key: 'gamename' },
            { title: '投注内容', dataIndex: 'getcontent', key: 'getcontent'},
            { title: '投注注数', dataIndex: 'getnumber', key: 'getnumber'},
            { title: '金额', dataIndex: 'jiner', key: 'jiner'},
        ];
        let tableDate=[];
        data.oreder_detail.map((item,i)=>{
            let getcontent=[];
            item.comment.map((num,j)=>{
                getcontent.push(<div key={j}>{num.code},</div>)
            })
            tableDate.push({
                key: i,
                gamename:item.game_name,
                getcontent:getcontent ,
                getnumber: item.num,
                jiner: item.amount
            })
        });
        let list=[];
        let  ListData = this.state.order_data;
        if(ListData){
            if(this.state.winList){
                ListData.map((item,i)=>{
                    if(item.status==1){
                        list.push(
                            <div className="list_chase" key={i}>
                                <ul>
                                    <li>操作</li>
                                    <li>追号期号</li>
                                    <li>{item.chase_num}</li>
                                </ul>
                                <ul>
                                    <li><input type="checkbox"/></li>
                                    <li>中奖号码</li>
                                    <li>{item.winning_nums}</li>
                                </ul>
                                <ul>
                                    <li></li>
                                    <li>中奖金额</li>
                                    <li>{parseFloat(item.prize).toFixed(3)}</li>
                                </ul>
                                <ul>
                                    <li></li>
                                    <li>订单状态</li>
                                    <li>{item.show_status}</li>
                                </ul>
                            </div>

                        )
                    }
                })
            }else{
                ListData.map((item,i)=>{
                    if(this.state.SelectAll){
                        if(item.status!==0){
                        }
                    }
                    list.push(
                        <div className="list_chase" key={i}>
                            <ul>
                                <li>操作</li>
                                <li>追号期号</li>
                                <li>{item.chase_num}</li>
                            </ul>
                            <ul>
                                <li><input type="checkbox" name="item-isue"
									// checked={item.can_cancel==0?false:null}
                                           onClick={(e)=>{this.selectItem(e)}}
                                />
                                </li>
                                <li>中奖号码</li>
                                <li>{item.winning_nums}</li>
                            </ul>
                            <ul>
                                <li></li>
                                <li>中奖金额</li>
                                <li>{parseFloat(item.prize).toFixed(3)}</li>
                            </ul>
                            <ul>
                                <li></li>
                                <li>订单状态</li>
                                <li>{item.show_status}</li>
                            </ul>
                        </div>
                    )})
            }}
        // 判断追号实际期数
        let zhuihaoshu=0;
        if(this.props.location.query.page==3){
            let sjzhuihao=data.issue_detail;
            sjzhuihao.map((item,i)=>{
                if(item.show_status=="已中奖" ||item.show_status=="未中奖"||item.show_status=="未开奖"){
                    zhuihaoshu++;
                }
            })

        }
        return (
            <div>
                <Navbar  title="订单详情" back="back"/>
                <div className="order-detail-wrap">
                    {/*普通訂單詳情*/}
                    {this.props.location.query.page<3 ?<div className="order_deatil">
                        <p><span className="fl">订单号：</span><span className="fl">{data.wrap_id}</span><span className="fr">{data.show_status}</span></p>
                        <div className="table">
                            <div className="table_left fl">
                                <i className={"lt-icon lt-icon-"+data.lottery_id}></i><span>{data.lottery_name}</span>
                            </div>
                            <div className="table_toLeft">
                                <ul>
                                    <li>
                                        <span>第</span><span>{data.award_period}</span><span>期</span>
                                        <span className="ddu">{data.create_time}</span>
                                    </li>
                                    <li>
                                        <span>开奖号码：</span>{data.winning_nums}
                                    </li>
                                    <li>
                                        <span>单倍注数:{data.single_number}</span>
                                        <span className="ddu">模式：{data.betting_mode}</span>
                                    </li>
                                    <li>
                                        <span>投注倍数：{data.betting_factor}</span>
                                        <span className="ddu" >是否追号：{data.is_trace==1?"是":"否"}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="table_toRight">
                            <ul>
                                <li>
                                    <span>总金额：<span className="bbuColor">{_this.toFixed(data.total_amount,3)}</span></span>
                                    <span className="bbu">中奖金额：<span className="bbuColor">{_this.toFixed(parseFloat(data.winning_amount),3)}</span></span>
                                </li>
                                <li>
                                    <span>返点：<span className="bbuColor">{_this.toFixed(data.rebate,3)}</span></span>
                                    <span className="bbu">订单盈亏：<span className="bbuColor">{data.show_status=="未开奖"?"未开奖":_this.toFixed(parseFloat(data.profit_loss.replace(/,/g, "")),3)}</span></span>{/*去掉中间的逗号转为数字省略小数点后三位*/}
                                </li>
                            </ul>
                        </div>

                        <Table columns={columns} dataSource={tableDate}></Table>
                    </div>:null}
                    {/*追號訂單詳情*/}
                    {this.props.location.query.page>=3 ?<div className="order_deatil">
                        <p><span className="fl">订单号：</span><span className="fl">{data.trace_no}</span><span className="fr">{data.show_status}</span></p>
                        <div className="table">
                            <div className="table_left fl">
                                <i className={"lt-icon lt-icon-"+data.lottery_id}></i><span>{data.lottery_name}</span>
                            </div>
                            <div className="table_toLeft">
                                <ul>
                                    <li>
                                        <span>第</span><span>{data.award_period}</span><span>期</span>
                                        <span className="ddu">{data.create_time}</span>
                                    </li>
                                    <li>
                                        <span>总追号倍数：{data.total_chase_number}</span>
                                        <span className="ddu">单倍注数：{data.single_number}</span>
                                    </li>
                                    <li>
                                        <span>计划追号期数:{data.plan_number}</span>
                                        <span className="ddu">模式：{data.betting_mode}</span>
                                    </li>
                                    <li>
                                        <span>实际追号期数：{zhuihaoshu}</span>
                                        <span className="ddu" >中奖即停止：{data.is_stop_on_win==1?"是":"否"}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="table_toRight">
                            <ul>
                                <li>
                                    <span>计划总金额：<span className="bbuColor">￥{_this.toFixed(parseFloat(data.plan_total_amount),3)}</span></span>
                                    <span className="bbu">中奖金额：<span className="bbuColor">￥{_this.toFixed(parseFloat(data.total_prize),3)}</span></span>
                                </li>
                                <li>
                                    <span>返点：<span className="bbuColor">￥{_this.toFixed(data.total_rebate,3)}</span></span>
                                    <span className="bbu">当前盈亏：<span className="bbuColor">{data.show_status=="进行中"?"进行中":_this.toFixed(parseFloat(data.total_profit_loss.replace(/,/g, "")),3) }</span></span>
                                </li>
                            </ul>
                        </div>
                        <Table columns={columns} dataSource={tableDate}></Table>
                        <div className="ChaseNumber">
                            <ul className="input_box">
                                <li><label><input type="checkbox"  name="all-check"  onClick={(e)=>{this.handleAllSelect(e)}}/> <p>全选</p></label></li>
                                <li><h2>各期追号详情</h2></li>
                                <li><label><input type="checkbox" name="win-check"  onClick={(e)=>{this.handleWinSelect(e)}}/> <p>已中奖</p></label></li>
                            </ul>
                            <div className="list_chase">
                                {list}
                            </div>
                        </div>
                    </div>:null}
                    {/*普通訂單按鈕*/}
                    {this.props.location.query.page<3 ?<div className="xdButton">
                        <Link to="/hall?_k">
                            <button className="cx_button">重新下单</button>
                        </Link>
                        <Link to={this.fiflerPath(parseInt(this.state.show_status.lottery_id))}>
                            <button className="jx_button" >继续下单</button>
                        </Link>

                    </div>:null}
                    {/*追号订单追号*/}
                    {this.props.location.query.page>=3||data.show_status==="未中奖"||data.show_status==="已中奖" ?<div className="xdButton">
                        <Link to={this.fiflerPath(parseInt(this.state.show_status.lottery_id))}>
                            <button className="cx_button">重新下单</button>
                        </Link>
                        <Link to={{pathname:"TraceSingle",query:{
                                id:this.state.show_status.lottery_id,
                                data:JSON.stringify(this.state.show_status)}}}>
                            <button className="jx_button">追号</button>
                        </Link>
                    </div>:null}
                    {/*判斷彩種是否有追號功能   以下四種沒有*/}
                    {data.lottery_id===26 || data.lottery_id===21 || data.lottery_id===9 || data.lottery_id===22 || data.lottery_id===25 ||data.is_xgame===1?<div className="xdButton">
                        <Link to={this.fiflerPath(parseInt(this.state.show_status.lottery_id))}>
                            <button className="cx_button">重新下单</button>
                        </Link>
                        <Link to={this.fiflerPath(parseInt(this.state.show_status.lottery_id))}>
                            <button className="jx_button" >继续下单</button>
                        </Link>
                    </div>:null}
                    {/*普通撤單*/}
                    {data.show_status==="未开奖" ?<div className="xdButton">
                        <Link to={this.fiflerPath(parseInt(this.state.show_status.lottery_id))}>
                            <button className="cx_button">继续下单</button>
                        </Link>
                        <button className="jx_button" onClick={this.biHhowConfirm.bind(this)}>撤单</button>
                    </div>:null}
                    {/*彩种禁用*/}
                    {data.lottery_status==0 ?<div className="xdButton">
                        <Link onClick={(e)=>{this.czForbidden(e)}}>
                            <button className="cx_button">继续下单</button>
                        </Link>
                        <button className="jx_button" onClick={this.biHhowConfirm.bind(this)}>撤单</button>
                    </div>:null}
                    {/*追号订单撤单*/}
                    {data.show_status==="进行中"||data.show_status==="未开始"?<div className="xdButton">
                        <Link to={this.fiflerPath(parseInt(this.state.show_status.lottery_id))}>
                            <button className="cx_button">继续下单</button>
                        </Link>
                        <button className="jx_button" onClick={this.AfterHhowConfirm.bind(this)}>撤单</button>
                    </div>:null}
                </div>
            </div>
        );
    }
}
