import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import  Row from 'antd/lib/row';
import  Col from 'antd/lib/col';

import Navbar from '../common/navbar';
import HistoryItem from './historyItem';
import GetLotteryList from '../get_lottery_list';

import Api from '../api';



export default class HistoryList extends Component {
    constructor(props) {
        super(props);
        console.log()
        this.state={
            id:new URLSearchParams(props.history.location.search).get("id"),
            lotteryHistory:[]
        }
    }
    getHistory(){
        Api("c=default&a=getOpen&lottery_id="+this.state.id,null,(res)=>{
            let data = res.data.openIssues?res.data.openIssues:[];

            let randerHistory =[];

            let id =this.state.id;
            data.map(function (item,i) {
                randerHistory.push(
                    <HistoryItem key={i} item={item} id={id} />
                )
            });

            this.setState({
                randerHistory : randerHistory
            })
        })
    }
    componentWillMount(){
        this.getHistory();
        GetLotteryList((data)=>{
            data.map((item,i)=>{
                if(item.lottery_id==this.state.id){
                    this.setState({
                        name:item.cname
                    })
                }
            })
        })
    }

    //路径判断
    fiflerPath(lottery_id){
        let path = '';
        if([1, 4, 8,11,18,24].indexOf(lottery_id) !== -1) {
            path = 'ssc/' + lottery_id;
        } else if([2, 5, 6, 7].indexOf(lottery_id) !== -1) {
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
        }
        return path;

    }
    render() {


        return (
            <div className="open-wrap">
                <Navbar title={this.state.name} back="/open" />
                <div className="open-history-list">
                    {/*第一个class名recent*/}
                    {this.state.randerHistory}
                </div>
                <div className="foot-btn-warp">
                    <div>
                        <Row>
                            <Link to={this.fiflerPath(parseInt(this.state.id))}>
                                <Col className="foot-btn btn-bet" span={12} >立即投注</Col>
                            </Link>

                            <Link to={{pathname:"/lotteryTrend",search:"?id="+this.state.id }}>
                                <Col className="foot-btn btn-trend" span={12}>走势图</Col>
                            </Link>
                        </Row>
                    </div>

                </div>
            </div>
        )
    }
}
