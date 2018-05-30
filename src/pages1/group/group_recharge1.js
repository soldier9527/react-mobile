import React,{Component} from 'react';
import {message} from 'antd';
import Navbar from '../common/navbar';
import Api from '../api';
import {List,Calendar,PullToRefresh,Icon} from 'antd-mobile';
import ReactDOM from 'react-dom';
import enUS from 'antd-mobile/lib/calendar/locale/en_US';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import 'antd-mobile/lib/Calendar/style/css';
import { Toast} from 'antd-mobile';

const extra = {
    '2017/07/15': { info: 'Disable', disable: true },
};

const now = new Date();

export default class Group_recharge1 extends Component{
    originbodyScrollY = document.getElementsByTagName('body')[0].style.overflowY;
    constructor(props){
        super(props);
        this.state = {
            ModalText:'HELLO',
            visible: false,
            confirmLoading: false,
            startTime:"",//日期选择的开始日期
            endTime:"",//日期选择的结束日期
            activityList:[],//需要显示在页面的后台数据
            ordercounting:0,//订单总数
            rechargeamount:0,//充值总金额
            hasContent:true,//控制字符串“无相关信息”的显示和隐藏
            nowDate:null,
            maxDate:null,
            refreshing: false,//下拉加载更多
            down: true,//下拉加载更多
            height: document.documentElement.clientHeight,//下拉加载更多
            page:1,//下拉加载更多
            totalpage:1,//下拉加载更多
            countDisPlay:false,//切换底部首存人数
            en: false,
            show: false,
            config: {},
            todayFirst:0,
            todayAll:0,
            allFirst:0,
            allAll:0,
        }
    }

    //下面方法用于转换日期字符串格式
    check(str){
        str=str.toString();
        if(str.length<2){
            str='0'+ str;
        }
        return str;
    }

    //下面方法用于转换日期字符串格式
    format(date,str){
        var mat={};
        mat.M=date.getMonth()+1;//月份记得加1
        mat.H=date.getHours();
        mat.s=date.getSeconds();
        mat.m=date.getMinutes();
        mat.Y=date.getFullYear();
        mat.D=date.getDate();
        mat.d=date.getDay();//星期几
        mat.d=this.check(mat.d);
        mat.H=this.check(mat.H);
        mat.M=this.check(mat.M);
        mat.D=this.check(mat.D);
        mat.s=this.check(mat.s);
        mat.m=this.check(mat.m);
        if(str.indexOf(":")>-1){
            mat.Y=mat.Y.toString().substr(2,2);
            return mat.Y+"/"+mat.M+"/"+mat.D+" "+mat.H+":"+mat.m+":"+mat.s;
        }
        if(str.indexOf("/")>-1){
            return mat.Y+"/"+mat.M+"/"+mat.D+" "+mat.H+"/"+mat.m+"/"+mat.s;
        }
        if(str.indexOf("-")>-1){
            return mat.Y+"-"+mat.M+"-"+mat.D;
        }
    }


    //拿当天日期和最大限制日期
    getDate(){
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        this.setState({
            nowDate:now,
            maxDate:now,
        })
    }
    //区间组件用法

    renderBtn(zh, en, config = {}) {
        config.locale = this.state.en ? enUS : zhCN;

        return (
            <List.Item arrow="horizontal"
                       onClick={() => {
                           document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
                           this.setState({
                               show: true,
                               config,
                           });
                       }}
            >
                {this.state.en ? en : zh}
            </List.Item>
        );
    }

    //确认时回调
    onConfirm = (startTime, endTime) => {
        let startDate=this.format(startTime,"-");
        let endDate=this.format(endTime,"-");
        this.setState({
            show: false,
            startTime:startDate,
            endTime:endDate,
            page:1,
            totalpage:1,
            activityList:[],
            ordercounting:0,
            rechargeamount:0
        },()=>this.handleGetdataforoneday());
    }

    //	关闭时回调
    onCancel = () => {
        document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
        this.setState({
            show: false,
            startTime: undefined,
            endTime: undefined,
        });
    }

    //组件将要渲染前向后头发起请求
    componentWillMount(){
        this.handleGetdata();
        this.getDate();
    }

    //上拉加载更多组件
    componentDidMount() {
        const hei =ReactDOM.findDOMNode(document.getElementsByClassName("showContent")[0]).offsetHeight;
        setTimeout(() => this.setState({
            height: hei,
        }), 0);
        this.changeDownStatus();
    }

