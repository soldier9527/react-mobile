import React, {Component} from 'react'
// import {Select} from 'antd';
import LotteryNum from '../open/lotteryNum';

export default class TheLatestLottery extends Component {


  constructor(props) {

    super(props);
    this.state = {
      colorOf_img: '',  //彩种小图标
      colorOf_id: 0,
      showList: false,
      content: [],
      id: '',


      data: this.props.item,  //彩种下拉列表
      index:0,
      show: false,

    }
  }


//控制下拉组件的显示隐藏
  showList(e,close) {
    if(close===false){
      this.setState({
        show: false,
      });
    }else{
      this.setState({
        show: !this.state.show,
      });
      e.stopPropagation(e);
    }


  }


  handleChange(id) {
    this.setState({
      index: id
    })
  }

  render() {
    let item = this.state.data[this.state.index];
    let list = [];
    this.state.data.map((data, i) => {
      list.push(
        <li key={i} onClick={()=>this.handleChange(i)}>{data.lastIssueInfo.cname}</li>
      );
    });

    return (

      <div>

        <div className="box clearfix">
          <dl className="fl lt-select">
            <dt>
              <i className={"lt-icon lt-icon-" + item.lotteryId}></i>
              <span>
                           <div style={{position: 'relative'}} id="area">
                            <p className="default" onClick={(e) => {this.showList(e);}}>
                              {item.lastIssueInfo.cname}
                            </p>
                             {this.state.show?<div className="container-wrap">
                                <ul className="latestLottery">
                                  {list}
                                </ul>
                              </div>:null}
                              </div>
                           </span>
            </dt>

          </dl>
          <div className="open-wrap" style={{position: 'absolute',top: '0.3rem',right: '0.1rem'}}>
            <div className="nums prize-num">
              {/* 开奖结果公共组件 ,data，ID,表示传递的参数*/}
              <LotteryNum data={item.lastIssueInfo}
                          id={item.lotteryId}/>
            </div>

          </div>
          <br/><br/><br/>
          <div className="issue">
            第{item.lastIssueInfo.issue}期
            <span className="time">
                     &nbsp;&nbsp;
              {item.lastopenIssues.end_sale_time}
                        </span>
          </div>
          <div
            className="amount">总奖金：<span>{item.total_amount}</span>元
          </div>
        </div>
      </div>
    )
  }

}
