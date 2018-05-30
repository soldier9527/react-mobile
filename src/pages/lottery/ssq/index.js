import React, { Component } from "react"
import './ssq.scss';
import Game from '../components/game';
import {LotteryCommon} from '../components/common';
import Calc from "../components/calc";
import Modal from 'antd/lib/modal';
import  Icon from 'antd/lib/icon';

class LtSSQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    //清空单式玩法输入框
    handleClearAll(bool){
        if(this.refs.danshiRef){
            this.refs.danshiRef.handleClear(bool);
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
        let item = this.calcItem(cart);

        let cartItem ={
            buttonType:buttonType,//记录按钮大小单双
            zhushu:item.zhushu,//注数
            content:item.content,//content
            cart:cart//购物车
        };
        this.props.setCartItem(cartItem);
    }

    //设置单式购物车
    danshiSetCart(content){
        if(!content){
            let cartItem ={
                zhushu:0,//注数
            };
            this.props.setCartItem(cartItem);
            return;
        }

        let md = this.props.md;
        const game = new Game(this.props);
        let zhushu = 0;
        let contentArr=[];
        content.map((c,i)=>{
            zhushu += game.isLegalCode(c, md.name)['singleNum'];

            contentArr.push({
                name:md.cname,
                'method_id': md.method_id,
                content:c,
                zhushu:1
            })
        });

        let cartItem ={
            zhushu:zhushu,//注数
            content:contentArr,//content
            multiple:true//是否多注
        };
        this.props.setCartItem(cartItem);
    }

    render(){
        let md = this.props.md;
        let game = new Game(this.props);
        if(!md) {
            return null;
        }
        let touzhu=[];
        if(!md.type){
            touzhu.push(<NumList
                key={md.cname+this.props.game_key}
                cur_method={this.props.cur_method}//当前玩法数据
                cart={this.props.cart}//当前购物车
                handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                prize={game.toFixed(parseFloat(this.props.md.prize[1]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)}//赔率
                buttonType={this.props.buttonType}
                divisor={this.props.divisor}
            />)
        }else if(md.type==="danshi"){
            touzhu.push(<Unitary
                key={md.type}
                md={this.props.md}//当前玩法数据
                cart={this.props.cart}//当前购物车
                buttonType={this.props.buttonType}
                prize={game.toFixed(parseFloat(this.props.md.prize[1]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)}//赔率
                gamePrize={this.props.gamePrize}//拉杆赔率
                danshiSetCart={(content)=>{this.danshiSetCart(content)}}
                divisor={this.props.divisor}
                ref="danshiRef"
            />)
        }
        return (
            <div>
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
                        &nbsp;&nbsp;&nbsp;
                        {item.prompt}
                        <span>赔率：{this.props.prize}</span>
                    </div>
                    <div className="ch_num_box">
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
//双色球单式玩法
class Unitary extends Component{
    constructor(props){
        super(props);
        this.state={
            value:"",//双色球输入内容
            unitaryInfo:""
        };
    }

    //勿删
    handleClear(bool){
        let _this=this;
        if(bool){

            _this.setState({
                value:""
            });
        }else{
            Modal.confirm({
                title:'提示',
                content:'请问您是否要清空号码？',
                onOk(){
                    _this.setState({
                        value:""
                    });
                },
                onCancel(){},
            });
        }

    }
    onChange(v){
        let value = v?v.target.value:this.state.value;
        if(v){
            this.setState({
                value:value
            });
        }else{
            this.setState({
                value:value,
                unitaryInfo:""
            });
        }
        let valueArr =[];
        let content=[] ;
        let md=this.props.md;
        value = value.trim();
        let arr =value.split("\n");
        //去重
        arr.map((item,i)=>{
            if(item.trim()){
                valueArr.push(item.trim());
            }
        });

        valueArr=[...new Set(valueArr)];

        let count =0;
        let _this =this;
        let re = /^(([012]\d)|(3[0123]))(\s(([012]\d)|(3[0123]))){4}:((0[1-9])|(1[0-6]))$/;
        valueArr.map((item,i)=>{
            item = item.trim();
            let itemArr = item.split(":")[0].split(" ");

            let newSet = [...new Set(itemArr)];
            if(newSet.length ===itemArr.length){
                if (!re.test(item)) {
                    count++;
                    _this.setState({
                        unitaryInfo:"您输入的号码"+item+"有误，请重新检查输入"
                    });
                }else{
                    let newContent = item.replace(/\s/g,'_');
                    newContent = newContent.split(":");
                    content.push(newContent);

                }
            }else{
                count++;
                _this.setState({
                    unitaryInfo:"所选号码有重复，请重新检查输入"
                })
            }

        });

        if(count){
            this.props.danshiSetCart();
        }else{
            this.props.danshiSetCart(content);
        }
    }
    render(){
        return(
            <div>
                <div id="unitaryInfo" className="unitary-info">{this.state.unitaryInfo}</div>

                <div className="unitary">
                    <div className="cart">
                        <p>
                            <i className="up"></i>
                            号码篮
                            <i className="down"></i>
                        </p>
                        <textarea  value={this.state.value} type="text"  onChange={(v)=>{this.onChange(v)}}></textarea>
                    </div>
                    <h4 className="prize">赔率:{this.props.prize}</h4>
                    <div className="tips" dangerouslySetInnerHTML={{__html:Calc.getMethodInfo()[this.props.md.name]}}></div>

                </div>
            </div>
        )
    }



}
export default LotteryCommon(LtSSQ)