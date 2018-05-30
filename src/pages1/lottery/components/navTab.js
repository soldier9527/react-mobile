import React, { Component } from "react"

// 投足玩法菜单
class NavTab extends Component {
    constructor(props) {
        super(props);
    }
    closeTab(e){
        if(e.target.className==="tabOverlay"){
          this.props.closeTab()
        }
    }
    render() {
        let arr = ["其他","直选","组选","趣味","特殊","定位","不定位","任二","任三","任四","任选单式","任选复式"];
        let oneFocus = this.props.menu_foucsed[0];
        let twoFocus = this.props.menu_foucsed[1];
        let two_level_menu = this.props.two_level_menu[oneFocus];
        let twoRender = [];
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
        return(
            <div>
                <div className="tabOverlay" onClick={(e)=>this.closeTab(e)}>
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
                    </div>
                </div>
            </div>
        )
    }
}

export default NavTab