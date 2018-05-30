import React, { Component} from 'react'
import {Link } from 'react-router-dom';
import Navbar from '../common/navbar';

export default class Setting extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let user=sessionStorage.getItem("user");
        return (
          <div>
             <Navbar title="设置" back={user?"user_login":"user"}/>
             <div className="setting">
                <ul>
                    <li><Link to="feedback"><i className="setting_icon_pen fl"></i><span>意见反馈</span><i className="arrow-right fr"></i></Link></li>
                    <li><Link to="help"><i className="setting_iocn fl"></i><span>使用帮助</span><i className="arrow-right fr"></i></Link></li>
                    <li><Link to="ours"><i className="setting_kefu_icon fl"></i><span>关于我们</span><i className="arrow-right fr"></i></Link></li>
                    <li><Link to="getService"><i className="icon_service fl"></i><span>联系客服</span><i className="arrow-right fr"></i></Link></li>
                </ul>
             </div>
          </div>
        )
    }
}
