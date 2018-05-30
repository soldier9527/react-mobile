import React, { Component } from "react"
import './ssc.scss';
import {LotteryCommon} from '../components/common';
import  Icon from 'antd/lib/icon';

import Game from '../components/game';

import Calc from "../components/calc";
import  Checkbox from 'antd/lib/checkbox';
const CheckboxGroup = Checkbox.Group;


class LtSSC extends Component {
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
        if(md.name === 'WXDW' || md.name === 'SSC-LMDXDS') {
            md.field_def.map((num,i)=>{
                let data="";
                if(cart[i]){
                    data =cart[i].join('')
                }
                content.push(data);
            });
        } else if(md.cname.indexOf("和值") !== -1) {
            md.field_def.map((num,i)=>{
                let data="";
                if(cart[i]){
                    data += cart[i].join("_")
                }
                content.push(data);
            });
        } else {
            md.field_def.map((num,i)=>{
                let data="";
                if(cart[i]){
                    data += cart[i].join("")
                }
                content.push(data);
            });
        }

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
                        if(md.name[i]=="SSCLH"||md.name[i]=="SSCDYQ-DXDS"||md.name[i]=="SSCDEQ-DXDS"||md.name[i]=="SSCDSAQ-DXDS"||md.name[i]=="SSCDSIQ-DXDS"||md.name[i]=="SSCDWQ-DXDS"||md.name[i]=="SSCQS"||md.name[i]=="SSCZS"||md.name[i]=="SSCHS"||md.name[i]=="SSCDN"||md.name[i]=="SSCSH"){
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
        if(!md) {
            return null;
        }
        let methodId=this.props.menu_foucsed[1];//玩法id
        let touzhu=[];
        if(md.type==="special"){//玩法 整合
            touzhu=<LtSpecial
                md={this.props.md}//当前玩法数据
                cart={this.props.cart}//当前购物车
                handlechooseNum={(i,num,arr,type,index)=>{this.setCartSpecil(i,num,arr,type,index)}}
                buttonType={this.props.buttonType}
                prize={this.props.md.prize}//赔率
                gamePrize={this.props.gamePrize}//拉杆赔率
                divisor={this.props.divisor}
            />
        }else if(md.type==="danshi"){
            touzhu=<Unitary
                key={md.cname+this.props.game_key}
                md={this.props.md}//当前玩法数据
                cart={this.props.cart}//当前购物车
                buttonType={this.props.buttonType}
                prize={this.props.md.prize}//赔率
                gamePrize={this.props.gamePrize}//拉杆赔率
                danshiSetCart={(content)=>{this.danshiSetCart(content)}}
                divisor={this.props.divisor}
                ref="danshiRef"
            />
        }else if(methodId===24){//玩法id===24 定单双
            touzhu=<Lt11x5DingDanshuang
                md={this.props.md}//当前玩法数据
                cart={this.props.cart}//当前购物车
                handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                buttonType={this.props.buttonType}
                prize={this.props.md.prize}//赔率
                gamePrize={this.props.gamePrize}//拉杆赔率
                divisor={this.props.divisor}

            />
        }else{
            touzhu=<LtSSCNumList
                md={this.props.md}//当前玩法数据
                handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                cart={this.props.cart}//当前购物车
                buttonType={this.props.buttonType}
                prize={this.props.md.prize}//赔率
                gamePrize={this.props.gamePrize}//拉杆赔率
                divisor={this.props.divisor}
            />
        }
        return (
            <div className="ltssc-wrapper">
                {touzhu}
            </div>
        )
    }
}
//选数字
class LtSSCNumList extends Component{
    constructor(props) {
        super(props);
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
                num = ["0","1","2","3","4","5","6","7","8","9"];
                break;
            case 1:
                num = ["5","6","7","8","9"];
                break;
            case 2:
                num = ["0","1","2","3","4"];
                break;
            case 3:
                num = ["1","3","5","7","9"];
                break;
            case 4:
                num = ["0","2","4","6","8"];
                break;
            case 5:
                num = [];
                break;
        }
        this.props.handlechooseNum(i,"",num,type);
    }

    render(){
        let game = new Game(this.props);
        let field_def = this.props.md.field_def;
        let cart = this.props.cart;
        let renderNumList=[];
        let levels=this.props.md.levels>1;
        let simple;
        let specific;
        if(levels){
            simple=this.props.md.num_level.simple.split(" ");
            specific=this.props.md.num_level.specific;
        }
        let centerClassName="";
        if (["SSC-LMDXDS"].indexOf(this.props.md.name) === -1) {
            centerClassName = ""
        } else {
            centerClassName = "textcenter"
        }
        field_def.map((item,i)=>{
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
                        {levels?"":<span>赔率：{game.toFixed(parseFloat(this.props.prize[1]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)}</span>}
                    </div>
                    <div className="ch_num_box">
                        <ul className={"ch_num_show "+centerClassName}>
                            {codeArr.map((num,j)=>{
                                let level ;
                                if(levels){
                                    level  = specific[simple[j]-1].level;
                                }
                                return(<li key={j}>
                                    <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                        {num}
                                    </button>
                                    {levels?<label>{game.toFixed(this.props.gamePrize*10000*parseFloat(this.props.prize[level])*10000/(this.props.divisor*10000)/10000,3)}</label>:""}

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
//定单双
class Lt11x5DingDanshuang extends Component{
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
                <div className="ch_chart lt11x5-dingdanshuang" key={i}>
                    <div className="ch_num_w">
                        <Icon type="down-circle" style={{ fontSize:"15px",color: '#d22018' }}/>
                        &nbsp;&nbsp;&nbsp;{item.prompt}
                    </div>
                    <div className="ch_num_box">
                        <ul className="ch_num_show">
                            {codeArr.map((num,j)=>{
                                let level = specific[simple[j]-1].level;
                                return(<li key={j}>
                                    <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                        {num.substr(0,2)}
                                        <br/>
                                        {num.substr(2)}
                                    </button>
                                    <label>{game.toFixed((this.props.gamePrize*10000*parseFloat(this.props.prize[level]))*10000/(this.props.divisor*10000)/10000,3)}</label>

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
//直选单式
class Unitary extends Component{
    constructor(props){
        super(props);

        this.state={
            value:"",
            checkboxValue:[],
            checkboxShow:false,
            optionsArr : [{ label: '万位', value: 0 },
                { label: '千位', value: 1 },
                { label: '百位', value: 2 },
                { label: '十位', value: 3 },
                { label: '个位', value: 4 }
            ],
            unitaryInfo:""

        }
    }
    componentWillMount(){
        let md = this.props.md;
        let defaultValue =[];
        const optionsArr = this.state.optionsArr;
        let length=0;
        let checkboxShow=false;
        switch (md.name){
            case "REZX":
                length=2;
                checkboxShow=true;
                break;
            case "RSZX":
                length=3;
                checkboxShow=true;
                break;
            case "RSIZX":
                length=4;
                checkboxShow=true;
                break;
        }
        for(let i = 0;i<length;i++){

            defaultValue.push(optionsArr.length-1-i);
        }
        this.setState({
            checkboxValue:defaultValue.sort(),
            checkboxShow:checkboxShow
        })

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
    onChange(v) {
        let value = v?v.target.value:this.state.value;
        let valueArr=[] ;
        let content=[] ;
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
        let nums = this.props.md.field_def[0].nums.split(" ");
        let md=this.props.md;
        let length;
        let isArbitrary;//任选
        let checkboxValue=this.state.checkboxValue;
        switch (md.name){
    //  任选
            case "REZX":
                length=2;
                isArbitrary=true;
                break;
            case "RSZX":
                length=3;
                isArbitrary=true;
                break;
            case "RSIZX":
                length=4;
                isArbitrary=true;
                break;
            default:
                length=0;
                break;
        }

        value = value.trim();
        value = value.replace(/\s/g,',');
        let arr = value.split(",");
        //去重
        arr.map((item,i)=>{
            if(item.trim()){
                valueArr.push(item.trim());
            }
        });
        valueArr=[...new Set(valueArr)];
        let _this =this;
        let count =0;
        if(isArbitrary){//任选
            let checkboxLength = checkboxValue.length;
            let positionArr =[0,1,2,3,4];
            //为空的位置
            let nullPosition = positionArr.filter(function(v){ return checkboxValue.indexOf(v) === -1 }).concat(checkboxValue.filter(function(v){ return positionArr.indexOf(v) === -1 }));
            valueArr.map((item,i)=>{
                if((item.length === length)&&(item.length <= checkboxLength)){
                    let itemArr = item.split("");
                    switch (length){
                        //  任选
                        case 2:
                            for(let a=0;a<checkboxLength;a++){

                                for(let b=a+1;b<checkboxLength;b++){
                                    let defaultArr = ["-","-","-","-","-"];
                                    defaultArr[a]=itemArr[0];
                                    defaultArr[b]=itemArr[1];
                                    nullPosition.map((pos,p)=>{
                                        defaultArr.splice(pos, 0, "-");
                                    });
                                    defaultArr.length=5;
                                    content.push(defaultArr);
                                }
                            }
                            break;
                        case 3:
                            for(let a=0;a<checkboxLength;a++){
                                for(let b=a+1;b<checkboxLength;b++){
                                    for(let c=b+1;c<checkboxLength;c++){
                                        let defaultArr = ["-","-","-","-","-"];
                                        defaultArr[a]=itemArr[0];
                                        defaultArr[b]=itemArr[1];
                                        defaultArr[c]=itemArr[2];
                                        nullPosition.map((pos,p)=>{
                                            defaultArr.splice(pos, 0, "-");
                                        });
                                        defaultArr.length=5;
                                        content.push(defaultArr);
                                    }
                                }
                            }
                            break;
                        case 4:
                            for(let a=0;a<checkboxLength;a++){
                                for(let b=a+1;b<checkboxLength;b++){
                                    for(let c=b+1;c<checkboxLength;c++){
                                        for(let d=c+1;d<checkboxLength;d++){
                                            let defaultArr = ["-","-","-","-","-"];
                                            defaultArr[a]=itemArr[0];
                                            defaultArr[b]=itemArr[1];
                                            defaultArr[c]=itemArr[2];
                                            defaultArr[d]=itemArr[3];
                                            nullPosition.map((pos,p)=>{
                                                defaultArr.splice(pos, 0, "-");
                                            });
                                            defaultArr.length=5;
                                            content.push(defaultArr);
                                        }
                                    }
                                }
                            }
                            break;
                    }
                }else{
                    count++;
                }
            });

        }else{
            let length =md.field_def.length;
            valueArr.map((item,i)=>{
                if(item.length === length) {
                    for(let a =0;a<length;a++){
                        if(nums.indexOf(item[a])===-1){
                            count++;
                            a=length;
                            _this.setState({
                                unitaryInfo:"所选号码不符规定，请重新检查输入"
                            })
                        }
                    }

                    content.push(item.split(""));
                }else{
                    count++;
                    _this.setState({
                        unitaryInfo:"所选号码不符规定，请重新检查输入"
                    })
                }
            });
        }
        if(count){
            this.props.danshiSetCart();
        }else{
            this.props.danshiSetCart(content);
        }

    }
    handleChange(checkedValues) {
        this.setState({
            checkboxValue:checkedValues
        },()=>{
            this.onChange()
        })

    }
    render(){
        if(!this.props.md){
            return
        }

        let game = new Game(this.props);
        return(
            <div>
                <div className="unitary">
                    {/*提示信息存这里*/}
                    <div id="unitaryInfo" className="unitary-info">{this.state.unitaryInfo}</div>
                    {this.state.checkboxShow?<div className="check-box-wrap">
                        <CheckboxGroup options={this.state.optionsArr} value={this.state.checkboxValue} onChange={(v)=>this.handleChange(v)} />

                    </div>:null}

                    <div className="cart">
                        <p>
                            <i className="up"></i>
                            号码篮
                            <i className="down"></i>
                        </p>
                        <textarea  value={this.state.value} type="text"  onChange={(v)=>{this.onChange(v)}}></textarea>
                    </div>
                    <h4 className="prize">赔率:{game.toFixed(parseFloat(this.props.prize[1]*10000)*this.props.gamePrize*10000/(this.props.divisor*10000)/10000,3)}</h4>
                    <div className="tips" dangerouslySetInnerHTML={{__html:Calc.getMethodInfo()[this.props.md.name]}}></div>
                </div>
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
        let md=this.props.md;
        let specialSize="0.5rem";
        if(md.cname=="前中后"||md.cname=="斗牛"||md.cname=="梭哈"){
            specialSize="0.25rem"
        }
        let renderNumList=[];
        field_defArr.map((field_def,f)=>{
            let prize=[];
            let numleval=[];
            if(num_levelArr[f]){
                numleval = num_levelArr[f].simple.split(" ");
                numleval.map((num,i)=>{
                    prize.push(game.toFixed((parseFloat(prizeArr[f][num]*10000)*this.props.gamePrize)*10000/(this.props.divisor*10000)/10000,3));
                })
            }else{
                prize.push(game.toFixed((parseFloat(prizeArr[f][1]*10000)*this.props.gamePrize)*10000/(this.props.divisor*10000)/10000,3));

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
                            <ul className={"ch_num_show textcenter"}>
                                {codeArr.map((num,j)=>{
                                    return(<li key={j}>
                                        <button onClick={()=>{this.props.handlechooseNum(i,num,"","",f)}} type="button" className={cart[f]&&cart[f][i]&&cart[f][i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"} style={{fontSize:specialSize}}>
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
export default LotteryCommon(LtSSC);