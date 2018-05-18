import React, { Component } from 'react'
import LotteryNum from './lotteryNum';

export default class HistoryItem extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let item ='';
        let query = {
            id:this.props.id,
            end_sale_time:this.props.item.end_sale_time,
            issue:this.props.item.issue,
            code:this.props.item.code
        };
        let data ={
            lottery_id:this.props.id,
            code:this.props.item.code
        }
        return (
            <div>
                {/*<Link to={{ pathname: '/open/winDetail', query: query}} >*/}
                    <div className="separate-item">
                        <div className="separate-item-title"><span>第{this.props.item.issue}期</span> <span>{this.props.item.end_sale_time}</span> </div>
                        <div className="prize-num">
                            {/*彩球样式*/}
                            <LotteryNum  data={data} />

                        </div>

                        {/*<i className="anticon anticon-right"></i>*/}
                    </div>
                {/*</Link>    */}
            </div>

            
        )
    }
}
