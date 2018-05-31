import React from 'react';
import ReactDOM from 'react-dom';
import Api from '../../api';
import {Link} from 'react-router-dom';
import Navbar from '../../common/navbar';
import MaskLoading from '../../common/maskLoading';
import ShowMessage from '../../common/globalMessage';
import LotteryHead from '../components/lotteryHead';//头部信息展示
import LotteryBottom from '../components/lotteryBottom';//底部投注条
import NavTabRight from '../components/navTabRight';//右侧切换
import TouzhuCart from '../components/TouzhuCart'
import Trace from '../components/trace'
import ConfirmModal from '../components/ConfirmModal';
import GetLotteryList from '../../get_lottery_list'
import DESCRIPTION from './description'
import Animate from '../components/animate'
import Modal from 'antd/lib/modal';
import  message from 'antd/lib/message';
import getStaticData from '../../common/getStatic'
//1
export let LotteryCommon = ComposeComponent => class extends ComposeComponent {
    static displayName = 'LotteryCommon';
    constructor(props) {
        super(props);
        let type = props.history.location.search&&new URLSearchParams(props.history.location.search).get('type')
        if([26].indexOf(parseInt(this.props.match.params.id))!==-1){
            type="x"
        }else if([15].indexOf(parseInt(this.props.match.params.id))!==-1){
            type="g"
        }
        this.state = {
            lottery_id:this.props.match.params.id,
            // lottery_id:19,
            lottery_name:"",
            showList:false,//彩种列表显示
            showMask:false,//遮罩层
            navBarTitle:"",
            showNavbarRight:false,//显示操作下拉
            showPlayFunc:false,//显示玩法
            balance:"",//余额
            winMoney:"",//盈亏
            game_key:type?type:"x",//官方g 信用x
            lotterys:[],
            issue:"",//彩种期号
            openedIssues:[],//最新5期开奖
            lastOpenCode:"",//最近一期开奖号码
            lastOpenissue:[],//上一期开奖期数
            intervalId:null,
            kTime:0,//休市
            countDownType:"normal",
            ltOpenSetTime:null,//封盘定时器15s
            showTab:false,
            one_level_menu:[],//一级菜单
            two_level_menu: [],//二级菜单
            method_name: "",//玩法名字
            menu_foucsed:[0,0],//菜单被选中
            method_id:0,
            cur_method:[],//当前玩法数组
            gamePrize:0,//拉杆赔率
            methods:[],//所有玩法信息
            sliderValue: 0.0,
            sliderConfig:null,
            showSlider: false,//反点Slider条
            minRebateGaps:{},
            rebate: 0,//基础赔率
            buttonType:[],//大小单双选中数组
            prize:[],//玩法赔率
            cart:[],// 当前购物车
            total_profit:0,//总返水
            maxCombPrize: 0,
            zhushu:0,
            content:"",
            md:null,
            showcart:false,//购物车页面
            loading:false,//购物车loading
            tableList:[],
            beishu:1,
            cishu:1,//秒秒彩次数，只有秒秒彩用到cishu
            mode:1,//模式  元1  角0.1 分0.01
            modeArr:[],//后台传过来的模式数组
            qihaoData: [], // 追号期号列表
            isStopZhuihao:true,
            modalVisible:false,
            zhDataForSubmit:[],
            total_zhushu:0,
            total_money:0,
            money:0,//信用玩法确认投注 金钱
            wanfa:"",
            showConfirmType:"x",//确认弹框样式，x:信用  g:官方  z:追号
            showConfirmModal:false,//信用玩法投注 模态框显示隐藏
            showMMCanimation:false,//显示mmc动画
            mmcData:[],//mmc数据
            divisor:1,//除数  防止多位小数，不准确
            //单式玩法增加字段
            multiple:true,//是否多注，用来拆分

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


            //两面盘
            isLiangMian:false,//是否两面盘
            liangmianZhushu:{}
        };

        this.keepPlaying = this.keepPlaying.bind(this); // 继续投注
        this.addNumber = this.addNumber.bind(this); //添加号码
        this.submitbuy = this.submitbuy.bind(this); //直接投注所有结果
        this.clearCart = this.clearCart.bind(this); // 清空购彩篮
        this.setModalVisible = this.setModalVisible.bind(this)

        this.qihaoCheck = this.qihaoCheck.bind(this) //追号期号单个勾选
        this.beishuChange = this.beishuChange.bind(this) // 倍数onchange事件
        this.beishuOnBlur = this.beishuOnBlur.bind(this) // 倍数beishuOnBlur事件
        this.cishuChange = this.cishuChange.bind(this) // 倍数onchange事件
        this.modeChange = this.modeChange.bind(this)

        // 追号相关
        this.startTrace = this.startTrace.bind(this);   // 开始追号
        this.cancelTrace = this.cancelTrace.bind(this); // 取消追号
        this.stopOnWinChange = this.stopOnWinChange.bind(this); // 中奖即停
        this.traceBeishuChange = this.traceBeishuChange.bind(this); // 倍数更改
        this.traceBeishuOnBlur = this.traceBeishuOnBlur.bind(this); // 倍数更改
        this.traceQishuOnBlur = this.traceQishuOnBlur.bind(this); // 期数更改
        this.traceQishuChange = this.traceQishuChange.bind(this); // 期数更改
        this.traceStartChange = this.traceStartChange.bind(this); // 起始期数更改
        this.traceSelectChange = this.traceSelectChange.bind(this); // 追号列表 选中/取消 当前期
        this.traceSelectAllChange = this.traceSelectAllChange.bind(this); // 追号列表 选中/取消 当前期
        this.traceSingleBeishuChange = this.traceSingleBeishuChange.bind(this); // 追号列表 单条倍数更改
        this.traceListUpdate = this.traceListUpdate.bind(this); // 追号列表更新
        this.traceSubmit = this.traceSubmit.bind(this); // 确认追号

        //注单详情页加减
        this.onAdd=this.onAdd.bind(this);
        this.onReduce=this.onReduce.bind(this);

    }
    componentWillMount(){
      const user = JSON.parse(sessionStorage.getItem("user"));
      if(user!=null ){
        this.getInitData();
        this.getLastOpen();
        this.getBalance();
          GetLotteryList((data)=>{
              this.setState({
                  lotterys:data
              })
          })

      }else{
          ShowMessage("请先登录","info");
        this.props.history.push("/login");
      }

    }
    //注单详情页加
    onAdd(){

        this.setState({beishu:this.state.beishu+1},()=>this.updateTableList());

    }
    //注单详情减少
    onReduce(){
        if(this.state.beishu<=1){
            return
        }
        this.setState({beishu:this.state.beishu-1},()=>this.updateTableList());
    }
    filterLottery(id){
        let path;
        if([1,3,4, 8,11,18,24].indexOf(id) !== -1) {
            path = 'ssc';
        } else if([2, 5, 6, 7,16].indexOf(id) !== -1) {
            path = '11x5';
        }else if([9].indexOf(id) !== -1) {
            path = 'fc3d';
        }else if([12,13,19,20,27,28,29,30].indexOf(id) !== -1) {
            path = 'k3';
        }else if([21,25].indexOf(id) !== -1) {
            path = 'lhc';
        } else if([14].indexOf(id) !== -1) {
            path = 'klpk';
        }else if([10].indexOf(id) !== -1) {
            path = 'p3p5';
        }else if([22].indexOf(id) !== -1) {
            path = 'ssq';
        }else if([23].indexOf(id) !== -1) {
            path = 'xy28';
        }else if([17].indexOf(id) !== -1) {
            path = 'pk10';
        }else if([26].indexOf(id) !== -1) {
            path = 'xyft';
        }else if([15].indexOf(id) !== -1) {
            path = 'mmc';
        }
        return "/"+path
    }
    changeLottery(id){
        let lotteryId=`${id}`;
        let oldPath=this.filterLottery(parseInt(this.state.lottery_id));
        let newPath=this.filterLottery(id);
        if(oldPath===newPath){
            this.setState({
                lottery_id:lotteryId,
                showList:false
            },()=>{
                this.getInitData();
                this.getLastOpen();
            });
        }else{
            this.props.history.push(newPath+"/"+id+"?type="+this.state.game_key);
        }
    }
    showLotteryList(e){
        this.setState({
            showList:true
        });
        e.stopPropagation();
    }
    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount(){
        if(this.state.intervalId){
            clearInterval(this.state.intervalId);
        }
        if(this.state.ltOpenSetTime){
            clearInterval(this.state.ltOpenSetTime);
        }
        if(this.state.lastIssueSetTime){
            clearTimeout(this.state.lastIssueSetTime);

        }

        this._isMounted = false;
    }
    //整合数据
    combineData(needCombineData){
        let data = getStaticData(this.state.game_key,(staticData)=>{
            let newData = JSON.parse(JSON.stringify(needCombineData))
            needCombineData.map((item,i)=>{
                item.childs.map((method,m)=>{
                    method =Object.assign({},staticData[method.name],method);
                    newData[i].childs[m]=method
                })
            })
            return newData;
        });
        return data
    }
    //初始化信息
    getInitData(game_key){
        if(this.state.lottery_id==="15"){
            game_key = "g"
        }
        if(!game_key){
            game_key =this.state.game_key;
        }
        // let data = sessionStorage.getItem(this.state.lottery_id+game_key);
        // if(data){
        //     this.transMethods(this.combineData(JSON.parse(data)));
        // }
        Api('c=game&a=initCaiZhong2&game_key='+game_key+'&lottery_id=' + this.state.lottery_id+"&historyLimit=8", null, (res) => {
            if(res.errno===0){
                let data = res.data;
                // sessionStorage.setItem(this.state.lottery_id+game_key,JSON.stringify(data.methods));
                let methods = this.combineData(data.methods);
                data.methods = methods;
                this.transMethods(data.methods);
                let sliderConfig=null;
                //当前游戏最高最低返点
                if(data['minRebateGaps']===1){
                    sliderConfig=data['minRebateGaps'][0];
                }else{
                    let max=data['minRebateGaps'][data['minRebateGaps'].length-1].to;
                    let min=data['minRebateGaps'][0].from;

                    sliderConfig={
                        from:min,
                        to:max
                    }
                }

                let gap=1;

                data['minRebateGaps'].map((item,i)=>{
                    if(item.gap<gap){
                        gap=item.gap;
                    }
                });



                let total_profit=parseFloat(data.lottery.total_profit);
                let rebate=parseFloat(data.rebate);//用户返点

                if(sliderConfig.to>=rebate){//当前游戏最高返点如果大于用户返点，则取用户返点
                    sliderConfig= {
                        gap: gap,
                        from: 0,
                        to: rebate
                    }
                }else{

                    sliderConfig= {
                        gap: gap,
                        from: rebate - sliderConfig.to,
                        to: rebate
                    };
                }

                // //用户返点减去当前玩法返点
                // let to_1 =sliderConfig.to;
                // sliderConfig={
                //     gap:gap,
                //     from:rebate-to_1,
                //     to:rebate
                // }
                let mode= game_key==="x"?0.5:1;
                //别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删
                //赔率算法
                // 1782*1*(1-total_profit+rebate-curRebste)/(1-total_profit)
                // 奖金*模式*(1-总返点+返点-当前返点)/(1-总返点)
                // 18*1*(1-0.1+0.095-0)/(1-0.1)    19.9
                // 3.6000*1*(1-0.1+0.095)/(1-0.1)
                //别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删别删
                let gamePrize = (10000 - total_profit*10000+rebate*10000-(sliderConfig.from*10000))*(mode*10000)/100000000;
                let divisor = 1-total_profit;

                this.setState({
                    gamePrize: gamePrize,
                    divisor:divisor,
                    maxCombPrize: data['maxCombPrize'],
                    lottery_name:data.lottery.cname,
                    methods:data.methods,
                    cart:[],// 当前购物车
                    mode:mode,
                    buttonType:[],//
                    zhushu:0,
                    showSlider:false,
                    sliderConfig:sliderConfig,
                    total_profit:total_profit,//总返水
                    rebate:rebate,//基础赔率
                    wanfa:data.methods,
                    modeArr:data.modes,
                    sliderValue:sliderConfig.from,
                    openedIssues:data.json_openedIssues//最新5期开奖

                });

            }else{return false}
        });
    }
    //最新开奖信息
    getLastOpen(){
        if(this.state.lottery_id==="15"){
            return;
        }
        Api('c=game&a=play&remind=0', {
            lotteryId: this.state.lottery_id,
            op: 'getCurIssue',
        }, (res) => {
            if(res.errno===0){
                let data = res.data;
                let serverTime = new Date(data.serverTime.replace(/-/g,"\/")).getTime();//服务器时间
                let endTime = new Date(data.issueInfo.end_time.replace(/-/g,"\/")).getTime();//停止时间
                let nowTime = new Date().getTime();
                this.setState({
                    issue:data.issueInfo.issue,
                    lastOpenissue:data.lastIssueInfo.issue,//上一期开奖期数
                    lastOpenCode:data.lastIssueInfo.code?data.lastIssueInfo.code:"",
                    kTime:nowTime + data.kTime,//休市时间
                    countDownType:data.kTime>0?"kTime":"normal",
                    openTime:nowTime + endTime - serverTime,//开奖时间
                },()=>{
                    this.setCountDown();
                });
                if(data.kTime===0&&!data.lastIssueInfo.code){
                    this.setState({
                        lastIssueSetTime:setTimeout(()=>{
                        this.getLastOpen();
                    },10000)
                    })
                }
            }
        })
    }

    getBalance(){
        //获取余额
        Api("c=user&a=info&remind=0", null, (res) => {
            let data = res.data;
            if (res.errno === 0) {
                this.setState({
                    balance: parseFloat(data.balance)
                })
            }
        });
        //获取今日盈亏
        Api("c=user&a=getUserTodayRealWin", null, (res) => {
            let data = res.data;
            if (res.errno === 0) {
                this.setState({
                    winMoney: data.total_win,
                })
            }
        })
    }


    setCountDown(){
        // return;
        if(this.state.intervalId){
            clearInterval(this.state.intervalId);
        }
        if(this.state.ltOpenSetTime){
            clearInterval(this.state.ltOpenSetTime);
        }

        let intervalId = setInterval(() => {
            let kTime = this.state.kTime;
            let openTime = this.state.openTime;
            let ltPause = this.state.openTime+15000;
            let nowTime = new Date().getTime();
            let countDownType;
            let countDownTime;
            if(kTime>nowTime){
                countDownTime = (kTime-nowTime)/1000;
                countDownType="kTime";
            }else if(openTime>nowTime){
                countDownTime = (openTime-nowTime)/1000;
                countDownType="normal";
            }else{
                countDownTime = (ltPause-nowTime)/1000;
                countDownType="ltPause";
            }
            if(countDownTime <= 0) {
                clearInterval(this.state.intervalId);
                this.getLastOpen();
            }else{
                this.setState({
                    countDownType:countDownType,
                    countDownTime:Math.round(countDownTime),
                })
            }
        }, 1000);

        this.setState({
            intervalId: intervalId
        });

    }
    //玩法数据转换，navTab
    transMethods(data){
        let one_level_menu=[];
        let two_level_menu=[];
        let gameKey=this.state.game_key;
        data.map((item,i)=>{
            one_level_menu.push(item.mg_name);
            let childsObj={};
            item.childs.map((childs,j)=>{
                if(item.is_merge===1){
                    let description=[],
                        field_def=[],
                        levels=[],
                        method_id=[],
                        mg_id=[],
                        mg_name=[],
                        name=[],
                        num_level=[],
                        prize=[];
                    item.childs.map((childs,j)=>{
                        description.push(childs.description);
                        field_def.push(childs.field_def);
                        levels.push(childs.levels);
                        method_id.push(childs.method_id);
                        mg_id.push(childs.mg_id);
                        mg_name.push(childs.cname);
                        name.push(childs.name);
                        num_level.push(childs.num_level);
                        prize.push(childs.prize);

                    });
                    childsObj = {
                        0:[{
                            description: description,
                            field_def: field_def,
                            levels: levels,
                            lottery_id: item.childs[0].lottery_id,
                            method_id: method_id,
                            method_property: 0,
                            mg_id: mg_id,
                            mg_name: mg_name,
                            name: name,
                            cname:item.mg_name,
                            type:"special",
                            num_level: num_level,
                            prize: prize
                        }]
                    };

                }else if(["QSHHZX","ZSHHZX","SXHHZX"].indexOf(childs.name) !== -1){//混合玩法不显示

                }else{
                    //11x5
                    if([2, 5, 6, 7,16].indexOf(this.state.lottery_id-0) !== -1&&childs.method_property===0){
                        if(!childsObj[10]){
                            childsObj[10]=[]
                        }
                        if(!childsObj[11]){
                            childsObj[11]=[]
                        }
                        childsObj[10].push(childs);
                        if(childs.can_input===1&&gameKey==="g"){
                            let newChilds = JSON.parse(JSON.stringify(childs));
                            newChilds.cname=newChilds.cname+"单式";
                            newChilds["type"]="danshi";
                            childsObj[11].push(newChilds);
                        }


                    }else{
                        if(!childsObj[childs.method_property]){
                            childsObj[childs.method_property]=[]
                        }
                        childsObj[childs.method_property].push(childs);
                        if(childs.can_input===1&&gameKey==="g"){
                            let newChilds = JSON.parse(JSON.stringify(childs));
                            newChilds.cname=newChilds.cname+"单式";
                            newChilds["type"]="danshi";
                            childsObj[childs.method_property].push(newChilds);
                        }
                    }




                }
            });
            // method_property
            two_level_menu.push(childsObj);
        });
        this.setState({
            one_level_menu:one_level_menu,
            two_level_menu:two_level_menu
        });
        let md=null;
        let menu_foucsed = JSON.parse(JSON.stringify(this.state.menu_foucsed));
            //切换玩法需要保持玩法选中
            let mdMap = two_level_menu[menu_foucsed[0]];
        two_level_menu.map((mdMap,j)=>{
            for(let index in mdMap){
                mdMap[index].map((item,i)=>{
                    if(item.cname===menu_foucsed[1]){
                        md=mdMap[index][i];
                        menu_foucsed=[j,md.cname];
                    }
                })
            }
        });

            //如果没有玩法，则为默认第一个
        // console.log(two_level_menu)
        if(!md){
            let defaultIndex = 0;
            for(let i=0,j=12;i<j;i++){//11种玩法，取第一个被选中
                if(two_level_menu[0][i]){
                    md=two_level_menu[0][i][0];
                    defaultIndex=i;
                    i=j;
                }
            }

            menu_foucsed=[0,md.cname]
        }
        if(md.type==="special"){
            this.setState({
                isLiangmian:true
            })
        }else{
            this.setState({
                isLiangmian:false
            })
        }
        this.setState({
            md:md,
            navBarTitle:md.cname,
            method_id:md.method_id,//当前玩法id
            cur_method:md.field_def,//当前玩法
            menu_foucsed:menu_foucsed,//菜单被选中
            prize:md.prize,
        });

    }
    //切换信用官方玩法
    handleChangeGameKey(){
        if(this.state.game_key==="g"){
            this.setState({
                game_key:"x",
            });
            this.getInitData("x")
        }else{
            this.setState({
                game_key:"g",
            });
            this.getInitData("g")
        }
    }
    navBarClick() {
        this.setState({'showTab': !this.state.showTab});
    }
    //一级导航点击
    OneLevelClick(index){
        this.setState({
            menu_foucsed:[index,this.state.menu_foucsed[1]]
        });
    }
    //二级导航点击
    TwoLevelClick(item){
        let one =this.state.menu_foucsed[0];
        this.sliderOnChange(this.state.sliderConfig.to)
        if(item.type==="special"){
            this.setState({
                isLiangmian:true
            })
        }else{
            this.setState({
                isLiangmian:false
            })
        }

        this.setState({
            showSlider:false,
            menu_foucsed:[one,item.cname],
            navBarTitle:item.cname,
            showTab:false,
            cur_method:item.field_def,
            method_name:item.name,
            cart:[],//当前购物车清空
            buttonType:[],//
            md:item,
            zhushu:0,
        });
    }
    //点击显示和隐藏返点条
    handleToggleSlider(){
        if(this.state.showSlider===false){
            this.setState({
                showSlider:true
            });
        }else{
            this.setState({
                showSlider:false
            });
        }
    }
    //拖动返点条
    sliderOnChange(value) {
        let total_profit=this.state.total_profit;
        let rebate=this.state.rebate;
        let currentValue =value;
        if(currentValue>this.state.sliderConfig.to){
            currentValue=this.state.sliderConfig.to;
        }
        currentValue= currentValue-this.state.sliderConfig.from;
        let mode= this.state.game_key==="x"?0.5:1;
        let gamePrize = (10000 - total_profit*10000+rebate*10000- (parseFloat(this.state.sliderConfig.to*10000-currentValue*10000)))*mode*10000/100000000;

        let sliderValue = Math.round(this.state.sliderConfig.to * 10000 - currentValue * 10000) / 10000;

        this.setState({sliderValue: sliderValue, gamePrize: gamePrize});
    }
    //清空
    handleClearAll(bool){
        //单式清空
        if(this.refs.childRef&&this.refs.childRef.handleClearAll){
            this.refs.childRef.handleClearAll(bool);
        }
        this.setState({
            cart:[],
            buttonType:[],
            zhushu:0
        })
    }
    //投注点击
    handleTouzhu(){

        if(this.state.zhushu === 0) {
            let unitaryInfoEle = ReactDOM.findDOMNode(document.getElementById("unitaryInfo"));
            if(unitaryInfoEle&&unitaryInfoEle.innerHTML){
                ShowMessage(unitaryInfoEle.innerHTML,"warning");
            }else{
                ShowMessage("注数不合法","warning");
            }

            return false;
        }

        if(this.state.game_key==="g"||this.state.lottery_id==="15"){
            this.addNumber();
            this.setState({
                showcart: true,
                showConfirmType:"g",
            });
        }else{

            let money = parseInt(ReactDOM.findDOMNode(document.getElementById("jsInputMoney")).value);

            if(!money||money<=0){
                ShowMessage("请填写金额","warning");
                return;
            }
            this.setState({
                money:money
            },()=>{
                this.handleShowConfirm("x");
            });
        }

    }
    handleShowConfirm(type){
        if(this.state.lottery_id==="15"){
            this.submitbuy();
            return;
        }

        if(type==="z"&&this.state.traceList[this.state.traceList.length-1].amount<=0){
            ShowMessage("至少选择一注","error");
            return false;
        }
        this.setState({
            showConfirmModal:true,
            showConfirmType:type
        });
    }
    addNumber() {
        let mode = this.state.mode;
        let zhushu ;
        let listData =[];
        let total_zhushu = this.state.total_zhushu;
        let total_money = this.state.total_money;
        if(this.state.multiple){
            let contentArr = this.state.content;
            contentArr.map((item,i)=>{
                listData.push({
                    'title':  item.name,
                    'method_id':  item.method_id,//玩法id
                    'content': item.content,
                    'zhushu': item.zhushu,
                    'money': item.zhushu * mode * this.state.beishu * 2,
                    'mode': this.state.mode
                });
                total_zhushu+= item.zhushu;
                total_money+= item.zhushu * mode * this.state.beishu * 2;
            })
        }else{
            zhushu = this.state.zhushu;
            listData = [{
                'title': this.state.md.cname,
                'method_id': this.state.md.method_id,//玩法id
                'content': this.state.content,
                'zhushu': zhushu,
                'money': zhushu * mode * this.state.beishu * 2,
                'mode': this.state.mode
            }];
            total_zhushu+= zhushu;
            total_money+= zhushu * mode * this.state.beishu * 2;
        }

        let tableList = JSON.parse(JSON.stringify(this.state.tableList));
        tableList=tableList.concat(listData);
        this.handleClearAll(true);
        this.setState({
            "tableList": tableList,
            "total_zhushu": total_zhushu,
            "total_money": total_money,
        });

    }
    //计算注数
    setCartItem(item){
        this.setState({
            buttonType:item.buttonType,//记录按钮大小单双
            zhushu:item.zhushu,
            cart:item.cart,
            content:item.content,
            multiple:item.multiple?item.multiple:false,
            liangmianZhushu:item.liangmianZhushu?item.liangmianZhushu:[],//两面盘数据提交需要判断
        })
    }

    qihaoCheck(index, e) {
        this.state.qihaoData[index].checked = e.target.checked;
        this.state.qihaoData[index].qihaoBeishu = e.target.checked ? 1: 0;
        this.setState(this.state.qihaoData)
    }

    beishuChange(e){
        let val =e.target.value;
        if(val===""){
            this.setState({ "beishu" :  val});
            return
        }
        val = parseInt(val) < 0 ? 0 : parseInt(val);
        this.setState({ "beishu" :  val}, () => {
            this.updateTableList();
        });
    }
    beishuOnBlur(e){
        let val =e.target.value;
        if(val===""||val==="0"){
            this.setState({ "beishu" :  1}, () => {
                this.updateTableList();
            });
            return
        }
    }
    //次数修改  秒秒彩专有
    cishuChange(e){
        let cishu =e.target.value;
        let cishuOld=this.state.cishu;
        if(cishu===""&&cishuOld===1){
            this.setState({cishu: cishu});
            return false;
        }else if(cishu===""&&cishuOld){
            cishu =1;
        }else if(cishu>30){
            ShowMessage("连开次数最大30次","error");
            cishu=30;
        }else{
            cishu = parseInt(cishu) < 0 ? 0 : parseInt(cishu);
        }

        this.setState({ "cishu" :  cishu}, () => {
            this.updateTableList();
        });
    }

    updateTableList() {
        let list = this.state.tableList;
        let mode = this.state.mode * 1000;
        let beishu = this.state.beishu;
        let total_money = 0;
        for (let i = 0; i < list.length; i++) {
            let money = list[i]['zhushu'] * mode * beishu * 2 / 1000
            list[i]['money'] = money;
            total_money += money * 1000;
        }

        this.setState({tableList: list, total_money: total_money / 1000});

    }
    modeChange(mode) {
        mode = Number(mode);
        this.setState({ "mode" : mode}, () => {
            this.updateTableList();
        });
    }
    keepPlaying() {
        this.setState({"showcart": false});
    }
    setModalVisible() {
        this.setState({modalVisible: false, zhChecked: this.state.zhDataForSubmit.length > 0})
    }
    cancelOrder(index){
        let tableList = JSON.parse(JSON.stringify(this.state.tableList));
        if(tableList.length===1){
            this.clearCart();
        }else{
            //获取删除玩法的注数
            let  number = tableList[index]['zhushu'];
            tableList.splice(index,1);
            this.setState({ "tableList" : tableList,"total_zhushu":this.state.total_zhushu-number},() => {
                this.updateTableList();
            });
        }

    }
    clearCart() {
        this.setState({"tableList": []});
        this.setState({"total_zhushu": 0});
        this.setState({"total_money": 0});
        setTimeout(() => {
            this.setState({"showcart": false})
        }, 100);
    }
    submitbuy() {

        if(this.state.countDownType==="ltPause") {
            ShowMessage("封盘时间,请您稍后再购买","error");
            this.setState({
                showConfirmModal: false,
            });
            return;
        }else if(this.state.countDownType==="kTime"){
            ShowMessage("休市时间,请您开市后再购买","error");
            this.setState({
                showConfirmModal: false,
            });
            return;
        }
        MaskLoading(5);
        let data = this.state.tableList;
        let zhushu = this.state.total_zhushu;
        let money = this.state.total_money;
        // 玩法 : 内容
        this.setState({loading: true});
        if(data.length < 1 && zhushu < 1) {
            ShowMessage("选号格式错误！","warning");
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
            lotteryId: this.state.lottery_id,
            curRebate: this.state.sliderValue,
            codes: codes,
            modes: this.state.mode,
            multiple: this.state.beishu?this.state.beishu:1,
            token: getRandChar(32)
        };
        if(this.state.lottery_id==="15"){//mmc无期数
            postObj.openCounts=this.state.cishu;
        }else{
            postObj.issue=this.state.issue;
        }

        Api('c=game&a=play', postObj, (res) => {
            MaskLoading(false);
            if(res.errno === 0) {
                ShowMessage("购买成功","success");

                if(this.state.lottery_id==="15"){
                    this.setState({
                        mmcData:res.data,
                        showMMCanimation:true
                    });
                }else{
                    this.setState({
                        ...this.state,
                        showConfirmModal:false,
                        tableList: [],
                        total_zhushu: 0,
                        total_money: 0,
                        showcart: false
                    });
                }
                this.getBalance();
            } else {
                // message.error(res.msg);
            }
            this.setState({loading: false})
        });
    }
    //信用投注 确认按钮事件
    submitXbuy(){

        if(this.state.countDownType==="ltPause") {
            message.error('封盘时间,请您稍后再购买', 2);
            this.setState({
                showConfirmModal: false,
            });
            return;
        }else if(this.state.countDownType==="kTime"){
            message.error('休市时间,请您开市后再购买', 2);
            this.setState({
                showConfirmModal: false,
            });
            return;
        }
        MaskLoading(5);
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
        let codes="";
        let liangmianZhushu = this.state.liangmianZhushu;
        let method_id = this.state.md.method_id;
        if(this.state.isLiangmian){
            for(let index in liangmianZhushu){
                if(liangmianZhushu[index]>0){
                    codes +=method_id[index]+":"+this.state.content[index]+"#"
                }
            }
            codes = codes.substr(0,codes.length-1);
        }else if(this.state.multiple){
            let contentArr = this.state.content;
            contentArr.map((item,i)=>{
                codes += item.method_id+":"+item.content+"#";
            });
            codes = codes.substr(0,codes.length-1)
        }else{
            codes= this.state.md.method_id+":"+this.state.content;
        }
        let money = this.state.money;

        let postObj = {
            op: 'buy',
            lotteryId: this.state.lottery_id,
            issue: this.state.issue,
            curRebate: this.state.sliderValue,//当前折扣
            codes: codes,
            modes: 0.5,
            multiple: money,
            xgame:"1",
            token: getRandChar(32)
        };
        Api('c=game&a=play', postObj, (res) => {
            MaskLoading(false);
            if(res.errno === 0) {
                ShowMessage("购买成功","success");
                this.setState({
                    showConfirmModal:false,
                    cart:[],
                    zhushu:0
                });

                this.getBalance();
            }
        });
    }
    //切换右边导航条
    toggleNavRight(e,isClose){

        if(isClose===undefined){
            this.setState({
                showNavbarRight:!this.state.showNavbarRight
            });

        }else if(isClose!==this.state.showNavbarRight){
            this.setState({
                showNavbarRight:!this.state.showNavbarRight
            });
        }
        this.setState({
            showList:false,
        });

        if(this.refs.lotterHead){
            this.refs.lotterHead.toggleOpenIssue(e,"close")
        }

        e.stopPropagation();

    }
    //切换玩法模态框
    togglePlayFunc(isClose){
        this.setState({
            showPlayFunc:isClose===false?false:!this.state.showPlayFunc,
            showNavbarRight:false
        })
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
            if (!this._isMounted) {
                return false;
            }
            if(res.data) {
                let beishu=this.state.beishu?this.state.beishu:1;
                let baseMoney=this.state.total_money/beishu;
                this.setState({
                    showConfirmType:"z",
                    traceBeishu:beishu,
                    traceQishu:1,
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
    //取消 追号
    cancelTrace() {
        this.setState({
            showTrace: false,
            traceBeishu: 1,
            traceQishu: 1,
            traceStart: 0,
            traceList: []
        });
    }
    //开奖即停
    stopOnWinChange(e) {
        this.setState({stopOnWin: e.target.checked ? 1 : 0});
    }
    //倍数改变
    traceBeishuChange(e) {
        let beishu =e.target.value;
        let traceBeishu=this.state.traceBeishu;
        if(beishu===""&&traceBeishu===1){
            this.setState({traceBeishu: beishu});
            return false;
        }else if(beishu===""&&traceBeishu){
            beishu =1;
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
    traceBeishuOnBlur(e){
        let beishu =e.target.value;
        if(beishu==="0"||beishu===""){
            beishu=1;
        }
        const traceList = this.state.traceList;

        const baseMoney = this.state.baseMoney;

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

        if(qishu!=="0"&&qishu!==""){
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
        if(qishu!=="0"){
            this.setState({traceQishu: qishu });
        }


    }
    traceQishuOnBlur(e){
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
        MaskLoading(5);
        let data = this.state.tableList;
        let traceList = this.state.traceList;

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
            issue: this.state.issue,
            curRebate: this.state.sliderValue,
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
        Api('c=game&a=play', postObj, (res) => {
            MaskLoading(false);
            if(res.errno === 0) {
                ShowMessage("购买成功","success");
                this.setState({
                    ...this.state,
                    tableList: [],
                    traceList: [],
                    traceBeishu: 1,
                    traceQishu: 1,
                    beishu:1,
                    total_zhushu: 0,
                    total_money: 0,
                    showcart: false,
                    showTrace: false,
                    traceIssues: [],    // 追号期数
                    stopOnWin: 0,       // 中奖即停
                    traceStart: 0,      // 追号起始期序号
                    traceAllChecked: true,   // 追号全选 反选
                    showConfirmModal:false,
                });

                this.getBalance();
            }
        });
    }
    confirmSubmitbuy(){
        let type= this.state.showConfirmType;
        if(type==="x"){
            this.submitXbuy();
        }else if(type==="g"){
            this.submitbuy();
        }else{

            this.traceSubmit();
        }
    }

    handleChangeMoney(e){
        let value = e.target.value;
        if(value<0){
            e.target.value=""
        }else{
            e.target.value=parseInt(value)
        }

    }
    //点击小箭头回退事件
    handleBack(){
        if(this.state.showTrace){
            this.setState({
                showTrace: false,
                traceBeishu: 1,
                traceQishu: 1,
                traceStart: 0,
                traceList: [],
                showcart: true
            });
        }else if(this.state.showcart){
            this.setState({"showcart": false});
        }else{

                this.props.history.push("/hall");

        }
    }
    handleCloseMMCanimation(){
        message.info("开奖结果将在订单中心显示");
        this.setState({
            showMMCanimation:false,
            mmcData:[],//mmc数据
        })
    }
    render() {

        let navbarRight=<div className="lottery-operate-wrapper" >
            <label onClick={(e)=>{this.toggleNavRight(e)}} ></label>
            {this.state.showNavbarRight?<ul className="lottery-operate">
                <li>
                    <Link to="/account">
                        个人帐变
                    </Link>
                </li>
                <li>
                    <Link to="/order">
                        投注记录
                    </Link>
                </li>
                <li>
                    <Link to={{pathname:"/lotteryTrend",search:"?id="+this.state.lottery_id}}>
                        走势图
                    </Link>
                </li>
                <li onClick={()=>{this.togglePlayFunc()}}>玩法介绍</li>
                <li className="extra"><span>今日盈亏</span></li>
                <li>{"￥"+this.state.winMoney}</li>
                <li className="extra"><span>账户余额</span></li>
                <li>{"￥"+this.state.balance}</li>

            </ul>:null}
        </div>;

        return (
            // 4
            <div className={"lt-wrapper-"+this.state.lottery_id} onClick={(e)=>{this.toggleNavRight(e,false)}}>
                {this.state.showTrace?
                    <Navbar backFunc={()=>{this.handleBack()}} title="追号管理"  navbarRight={navbarRight} />
                :this.state.showcart?
                        <Navbar backFunc={()=>{this.handleBack()}} title={this.state.lottery_name} navbarRight={navbarRight} />
                        :this.state.game_key==="x"?
                            <Navbar backFunc={()=>{this.handleBack()}} title={this.state.navBarTitle} navbarRight={navbarRight} />
                        : <Navbar backFunc={()=>{this.handleBack()}} title={this.state.navBarTitle}  navbarRight={navbarRight} />

                }

                {!(this.state.showcart||this.state.showTrace) ?
                    <div>
                        <div className="lottery">
                            <LotteryHead
                                ref="lotterHead"
                                lottery_id={this.state.lottery_id}
                                lottery_name={this.state.lottery_name}
                                game_key={this.state.game_key}
                                issue={this.state.issue}
                                lastOpenCode={this.state.lastOpenCode}

                                countDownType={this.state.countDownType}
                                countDownTime={this.state.countDownTime}
                                showList={this.state.showList}
                                openedIssues={this.state.openedIssues}//最近5期开奖

                                showLotteryList={(e)=>{this.showLotteryList(e)}}
                                changeLottery={(id)=>{this.changeLottery(id)}}
                                handleChangeGameKey={()=>{this.handleChangeGameKey()}}
                                lotterys={this.state.lotterys}
                                lastOpenissue={this.state.lastOpenissue}

                            />

                            <NavTabRight
                                one_level_menu={this.state.one_level_menu}
                                two_level_menu={this.state.two_level_menu}
                                showTab={this.state.showTab}
                                closeTab={()=>{this.setState({showTab:false})}}
                                OneLevelClick={(index)=>{this.OneLevelClick(index)}}
                                TwoLevelClick={(item)=>{this.TwoLevelClick(item)}}
                                methods={this.state.methods}
                                menu_foucsed={this.state.menu_foucsed}
                                navBarClick={()=>{this.navBarClick()}}
                                game_key={this.state.game_key}
                            />


                            <div className="ch_chart_wrap">
                                <ComposeComponent
                                    {...this.props}
                                    {...this.state}
                                    handlechooseNum={(e,num,arr,type)=>{this.handlechooseNum(e,num,arr,type)}}
                                    setCartItem={item=>this.setCartItem(item)}
                                    ref="childRef"
                                />
                            </div>

                        </div>
                        <LotteryBottom
                            game_key={this.state.game_key}
                            md={this.state.md}
                            showSlider={this.state.showSlider}
                            sliderValue={this.state.sliderValue}
                            handleToggleSlider={()=>{this.handleToggleSlider()}}
                            sliderOnChange={(e)=>{this.sliderOnChange(e)}}
                            handleTouzhu={()=>{this.handleTouzhu()}}
                            handleClearAll={()=>{this.handleClearAll()}}
                            zhushu={this.state.zhushu}
                            sliderConfig={this.state.sliderConfig}
                            lottery_id={this.state.lottery_id}
                            countDownType={this.state.countDownType}
                            handleChangeMoney={(e)=>{this.handleChangeMoney(e)}}
                        />
                    </div>
                    :null}

                {this.state.showcart&&!this.state.showTrace ? <TouzhuCart
                        loading={this.state.loading}
                        tableList={this.state.tableList}
                        beishu={this.state.beishu}
                        cishu={this.state.cishu}
                        beishuChange={this.beishuChange}
                        beishuOnBlur={this.beishuOnBlur}
                        cishuChange={this.cishuChange}
                        modeChange={this.modeChange}
                        mode={this.state.mode}
                        modeArr={this.state.modeArr}
                        startTrace={this.startTrace}
                        total_zhushu={this.state.total_zhushu}
                        lottery_id={this.state.lottery_id}
                        total_money={this.state.total_money}
                        clearCart = {this.clearCart}
                        cancelOrder = {(index)=>this.cancelOrder(index)}
                        balance = {this.state.balance}
                        onAdd={this.onAdd}
                        onReduce={this.onReduce}
                        submitbuy={()=>{this.handleShowConfirm("g")}} />
                    : null}

                {this.state.showTrace ? <Trace
                        zhushu={this.state.total_zhushu}
                        baseMoney={this.state.total_money}
                        traceIssues={this.state.traceIssues}
                        traceBeishu={this.state.traceBeishu}
                        traceQishu={this.state.traceQishu}
                        traceList={this.state.traceList}
                        traceAllChecked={this.state.traceAllChecked}
                        stopOnWinChange={this.stopOnWinChange}
                        traceBeishuChange={this.traceBeishuChange}
                        traceBeishuOnBlur={this.traceBeishuOnBlur}
                        traceQishuChange={this.traceQishuChange}
                        traceQishuOnBlur={this.traceQishuOnBlur}
                        traceStartChange={this.traceStartChange}
                        traceSelectChange={this.traceSelectChange}
                        traceSelectAllChange={this.traceSelectAllChange}
                        traceSingleBeishuChange={this.traceSingleBeishuChange}
                        traceSubmit={()=>{this.handleShowConfirm("z")}} />
                    : null}
                {/*//玩法介绍框*/}
                <PlayFuncModal
                    visible={this.state.showPlayFunc}
                    togglePlayFunc={(item)=>{this.togglePlayFunc(item)}}
                    md={this.state.md}
                />
                {/*确认投注弹框*/}
                <ConfirmModal
                    visible={this.state.showConfirmModal}
                    confirmtype={this.state.showConfirmType}
                    //{/*x*/}
                    md={this.state.md}
                    issue={this.state.issue}
                    zhushu={this.state.zhushu}
                    money={this.state.money}
                    //{/*g*/}
                    total_zhushu={this.state.total_zhushu}
                    mode={this.state.mode}
                    beishu={this.state.beishu}
                    total_money={this.state.total_money}

                    //{/*追号*/}
                    traceList={this.state.traceList}


                    onOk={()=>{this.confirmSubmitbuy()}}
                    onCancel={()=>{this.setState({"showConfirmModal":false})}}
                />
                {/*this.state.showMMCanimation */}
                {this.state.showMMCanimation ? <LtMMCanimation
                        mmcData={this.state.mmcData}
                        visible={this.state.showMMCanimation}
                        onOk={()=>{this.handleCloseMMCanimation()}}
                    />
                    : null}

                </div>

        );
    }
};
//玩法介绍modal
class PlayFuncModal extends React.Component {

    constructor(props) {
        super(props);

    }
    render() {
        if(!this.props.md){
            return null;
        }
        let md=this.props.md;
        let returnHtml=[];
        if(Array.isArray(md.mg_name)){
            md.mg_name.map((item,i)=>{
                returnHtml.push(<div key={i}>
                    <p>{item}</p>
                    <div dangerouslySetInnerHTML={{__html:DESCRIPTION[md.name[i]] }}>
                    </div>
                </div>)
            })
        }else {
            returnHtml.push(<div key={1}>
                <p>{md.mg_name}</p>
                <div dangerouslySetInnerHTML={{__html:DESCRIPTION[md.name] }}>
                </div>
            </div>)
        }
        return (
            <div>

                <Modal
                    title={this.props.md.cname+"玩法"}
                    visible={this.props.visible}
                    onCancel={()=>{this.props.togglePlayFunc("close")}}
                    footer={null}
                >
                    {Array.isArray(this.props.md.description)||returnHtml?<div className="play-func-modal" >
                        {returnHtml}
                      </div>:<div className="play-func-modal" dangerouslySetInnerHTML={{__html: this.props.md.description}}>
                    </div>}
                </Modal>
            </div>
        );
    }
}



//mmc信用LtMMCanimation
class LtMMCanimation extends React.Component {

  constructor(props) {
        super(props);
      this.state={
          index:0,
          numArr:[],
          setTimeoutArr:[],
          data:props.mmcData,
          init:false,
      }
    }
    componentWillUnmount(){
      this.state.setTimeoutArr.map((item,i)=>{
          if(item){
              clearTimeout(item)
          }
      })
    }
    componentDidMount(){
        this.setTime();
    }
    shouldComponentUpdate(nextProps, nextState){
      if(nextState.index!==this.state.index){
          return true
      }else{
          return false
      }
    }
    componentDidUpdate(){


    }
    setTime(){
        let data=this.props.mmcData;
        let setTimeoutArr =[]
        for(let i=0;i<data.length;i++){
            let setTime=setTimeout(()=>{

                if(i===data.length-1){
                    this.setState({
                        index:this.state.index+1
                    })
                }else{
                    this.setState({
                        index:this.state.index+1,
                        numArr:data[this.state.index+1].opencode.split("")
                    })
                }

            },(i+1)*4000);
            setTimeoutArr.push(setTime);
        }
    }
    render() {
      if(!this.props.mmcData){
          return null;
      }
        let data=this.props.mmcData;
        let open ="";

        if(this.state.index===data.length){
           open =  <Animate
               key={Math.random()*1000}
               stop={true}
               numArr={this.props.mmcData[this.state.index-1].opencode.split("")}
           />;
        }else{
           open =  <Animate
                key={Math.random()*1000}
                numArr={this.props.mmcData[this.state.index].opencode.split("")}
            />;
        }

        let list=[];
        for(let i=0;i<this.state.index;i++){
            list.push(<li key={i}>
                <span>第{i+1}次开奖</span>
                <span>{data[i].opencode}</span>
                <span className={data[i].prize>0?"active":""}>{data[i].prize>0?"已中奖":"未中奖"}</span>
            </li>)
        }
        return (
            <div>

                <Modal
                    wrapClassName="mmc-animation-wrapper"
                    closable={false}
                    title="秒秒彩开奖"
                    visible={this.props.visible}
                    footer={null}
                >
                    <div className="mmc-animation-content">
                        <div className="open-animate">
                            {open}
                        </div>
                        <div className="open-list">
                            <ul>
                                {list}
                            </ul>
                        </div>
                        <div className="onOk" onClick={()=>{this.props.onOk()}}>
                            确定
                        </div>

                    </div>
                </Modal>
            </div>
        );
    }
}
