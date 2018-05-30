import React, { Component, PropTypes } from 'react'
import {Link} from 'react-router-dom';
import { Tabs } from 'antd-mobile';
import Navbar from '../common/navbar';
import Footer from '../common/footer';
import LotteryNum from '../open/lotteryNum'
// import CountdownTimer from '../open/countdown'
import Api from '../api';



export default class Hall extends Component {
    constructor(props) {
        super(props);

        this.state = {
          data0:null,
          data1:null,
          data2:null,
          data3:null,
          data4:null
        };

        this.changeHandler = this.changeHandler.bind(this);
    }

    componentWillMount() {
      this.changeHandler({index: 0});
    }

    changeHandler(tab) {
      Api('c=default&a=lobby&index=' + tab.index, null, (res) => {
        this.setState({['data' + tab.index] : res.data});
      });

      // 设置信用、官方 进入彩种后获取参数
      // tab 0 为信用  其余 官方
      localStorage.setItem('game_key', tab.index === 0 ? 'x' : 'g');
    }

    render() {
      const tabs = [
        { title: '信用彩', index: 0 },
        { title: '时时彩', index: 1 },
        { title: '11选5', index: 2 },
        { title: '低频彩', index: 3 },
        { title: '高频彩', index: 4 }
      ];

      let panel_0 = null;
      let panel_1 = null;
      let panel_2 = null;
      let panel_3 = null;
      let panel_4 = null;

      let data0 = this.state.data0;
      let data1 = this.state.data1;
      let data2 = this.state.data2;
      let data3 = this.state.data3;
      let data4 = this.state.data4;

      const renderData = (data) => {
        return data.map((item) => {
          let path = '';
          if([1, 4, 8,11,18,24].indexOf(item.lottery_id) !== -1) {
            path = 'ssc/' + item.lottery_id;
          } else if([2, 5, 6, 7,16].indexOf(item.lottery_id) !== -1) {
              path = '11x5/' + item.lottery_id;
          }else if([9].indexOf(item.lottery_id) !== -1) {
              path = 'fc3d/' + item.lottery_id;
          }else if([12,13,19,20,27,28,29,30].indexOf(item.lottery_id) !== -1) {
              path = 'k3/' + item.lottery_id;
          }else if([21,25].indexOf(item.lottery_id) !== -1) {
              path = 'lhc/' + item.lottery_id;
          } else if([14].indexOf(item.lottery_id) !== -1) {
              path = 'klpk/' + item.lottery_id;
          }else if([10].indexOf(item.lottery_id) !== -1) {
              path = 'p3p5/' + item.lottery_id;
          }else if([22].indexOf(item.lottery_id) !== -1) {
              path = 'ssq/' + item.lottery_id;
          }else if([23].indexOf(item.lottery_id) !== -1) {
              path = 'xy28/' + item.lottery_id;
          }else if([17].indexOf(item.lottery_id) !== -1) {
              path = 'pk10/' + item.lottery_id;
          }else if([26].indexOf(item.lottery_id) !== -1) {
              path = 'xyft/' + item.lottery_id;
          }else if([15].indexOf(item.lottery_id) !== -1){
              path = 'mmc/' + item.lottery_id;
          }



          else {
            path = 'hall';
          }

            let count_down=0;
            if(item.kTime>0){
                count_down =item.kTime;
            }else{
                count_down = item.count_down>0?item.count_down*1000:0
            }
          return (
              <div className='transition'>
            <Link key={item.lottery_id} to={path}>
              <div className="gameLeft fl">
                <i className={"lt-icon lt-icon-" + item.lottery_id}></i>
              </div>
              <div className="gameMid fl">
                <h3>{item.cname}</h3>
                  <div className="prize-num">
                      {/*彩球样式*/}
                      <LotteryNum data={{
                              lottery_id:item.lottery_id,
                              code:item.code,
                              kTime:item.kTime
                          }}  />
                  </div>
                  {item.lottery_id!=15?<p className="date">第
                      <span className="">{item.issue}</span>期    截至
                      {/*<CountdownTimer initialTimeRemaining={count_down} />*/}
                  </p>:<p className="date">无奖期</p>}
              </div>
              <div className="gameRight"><i className="anticon anticon-right"></i></div>
            </Link>
          </div>
          );
        });
      };


      if(data0 !== null) {
        panel_0 = renderData(data0);
      } else {
        panel_0 = <div>loading...</div>
      }

      if(data1 !== null) {
        panel_1 = renderData(data1);
      } else {
        panel_1 = <div>loading...</div>
      }

      if(data2 !== null) {
        panel_2 = renderData(data2);
      } else {
        panel_2 = <div>loading...</div>
      }
      if(data3 !== null) {
        panel_3 = renderData(data3);
      } else {
        panel_3 = <div>loading...</div>
      }

      if(data4 !== null) {
        panel_4 = renderData(data4);
      } else {
        panel_4 = <div>loading...</div>
      }

      return (
          <div>
              <div className='transition'>
              <Navbar title="购彩大厅" />
              <div className="hall">
                <Tabs tabs={tabs} onChange={this.changeHandler} className="tabs" distanceToChangeTab={.9}>
                  <div>{ panel_0 }</div>
                  <div>{ panel_1 }</div>
                  <div>{ panel_2 }</div>
                  <div>{ panel_3 }</div>
                  <div>{ panel_4 }</div>
                </Tabs>
              </div>
              </div>
              <Footer />
          </div>
      )
    }
}

