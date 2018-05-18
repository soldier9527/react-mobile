import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Navbar from '../common/navbar';
import ShowMoney from '../common/showmoney';

import Footer from '../common/footer';
import { Tabs,PullToRefresh,Toast } from 'antd-mobile';
import {Link } from 'react-router-dom';
import LotteryNum from './lotteryNum';
import CountdownTimer  from './countdown';
import Api from '../api';
export default class OpenList extends Component {
    constructor(props) {
        super(props);
        let user = sessionStorage.getItem("user");
        this.state = {
            user: user,
            data: [],
            list: null,
            setTime:null,
            refreshing: false,
            height: document.documentElement.clientHeight,//下拉刷新判断
        };

        this.getLobbyData = this.getLobbyData.bind(this);
    }

    componentDidMount() {
        this.setState({
            setTimeHeight:setTimeout(() => this.setState({
                height: ReactDOM.findDOMNode(document.getElementsByClassName("am-tabs-content-wrap")[0]).offsetHeight
            }), 1000)
        });

        this.getTab();
        Toast.loading('数据加载中...', 15,null,false);
        this.setState({
            setTime:setInterval(()=>{
                this.getLobbyData()
            },30000)
        })
    }
    componentWillUnmount(){
        Toast.hide();
        if(this.state.setTime){
            clearInterval(this.state.setTime);
        }
        if(this.state.setTimeHeight){
            clearInterval(this.state.setTimeHeight);
        }
    }



    //获取标题
    getTab() {
        Api('c=default&a=lotteryList', null, (res) => {
            if(res.errno===0){
                let list = res.data.list;
                this.setState({list: list},()=>{
                    this.getLobbyData();
                });

            }
        })
    }
    //彩种列表
    getLobbyData(index = 0,type) {
        let id=this.state.list[index].list_id;
        if(!this.state.data[id]||type){
            Toast.loading('数据加载中...', 15,null,false);
            Api('c=default&a=newLobby&index=' + id, null, (res) => {
                this.setState({ refreshing: false });
                let newData = JSON.parse(JSON.stringify(this.state.data));
                setTimeout(() => {
                    Toast.hide();
                }, 200);
                newData[id]=res.data;
                this.setState({data: newData});
            });
        }
    }



    render() {
        let list = this.state.list;
        let listDiv = [];
        let listDiv_=[] ;
        const renderData = (data, type) => {
            return data.map((item,i) => {

                if(item.lottery_id!="15"){
                    let issue = item.issue.split("-");
                    if(issue[1]!==undefined){
                        issue= issue[1]
                    }else if(issue[0].indexOf("2017") !==-1){
                        issue= issue[0].replace("2017","")
                    }
                    let count_down=0;
                    if(item.kTime>0){
                        count_down =item.kTime;
                    }else{
                        count_down = item.count_down>0?item.count_down*1000:0
                    }
                    return (
                        <div className="openli"  key={i}>
                            <Link to={"open/history/"+item.lottery_id}>
                                <i className={"lt-icon lt-icon-"+item.lottery_id}></i>
                                <div>
                                    <h3>{item.cname}</h3>
                                    <p className="time">
                                        第{issue}期&nbsp;&nbsp;
                                        <CountdownTimer initialTimeRemaining={count_down}   />
                                    </p>
                                    <div className="prize-num">
                                        {/*彩球样式*/}
                                        <LotteryNum data={item}  />
                                    </div>
                                    <i className="anticon anticon-right"></i>
                                </div>
                            </Link>
                        </div>




                    );
                }else{
                    return null;
                }

            });
        };
        if (list) {
            let data = this.state.data;
            list.map((item, i) => {
                listDiv.push({title: item.name, index: item.list_id});
                if (data[item.list_id]) {
                    listDiv_.push(<div className="open-index-list" key={i}>
                        <PullToRefresh
                            key={i}
                            style={{
                                height: this.state.height,
                                overflow: 'auto',
                            }}
                            direction='down'
                            refreshing={this.state.refreshing}
                            onRefresh={() => {

                                this.setState({ refreshing: true });
                                this.getLobbyData(i,true)
                            }}
                            indicator={{ activate: "下拉刷新", deactivate: " ",  finish: " " }}
                        >


                            {renderData(data[item.list_id])}
                        </PullToRefresh>

                    </div>);
                }else{
                    listDiv_.push(<div key={i}></div>);
                }
            });

        }





        return (
            <div>
                <Navbar className="" title="开奖信息" />
                <div className="open-wrap open-wrap1">
                    <div className="open-award-wrap">
                        <ShowMoney />
                    </div>
                    <div className="open-tab" >
                        {listDiv.length===0?null:<Tabs ref = "tabs"
                                                       tabs={listDiv}
                                                       swipeable={false}
                                                       className="tabs"
                                                       onChange={(tab, index) => { this.getLobbyData(index); }}
                                                       distanceToChangeTab={.9}>
                            {listDiv_}
                        </Tabs>}
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}


class OpenLi extends Component {
    constructor(props) {
        super(props);

    }
    componentWillMount(){

    }
    componentWillUpdate(){
    }
    render() {
        let issue = this.props.item.issue.split("-");
        if(issue[1]!==undefined){
            issue= issue[1]
        }else if(issue[0].indexOf("2017") !==-1){
            issue= issue[0].replace("2017","")
        }

        let count_down=0;
        if(this.props.item.kTime>0){
            count_down =this.props.item.kTime;
        }else{
            count_down = this.props.item.count_down>0?this.props.item.count_down*1000:0
        }

        return (
            <div className="openli">
                <Link to={"open/history/"+this.props.item.lottery_id}>
                    <i className={"lt-icon lt-icon-"+this.props.item.lottery_id}></i>
                    <div>
                        <h3>{this.props.item.cname}</h3>
                        <p className="time">
                            第{issue}期&nbsp;&nbsp;
                            <CountdownTimer initialTimeRemaining={count_down}   />
                        </p>
                        <div className="prize-num">
                            {/*彩球样式*/}
                            <LotteryNum data={this.props.item}  />
                        </div>
                        <i className="anticon anticon-right"></i>
                    </div>
                </Link>
            </div>
        )
    }

}