    //获取后台数据方法
    handleGetdata(){
        let page="&page="+this.state.page;
        if(this.state.page>this.state.totalpage){
            message.config({
                top:20,
                duration:1
            });
            message.info("没有更多数据");
            return;
        }else{
            this.loadingToast();
            Api("c=fin&a=depositList"+page,null,(res)=>{
                if(res.errno>0){
                    message.info(res.errstr);
                }
                let today=res.data.deposit_count.today;
                let todayFirst=today.first;
                let todayAll=today.all;
                let all=res.data.deposit_count.all;
                let allFirst=all.first;
                let allAll=all.all;
                let activityList=res.data.showDatas;//需要渲染到页面的数据
                let totalpage=res.data.totalPages;//总页数
                let totalAmount=0;//用于放置每页提现总金额
                let ordercounting=0;
                this.setState({
                    totalpage:totalpage,
                    page:this.state.page+1,
                    todayFirst:todayFirst,
                    todayAll:todayAll,
                    allFirst:allFirst,
                    allAll:allAll,
                })
                if(activityList==""){
                    activityList=[];
                    totalAmount=0;
                    ordercounting=0;
                }else{
                    totalAmount=res.data.all_count.totals.total_amount;
                    ordercounting=res.data.all_count.totals.count;
                };
                if(activityList.length===0){
                    this.setState({
                        hasContent:false
                    })
                }else{
                    this.setState({
                        hasContent:true
                    })
                }
                let rechargeamount=Number(totalAmount).toFixed(2);
                let thisForActivityList=this;
                activityList.map(function(item,i){thisForActivityList.state.activityList.push(item)});
                this.setState({
                    ordercounting:ordercounting,
                    rechargeamount:rechargeamount
                })
            });
        }
    }
    //切换数据方法
    handleChange(){
        this.setState({
            countDisPlay:!this.state.countDisPlay
        })
    }
    //向后台发送请求拿一天数据
    handleGetdataforoneday() {
        let startDate = this.state.startTime;
        let endDate = this.state.endTime;
        let page = this.state.page;
        let param = "&start_date=" + startDate + "&end_date=" + endDate+"&page="+page;
        if (this.state.page > this.state.totalpage) {
            message.config({
                top:20,
                duration:1
            })
            message.info("没有更多数据");
            return;
        } else {
            this.loadingToast();
            Api("c=fin&a=depositList" + param, null, (res) => {
                let today = res.data.deposit_count.today;
                let todayFirst = today.first;
                let todayAll = today.all;
                let all = res.data.deposit_count.all;
                let allFirst = all.first;
                let allAll = all.all;
                let activityList = res.data.showDatas;//需要渲染到页面的数据
                let totalpage = res.data.totalPages;//总页数
                let totalAmount = 0;//用于放置充值总金额
                let ordercounting = 0;//总订单数
                this.setState({
                    totalpage: totalpage,
                    page: this.state.page + 1,
                    todayFirst: todayFirst,
                    todayAll: todayAll,
                    allFirst: allFirst,
                    allAll: allAll,
                })
                if (activityList == "") {
                    activityList = [];
                    totalAmount = 0;
                    ordercounting = 0;
                } else {
                    totalAmount = res.data.all_count.totals.total_amount;
                    ordercounting = res.data.all_count.totals.count;
                }
                if (activityList.length === 0) {
                    this.setState({
                        hasContent: false
                    })
                } else {
                    this.setState({
                        hasContent: true
                    })
                }
                let rechargeamount = Number(totalAmount).toFixed(2);
                let thisForActivityList = this;
                activityList.map(function (item, i) {
                    thisForActivityList.state.activityList.push(item)
                });
                this.setState({
                    ordercounting: ordercounting,
                    rechargeamount: rechargeamount
                })
            })
        }
    }

    //根据移动触摸事件更改down的布尔值
    changeDownStatus(){
        let content=document.getElementsByClassName("showContent")[0];
        let startY;
        content.addEventListener("touchstart",(e)=>{
            startY=e.changedTouches[0].pageY;
        },true);
        content.addEventListener("touchend",(e)=>{
            let endY=e.changedTouches[0].pageY;
            let direction=endY-startY;
            if(direction==0){
                return;
            }else if(direction>0){
                this.setState({
                    down:true
                })
            }else{
                this.setState({
                    down:false
                })
            }
        },true)
    }

