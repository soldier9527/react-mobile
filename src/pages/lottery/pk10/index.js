import React, { Component, PropTypes } from 'react';
import {LotteryCommon} from '../components/common';
import Game from '../components/game';
import  Icon from 'antd/lib/icon';
import './pks.scss';
class Pk10 extends Component {


  constructor(props) {
      super(props);
      this.state = {
      }
  }
  //计算注数，参数cart： 购物车数组
  calcItem(cart){
      //=============计算注数 start=============
      let md = this.props.md;
      if(!md) {
          return null;
      }


      const game = new Game(this.props);
      let zhushu = 0;
      let content=[];
      cart.map((item,i)=>{
          if(item){
              item.sort()//排序
          }
      });
      md.field_def.map((num,i)=>{
          let data="";
          if(cart[i]){
              data += cart[i].join("_")
          }
          content.push(data);
      });
      if(content.length === md.field_def.length) {
          zhushu = game.isLegalCode(content, md.name)['singleNum'];
      }
      return {
          content:content,
          zhushu:zhushu,
      };
      //=============计算注数end=============
  }

  //设置购物车
  setCart(i,num,arr,type){
      let cart = this.props.cart;
      let buttonType = this.props.buttonType;
      cart = JSON.parse(JSON.stringify(cart));

      if(num===""){//点击 全单双大小
          cart[i]=arr;
          buttonType = JSON.parse(JSON.stringify(buttonType));
          buttonType[i]=type;
      }else{//点击 单个球
          if([24,25].indexOf(this.props.md.method_id)!==-1){//单独判断点击球
              cart[i]=[num]
          }else{
              if(cart[i]&&cart.length>0&&this.props.md.method_id!=620&&this.props.md.method_id!=621&&this.props.md.method_id!=622&&this.props.md.method_id!=623&&this.props.md.method_id!=624){
                  if(cart[i].indexOf(num)===-1){
                      cart[i].push(num)
                  }else{
                      cart[i].splice(cart[i].indexOf(num),1)
                  }
              }else{
                  cart[i]=[num];
              }
          }

      }
      let item = this.calcItem(cart);
      let cartItem ={
          buttonType:buttonType,//记录按钮大小单双
          zhushu:item.zhushu,//注数
          content:item.content,//content
          cart:cart//购物车
      };
      this.props.setCartItem(cartItem);
  }

    //设置整合购物车
    setCartSpecil(i,num,arr,type,index){
        let md =this.props.md;
        let cart = this.props.cart;
        let liangmianZhushu={};
        let zhushu = 0;
        let contentArr = [];
        cart = JSON.parse(JSON.stringify(cart));
        let cartData=cart[index]?cart[index]:[];
        if(cartData[i]){
            if(cartData[i].indexOf(num)===-1){
                cartData[i].push(num)
            }else{
                cartData[i].splice(cartData[i].indexOf(num),1)
            }
        }else{
            cartData[i]=[num];
        }
        cart[index]=cartData;
        const game = new Game(this.props);
        for(let i=0;i<cart.length;i++){
            let content =[];
            let item = cart[i];
            if(item){
                for(let index=0,len=md.field_def[i].length;index<len;index++){
                    if(item[index]){
                        if(md.name[i]=="PKS-GYHZ"){
                            content.push(item[index].join("_"))
                        }else{
                            content.push(item[index].join(""))
                        }

                    }else{
                        content.push("")
                    }
                };
                let singleNum=game.isLegalCode(content, md.name[i])['singleNum'];
                zhushu += singleNum;
                liangmianZhushu[i]=singleNum
            }else{

            }
            contentArr.push(content);
        }
        let cartItem ={
            zhushu:zhushu,//注数
            liangmianZhushu:liangmianZhushu,
            content:contentArr,//contentArr
            cart:cart//购物车
        };
        this.props.setCartItem(cartItem);
    }

