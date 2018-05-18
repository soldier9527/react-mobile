import React, { Component } from "react"

import {Icon} from "antd";

// 投足玩法菜单
class NavTabRight extends Component {
    constructor(props) {
        super(props);
    }
    closeTab(e){
        if(e.target.className==="tabOverlay"){
          this.props.closeTab()
        }
    }


    render() {


        let twoFocus = this.props.menu_foucsed[1];
        let listRender = [];

        if(this.props.game_key==="x"){
            this.props.two_level_menu.map((two_level_menu,index)=>{
                for(let i in two_level_menu){
                    if(two_level_menu[i].length>0){
                        two_level_menu[i].map((item, j) =>{
                                listRender.push(<li key={index+"_"+i+"_"+j}  onClick={()=>this.props.TwoLevelClick(item)} className={twoFocus ==  item.cname ? "cur": ""}>{item.cname}</li>)
                            }
                        )
                    }
                }
            })
        }else{
            let arr = ["其他","直选","组选","趣味","特殊","定位","不定位","任二","任三","任四","任选单式","任选复式"];
            var oneFocus = this.props.menu_foucsed[0];
            var two_level_menu = this.props.two_level_menu[oneFocus];
            var twoRender = [];
            for(let i in two_level_menu){

                if(two_level_menu[i].length>0){
                    twoRender.push(
                        <div key={i} className="sub-row">
                            <span>{arr[i]}</span>
                            {two_level_menu[i].map((item, j) =>
                                <a key={j} href="javascript:void(0)" onClick={()=>this.props.TwoLevelClick(item)} className={twoFocus ==  item.cname ? "cur": ""}>{item.cname}</a>
                            )}
                        </div>)
                }

            }


        }


        let isSafari = navigator.userAgent.indexOf("iPhone") > -1;
        return(
            <div className={this.props.showTab?"tab-over-lay-right show":"tab-over-lay-right"}  style={this.props.showTab&&this.props.game_key==="g"?{width:'9.5rem'}:this.props.showTab&&this.props.game_key==="x"?{right:'0.1rem'}:null}>
                <div className="ctrl-btn" style={{top:this.props.showTab?'0.015rem':null}} onClick={(e)=>{this.props.navBarClick(e)}}>
                    {this.props.showTab?<Icon type="caret-right"></Icon>:<i className="anticon anticon-caret-left"></i>}
                    玩法选择
                </div>

                {this.props.game_key==="x"?<div className="methods-wrap">
                    <ul>
                        {listRender}
                    </ul>
                    {/*遮罩层*/}
                    <div className="mask-layer" style={{display: this.props.showTab ? 'block' : 'none'}} onClick={()=> this.props.navBarClick()
                    }>

                    </div>
                </div>: <div className="tabOverlay" onClick={(e)=>this.closeTab(e)} style={isSafari?{top:'2.93rem',bottom:'-5rem'}:{top:'2.93rem',bottom:'-7.9rem'}}>
                    <div className="tabWrap">
                        <div className="lt_tab">
                            <ul>
                                {this.props.one_level_menu.map((menu, key) =>
                                    <li key={key} onClick={()=>this.props.OneLevelClick(key)}  className={oneFocus == key ? "cur": ""}>
                                        {menu}</li>)}
                            </ul>
                        </div>
                        <div className="sub-tab">
                            <div className="xuanx">
                                <div className="playmethods">
                                    {twoRender}
                                </div>
                            </div>
                        </div>
                        {/*遮罩层*/}
                        <div className="mask-layer" style={{display: this.props.showTab ? 'block' : 'none'}} onClick={() =>this.props.navBarClick()}>

                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}

export default NavTabRight