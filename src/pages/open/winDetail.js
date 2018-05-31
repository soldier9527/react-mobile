import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import LotteryNum from './lotteryNum';
import Navbar from '../common/navbar';
import GetLotteryList from '../get_lottery_list';

export default class WinDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "normal",
            name:"",
            id:this.props.location.query.id,
            item:this.props.location.query
        }
    }
    componentWillMount(){
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
    render() {
        let item ={
            lottery_id: this.state.item.id,
            code: this.state.item.code
        };




        return (
            <div className="open-wrap">
                <Navbar title={this.state.name} back={"/open/history/"+this.state.item.id} />
                <div className="win-detail-wrap">
                    <div className="win-detail-head">
                        <h3>{this.state.name}</h3>
                        <span>第{this.state.item.issue}期</span>
                        <span>{this.state.item.end_sale_time}</span>
                    </div>

                    <div className="prize-num">

                        <LotteryNum  data={item} />

                    </div>
                    <hr/>

                    <div className="win-table current-prize">
                        <div className="win-tr">
                            <div className="win-td">本期销量 <span>3.2亿</span></div>
                            <div className="win-td">奖金积累 <span>3.9亿</span></div>
                        </div>
                    </div>

                    <div className="win-table current-prize-detail">
                        <div className="win-tr">
                            <div className="win-td">奖项</div>
                            <div className="win-td">中奖注数</div>
                            <div className="win-td">每注奖金（元）</div>
                        </div>
                        <div className="win-tr">
                            <div className="win-td">一等奖</div>
                            <div className="win-td"><span>1</span></div>
                            <div className="win-td"><span>88888888</span></div>
                        </div>
                        <div className="win-tr">
                            <div className="win-td">二等奖</div>
                            <div className="win-td"><span>4</span></div>
                            <div className="win-td"><span>1111</span></div>
                        </div>
                        <div className="win-tr">
                            <div className="win-td">三等奖</div>
                            <div className="win-td"><span>132</span></div>
                            <div className="win-td"><span>123123</span></div>
                        </div>
                    </div>

                    <div className="submit-btn">
                        <Link to="/">
                            立刻投注
                        </Link>
                    </div>
                </div>

            </div>


        )
    }
}
