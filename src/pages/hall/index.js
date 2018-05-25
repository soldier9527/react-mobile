import React, {Component} from 'react'
import {Link} from 'react-router-dom';
import {Tabs,Toast} from 'antd-mobile';
import Navbar from '../common/navbar';
import Footer from '../common/footer';
import LotteryNum from '../open/lotteryNum'
import Api from '../api';
export default class Hall extends Component {
    constructor(props) {
        super(props);
        let user = sessionStorage.getItem("user");
        this.state = {
            user: user,
            data: {},
            list: null,
            setTime:null,
            listId:null
        };

        this.getLobbyData = this.getLobbyData.bind(this);
    }

    componentDidMount() {
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
    getLobbyData(index = 0) {
        let id=this.state.list[index].list_id;
        if(!this.state.data[id]){
            Toast.loading('数据加载中...', 15,null,false);
            Api('c=default&a=newLobby&index=' + id, null, (res) => {
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
        const renderData = (data, type) => {
            return data.map((item) => {
                let lottery_id = parseInt(item.lottery_id);
                let path = '';
                if ([1, 4, 8, 11, 18, 24].indexOf(lottery_id) !== -1) {
                    path = 'ssc/' + lottery_id;
                } else if ([2, 5, 6, 7, 16].indexOf(lottery_id) !== -1) {
                    path = '11x5/' + item.lottery_id;
                } else if ([9].indexOf(lottery_id) !== -1) {
                    path = 'fc3d/' + lottery_id;
                } else if ([12, 13, 19, 20, 27, 28, 29, 30].indexOf(lottery_id) !== -1) {
                    path = 'k3/' + lottery_id;
                } else if ([21, 25].indexOf(lottery_id) !== -1) {
                    path = 'lhc/' + lottery_id;
                } else if ([14].indexOf(lottery_id) !== -1) {
                    path = 'klpk/' + lottery_id;
                } else if ([10].indexOf(lottery_id) !== -1) {
                    path = 'p3p5/' + lottery_id;
                } else if ([22].indexOf(lottery_id) !== -1) {
                    path = 'ssq/' + lottery_id;
                } else if ([23].indexOf(lottery_id) !== -1) {
                    path = 'xy28/' + lottery_id;
                } else if ([17].indexOf(lottery_id) !== -1) {
                    path = 'pk10/' + lottery_id;
                } else if ([26].indexOf(lottery_id) !== -1) {
                    path = 'xyft/' + lottery_id;
                } else if ([15].indexOf(lottery_id) !== -1) {
                    path = 'mmc/' + lottery_id;
                }
                else {
                    path = 'hall';
                }

                let to = {pathname: path, query: {type: "x"}};//切换跳转的彩种从大厅进入是否为官方g或者信用x
                if (type) {
                    to = {pathname: path, query: {type: type}};
                }
                let count_down = 0;
                if (item.kTime > 0) {
                    count_down = item.kTime;
                } else {
                    count_down = item.count_down > 0 ? item.count_down * 1000 : 0
                }

                return (

                    <Link key={item.lottery_id} to={this.state.user ? to : "login"}>
                        <div className="gameLeft fl">
                            <i className={"lt-icon lt-icon-" + item.lottery_id}></i>
                        </div>
                        <div className="gameMid fl">
                            <h3>{item.cname}</h3>
                            <div className="prize-num">
                                {/*彩球样式*/}
                                <LotteryNum data={{
                                    lottery_id: item.lottery_id,
                                    code: item.code,
                                    kTime: item.kTime
                                }}/>
                            </div>
                            {item.lottery_id != 15 ? <p className="date">第
                                <span className="">{item.issue}</span>期 截至
                                {/*<CountdownTimer initialTimeRemaining={count_down}/>*/}
                            </p> : <p className="date">无奖期</p>}
                        </div>
                        <div className="gameRight"><i className="anticon anticon-right"></i></div>
                    </Link>
                );
            });
        };
        let listDiv = [];
        let listDiv_=[] ;
        if (list) {
            let data = this.state.data;
            list.map((item, i) => {
                listDiv.push({title: item.name, index: item.list_id});
                if (data[item.list_id]) {
                    listDiv_.push(<div key={i}>{renderData(data[item.list_id])}</div>);
                }else{
                    listDiv_.push(<div key={i}></div>);
                }
            });
        }


        return (
            <div>
                <Navbar title="购彩大厅"/>
                <div className="hall fadeInRight">
                    {listDiv.length===0?null:<Tabs
                        tabs={listDiv}
                        swipeable={false}
                        className="tabs"
                        onChange={(tab, index) => { this.getLobbyData(index); }}
                        distanceToChangeTab={.9}>
                        {listDiv_}
                    </Tabs>}
                </div>
                <Footer/>
            </div>
        )
    }
}

