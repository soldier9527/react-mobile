import React,{Component} from 'react';
import Navbar from '../common/navbar';
import Api from '../api';
import { PullToRefresh } from 'antd-mobile';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';

export default class Group_member_detail extends Component{
    constructor(props){
        super(props);
        this.state={
            memberDatas: [],
            visible: false,
            confirmLoading: false,
            refreshing: false,//下拉加载更多
            down: false,//下拉加载更多
            height: document.documentElement.clientHeight,//下拉加载更多
            page: 1,
            show:"none",
            rebate:"",//返点
            bonusOdds:""//奖金赔率
        }
    }

    getMemberData() {
        let userId=this.props.params.memberId;
        let param="&user_id="+userId+"&limit=10&page="+this.state.page;
        Api("c=user&a=childList"+param, null, (res) => {

            let data = res.data;


            //后台异常信息
            let error = res.errstr;

            //服务状态(0/成功)
            let status = res.errno;
            if (status > 0) {
                Modal.error({
                    title: '会员管理' + error
                });
            } else {
                let temp = this.state.memberDatas;
                let priceRebate=data.show_datas[0].price_rebate;
                priceRebate=priceRebate.split("/");
                let userLevel=this.props.params.memberLevel;
                if(userLevel==100){
                    this.setState({show:"block"})
                }
                if (this.state.page <= data.totalPages) {
                    for (let i = 0; i < data.show_datas.length; i++) {
                        temp.push(data.show_datas[i]);
                    }
                    this.setState({
                        page: this.state.page + 1,
                        memberDatas: temp,
                        rebate:priceRebate[1],
                        bonusOdds:priceRebate[0]
                    })

                }
            }
        })
    }

    componentWillMount(){
        this.getMemberData();
    }

    //上拉加载更多组件
    componentDidMount(){
        const hei = ReactDOM.findDOMNode(document.getElementsByClassName("teamlist1")[0]).offsetHeight;
        let itemHei = ReactDOM.findDOMNode(document.getElementsByClassName("teamcustom1header")[0]).offsetHeight;
        setTimeout(() => this.setState({
            height: hei - itemHei,
        }), 0);
    }

    render(){
        const { visible, confirmLoading, ModalText } = this.state;
        let userId=this.props.params.memberId;
        let userName=this.props.params.memberName;
        let userLevel=this.props.params.memberLevel;
        let memberData=[];
        for (var i=0;i<this.state.memberDatas.length;i++) {
            let lv = this.state.memberDatas[i].level;
            if(lv == 0){
                lv = "总代";
            }else if(lv == 100){
                lv = "会员";
            }else{
                lv = lv+"级代理";
            }
            memberData.push(<div key = {i}>
                    <ul  className="teamprofitchange1detail">
                        <li>{this.state.memberDatas[i].username}<br/>({(lv)})</li>
                        <li>{this.state.memberDatas[i].price_rebate}</li>
                        <li>{this.state.memberDatas[i].balance}</li>
                        <li>{(this.state.memberDatas[i].last_time=="0000-00-00 00:00:00")?"无登录记录":this.state.memberDatas[i].last_time.split(" ")[0]}<br/>
                            {(this.state.memberDatas[i].last_time=="0000-00-00 00:00:00")?"":this.state.memberDatas[i].last_time.split(" ")[1]}
                        </li>
                    </ul>
            </div>);
        }
        return (
            <div>
                <Navbar title={userName} back="/group_custom1" />
                <div className="changeLevel" style={{display:this.state.show}}>
                    <Link to={{pathname:"group_member_change_level/"+userId+"/"+this.state.rebate+"/"+this.state.bonusOdds+"/"+userName+"/"+userLevel}}>
                        <span>转代理</span>
                    </Link>
                </div>
                <div className="teamlist1" style={{position:"fixed"}}>


                    <div className="behindNavbar"  style ={{marginTop:"-0.9rem"}}>
                        <div>
                            <ul className="teamcustom1header" >
                                <li>账户</li>
                                <li>奖金/返点</li>
                                <li>余额</li>
                                <li>最近登录</li>
                            </ul>
                        </div>
                        <PullToRefresh
                            ref={el => this.ptr = el}
                            style={{
                                height: this.state.height,
                                overflow: 'auto',
                            }}
                            indicator={this.state.down ? {} : { activate:'松开立即加载' ,deactivate: '上拉加载更多',finish: '完成加载' }}
                            direction={this.state.down ? 'down' : 'up'}
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this.getMemberData();
                                this.setState({ refreshing: true });
                                setTimeout(() => {
                                    this.setState({ refreshing: false });
                                }, 1000);

                            }}
                        >
                            {memberData}
                        </PullToRefresh>
                    </div>
                </div>
            </div>
        )
    }
}
