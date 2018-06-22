import React, { Component} from 'react'
import {Link} from 'react-router-dom'
import "./header.scss"
export default class Header extends Component {
    render(){
        return (<div className="header">
            <div className="topbar">
                <div className="w1200">
                    欢迎来到xx
                    <div className="login-box">
                        <Link to="/login" className="login-btn">登录</Link>
                        <Link to="/reg" className="reg-btn">注册</Link>
                    </div>
                </div>
            </div>
            <div className="nav">
                <ul className="w1200">
                    <li  className="on" ><Link to="/home">首页</Link></li>
                    <li><Link to="/home">大厅</Link></li>
                    <li><Link to="/home">开奖</Link></li>
                    <li><Link to="/home">手机购彩</Link></li>
                    <li><Link to="/home">其他</Link></li>
                </ul>
            </div>
        </div>)
    }
}
