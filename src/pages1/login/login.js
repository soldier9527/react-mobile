import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom';
import {Toast, Checkbox} from "antd-mobile";
import Navbar from '../common/navbar';
import Footer from '../common/footer';
import MaskLoading from '../common/maskLoading';// 防止重复点击
import Api from '../api';

import './login.scss'
import Btn from '../components/btn'
import renderVcode from './vcode'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            captchaId: "",
            codeStr: "",
            needVerificationCode: false, //默认不需要填写验证码
            psdErrorTime:0,
            isRememberPsd:false, //是否记住密码
            animateArr:[]
        }
    }

    componentDidMount() {
    }

    getVcode(showToast=true) {
        if(showToast){
            Toast.loading("", 0.5);
        }
        this.setState({
            needVerificationCode: true
        })
        Api("c=default&a=verifyCode&type=2", null, (res) => {
            if (res.errno === 0) {
                let data = res.data;
                if (data && data.codeStr) {
                    this.setState({
                        captchaId: data.captcha_id,
                        code: data.code,
                        codeStr: data.codeStr,
                    })
                    renderVcode(data.codeStr);
                } else {
                    Toast.loading("获取验证码失败", 2);
                }
            }
        })
    }

    handleLogin() {
        let username = this.refs.username.value;
        let password = this.refs.password.value;
        let vcode = this.refs.vcode.value;
        if (!username) {
            Toast.info('请输入用户名', 1);
            return;
        }
        if (!password) {
            Toast.info('请输入密码', 1);
            return;
        }
        if (this.state.needVerificationCode === true) {
            if (!vcode) {
                Toast.info('请输入验证码', 1);
                return;
            }
            if (vcode !== this.state.codeStr) {
                Toast.info('验证码错误', 1);
                return;
            }
        }
        username = username.replace(/\s/ig, '');
        username = username.replace(/[" "]/g, "")
        //去掉密码的前后空格
        password = password.trim();
        MaskLoading(5);
        Api("c=user&a=login", {
            username: username,
            password: password,
            str: 1,
            is_wap: 1,
            captcha_id: this.state.captchaId,
            verifyCode: vcode
        }, (res) => {
            MaskLoading(false);
            if (res.errno === 0) {
                let data = res.data;
                sessionStorage.user = JSON.stringify(data);
                console.log(res.data)
                if (this.state.isRememberPsd) {
                    localStorage.setItem('sid', data.sid);
                    localStorage.setItem('user_id', data.user_id);
                    localStorage.setItem('username', data.username);
                }
                this.props.history.push("home");
            } else if (res.errno === 7005) {
                let count = this.state.psdErrorTime;
                count++;
                this.setState({
                    psdErrorTime: count
                })
                if (count > 2 && !this.state.needVerificationCode) {
                    Toast.info('多次输入错误密码，需要输入验证码', 2);
                    this.getVcode(false);
                }
            }else{
                this.getCode();
            }
        })
    }
    handleRemember(){
        console.log(this.state.isRememberPsd)
        this.setState({
            isRememberPsd:!this.state.isRememberPsd
        })
    }
    findPsd(){
        Toast.info('找回密码，请联系客服', 2);
        setTimeout(()=>{
            this.props.history.push("getService");
        }, 2000);
    }
    handleAnimate(index,type=false){
        let animateArr = JSON.parse(JSON.stringify(this.state.animateArr))
        animateArr[index]=type?"animate-input-leave":"animate-input-on"
        this.setState({
            animateArr:animateArr
        })
    }
    render() {
        return (<div>
            <Navbar title="登录" back="back"/>
            <div className="container login-wrap">
                <div className='form-wrap'>
                    <div className="input-wrap">
                        <i className="i-login i-username"></i>
                        <input type="text" placeholder="账号" ref="username"
                               onFocus={() => this.handleAnimate(0)}
                               onBlur={() => this.handleAnimate(0,true)}
                        />
                        <div className={this.state.animateArr[0]?this.state.animateArr[0]:""}></div>
                    </div>
                    <div className="input-wrap">
                        <i className="i-login i-password"></i>
                        <input type="password" placeholder="密码" ref="password"
                               onFocus={() => this.handleAnimate(1)}
                               onBlur={() => this.handleAnimate(1,true)}
                        />
                        <div className={this.state.animateArr[1]?this.state.animateArr[1]:""}></div>
                    </div>
                    <div className={this.state.psdErrorTime>2?"input-wrap":"input-wrap hidden"} >
                        <label htmlFor="vcode">验证码</label>
                        <input type="text" id="vcode" ref="vcode" className="vcode-input" placeholder="输入验证码"
                               onFocus={() => this.handleAnimate(2)}
                               onBlur={() => this.handleAnimate(2,true)}
                        />
                        <canvas onClick={() => this.getVcode()} className="vcode-canvas" id="canvas" width="140"
                                height="40"></canvas>
                        {!this.state.codeStr ?
                            <Btn className="btn btn-get-vcode" onClick={() => this.getVcode()}>获取验证码</Btn> : null}
                        <div className={this.state.animateArr[2]?this.state.animateArr[2]:""}></div>
                    </div>

                </div>
                <Btn className="btn" onClick={() => this.handleLogin()}>登录</Btn>
                <Btn className="btn btn-white" onClick={()=>{this.props.history.push("register")}}>注册</Btn>
                <div className="links">
                    <Checkbox onChange={()=>{this.handleRemember()}} checked={this.state.isRememberPsd}>
                        记住密码
                    </Checkbox>
                    <span className="links-right" onClick={()=>this.findPsd()}>找回密码</span>
                    {/*检查是否为UC浏览器，如果是，页面低部显示温馨提示*/}
                    {navigator.userAgent.indexOf("UCBrowser") !== -1 ?
                        <p className="tip">如多次刷新后无法显示验证码，请尝试更换谷歌浏览器重新登录</p> : null}
                </div>
            </div>
            <Footer></Footer>
        </div>)
    }
}
