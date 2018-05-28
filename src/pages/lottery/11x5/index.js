import React, { Component } from "react"
import './11x5.scss';
import {LotteryCommon} from '../components/common';
import Game from '../components/game';
import Calc from "../components/calc";
import {Modal} from "antd/lib/index";
import {Icon,message} from 'antd';


class Lt11x5 extends Component {
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
        console.log(this.props.md.field_def[0].max_selected)
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
            if(["SDDDS","SDCZW"].indexOf(this.props.md.name)!==-1){//单独判断点击球
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
                        if(md.name[i]=="SYXW-EZHE"||"SYXW-SAZHSA"||"SYXW-SIZHSI"||"SYXW-WZHW"||"SYXW-LZHW"||"SYXW-QZHW"||"SYXW-BZHW"){

                            if(md.name[i]=="SYXW-SAZHSA"){
                                if(item[index].length>3){
                                    message.warn('当前最多只能选择3注',2,()=>{});
                                }
                            }else if(md.name[i]=="SYXW-QZHW"){
                                if(item[index].length>7){
                                    message.warn('当前最多只能选择7注',2,()=>{});
                                }
                            }else if(md.name[i]=="SYXW-SIZHSI"){
                                if(item[index].length>4){
                                    message.warn('当前最多只能选择4注',2,()=>{});
                                }
                            }else if(md.name[i]=="SYXW-BZHW"){
                                if(item[index].length>8){
                                    message.warn('当前最多只能选择8注',2,()=>{});
                                }
                            }else if(md.name[i]=="SYXW-WZHW"){
                                if(item[index].length>5){
                                    message.warn('当前最多只能选择5注',2,()=>{});
                                }
                            }else if(md.name[i]=="SYXW-EZHE"){
                                if(item[index].length>2){
                                    message.warn('当前最多只能选择2注',2,()=>{});
                                }
                            }else if(md.name[i]=="SYXW-LZHW"){
                                if(item[index].length>6){
                                    message.warn('当前最多只能选择6注',2,()=>{});
                                }
                            }

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
        //11选5“连码”两面盘判断
        if(md.name[index]=="SYXW-EZHE"){
            if(cart[index][0].length==3){
                cart[index][0].splice(2,1);
                contentArr[index][0]=contentArr[index][0].split("_");
                contentArr[index][0].splice(2,1);
                contentArr[index][0]=contentArr[index][0].join("_");
            }
        }else if(md.name[index]=="SYXW-SAZHSA"){
            if(cart[index][0].length==4){
                cart[index][0].splice(3,1);
                contentArr[index][0]=contentArr[index][0].split("_");
                contentArr[index][0].splice(3,1);
                contentArr[index][0]=contentArr[index][0].join("_");
            }
        }else if(md.name[index]=="SYXW-SIZHSI"){
            if(cart[index][0].length==5){
                cart[index][0].splice(4,1);
                contentArr[index][0]=contentArr[index][0].split("_");
                contentArr[index][0].splice(4,1);
                contentArr[index][0]=contentArr[index][0].join("_");
            }
        }else if(md.name[index]=="SYXW-WZHW"){
            if(cart[index][0].length==6){
                cart[index][0].splice(5,1);
                contentArr[index][0]=contentArr[index][0].split("_");
                contentArr[index][0].splice(5,1);
                contentArr[index][0]=contentArr[index][0].join("_");
            }
        }else if(md.name[index]=="SYXW-LZHW"){
            if(cart[index][0].length==7){
                cart[index][0].splice(6,1);
                contentArr[index][0]=contentArr[index][0].split("_");
                contentArr[index][0].splice(6,1);
                contentArr[index][0]=contentArr[index][0].join("_");
            }
        }else if(md.name[index]=="SYXW-QZHW"){
            if(cart[index][0].length==8){
                cart[index][0].splice(7,1);
                contentArr[index][0]=contentArr[index][0].split("_");
                contentArr[index][0].splice(7,1);
                contentArr[index][0]=contentArr[index][0].join("_");
            }
        }else if(md.name[index]=="SYXW-BZHW"){
            if(cart[index][0].length==9){
                cart[index][0].splice(8,1);
                contentArr[index][0]=contentArr[index][0].split("_");
                contentArr[index][0].splice(8,1);
                contentArr[index][0]=contentArr[index][0].join("_");
            }
        }

        let cartItem ={
            zhushu:zhushu,//注数
            liangmianZhushu:liangmianZhushu,
            content:contentArr,//contentArr
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
                ref="danshiRef"
                divisor={this.props.divisor}

            />
        }else if(md.name==="SDDDS"){//玩法id===526 定单双
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
            touzhu=<Lt11x5NumList
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
            <div className="lt11x5-wrapper">
                {touzhu}
            </div>
        )
    }
}
//选数字
class Lt11x5NumList extends Component{
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
                num = ["01","02","03","04","05","06","07","08","09","10","11"];
                break;
            case 1:
                num = ["06","07","08","09","10","11"];
                break;
            case 2:
                num = ["01","02","03","04","05"];
                break;
            case 3:
                num = ["01","03","05","07","09","11"];
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
                        {levels?"":<span>赔率：{game.toFixed((parseFloat(this.props.prize[1]*10000)*this.props.gamePrize)*10000/(this.props.divisor*10000)/10000,3)}</span>}
                    </div>
                    <div className="ch_num_box">
                        <ul className={item.max_selected==4?"ch_num_show center":"ch_num_show"}>
                            {codeArr.map((num,j)=>{
                                let level ;
                                if(levels){
                                    level  = specific[simple[j]-1].level;
                                }
                                return(<li key={j}>
                                    <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                        {num}
                                    </button>
                                    {levels?<label>{game.toFixed((this.props.gamePrize*10000*parseFloat(this.props.prize[level]))*10000/(this.props.divisor*10000)/10000,3)}</label>:""}
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
                        &nbsp;&nbsp;&nbsp;
                        {item.prompt}
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
        // console.log(cart)
        // console.log(this.props.md.field_def[0].max_selected)
        // console.log(field_defArr);

        // if(cart.length<this.props.md.field_def[0].max_selected){
        //     console.log('0000')
        // }
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
                let textcenter="";
                let liZhlh="";
                if(["总和","码一","码二","码三","码四","码五"].indexOf(item.prompt)!=-1){
                    textcenter="textcenter";
                }else if(["总和尾数","龙虎"].indexOf(item.prompt)!=-1){
                    // textcenter="textcenter_zhlh";
                    // liZhlh="li_zhlh";
                }else{
                    textcenter="";
                }
                renderNumList.push(
                    <div className="ch_chart " key={f+"_"+i}>
                        <div className="ch_num_w">
                            <Icon type="down-circle" style={{ fontSize:"15px",color: '#d22018' }}/>
                            &nbsp;&nbsp;&nbsp;{item.prompt}
                            {num_levelArr[f]?"":<span>赔率：{prize[0]}</span>}
                        </div>
                        <div className="ch_num_box">
                            <ul className={"ch_num_show "+textcenter}>
                                {codeArr.map((num,j)=>{
                                    return(<li key={j} className={liZhlh}>
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
//直选单式
class Unitary extends Component{
    constructor(props){
        super(props);

        this.state={
            value:"",
            unitaryInfo:""
        }
    }
    //勿删
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
        let valueArr = [];
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


        let md=this.props.md;
        let nums = this.props.md.field_def[0].nums.split(" ");
        let sdrx = false;//山东任选
        let sdzx = false;//山东组选
        switch (md.name){
            case "SDRX2":
                sdrx=2;
                break;
            case "SDRX3":
                sdrx=3;
                break;
            case "SDRX4":
                sdrx=4;
                break;
            case "SDRX5":
                sdrx=5;
                break;
            case "SDRX6":
                sdrx=6;
                break;
            case "SDRX7":
                sdrx=7;
                break;
            case "SDRX8":
                sdrx=8;
                break;
            case "SDQEZUX":
                sdzx=2;
                break;
            case "SDQSZUX":
                sdzx=3;
                break;


        }
        value = value.trim();
        value = value.replace(/\n/g,',');
        let arr = value.split(",");
        //去重
        arr.map((item,i)=>{
            if(item.trim()){
                valueArr.push(item.trim());
            }
        });

        valueArr=[...new Set(valueArr)];



        let count =0;
        let length =md.field_def.length;
        let _this =this;

        valueArr.map((item,i)=>{
            let itemArr = item.trim().split(" ");
            let newSet = [...new Set(itemArr)];
            //判断号码符不符合规范
            for(let a=0;a<newSet.length;a++){
                if(nums.indexOf(newSet[a])===-1){
                    count++;
                    a=newSet.length;
                    _this.setState({
                        unitaryInfo:"所选号码不符规定，请重新检查输入"
                    })
                }
            }
            if(count===0&&(itemArr.length === length||sdrx||sdzx)) {
                if(newSet.length ===itemArr.length){
                    if(sdrx||sdzx){
                        if(sdrx===itemArr.length||sdzx===itemArr.length){
                            content.push([itemArr.join("_")]);

                        }else{
                            count++;
                            _this.setState({
                                unitaryInfo:"所选号码不符规定，请重新检查输入"
                            })
                        }
                    }else{
                        content.push(itemArr);
                    }
                }else{
                    //重复判断
                    count++;
                    _this.setState({
                        unitaryInfo:"您输入的号码有重复，请重新检查输入"
                    })
                }

            } else{
                count++;
            }
        });

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
                {/*提示信息存这里*/}
                <div id="unitaryInfo" className="unitary-info">{this.state.unitaryInfo}</div>
                <div className="unitary">
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
                    <h4 className="prize">赔率:{game.toFixed((parseFloat(this.props.prize[1]*10000)*this.props.gamePrize)*10000/(this.props.divisor*10000)/10000,3)}</h4>

                    <div className="tips" dangerouslySetInnerHTML={{__html:Calc.getMethodInfo()[this.props.md.name]}}></div>
                </div>
            </div>
        )
    }



}

export default LotteryCommon(Lt11x5);