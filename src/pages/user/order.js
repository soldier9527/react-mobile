import React, {Component} from 'react';
import { Link} from 'react-router-dom';
import {Calendar, List, PullToRefresh, Tabs, Badge,} from 'antd-mobile';
import Navbar from '../common/navbar';
import ReactDOM from 'react-dom';
import message from 'antd/lib/message';


import Api from '../api';

//日期
const extra = {
    '2017/07/15': { info: 'Disable', disable: true },
};
const now = new Date();
const tabs = [
    {title: <Badge>全部</Badge>},
    {title: <Badge>已中奖</Badge>},
    {title: <Badge>待开奖</Badge>},
    {title: <Badge>追号</Badge>},
];
export default class Order extends Component {
    constructor(props) {
        super(props);
        let orderIndex =sessionStorage.getItem("orderIndex");
        this.state = {
            renderList: [],
            dpValue: null,
            customChildValue: null,
            // myDate: "",//拿到日期,
            // nowDate: null,
            // maxData: null,
            index:orderIndex?parseInt(orderIndex):0,
            hasContent: true,
            page:0,
            betamount:0,
            curPage: 1,
            totalPages:1,
            refreshing: false,
            down: true,
            startDate:"",//区间开始时间
            endDate:"",//区间结束时间
            height: document.documentElement.clientHeight,
            //新数据
            // selfWinReport:{},
            showDatas:"",
            // total_win:0,
        }
    };

    componentDidMount() {
        // this.getOrdersListtest()
        this.handlechange(this.state.index);
        this.getDown();
        const hei = ReactDOM.findDOMNode(document.getElementsByClassName("orderlist-content")[0]).offsetHeight;
        setTimeout(() => this.setState({
            height: hei,
        }), 0);

    }

    componentWillUnmount() {
        document.getElementsByClassName('orderlist-content')[0].removeEventListener('touchstart', (ev) => {
            startY = ev.changedTouches[0].pageY;
        }, true);
        document.getElementsByClassName('orderlist-content')[0].removeEventListener('touchend', (ev) => {
            let endY = ev.changedTouches[0].pageY;
            let direction = endY - startY;
            if (direction == 0) {
                return;
            } else if (direction > 10) {
                this.setState({
                    down: true
                })
            } else if (direction < -10){
                this.setState({
                    down: false
                })
            }
        }, true);
    }

    getDown() {
        //滑动处理

        document.getElementsByClassName('orderlist-content')[0].addEventListener('touchstart', (ev) => {
            let startY = ev.changedTouches[0].pageY;
            this.setState({
                startY:startY
            })
        }, true);

        document.getElementsByClassName('orderlist-content')[0].addEventListener('touchend', (ev) => {
            let endY = ev.changedTouches[0].pageY;

            let direction = endY - this.state.startY;
            this.setState({
                startY:endY
            })

            if (direction == 0) {
                return;
            } else if (direction > 10) {
                this.setState({
                    down: true
                })
            } else if (direction < -10){
                this.setState({
                    down: false
                })
            }
        }, true);
    }
//上拉加载更多
    loadMore() {
        let totalPages=this.state.totalPages;
        let curPage=this.state.curPage;
        if(this.state.curPage==totalPages){
            message.config({
                top: 20,
                duration: 1
            });
            message.info('亲，已经没有数据了');
            return;
        }else{
          curPage++;
          this.setState({
              curPage: curPage
          },()=>{
              this.getOrdersListtest();
          });

        }
    }
//下拉刷新
    reLoad() {
        this.setState({
            curPage:1,
            startDate:this.state.startTime,
            endDate:this.state.endTime,
        },()=>{
            
                this.getOrdersListtest();
         
        });
    }


