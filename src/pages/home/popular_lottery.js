import React, { Component} from 'react'
import {Link} from 'react-router-dom';
import Progress from 'antd/lib/progress';  // 加载 JS

// import CountdownTimer  from '../open/countdown';
export default class PopularLottery extends Component {


    constructor(props) {
        super(props);

        this.state={
            Total_amount:0, //总额初始值
            Bonus_pools:0, //奖金池
            countdown:10000,  //开奖倒计时
            issue:0,        //奖期
        }


    }


    componentWillMount(){

        this.currencyTo(this.props.item.total);
        this.currencyTo(this.props.item.prize);
//定时器==0


    }

    /*热门彩票总额与奖金池金额总数转换*/
    currencyTo(obj){


        if(obj.toString().length>5){


            let num = (obj/10000).toFixed(2)+'万';
            this.setState({
                Total_amount:num,
                Bonus_pools:num
            })

        }


    }

    render(){
        return(
            <div>
                <ul>
                    <li className="clearfix">
                        <div className="fl lt-name">
                            <i className={"lt-icon lt-icon-"+this.props.item.lottery_id}></i>
                            <span>{this.props.item.lottery_name}</span></div>
                        <div className="fl lt-info">
                            <dl>
                                <dd><span>游戏人数：<em>{this.props.item.bet_people}</em></span><span><em className="issue">
                             {this.props.item.openinfo.issue}期</em></span></dd>
                                <dd><span>中奖金额：<em>{this.state.Bonus_pools}</em></span><span>{this.props.item.kTime>0?"休市中..":"开奖："}
                                    {/*<CountdownTimer initialTimeRemaining={this.props.item.kTime>0?this.props.item.kTime:this.props.item.openinfo.count_down*1000} />*/}
                           </span></dd>
                            </dl>
                            <div className="bottom">
                                <div className="cvs">
                                    <Progress type="circle"
                                              percent={this.props.item.odds_win}
                                              width={48} format={() => this.props.item.odds_win.toFixed(2)}/>
                                </div>
                                <div className="rate">
                                    中奖率<br/>
                                    {parseFloat(this.props.item.odds_win).toFixed(2)}%
                                </div>
                                <Link to={this.props.changePath(this.props.item.lottery_id)} className="btn-go">一键下注</Link>
                            </div>
                        </div>
                    </li>

                </ul>


            </div>
        )
    }

}