  render(){
    let md = this.props.md;
    let game = new Game(this.props);
    if(!md) {
        return null;
    }
    let methodId=this.props.menu_foucsed[1];
    let touzhu=[];
      if(md.type==="special"){//玩法 整合
          touzhu=<LtSpecial
              md={this.props.md}//当前玩法数据
              cart={this.props.cart}//当前购物车
              handlechooseNum={(i,num,arr,type,index)=>{this.setCartSpecil(i,num,arr,type,index)}}
              buttonType={this.props.buttonType}
              gamePrize={this.props.gamePrize}//拉杆赔率
              divisor={this.props.divisor}
          />
      }
    //   else if(md.name==="PKS-GYDXDS"){//
    //     touzhu=<UnderBall
    //         md={this.props.md}//当前玩法数据
    //         cart={this.props.cart}//当前购物车
    //         handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
    //         buttonType={this.props.buttonType}
    //         prize={this.props.md.prize}//赔率
    //         gamePrize={this.props.gamePrize}//拉杆赔率
    //
    //     />
    // }
    else if(["PKS-GYHZ"].indexOf(md.name)!==-1){
        touzhu=<Under5Ball
            md={this.props.md}//当前玩法数据
            cart={this.props.cart}//当前购物车
            handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
            buttonType={this.props.buttonType}
            prize={this.props.md.prize}//赔率
            gamePrize={this.props.gamePrize}//拉杆赔率
            divisor={this.props.divisor}

        />
    }else if(["PKS-Q5LM","PKS-H5LM","PKS-OT","PKS-TN","PKS-TE","PKS-FS","PKS-FSIX"].indexOf(md.name)!==-1){
        // methodId===620||methodId===621||methodId===622||methodId===623||methodId===624||methodId===709||methodId===827||methodId===828
        touzhu=
              <NumList
                  cur_method={this.props.cur_method}//当前玩法数据
                    handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                  cart={this.props.cart}//当前购物车
                  prize={this.props.prize}//赔率
                    gamePrize={game.toFixed(parseFloat(this.props.md.prize[1]*10000)*this.props.gamePrize/(this.props.divisor*10000),3)}//赔率
                  // gamePrize={this.props.gamePrize}
                   buttonType={this.props.buttonType}
                  divisor={this.props.divisor}
              />

    }else{  touzhu=
            <NumList
                cur_method={this.props.cur_method}//当前玩法数据
                  handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                cart={this.props.cart}//当前购物车
                prize={this.props.prize}//赔率
                  gamePrize={game.toFixed(parseFloat(this.props.md.prize[1]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000*10000),3)}//赔率
                // gamePrize={this.props.gamePrize}
                 buttonType={this.props.buttonType}
                divisor={this.props.divisor}
            />

    }
      return (
         <div className="pk10-wrapper">
            {touzhu}
                </div>
      )
  }
}

