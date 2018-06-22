import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../common/header'
import Footer from '../common/footer'
import "./login.scss"
import Api from '../api'
export default class Login extends Component {
    handleSubmit(){
        let username = this.refs.username.value;
        let password = this.refs.password.value;
        console.log(username)
        console.log(password)
        Api("c=user&a=login", {
            username: username,
            password: password,
            str: 1,
            is_wap: 1,
        },  (res)=> {
            if(!res.errno){
                sessionStorage.setItem('user',JSON.stringify(res.data));
                this.props.history.push("/home");
            }
        })
    }
    render() {
        return (<div className="login-wrap">
                <Header></Header>
                <div className="w1200 login-content">
                    <h3 className="title">用户登录</h3>
                    <ul className="">
                        <li className="input-wrap">
                            <label className="label-input" htmlFor="username">账 号：</label>
                            <input ref="username" id="username" className="text-input" type="text" autoComplete="off"/>
                        </li>
                        <li className="input-wrap">
                            <label className="label-input"  htmlFor="password">密 码：</label>
                            <input
                                id="password"
                                ref="password"
                            className="text-input"
                            type="password"
                            autoComplete="off"/>
                        </li>
                        <li className="input-wrap">
                            <label className="label-input"></label>
                            <div className="submit-btn" onClick={this.handleSubmit.bind(this)}>
                                登 录
                            </div>
                            <div className="forgot-pwd">忘记密码?</div>
                        </li>
                    </ul>

                </div>
                <Footer/>
            </div>
        )
    }
}
