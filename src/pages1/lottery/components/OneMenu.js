import React, { Component } from "react"

// 一级菜单
class OneLevelMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="lt_tab">
            <ul>
            {this.props.one_level_menu.map((menu, key) =>
            <li key={key} onClick={this.props.OneLevelClick.bind(this, menu)}  className={this.props.focused == menu ? "cur": ""}>
        {menu}</li>)}
    </ul>
        </div>
    )
    }
}

export default OneLevelMenu