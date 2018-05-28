import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {message} from 'antd';
import Navbar from '../common/navbar';
import Api from '../api';
import ReactDOM from 'react-dom';
import {PullToRefresh, List, Calendar} from 'antd-mobile';
import 'antd-mobile/lib/pull-to-refresh/style/css';//加载选择样式
import enUS from 'antd-mobile/lib/calendar/locale/en_US';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import 'antd-mobile/lib/Calendar/style/css';
import { Toast} from 'antd-mobile';


const now = new Date();

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            visible: false,
            total: 0,
            totalMount: 0,
            show: false,
            filter: [],
            nowDate: null,//当前日期
            maxDate: null,//最大可选日期
            key: '',//筛选类型
            height: document.documentElement.clientHeight,//下拉刷新判断
            down: true,
            curpage: 1,
            startY: 0,
            refreshing: false,
            en: false,
            config: {},
            showCalendar: false,
            startDate: "",
            endDate: "",
            totalpage: 1,
        }
    }

    componentDidMount() {
        this.getDate();//获取当前日期
        this.getData();
        this.getType()//获取类型
        this.getDown()
        setTimeout(() => this.setState({
            height: ReactDOM.findDOMNode(document.getElementsByClassName("account")[0]).offsetHeight
        }), 0);
    }
    //防止快速多次下拉刷新
    loadingToast() {
        Toast.loading('数据加载中...', 2, () => {
            // console.log('Load complete !!!');
        });
    }
