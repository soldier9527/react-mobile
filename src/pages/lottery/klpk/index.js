import React, { Component} from "react"
import '../../../css/klpk.scss';
import {LotteryCommon} from '../components/common';
import Game from '../components/game';
import  Icon from 'antd/lib/icon';
function replaceT(item){
    return item.replace(/T/g,"10");
}
 class Ltklpk extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

     //计算注数，参数cart： 购物车数组
     calcZhushu(cart){
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
                 if(cart[i]&&cart.length>0){
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

         let item=this.calcZhushu(cart);
         let cartItem ={
             buttonType:buttonType,//记录按钮大小单双
             zhushu:item.zhushu,//注数
             cart:cart,//购物车
             content:item.content//content
         };
         this.props.setCartItem(cartItem);
     }

    render(){
        let md=this.props.md;
        let game = new Game(this.props);
        let renderPage=[];
        if(!md){
            return null;
        }
        let prize=game.toFixed(parseFloat(this.props.md.prize[1]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3);
        let numsArr=md.field_def[0].nums.split(" ");
        let childArr=[];
        let cart=this.props.cart;
        numsArr.map((item,i)=>{
            childArr.push(<li key={i} onClick={()=>this.setCart(0,item)}>
                <div className="common">
                    <span className={"poker-style poker-style-"+(i+1)}></span>
                    {cart[0]&&cart[0].indexOf(item) !==-1?<span className="poker-style-select"></span>:null}
                    <i className="item">{replaceT(item)}</i>
                </div>
                <div className="pksz">
                    <i>{replaceT(item)}</i>
                    <br/>
                    <span className={"poker-style poker-style-"+(i+1)}></span>
                    {cart[0]&&cart[0].indexOf(item)!==-1?<span className="poker-style-select"></span>:null}
                </div>
            </li>)
        });
        renderPage = <div className={"poker-wrap"}>
                <ul className="playType">
                    <li>{md.cname}</li>
                    <li>赔率：{prize}</li>
                </ul>
                <div>
                    <ul className={"showPoker showPoker-"+md.name}>
                        {childArr}
                    </ul>
                </div>
            </div>

        return (
            <div className="playBody">
                {renderPage}
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
                        <span>赔率：1960</span>
                    </div>
                    <div className="ch_num_box">
                        {item.has_filter_btn==1?<div className="ch_num_btns">
                            <button onClick={()=>{this.props.handlechooseNum(i,"",codeArr)}}>全</button>
                            <button >大</button>
                            <button>小</button>
                            <button>奇</button>
                            <button>偶</button>
                            <button>清</button>
                        </div>:null
                        }

                        <ul className="ch_num_show">
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
export default LotteryCommon(Ltklpk);