    //防止快速多次下拉刷新
    loadingToast() {
        Toast.loading('数据加载中...', 2, () => {
            // console.log('Load complete !!!');
        });
    }

    render(){
        let randerActivity=[];//渲染到页面上的元素
        let lotteryActivity=this.state.activityList;//从后台取出的数据
        //把需要渲染到页面的元素PUSH到randerActivity里面
        if(!this.state.hasContent){
            randerActivity.push(
                <div key={0}>
                    <ul className="teamrechargedetail">
                        <li>没有相关信息</li>
                    </ul>
                </div>
            )
        }else{
            lotteryActivity.map(function(item,i){
                randerActivity.push(
                    <div key={i}>
                        <ul className="teamrechargedetail"  >
                            <li>{item.username}</li>
                            <li>{item.create_time}</li>
                            <li>{"￥"+item.amount}</li>
                            <li>{item.status_str}</li>
                        </ul>
                    </div>
                )
            });
        };
        return (
            <div>
                <Navbar title=" 团队充值明细" back="/group"/>
                <div>
                    <div className="pickUpDate">
                        <List className="calendar-list" style={{ backgroundColor: 'white' }}>
                            {this.renderBtn('查询日期', 'Select Date Range')}
                        </List>
                        <Calendar
                            defaultValue={[new Date(this.state.startTime?this.state.startTime:+now),
                                new Date(this.state.endTime?this.state.endTime:+now)]}
                            {...this.state.config}
                            visible={this.state.show}
                            onCancel={this.onCancel}
                            onConfirm={this.onConfirm}
                            onSelectHasDisableDate={this.onSelectHasDisableDate}
                            getDateExtra={this.getDateExtra}
                            defaultDate={now}
                            minDate={new Date(+now - (5184000000/2))}
                            maxDate={new Date(+now - 1)}
                        />
                    </div>

                </div>
                <div className="behindNavbar">
                    <div>
                        <ul className="teamrechargeheader">
                            <li>账户</li>
                            <li>充值时间</li>
                            <li>充值金额</li>
                            <li>状态</li>
                        </ul>
                    </div>
                    <div className="showContent">
                        <PullToRefresh
                            ref={el => this.ptr = el}
                            style={{
                                height: this.state.height,
                                overflow: 'auto',
                            }}
                            indicator={this.state.down? {} : { activate:'松开立即加载' }}
                            direction={this.state.down ? 'down' : 'up'}
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                    if(this.state.startTime){
                                        if(this.state.down){
                                            this.setState({
                                                page:1,
                                                totalpage:1,
                                                activityList:[],
                                                ordercounting:0,
                                                rechargeamount:0,
                                            })
                                            this.handleGetdataforoneday();
                                        }else{
                                            this.handleGetdataforoneday();
                                        }
                                    }else{
                                        if(this.state.down){
                                            this.setState({
                                                page:1,
                                                totalpage:1,
                                                activityList:[],
                                                ordercounting:0,
                                                rechargeamount:0
                                            })
                                            this.handleGetdata();
                                        }else{
                                            this.handleGetdata();
                                        }
                                    };
                                this.setState({ refreshing: true });
                                setTimeout(() => {
                                    this.setState({ refreshing: false });
                                }, 1000);
                            }}
                        >
                            <div className="teamlist">
                                {randerActivity}
                            </div>
                        </PullToRefresh>
                    </div>
                    <div>
                        {this.state.countDisPlay?
                            <div className="countADD">
                                <p className="deposit-today" >
                                    <i>今日：</i>
                                    <i>首存人数：</i>
                                    <i>{this.state.todayFirst}</i>
                                    <i>存款总人数：</i>
                                    <i>{this.state.todayAll}</i>
                                </p>
                                <p className="deposit-all" >
                                    <i>合计：</i>
                                    <i>首存人数：</i>
                                    <i>{this.state.allFirst}</i>
                                    <i>存款总人数：</i>
                                    <i>{this.state.allAll}</i>
                                </p>
                            </div>:<ul className="count">
                                <p className="deposit-all">
                                    <i>合计：</i>
                                    <i>订单个数：</i>
                                    <i>{this.state.ordercounting}</i>
                                    <i>充值金额：</i>
                                    <i>{"￥"+this.state.rechargeamount}</i>
                                </p>
                            </ul>
                        }


                        <div className="checkCount">
                            <span onClick={()=>this.handleChange()} onTouchMove={()=>this.handleChange()}><Icon type="left" /></span><span></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
