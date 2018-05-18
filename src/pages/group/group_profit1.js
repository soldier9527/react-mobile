import React,{Component,PropTypes} from 'react';
import Navbar from '../common/navbar';
import Api from '../api';
import {message } from 'antd';
import {List,PullToRefresh,Calendar} from 'antd-mobile';
import ReactDOM from 'react-dom';
import { Toast} from 'antd-mobile';
import enUS from 'antd-mobile/lib/calendar/locale/en_US';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';

const extra = {
    '2017/07/15': { info: 'Disable', disable: true },
};

const now = new Date();

export default class Group_profit1 extends Component{
  constructor(props){
    super(props);
    super(props);
    this.state = {
    ModalText:'HELLO',
    visible: false,
    confirmLoading: false,
    startTime:"",//日期选择的开始日期
    endTime:"",//日期选择的结束日期
    activityList:[],//向后台请求返回的数据
    totalCommission:0,//返佣总金额
    totalWin:0,//盈亏总金额
    hasContent:true,
    nowDate:null,
    maxDate:null,
    refreshing: false,//下拉加载更多
    down: true,//下拉加载更多
    height: document.documentElement.clientHeight,//下拉加载更多
    page:1,//下拉加载更多
    totalpage:1,//下拉加载更多
    en: false,
    show: false,
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

 //从日期选择表里提取所选日期，date为所选日期
 onChange(date){
        let myDate=this.format(date,'YYYY-MM-DD');
        this.setState({
            myDate:myDate,
            nowDate:date,
            page:1,
            totalpage:1,
            activityList:[],
            totalCommission:0,
            totalWin:0,
            down: true
        },()=>{
            this.handleGetdataforoneday();
        })
    }

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

    onSelectHasDisableDate = (dates) => {
        console.warn('onSelectHasDisableDate', dates);
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

  //获取后台数据
  handleGetdata(){
    let page=this.state.page;
    let param="&page="+this.state.page;
    if(this.state.page>this.state.totalpage){
        message.config({
            top:20,
            duration:1
        })
        message.info("没有更多数据");
        return;
    }else{
        this.loadingToast();
    Api("c=user&a=teamWinReport"+param,null,(res)=>{
        if(res.errno>0){
            message.info(res.errstr);
        }
        let activityList=res.data.other;//需要渲染到页面的数据
        let userList = res.data.self;  //当前登录用户的信息也需要显示
        let totalpage=res.data.totalPages;
        let totalCommission=0;//返佣总金额
        let totalWin=0;//盈亏总金额
        this.setState({
            totalpage:totalpage,
            page:this.state.page+1
        })
        if(activityList==""){
            activityList=[];
            totalCommission=0;
            totalWin=0;
        }else{
            totalCommission=Number(res.data.all_count.total_count.team_total_commission).toFixed(2);
            totalWin=Number(res.data.all_count.total_count.team_total_win).toFixed(2);
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

        if(page==1){
            activityList.unshift(userList); //当前登录账户也需要显示并显示在第一个，unshift在数组的开头插入一个或多个元素
        }
        let thisForActivityList=this;
        activityList.map(function(item,i){
            thisForActivityList.state.activityList.push(item);
        });
        this.setState({
           totalCommission:totalCommission,
           totalWin:totalWin
        });
    })
   };
  }

  //获取后台一天数据
  handleGetdataforoneday(){
        let startDate=this.state.startTime;
        let endDate=this.state.endTime;
        let page=this.state.page;
        let param="&start_date="+startDate+"&end_date="+endDate+"&page="+page;
        if(this.state.page>this.state.totalpage){
            message.config({
                top:20,
                duration:1
            });
            message.info("没有更多数据");
            return;
        }else{
            this.loadingToast();
            Api("c=user&a=teamWinReport"+param,null,(res)=>{
                if(res.errno>0){
                    message.info(res.errstr);
                }
                let activityList=res.data.other;//需要渲染到页面的数据
                let userList = res.data.self;  //当前登录用户的信息也需要显示
                let totalpage=res.data.totalPages;
                let totalCommission=0;//初始化返佣总金额
                let totalWin=0;//初始化盈亏总金额
                this.setState({
                    totalpage:totalpage,
                    page:this.state.page+1
                })
                if(activityList==""){
                    activityList=[];
                    totalCommission=0;
                    totalWin=0;
                }else{
                    totalCommission=Number(res.data.all_count.total_count.team_total_commission).toFixed(2);
                    totalWin=Number(res.data.all_count.total_count.team_total_win).toFixed(2);
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

                if(page==1){
                    activityList.unshift(userList); //当前登录账户也需要显示并显示在第一个，unshift在数组的开头插入一个或多个元素
                }
                let thisForActivityList=this;
                activityList.map(function(item,i){
                    thisForActivityList.state.activityList.push(item);
                });
                this.setState({
                    totalCommission:totalCommission,
                    totalWin:totalWin
                });
            })
        };
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
    let randerActivity=[];//显示在页面上的元素
    let lotteryActivity=this.state.activityList;//从后台获取的数据
    //把需要显示在页面上的元素PUSH到randerActivity
    if(!this.state.hasContent){
      randerActivity.push(
          <div key={0}>
            <ul className="teamprofitdetail">
              <li>无相关信息</li>
            </ul>
          </div>
      );
    }else{
    lotteryActivity.map(function(item,i){
        randerActivity.push(
            <div key={i}>
              <ul className="teamprofitdetail">
                <li>{item.username}</li>
                <li>{"￥"+item.total_commission}</li>
                <li>{"￥"+item.total_win}</li>
              </ul>
            </div>
        );
    })
    };
    return (
      <div>
        <Navbar title=" 投注盈亏报表" back="/group"/>
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
            <ul className="teamprofitheader">
              <li>账户</li>
              <li>返佣</li>
              <li>投注盈亏</li>
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
                                  totalCommission:0,
                                  totalWin:0
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
                                  totalCommission:0,
                                  totalWin:0
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
              <ul className="countforprofit">
                  <li>合计:</li>
                  <li>返佣：
                      <span>￥{this.state.totalCommission}</span>
                  </li>
                  <li>投注盈亏：
                      <span>￥{this.state.totalWin}</span>
                  </li>
              </ul>
          </div>
        </div>
      </div>
    )
  }
}
