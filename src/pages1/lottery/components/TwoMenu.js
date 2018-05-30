import React, { Component } from "react"

//二级菜单
class TwoLevelMenu extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="sub-tab">
            <div className="xuanx">
            <div className="playmethods">
            {this.props.two_level_menu.map((menu, i) =>
            <div key={i} className="sub-row">
            <span>{menu.sub_title}</span>
        {menu.data.map((data, j) =>
        <a key={j} href="javascript:void(0)" onClick={this.props.TwoLevelClick.bind(this, menu.sub_title, data.title)} className={this.props.second_focus == menu.sub_title+ "_" +data.title ? "cur": ""}>{data.title}</a>
    )}
    </div>
    )}
    </div>
        </div>

        </div>
    )

    }
}

export default TwoLevelMenu