class NumList extends Component{
  constructor(props) {
      super(props);
      this.state={

      }
  }
    // 全大小奇偶清，渲染按钮
    renderTypeButton(index){
        let typeArr=["全","大","小","奇","偶","清"];
        let renderArr=[];
        let buttonType=this.props.buttonType;
        typeArr.map((item,i)=>{
            renderArr.push(<button key={i} onClick={()=>{this.handleFilter(index,i)}} className={buttonType&&buttonType[index]===i?"on":""}>{item}</button>)
        });
        return renderArr;
    }
    //点击筛选
    handleFilter(i,type){//选号
        let num;
        // "全","大","小","奇","偶","清"
        switch (type){
            case 0:
                num = ["01","02","03","04","05","06","07","08","09","10"];
                break;
            case 1:
                num = ["06","07","08","09","10"];
                break;
            case 2:
                num = ["01","02","03","04","05"];
                break;
            case 3:
                num = ["01","03","05","07","09"];
                break;
            case 4:
                num = ["02","04","06","08","10"];
                break;
            case 5:
                num = [];
                break;
        }
        this.props.handlechooseNum(i,"",num,type);
    }
  render(){
      let cur_method = this.props.cur_method;
      let cart = this.props.cart;
      let renderNumList=[];
      cur_method.map((item,i)=>{
          let codeArr = item.nums.split(" ");
          renderNumList.push(
              <div className="ch_chart" key={i}>
                  <div className="ch_num_w">
                      <Icon type="down-circle" style={{ fontSize:"15px",color: '#d22018' }}/>
                      &nbsp;&nbsp;&nbsp;{item.prompt}
                      <div className="ch_num_box">
                          {item.has_filter_btn==1?<p className="ch_num_btns">
                              {this.renderTypeButton(i)} {/*//渲染按钮*/}
                          </p>:null
                          }
                      </div>
                      <span>赔率：{this.props.gamePrize}</span>
                  </div>
                  <div className="ch_num_box">
                      <ul className="ch_num_show" style={{textAlign:"center"}} >
                          {codeArr.map((num,j)=>{
                              return(<li key={j}>
                                  <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                      {num}
                                  </button>
                              </li>)
                          })
                          }
                      </ul>
                  </div>
              </div>
          )
      });
      return(
          <div>
              {renderNumList}
          </div>
      )
  }

}
class UnderBall extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        let game = new Game(this.props);
        let field_def = this.props.md.field_def;
        let cart = this.props.cart;
        let renderNumList=[];
        let simple=this.props.md.num_level.simple.split(" ");
        let specific=this.props.md.num_level.specific;

        field_def.map((item,i)=>{
            let codeArr = item.nums.split(" ");
            renderNumList.push(
                <div className="ch_chart pk10-UnderBall" key={i} >
                    <div className="ch_num_w">
                        <Icon type="down-circle" style={{ fontSize:"15px",color: '#d22018' }}/>
                        &nbsp;&nbsp;&nbsp;{item.prompt}
                    </div>
                    <div className="ch_num_box" >
                        <ul className="ch_num_show" style={{textAlign:"center"}} >
                            {codeArr.map((num,j)=>{
                                let level = specific[simple[j]-1].level;
                                return(<li key={j}>
                                    <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                        {num.substr(0,2)}
                                        <br/>
                                        {num.substr(2)}
                                    </button>
                                    <label>{game.toFixed(parseFloat((this.props.gamePrize*10000*parseFloat(this.props.prize[level])/(this.props.divisor*10000))),3)}</label>
                                </li>)
                            })
                            }
                        </ul>
                    </div>
                </div>
            )
        });
        return(
            <div>
                {renderNumList}
            </div>
        )
    }
}
class Under5Ball extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        let game = new Game(this.props);
        let field_def = this.props.md.field_def;
        let cart = this.props.cart;
        let renderNumList=[];
        let simple=this.props.md.num_level.simple.split(" ");
        let specific=this.props.md.num_level.specific;

        field_def.map((item,i)=>{
            let codeArr = item.nums.split(" ");
            renderNumList.push(
                <div className="ch_chart pk10-UnderBall" key={i} >
                    <div className="ch_num_w">
                        <Icon type="down-circle" style={{ fontSize:"15px",color: '#d22018' }}/>
                        &nbsp;&nbsp;&nbsp;{item.prompt}
                    </div>
                    <div className="ch_num_box" >
                        <ul className="ch_num_show" style={{textAlign:"left"}}  >
                            {codeArr.map((num,j)=>{
                                let level = specific[simple[j]-1].level;
                                return(<li key={j}>
                                    <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                        {num.substr(0,2)}
                                        <br/>
                                        {num.substr(2)}
                                    </button>
                                    <label>{game.toFixed(parseFloat((this.props.gamePrize*10000*parseFloat(this.props.prize[level]))/(this.props.divisor*10000)),3)}</label>
                                </li>)
                            })
                            }
                        </ul>
                    </div>
                </div>
            )
        });
        return(
            <div>
                {renderNumList}
            </div>
        )
    }
}


//整合
class LtSpecial extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        let game = new Game(this.props);
        let field_defArr = this.props.md.field_def;
        let num_levelArr = this.props.md.num_level;
        let prizeArr = this.props.md.prize;
        let cart = this.props.cart;
        let renderNumList=[];
        field_defArr.map((field_def,f)=>{
            let prize=[];
            let numleval=[];
            if(num_levelArr[f]){
                numleval = num_levelArr[f].simple.split(" ");
                numleval.map((num,i)=>{
                    prize.push(game.toFixed(parseFloat(prizeArr[f][num])*10000*this.props.gamePrize/(this.props.divisor*10000),3));
                })
            }else{
                prize.push(game.toFixed(parseFloat(prizeArr[f][1])*10000*this.props.gamePrize/(this.props.divisor*10000),3));
            }
            field_def.map((item,i)=>{

                let codeArr = item.nums.split(" ");
                renderNumList.push(
                    <div className="ch_chart " key={f+"_"+i}>
                        <div className="ch_num_w">
                            <Icon type="down-circle" style={{ fontSize:"15px",color: '#d22018' }}/>
                            &nbsp;&nbsp;&nbsp;{item.prompt}
                            {num_levelArr[f]?"":<span>赔率：{prize[0]}</span>}
                        </div>
                        <div className="ch_num_box">
                            <ul className={codeArr.indexOf("龙")!==-1?"ch_num_show_pklm textcenter":"ch_num_show textcenter"}>
                                {codeArr.map((num,j)=>{
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num,"","",f)}} type="button" className={cart[f]&&cart[f][i]&&cart[f][i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                            {num}
                                        </button>
                                        {num_levelArr[f]?<label>{prize[j]}</label>:""}
                                    </li>)
                                })
                                }
                            </ul>
                        </div>
                    </div>
                )
            });
        });

        return(
            <div>
                {renderNumList}
            </div>
        )
    }
}
export default LotteryCommon(Pk10);