class Codes extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount(){

    }

    // Code有4种
    // 第一种 “55555”  一个数字一个号
    // 第二种 “01 02 03 04 05” 空格分割
    // 第三种 “2s 5h 8d”
    getLotteryCode(){
        let code = this.props.data.code;
        if(/[shdc]/.test(code)){
            //第一种 poker
            return {
                codeArr:code.split(" "),
                type:"poker"
            }
        }else if([12,13,19,20,27,28,29,30].indexOf(parseInt(this.props.data.lottery_id)) !==-1){
            // 第二种 骰子
            return {
                codeArr:code.split(""),
                type:"sifter"
            }
        }else if(/[" "]/.test(code)){

            return {
                codeArr:code.split(" "),
                type:"normal"
            }


        }else{
            // 第四种 普通
            return {
                codeArr:code.split(""),
                type:"normal"
            }
        }
    }
    renderDate(){
        let codeObj = this.getLotteryCode();
        let render="";
        //休市判断
        if(this.props.data.kTime!==undefined&&this.props.data.kTime!==0){
            render = <span className="closed">
                休市中...
            </span>
        }else if(this.props.data.code==""){
            if(this.props.data.lottery_id=="15"){
                render="秒秒彩无号码"
            }else{
                render = <p className="winning">
                    正在开奖...
                </p>
            }
        }else{
            let arr = codeObj.codeArr;
            let itemArr = [];

            if (codeObj.type.indexOf("normal") !==-1){
                let _this = this;
                arr.map(function (item,index) {
                    itemArr.push(<li key={index} className={_this.trans(item)}>{item}</li>)
                });
                render = <ul className={codeObj.type}>
                    {itemArr}
                </ul>
            }else if(codeObj.type=="sifter"){//骰子
                arr.map(function (item,index) {
                    itemArr.push(<i key={index} className={"icon-sifter icon-sifter-"+item}></i>)
                });
                render = <div className="sifter">
                    {itemArr}
                </div>
            }else{//扑克
                arr.map(function (item,index) {
                    itemArr.push(<i key={index} className={"poker-icon poker-"+item}></i>)
                });
                render = <div className="poker">
                    {itemArr}
                </div>
            }

        }
        return render;
    }
    trans(num){
        let id= parseInt(this.props.data.lottery_id);

        if(id===21||id===25){//双色球
            let redBo =[1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46]
            let blueBo =[3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48 ]
            // let greenBo =[5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49]

            if(redBo.indexOf(parseInt(num)) !== -1){
                return("cell-red")
            }else if(blueBo.indexOf(parseInt(num)) !== -1){
                return("cell-blue")
            }else{
                return("cell-green")
            }
        }else if(id===22){
            return("cell-ssq")
        }else if(id===17){//pk10
            return "pk-"+num
        }
    }
    render() {
        return (
            <div>
                {this.renderDate()}
            </div>
        )
    }

}