//保留三位小数
      toFixed (value, n) {
        value = value.toFixed(8);
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


    getDate() {
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        this.setState({
            nowDate: now,
            maxDate: now,
        })
    }

    hideSel() {
        this.setState({
            show: false,
        })
    }

    handleCancel() {
        this.setState({
            visible: false,
            showdate: false
        });
    }

    //获取当天日期的值
    onOk(value) {
        let newdate;
        if (value === undefined) {
            //获取今天日期
            let currentTime = new Date();
            let currentYear = currentTime.getFullYear();
            let currentMonth = currentTime.getMonth() < 10 ? '0' + currentTime.getMonth() + 1 : currentTime.getMonth() + 1;
            let currentDate = currentTime.getDate() < 10 ? '0' + currentTime.getDate() : currentTime.getDate();
            newdate = `${currentYear}-${currentMonth}-${currentDate}`;
        } else {
            //获取插件日期
            let date = value;
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let curmonth = month < 10 ? '0' + month : month;
            let day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate();
            newdate = `${year}-${curmonth}-${day}`;
        }
        this.setState({
            visible: false,
            date: newdate,
            nowDate: value,
            showdate: false,
        }, () => {
            this.getData();
        })
    }

    componentWillUnmount() {
        document.getElementsByClassName('account')[0].removeEventListener('touchstart', (ev) => {
            let startY = ev.changedTouches[0].pageY;
            this.setState({
                startY: startY
            })

        }, true);
        document.getElementsByClassName('account')[0].removeEventListener('touchend', (ev) => {
            let endY = ev.changedTouches[0].pageY;
            let direction = endY - this.state.startY;
            if (direction === 0) {
                return false;
            } else if (direction > 0) {
                this.setState({
                    down: true
                })
            } else {
                this.setState({
                    down: false
                })
            }


        }, true);
    }

    getDown() {
        //滑动处理
        document.getElementsByClassName('account')[0].addEventListener('touchstart', (ev) => {

            let startY = ev.changedTouches[0].pageY;
            this.setState({
                startY: startY
            })

        }, true);

        document.getElementsByClassName('account')[0].addEventListener('touchend', (ev) => {

            let endY = ev.changedTouches[0].pageY;
            let direction = endY - this.state.startY;
            if (direction === 0) {
                return false;
            } else if (direction > 0) {
                this.setState({
                    down: true
                })
            } else {
                this.setState({
                    down: false
                })
            }


        }, true);
    }

    getData() {
        let data = JSON.parse(sessionStorage.getItem("user"));
        let param = "";
        if (this.state.key) {
            param += "&orderType=" + this.state.key;
        }
        if (this.state.curpage) {
            param += "&page" + this.state.curpage;
        }
        let _this=this;
        Api("c=fin&a=orderList" + "&user_id=" + data.user_id + param, null, (data) => {
            let status = data.errno;
            if (status === 0) {
                let showData = data.data.showDatas ? data.data.showDatas : [];
                if (showData.length === 0) {
                    let newdata = [];
                    newdata.push(
                        <li key={0} className="noData">
                <span>
                没有相关消息
              </span>
                        </li>);
                    this.setState({
                        data: newdata,
                    });
                } else {
                    let newdata = [];
                    showData.map(function (item, i) {
                        newdata.push(
                            <li key={i}>
                <span className="span_time">
                  {item.create_time.substr(0, 10)}
                    <p>{item.create_time.substr(-8)}</p>
                </span>
                                <span className="span_middle">
                  {item.type}
                </span>
                                <span className="fr span_amount">
                    ￥{_this.toFixed(parseFloat(item.amount),3)}
                </span>
                            </li>)
                    });
                    this.setState({
                        data: newdata,
                    });
                }
            } else {
                message.error(" '查询数据异常信息' + error", 2)
            }
            setTimeout(() => {
                this.setState({refreshing: false});
            }, 1000);
        })
    }
    loadMore() {
        let nextpage = this.state.curpage + 1;
        this.setState({
            curpage: nextpage,
        });
        let _this=this;
        let data = JSON.parse(sessionStorage.getItem("user"));
        let param = "";
        let startDate = this.state.startDate;
        let endDate = this.state.endDate;
        let date = "&start_date=" + startDate + "&end_date=" + endDate;
        if (this.state.key) {
            param += "&orderType=" + this.state.key;
        }
        if (this.state.curpage) {
            param += "&page=" + nextpage;
        }
        this.loadingToast();
        Api("c=fin&a=orderList" + "&user_id=" + data.user_id + param + date, null, (data) => {
            let status = data.errno;
            if (status === 0) {
                let showData = data.data.showDatas ? data.data.showDatas : [];

                if (showData.length === 0) {
                    message.warning("没有更多的数据", 1);
                    setTimeout(() => {
                        this.setState({refreshing: false});
                    }, 1000);
                } else {
                    let newdata = [];
                    showData.map(function (item, i) {
                        newdata.push(
                            <li key={i}>
                <span className="span_time">
                  {item.create_time.substr(0, 10)}
                    <p>{item.create_time.substr(-8)}</p>
                </span>
                                <span className="span_middle">
                  {item.type}
                </span>
                                <span className="fr span_amount">
                  ￥{_this.toFixed(parseFloat(item.amount),3)}
                </span>
                            </li>)
                    });

                    this.setState({
                        data: new Set([...this.state.data, newdata]),
                    });
                }
            } else {
                message.error(" '查询数据异常信息' + error", 2)
            }
            setTimeout(() => {
                this.setState({refreshing: false});
            }, 1000);
        })
    }

    reLoad() {
        this.setState({
            // data:[],
            curpage: 1,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
        }, () => {
            if (!this.state.endDate) {
                this.getData();
            } else {
                this.getRange();
            }
        });
        // this.getData();
    }


    //	类型增加一个下拉列表
    showType() {
        this.setState({show: !this.state.show});
    }

    getType() {
        let data = JSON.parse(sessionStorage.getItem("user"));
        let user_id = data.user_id;
        Api("c=default&a=getType&user_id=" + user_id, null, (res) => {
            let data = res.data;
            this.setState({
                filter: data
            })
        })
    }

    //根据类型查数据
    filterType(key) {
        this.setState({
            key: key,
            show: !this.state.show,
            curpage:1,
        }, () => {
            this.getData();

        });
    }

    //隐藏
    hideLotteryType() {
        this.setState({show: false});
    }



    //区间组件用法
    //下面方法用于转换日期字符串格式
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

    renderBtn(zh, en, config = {}) {
        config.locale = this.state.en ? enUS : zhCN;

        return (
            <List.Item arrow="horizontal"
                       onClick={() => {
                           document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
                           this.setState({
                               showCalendar: true,
                               config,
                           });
                       }}
            >
                {this.state.en ? en : zh}
            </List.Item>
        );
    }

    //日历插件关闭时回调
    onCancel = () => {
        document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
        this.setState({
            showCalendar: false,
            startTime: undefined,
            endTime: undefined,
            show:false
        });
    }
    onSelectHasDisableDate = (dates) => {
        console.warn('onSelectHasDisableDate', dates);
    }
    //成功回调
    onConfirm = (startTime, endTime) => {
        let _this=this;
        let startDate = this.format(startTime, '-');
        let endDate = this.format(endTime, '-');
        this.setState({
            showCalendar: false,
            startDate: startDate,
            endDate: endDate,
            // page: this.state.curpage,
            curpage:1,
            show:false
        });
        let date = "&start_date=" + startDate + "&end_date=" + endDate;
        //把类型一起传给后台
        let type = "&orderType=" + this.state.key;
        Api("c=fin&a=orderList" + date + type, null, (data) => {
            let status = data.errno;
            if (status === 0) {
                let showData = data.data.showDatas ? data.data.showDatas : [];
                if (showData.length === 0) {
                    let newdata = [];
                    newdata.push(
                        <li key={0} className="noData">
							<span>
                没有相关消息
              </span>
                        </li>);
                    this.setState({
                        data: newdata,
                    });
                } else {
                    let newdata = [];
                    showData.map(function (item, i) {
                        newdata.push(
                            <li key={i}>
                <span className="span_time">
                  {item.create_time.substr(0, 10)}
                    <p>{item.create_time.substr(-8)}</p>
                </span>
                                <span className="span_middle">
                  {item.type}
                </span>
                                <span className="fr span_amount">
                    ￥{_this.toFixed(parseFloat(item.amount),3)}
                </span>
                            </li>)
                    });
                    this.setState({
                        data: newdata,
                    });
                }
            } else {
                message.error(" '查询数据异常信息' + error", 2)
            }
        });

    };

    //期间数据
    getRange() {
        let _this=this;
        let param = "";
        let nextpage = this.state.curpage + 1;
        this.setState({curpage: nextpage,});
        if (this.state.curpage) {
            param += "&page=" + this.state.curpage;
        }
        let startDate = this.state.startDate;
        let endDate = this.state.endDate;
        let date = "&start_date=" + startDate + "&end_date=" + endDate;
        let type = "&orderType=" + this.state.key;
        this.setState({
            curpage:1,
        });

        Api("c=fin&a=orderList" + date + type + param, null, (data) => {
            let status = data.errno;
            if (status === 0) {
                let showData = data.data.showDatas ? data.data.showDatas : [];
                if (showData.length === 0) {
                    let newdata = [];
                    newdata.push(
                        <li key={0} className="noData">
							<span>
                没有相关消息
              </span>
                        </li>);
                    this.setState({
                        data: newdata,
                    });
                } else {
                    let newdata = [];
                    showData.map(function (item, i) {
                        newdata.push(
                            <li key={i}>
                <span className="span_time">
                  {item.create_time.substr(0, 10)}
                    <p>{item.create_time.substr(-8)}</p>
                </span>
                                <span className="span_middle">
                  {item.type}
                </span>
                                <span className="fr span_amount">
                    ￥{_this.toFixed(parseFloat(item.amount),3)}
                </span>
                            </li>)
                    });
                    this.setState({
                        data: newdata,
                    });
                }
            } else {
                message.error(" '查询数据异常信息' + error", 2)
            }
        });
        setTimeout(() => {
            this.setState({refreshing: false});
        }, 1000);
    }


    render() {
        let typeArr = [];
        typeArr.push(<li key={""} onClick={() => {
            this.filterType()
        }}>全部</li>);
        this.state.filter.map((item, i) => {
            typeArr.push(
                <li key={i} className={item.key === this.state.key ? "active" : ""} onClick={() => {
                    this.filterType(item.key)
                }}>
                    {item.val}
                </li>
            )
        });

        return (
            <div>
                <Navbar title="个人账变" back="back"/>
                <div>
                    <div className="pickUpDate">
                        <List className="calendar-list" style={{backgroundColor: 'white'}}>
                            {this.renderBtn('选择日期', 'Select Date Range')}
                        </List>
                        <Calendar
                            {...this.state.config}
                            visible={this.state.showCalendar}
                            onCancel={this.onCancel}
                            onConfirm={this.onConfirm}
                            onSelectHasDisableDate={this.onSelectHasDisableDate}
                            getDateExtra={this.getDateExtra}
                            defaultDate={now}
                            defaultValue={[new Date(this.state.startDate?this.state.startDate:+now),
                                new Date(this.state.endDate?this.state.endDate:+now)]}
                            minDate={new Date(+now - (5184000000 / 2))}
                            maxDate={new Date(now)}
                        />
                    </div>
                </div>
                <div className="accountnav">
                    <ul>
                        <li>
                            <Link>
                                <span>账变时间</span>
                            </Link>
                            <Link>
                                <span className="accountType" onClick={() => {
                                    this.showType()
                                }}>类型</span>
                            </Link>
                            <Link>
                                <span>账变金额</span>
                            </Link>
                        </li>
                    </ul>

                    {/*帐变类型*/}
                    <ul className="type" style={{display: this.state.show ? 'block' : 'none'}}>
                        {typeArr}
                    </ul>
                </div>
                <div className="account" onClick={() => {
                    this.hideSel()
                }}>
                    {/*遮罩层*/}
                    <div className="box" style={{display: this.state.show ? 'block' : 'none'}} onClick={() => {
                        this.hideLotteryType()
                    }}>

                    </div>

                    <PullToRefresh
                        ref={el => this.ptr = el}
                        style={{
                            height: this.state.height,
                            overflow: 'auto',
                        }}
                        indicator={this.state.down ? {
                            activate: '松开立即刷新',
                            deactivate: '下拉刷新',
                            finish: " "
                        } : {activate: '松开立即加载', deactivate: '上拉加载更多', finish: " "}}
                        direction={this.state.down ? 'down' : 'up'}
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            this.setState({refreshing: true});
                            this.state.down ? this.reLoad() : this.loadMore();

                        }}
                    >
                        <ul className="account-content">
                            {this.state.data}
                        </ul>
                    </PullToRefresh>
                </div>
            </div>
        );
    }
}