    check(str) {
        str = str.toString();
        if (str.length < 2) {
            str = '0' + str;
        }
        return str;
    }
//下面方法用于转换日期字符串格式
    format(date, str) {
        var mat = {};
        mat.M = date.getMonth() + 1;//月份记得加1
        mat.H = date.getHours();
        mat.s = date.getSeconds();
        mat.m = date.getMinutes();
        mat.Y = date.getFullYear();
        mat.D = date.getDate();
        mat.d = date.getDay();//星期几
        mat.d = this.check(mat.d);
        mat.H = this.check(mat.H);
        mat.M = this.check(mat.M);
        mat.D = this.check(mat.D);
        mat.s = this.check(mat.s);
        mat.m = this.check(mat.m);
        if (str.indexOf(":") > -1) {
            mat.Y = mat.Y.toString().substr(2, 2);
            return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + ":" + mat.m + ":" + mat.s;
        }
        if (str.indexOf("/") > -1) {
            return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + "/" + mat.m + "/" + mat.s;
        }
        if (str.indexOf("-") > -1) {
            return mat.Y + "-" + mat.M + "-" + mat.D;
        }
    }

    //区间组件用法

    renderBtn(zh, en, config = {}) {
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
       //	关闭时回调
    onCancel = () => {
        document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
        this.setState({
            show: false,
            startTime: undefined,
            endTime: undefined,
        });
    }

    //确认时回调
    onConfirm = (startTime, endTime) => {
        let startDate=this.format(startTime,"-");//开始时间格式
        let endDate=this.format(endTime,"-");//结束时间格式
        this.setState({
            show:false,
            startTime:startDate,
            endTime:endDate,
            curPage:1,
            showDatas:"",
        },()=>this.getOrdersListtest());
    }

    //在render()之前渲染
    componentWillMount() {
         
    };
// 请求后台得到的下注记录
    getOrdersListtest(){
        let page=this.state.curPage;
        let index = this.state.index;
        let num = -1;
        if (index === 0) {
            num = -1
        } else if (index === 1) {
            num = 1
        } else if (index === 2) {
            num = 0
        } else if (index === 3) {
            num = 3
        }

        let startDate=this.state.startTime;
        let endDate=this.state.endTime;
        let param="";
        if(startDate==undefined){
            param="&page="+page+"&type="+num;
        }else{
            param="&start_date="+startDate+"&end_date="+endDate+"&page="+page+"&type="+num;
        }
        Api("c=game&a=packageList"+param,null,(res)=>{

            let showDatas = res.data.show_datas ? res.data.show_datas : [];
            if(res.errno==0){
                if(page!==1){
                    let oldData=JSON.parse(JSON.stringify(this.state.showDatas));
                    showDatas.map((item,i)=>{
                        oldData.push(item)
                    });
                    this.setState({
                        selfWinReport:res.data.selfWinReport,
                        totalPages:res.data.pageTool.totalPages,//总页数
                        showDatas:oldData,//上拉加载的新数据
                    });
                }else{
                    this.setState({
                        totalPages:res.data.pageTool.totalPages,
                        selfWinReport:res.data.selfWinReport,
                        showDatas:showDatas,
                    });
                }
            }

        });
    }

    // 未中奖  无开奖  追号
    handlechange(index) {
        sessionStorage.setItem("orderIndex",index);
        this.setState({
            index: index,
            curPage: 1,
            startDate:this.state.startTime,
            endDate:this.state.endTime,
        }, () => {
           
                this.getOrdersListtest();
        })
    };


    render() {
        let showDatas=this.state.showDatas;
        let listRender=[];
        let index = this.state.index;
        let num = -1;
        if (index === 0) {
            num = -1
        } else if (index === 1) {
            num = 1
        } else if (index === 2) {
            num = 0
        } else if (index === 3) {
            num = 3
        }
        if(showDatas !==""){
            showDatas.map(function (item, i) {
                let data = item.amount.replace(/,/g, "");
                listRender.push(
                    <li className="bottom_border" key={i}>
                        <Link to={{
                            pathname: "order_deatil",
                            query: {query: JSON.stringify(item), page: num}
                        }}><span>{item.show_name}</span><span>{item.issue}</span>
                            <span>{parseFloat(data).toFixed(3)}</span><span
                                className={item.status === 1 ? 'win' : ""}>{item.show_status}</span>
                        </Link>
                    </li>
                );


            });
        }

        return (
            <div>
                <Navbar title="注单中心" back="back"/>
                {/*查询日期*/}
                <div className="eziDay">
                    <div className="pickUpDate">
                        <List className="calendar-list" style={{ backgroundColor: 'white' }}>
                            {this.renderBtn('选择日期', 'Select Date Range')}
                        </List>
                        <Calendar
                            defaultValue={[new Date(this.state.startTime?this.state.startTime:+now),
                                new Date(this.state.endTime?this.state.endTime:+now)]}
                            {...this.state.config}
                            visible={this.state.show}
                            onCancel={this.onCancel}
                            onConfirm={this.onConfirm}
                            onSelectHasDisableDate={this.onSelectHasDisableDate}
                            getDate={this.getDate}
                            defaultDate={now}
                            minDate={new Date(+now - (5184000000/2))}//往前查询一个月
                            maxDate={new Date(+now -1)}//当前时间之前
                        />
                    </div>
                </div>
                <div className="order">
                    <Tabs tabs={tabs}
                          initialPage={this.state.index}
                          onChange={(tab, index) => {
                              this.handlechange(index)
                          }}>

                    </Tabs>
                    <div className="orderlist">
                        <div className="table-head">
                            <span>游戏类别</span><span>投注期号</span><span>金额（元）</span><span>状态</span>
                        </div>
                        <div className="orderlist-content">
                            <PullToRefresh
                                ref={el => this.ptr = el}
                                style={{
                                    height: this.state.height,
                                    overflow: 'auto',
                                }}
                                indicator={this.state.down ? {
                                    activate: '松开立即刷新',
                                    deactivate: '下拉刷新',
                                    finish:" "
                                } : {activate: '松开立即加载', deactivate: '上拉加载更多',finish:" "}}
                                direction={this.state.down ? 'down' : 'up'}
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this.state.down ? this.reLoad() : this.loadMore();
                                    this.setState({refreshing: true});
                                    setTimeout(() => {
                                        this.setState({refreshing: false});
                                    }, 1000);

                                }}
                            >
                                <ul className="table-body">
                                    {listRender}
                                </ul>
                            </PullToRefresh>
                        </div>
                    </div>    
                    {this.state.showDatas.length>0&&this.state.index===0 ? <div className="zhudanyinkui">
                        <ul className="yinkui">
                            <p>今日</p>
                            <li>投注金额：￥{this.state.selfWinReport&&this.state.selfWinReport.today?this.state.selfWinReport.today.total_amount.toFixed(3):"0"}</li>
                            <li>盈亏:￥{this.state.selfWinReport&&this.state.selfWinReport.today?this.state.selfWinReport.today.total_win.toFixed(3):"0"}</li>
                        </ul>
                        <div></div>
                        <ul className="yinkui">
                            <p>总计</p>
                            <li>投注金额：￥{this.state.selfWinReport&&this.state.selfWinReport.all?this.state.selfWinReport.all.total_amount.toFixed(3):"0"}</li>
                            <li>盈亏:￥{this.state.selfWinReport&&this.state.selfWinReport.all?this.state.selfWinReport.all.total_win.toFixed(3):"0"}</li>
                        </ul>
                    </div> : null}
                    {!this.state.showDatas.length>0 ?  <div className="data2_block">
                        <p>
                            <img src={require("../../img/global/data_block.png")}/>
                        </p>
                        <h2>您暂时没有下注订单</h2>
                        <span>请给梦想一个机会</span><br/>
                        <Link to="hall">
                            立即下注
                        </Link>
                    </div> :null}
                </div>
            </div>
        );
    }
}
