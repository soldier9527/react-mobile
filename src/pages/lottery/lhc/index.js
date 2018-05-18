import React, { Component} from 'react'
import {LotteryCommon} from '../components/common';
import './lhc.scss';
import Game from '../components/game';
import {Icon,message} from 'antd'

class Ltlhc extends Component {
    constructor(props) {
        super(props);
    }
    calcItem(cart){
        //=============计算注数 start=============
        let md = this.props.md;

        if(!md) {
            return null;
        }
        let max_selected=md.field_def[0].max_selected;
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
                data += cart[i].sort(function (a,b){return a-b}).join("_");
            }
            content.push(data);
        });
        if(content.length === md.field_def.length) {
            zhushu = game.isLegalCode(content, md.name,max_selected)['singleNum'];
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
        if(cart[0].length>this.props.md.field_def[0].max_selected){
            message.config({
                top: 20,
                duration: 1
            });
            message.warning("最多只能选"+this.props.md.field_def[0].max_selected)
            return
        }
        let cartItem ={
            buttonType:buttonType,//记录按钮大小单双
            zhushu:item.zhushu,//注数
            content:item.content,//content
            cart:cart//购物车
        };
        this.props.setCartItem(cartItem);
    }


    render(){
        if(!this.props.md) {
            return null;
        }
        return (
            <div>
                <NumList
                    cur_method={this.props.cur_method}//当前玩法数据
                    handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                    cart={this.props.cart}//当前购物车
                    prize={this.props.prize}//赔率
                    gamePrize={this.props.gamePrize}
                    md={this.props.md}
                    game_key={this.props.game_key}
                    divisor={this.props.divisor}
                />
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
    prizeCount(cart,prize){
        if(cart[0]){
            let count=cart[0].length;
            if(count==1||count==0){
                return '0.000'
            }else if(count==12){
                return prize[count-2]
            }else {
                return prize[count-1]
            }
        }else{
            return '0.000'
        }
    }
    render(){
        let game = new Game(this.props);
        let red=[1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46];//红波
        let blue=[3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48 ];//蓝波
        let green =[5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49];//绿波
        let shengxiao=['鼠','牛','虎','兔', '龙','蛇','马','羊','猴', '鸡','狗','猪'];//生肖
        let sebo=['红','蓝','绿'];//色波
        let dxds=['大','小','单','双'];//大小单双
        let cur_method = this.props.cur_method;
        let cart = this.props.cart;
        let renderNumList=[];
        let prize = this.props.md.prize;
        let gamePrize=game.toFixed(parseFloat(this.props.md.prize[1]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3);
        for(var i=0;i<cur_method.length;i++){
            var max_selected =  cur_method[i].max_selected;
            var prompt = cur_method[i].prompt;
        }
        cur_method.map((item,i)=>{
            let codeArr = item.nums.split(" ");
            renderNumList.push(
                <div className="ch_chart" key={i}>
                    <div className="ch_num_w">
                        <Icon type="down-circle" style={{ fontSize:"15px",color: '#d22018' }}/>
                        &nbsp;&nbsp;&nbsp;{item.prompt}
                        {(['HXZ','JS-HXZ','HXBZ','JS-HXBZ'].indexOf(this.props.md.name)!==-1)?<span>赔率:{(parseFloat(this.prizeCount(this.props.cart,this.props.md.prize)*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000).toFixed(3)}</span>:(['LHC-HZLM','LHC-ZTMH','LHC-ZTLM','TMDXDS','TMSX','TMWS','TMSB'].indexOf(this.props.md.name) !== -1)?<span></span>:(this.props.md.num_level.simple==undefined?<span>赔率:{gamePrize}</span>:<span>赔率:一等奖 : {gamePrize} 二等奖 : {game.toFixed((this.props.gamePrize*parseFloat(prize[2])),3)}</span>)}

                    </div>
                    <div className="ch_num_box">

                        <ul className={max_selected>4?"ch_num_show":"ch_num_show text-align"}>
                            {codeArr.map((num,j)=>{
                                if(['LBZ','WBZ','QBZ','BBZ','JBZ','SBZ','SYBZ','SEBZ','SZE','JS-LBZ','JS-WBZ','JS-QBZ','JS-BBZ','JS-JBZ','JS-SBZ','JS-SYBZ','JS-SEBZ','JS-SZE'].indexOf(this.props.md.name)!==-1){
                                    if(red.indexOf(parseInt(num))!=-1){
                                        return(<li key={j}>
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off red ant-btn-primary"}>
                                                {num}
                                            </button>
                                        </li>)
                                    }else if(blue.indexOf(parseInt(num))!=-1){
                                        return(<li key={j}>
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-blue ant-btn-primary":"ant-btn off blue ant-btn-primary"}>
                                                {num}
                                            </button>
                                        </li>)
                                    }else if(green.indexOf(parseInt(num))!=-1){
                                        return(<li key={j}>
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-green ant-btn-primary":"ant-btn off green ant-btn-primary"}>
                                                {num}
                                            </button>
                                        </li>)
                                    }
                                }else if(["LHC-BB","JSLHC-BB"].indexOf(this.props.md.name)!==-1){
                                    if(['红大','红小','红单','红双'].indexOf(num)!==-1){
                                        return(<li key={j} className="TMBT">
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off red ant-btn-primary"}>
                                                {num}
                                            </button>
                                        </li>)
                                    }else if(['蓝大','蓝小','蓝单','蓝双'].indexOf(num)!==-1){
                                        return(<li key={j} className="TMBT">
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-blue ant-btn-primary":"ant-btn off blue ant-btn-primary"}>
                                                {num}
                                            </button>
                                        </li>)
                                    }else if(['绿大','绿小','绿单','绿双'].indexOf(num)!==-1){
                                        return(<li key={j} className="TMBT">
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-green ant-btn-primary":"ant-btn off green ant-btn-primary"}>
                                                {num}
                                            </button>
                                        </li>)
                                    }
                                }else if(red.indexOf(parseInt(num))!=-1&&max_selected==49&&this.props.md.num_level.simple!=undefined){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off red ant-btn-primary"}>
                                            {num}
                                        </button>
                                        <label>{gamePrize}</label>
                                    </li>)
                                }else if(red.indexOf(parseInt(num))!=-1&&max_selected==49&&this.props.md.num_level.simple==undefined){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off red ant-btn-primary"}>
                                            {num}
                                        </button>
                                    </li>)
                                } else if(blue.indexOf(parseInt(num))!=-1&&max_selected==49&&this.props.md.num_level.simple!=undefined){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-blue ant-btn-primary":"ant-btn off blue ant-btn-primary"}>
                                            {num}
                                        </button>
                                        <label>{gamePrize}</label>
                                    </li>)
                                } else if(blue.indexOf(parseInt(num))!=-1&&max_selected==49&&this.props.md.num_level.simple==undefined){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-blue ant-btn-primary":"ant-btn off blue ant-btn-primary"}>
                                            {num}
                                        </button>
                                    </li>)
                                } else if(green.indexOf(parseInt(num))!=-1&&max_selected==49&&this.props.md.num_level.simple!=undefined){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-green ant-btn-primary":"ant-btn off green ant-btn-primary"}>
                                            {num}
                                        </button>
                                        <label>{gamePrize}</label>
                                    </li>)
                                } else if(green.indexOf(parseInt(num))!=-1&&max_selected==49&&this.props.md.num_level.simple==undefined){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-green ant-btn-primary":"ant-btn off green ant-btn-primary"}>
                                            {num}
                                        </button>
                                    </li>)
                                } else if(shengxiao.indexOf(num)!=-1&&this.props.md.num_level.simple!=undefined&&prompt=="生肖"){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off  ant-btn-primary"}>
                                            {num}
                                        </button>
                                    </li>)
                                }
                                else if(shengxiao.indexOf(num)!=-1&&this.props.md.num_level.simple!=undefined){
                                    let simple=this.props.md.num_level.simple.split(" ");
                                    let specific=this.props.md.num_level.specific;
                                    let level = specific[simple[j]-1].level;
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off  ant-btn-primary"}>
                                            {num}
                                            </button>
                                        <label>{game.toFixed(this.props.gamePrize*10000*parseFloat(prize[level])*10000/(this.props.divisor*10000)/10000,3)}</label>
                                    </li>)
                                }else if(shengxiao.indexOf(num)!=-1&&this.props.md.num_level.simple==undefined){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off  ant-btn-primary"}>
                                            {num}
                                        </button>
                                    </li>)
                                } else if(sebo.indexOf(num)!=-1&&this.props.md.num_level.simple!=undefined){
                                    let simple=this.props.md.num_level.simple.split(" ");
                                    let specific=this.props.md.num_level.specific;
                                    let level = specific[simple[j]-1].level;
                                    if(num=='红'){
                                        return(<li key={j}>
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off red ant-btn-primary"}>
                                                {num}

                                                </button>
                                            <label>{game.toFixed(this.props.gamePrize*10000*parseFloat(prize[level])*10000/(this.props.divisor*10000)/10000,3)}</label>
                                        </li>)
                                    }else if(num=="蓝"){
                                        return(<li key={j}>
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-blue ant-btn-primary":"ant-btn off blue ant-btn-primary"}>
                                                {num}

                                                </button>
                                            <label>{game.toFixed(this.props.gamePrize*10000*parseFloat(prize[level])*10000/(this.props.divisor*10000)/10000,3)}</label>
                                        </li>)
                                    }else if(num=='绿'){
                                        return(<li key={j}>
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-green ant-btn-primary":"ant-btn off green ant-btn-primary"}>
                                                {num}

                                                </button>
                                            <label>{game.toFixed(this.props.gamePrize*10000*parseFloat(prize[level])*10000/(this.props.divisor*10000)/10000,3)}</label>

                                        </li>)
                                    }
                                }else if(sebo.indexOf(num)!=-1&&this.props.md.num_level.simple==undefined){
                                    if(num=='红'){
                                        return(<li key={j}>
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off red ant-btn-primary"}>
                                                {num}
                                            </button>
                                        </li>)
                                    }else if(num=="蓝"){
                                        return(<li key={j}>
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-blue ant-btn-primary":"ant-btn off blue ant-btn-primary"}>
                                                {num}
                                            </button>
                                        </li>)
                                    }else if(num=='绿'){
                                        return(<li key={j}>
                                            <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ba-green ant-btn-primary":"ant-btn off green ant-btn-primary"}>
                                                {num}
                                            </button>
                                        </li>)
                                    }
                                } else if(dxds.indexOf(num)!=-1&&this.props.md.num_level.simple!=undefined){
                                    let simple=this.props.md.num_level.simple.split(" ");
                                    let specific=this.props.md.num_level.specific;
                                    let level = specific[simple[j]-1].level;
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off  ant-btn-primary"}>
                                            {specific[j].code}
                                            </button>
                                        <label>{game.toFixed(this.props.gamePrize*10000*parseFloat(prize[specific[j].level])*10000/(this.props.divisor*10000)/10000,3)}</label>
                                    </li>)
                                }else if(dxds.indexOf(num)!=-1&&this.props.md.num_level.simple==undefined){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off  ant-btn-primary"}>
                                            {num}
                                        </button>
                                    </li>)
                                } else if(max_selected==10&&this.props.md.num_level.simple!=undefined){
                                    let simple=this.props.md.num_level.simple.split(" ");
                                    let specific=this.props.md.num_level.specific;
                                    let level = specific[simple[j]-1].level;
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off  ant-btn-primary"}>
                                            {num}

                                            </button>
                                        <label>{game.toFixed(this.props.gamePrize*10000*parseFloat(prize[level])*10000/(this.props.divisor*10000)/10000,3)}</label>

                                    </li>)
                                }else if(max_selected==10&&this.props.md.num_level.simple==undefined){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off  ant-btn-primary"}>
                                            {num}
                                        </button>
                                    </li>)
                                }else if(["TMBT","JS-TMBT"].indexOf(this.props.md.name)!==-1){
                                    return(<li key={j} className="TMBT">
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?" on":" off "}>
                                            {num}
                                        </button>
                                    </li>)
                                }else if(["TQS","JS-TQS"].indexOf(this.props.md.name)!==-1){
                                    return(<li key={j} className="TMBT">
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?" on":" off "}>
                                            {num}
                                        </button>
                                    </li>)
                                }
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

export default LotteryCommon(Ltlhc);