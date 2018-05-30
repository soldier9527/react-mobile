import React, { Component} from 'react'
import {LotteryCommon} from '../components/common';
import './lhc.scss';
import Game from '../components/game';
import  Icon from 'antd/lib/icon';
import  message from 'antd/lib/message';

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
        if(cart[0]&&cart[0].length>this.props.md.field_def[0].max_selected){
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
        let simple = this.props.md.num_level?this.props.md.num_level.simple.split(" "):null;
        cur_method.map((item,i)=>{
            let codeArr = item.nums.split(" ");
            // 1等奖和2等奖比较大小
            let p1VSp2 = null;
            if(["SZE","LMEZT","JS-LMEZT"].indexOf(this.props.md.name)!==-1){
                let p1 = parseFloat(prize[1])>parseFloat(prize[2])?prize[1]:prize[2];
                let p2 = parseFloat(prize[1])>parseFloat(prize[2])?prize[2]:prize[1];
                p1VSp2 = <span>一等奖：{game.toFixed(parseFloat(p1*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)} 二等奖：{game.toFixed(parseFloat(p2*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)}</span>
            }
            renderNumList.push(
                <div className="ch_chart" key={i}>
                    <div className="ch_num_w">
                        <Icon type="down-circle" style={{ fontSize:"15px",color: '#d22018' }}/>
                        &nbsp;&nbsp;&nbsp;{item.prompt}
                        {!simple?<span>赔率:{gamePrize}</span>:null}
                        {(['HXZ','JS-HXZ','HXBZ','JS-HXBZ'].indexOf(this.props.md.name)!==-1)?<span>赔率：{(parseFloat(this.prizeCount(this.props.cart,this.props.md.prize)*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000).toFixed(3)}</span>:null}
                        {p1VSp2}
                    </div>
                    <div className="ch_num_box">
                        <ul className={max_selected>4?"ch_num_show":"ch_num_show text-align"}>
                            {codeArr.map((num,j)=>{
                                // 普通 大小单双 鼠牛虎兔
                                if(["JS-TX","JS-ZX","JS-LXEX","JS-LXSX","JS-LXSIX","JS-LXWX","JS-PTX",'LHC-HZLM',"LHC-ZTMH","LHC-ZTLM","THDXDS","TDXDS","TX","PTX","ZX","TMSX","TMDXDS","ZTYX","ELX","SLX","SILX","LXEX","LXSX","LXSIX","LXWX","LWEW","LWSW","LWSIW","JS-THDXDS","JS-TDXDS"].indexOf(this.props.md.name)!==-1){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                            {num}
                                        </button>
                                        {simple?<label>{game.toFixed(parseFloat(prize[simple[j]]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)}</label>:null}
                                    </li>)
                                    // 普通 1-49号码球
                                }else if(["JS-LMSQZ","JS-LMEQZ","JS-LMTC","JS-LMEZT",'LBZ','WBZ','QBZ','BBZ','JBZ','SBZ','SYBZ','SEBZ','SZE','JS-LBZ','JS-WBZ','JS-QBZ','JS-BBZ','JS-JBZ','JS-SBZ','JS-SYBZ','JS-SEBZ','JS-SZE',"TMA","ZM","ZM1","ZM2","ZM3","ZM4","ZM5","ZM6","LMSQZ","LMEQZ","LMEZT","LMTC","TMZX","EZE","SZS","SZE","ZTYM","JS-TMA","JS-ZM","JS-ZM1","JS-ZM2","JS-ZM3","JS-ZM4","JS-ZM5","JS-ZM6"].indexOf(this.props.md.name)!==-1){
                                    let color = "red";
                                    if(red.indexOf(parseInt(num))!=-1){
                                        color = "red"
                                    }else if(blue.indexOf(parseInt(num))!=-1){
                                        color = "blue"
                                    }else if(green.indexOf(parseInt(num))!=-1){
                                        color = "green"
                                    }
                                    //三中二部显示prize
                                    let needPrize = ["SZE","LMEZT","JS-LMEZT"].indexOf(this.props.md.name) ===-1
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ant-btn-primary ba-"+color:"ant-btn off ant-btn-primary "+color}>
                                            {num}
                                        </button>
                                        {simple&&needPrize?<label>{game.toFixed(parseFloat(prize[simple[j]]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)}</label>:null}
                                    </li>)
                                    //  红绿蓝
                                }else if(["SB","ZMSB1","ZMSB2","ZMSB3","ZMSB4","ZMSB5","ZMSB6","TMSB","JS-SB","JS-ZMSB1","JS-ZMSB2","JS-ZMSB3","JS-ZMSB4","JS-ZMSB5","JS-ZMSB6"].indexOf(this.props.md.name)!==-1){
                                    let color = "red";
                                    if(["红","红大","红小","红单","红双"].indexOf(num)!=-1){
                                        color = "red"
                                    }else if(["蓝","蓝大","蓝小","蓝单","蓝双"].indexOf(num)!=-1){
                                        color = "blue"
                                    }else if(["绿","绿大","绿小","绿单","绿双"].indexOf(num)!=-1){
                                        color = "green"
                                    }
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn ant-btn-primary ba-"+color:"ant-btn off ant-btn-primary "+color}>
                                            {num}
                                        </button>
                                        {simple?<label>{game.toFixed(parseFloat(prize[simple[j]]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)}</label>:null}
                                    </li>)
                                    //  椭圆球
                                }else if(["LHC-BB","JSLHC-BB"].indexOf(this.props.md.name)!==-1){
                                    let color = "red";
                                    if(["红","红大","红小","红单","红双"].indexOf(num)!=-1){
                                        color = "red"
                                    }else if(["蓝","蓝大","蓝小","蓝单","蓝双"].indexOf(num)!=-1){
                                        color = "blue"
                                    }else if(["绿","绿大","绿小","绿单","绿双"].indexOf(num)!=-1){
                                        color = "green"
                                    }
                                    return(<li key={j} className="TMBT">
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?" on ba-"+color:" off "+color}>
                                            {num}
                                        </button>
                                        {simple?<label>{game.toFixed(parseFloat(prize[simple[j]]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)}</label>:null}
                                    </li>)
                                }else if(["TQS","JS-TQS","TMBT"].indexOf(this.props.md.name)!==-1){
                                    return(<li key={j} className="TMBT">
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?" on":" off "}>
                                            {num}
                                        </button>
                                        {simple?<label>{game.toFixed(parseFloat(prize[simple[j]]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)}</label>:null}
                                    </li>)
                                    // 合肖中
                                }else if(['HXZ','JS-HXZ','HXBZ','JS-HXBZ'].indexOf(this.props.md.name)!==-1){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                            {num}
                                        </button>
                                    </li>)
                                    // 普通 1-9球 没有颜色
                                }else if(["TMWS","ZTWS","JS-LWEW","JS-LWSW","JS-LWSIW"].indexOf(this.props.md.name)!==-1){
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button"  className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off  ant-btn-primary"}>
                                            {num}
                                        </button>
                                        {simple?<label>{game.toFixed(parseFloat(prize[simple[j]]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)}</label>:null}
                                    </li>)
                                }else if(true){
                                    console.log("没有匹配")
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