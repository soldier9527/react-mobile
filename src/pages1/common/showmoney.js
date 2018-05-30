import React, { Component, PropTypes } from 'react'
import Api from '../api';

export default class ShowMoney extends Component {
    constructor(props) {
        super(props);

        this.state={
            totalPrize :""
        }
    }
    getTotalPrize(){
        Api("c=default&a=totalPrize",null,(res)=>{
            let data =res.data.show_total_prize.toString().split(".")[0];
            this.setState({
                totalPrize : data
            })
        })
    }
    componentWillMount(){
        this.getTotalPrize();
    }
    render() {
        let arr = this.state.totalPrize.split("");
        let renderSum = [];
        arr.map(function (item,index) {
            renderSum.push(<span key={index} className="lt-sum">
                {item}
            </span>)
        });
        if(renderSum.length>8){
            renderSum.splice(-8, 0, <span key="亿" className="lt-unit">亿</span>);
        }
        if(renderSum.length>4) {
            renderSum.splice(-4, 0, <span key="万" className="lt-unit">万</span>);
        }


        return (
          <div className="open-award">
              <p>

                  {renderSum}
              </p>
              <div>当前已累计中奖金额</div>
          </div>
        )
    }
}
