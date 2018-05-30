import React, {Component} from 'react';
import Navbar from '../common/navbar';
import MaskLoading from '../common/maskLoading';// 防止重复点击
import Api from '../api';
import {withRouter} from 'react-router-dom'
import Btn from '../components/btn'
import './login.scss'
import {Toast} from "antd-mobile/lib/index";
import renderVcode from "./vcode";
class Register extends Component {
    constructor(props) {
        super(props);
        let host = window.location.href;
        if (host.indexOf("var") !== -1) {
            var arrUrl = host.split("var=");
            let n = arrUrl[1].indexOf("#");
            let arr = arrUrl[1].slice(0, n);
            this.haveCode();
            this.setState({
                arr: arr
            })
        }
        this.state={
            captchaId: "",
            codeStr: "",
            animateArr:[],
            config:{},
            hasInviteCode:false, //有邀请码
        }
    }
    componentDidMount() {
        this.getVcode();
        this.getConfig();
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
    handleRegister() {
        let config = this.state.config;
        let username = this.refs.username.value;
        let password = this.refs.password.value;
        let repassword = this.refs.repassword.value;
        let vcode = this.refs.vcode.value;
        let inviteCode = this.refs.inviteCode.value;
        let realname = this.refs.realname.value;
        let phone = this.refs.phone.value;
        let qq = this.refs.qq.value;

        if(config.need_invitation_code==="1"){
            if (!inviteCode) {
                Toast.info('请输入邀请码', 1);
                return;
            }
        }
        if(config.reg_need_mobile==="1"){
            if (!phone) {
                Toast.info('请输入手机号', 1);
                return;
            }
        }

        if (!username) {
            Toast.info('请输入用户名', 1);
            return;
        }
        if(config.real_name==="1"){
            if (!realname) {
                Toast.info('请输入真实姓名', 1);
                return;
            }
        }

        if (!password) {
            Toast.info('请输入密码', 1);
            return;
        }else if(password !==repassword){
            Toast.info('两次输入密码不相同', 1);
            return;
        }

        if (config.reg_need_qq==="1") {
            if (!qq) {
                Toast.info('请输入qq号', 1);
            }
            return;
        }
        if (!vcode) {
            Toast.info('请输入验证码', 1);
            return;
        }
        if (vcode !== this.state.codeStr) {
            Toast.info('验证码错误', 1);
            return;
        }
        username = username.replace(/\s/ig, '');
        username = username.replace(/[" "]/g, "")
        //去掉密码的前后空格
        password = password.trim();
        MaskLoading(5);
        Api("c=user&a=register", {
            register_from: "wap",
            mobile: phone,
            username: username,
            var: "12",
            realname: realname,
            password: password,
            qq: qq,
            is_wap: 1,
            captcha_id: this.state.captchaId,
            verifyCode: vcode,
            domain: window.location.host
        }, (res) => {
            if (res.errno === 0) {
                Toast.hide();
                let data = res.data;
                sessionStorage.user = JSON.stringify(data);
                this.props.history.push("home");
            } else{
                Toast.info(res.errstr, 2);
                this.getVcode(false)
            }
        })
    }
    handleAnimate(index,type=false){
        let animateArr = JSON.parse(JSON.stringify(this.state.animateArr))
        animateArr[index]=type?"animate-input-leave":"animate-input-on"
        this.setState({
            animateArr:animateArr
        })
    }
    getConfig() {
        Api("c=user&a=regconf", null, (res) => {
            if (res.errno === 0) {
                if(res.data.need_invitation_code==="1"){
                    this.setState({
                        hasInviteCode:true
                    })
                }
                this.setState({
                    config:res.data
                })
            } else {
                //实现不累加显示，重复点击只显示一个
                Toast.fail('注册配置接口调用失败，请重试,3s后再次请求配置', 2);
                setTimeout(() => {
                    this.getConfig();
                }, 3000)
            }
        })

    }
    render() {
        return (
            <div>
                <Navbar title="注册" back="/login"/>
                <div className="container login-wrap register-wrap">
                    <div className='form-wrap'>
                        <div className={this.state.hasInviteCode?"input-wrap":"input-wrap hidden"}>
                            <i className="i-login i-invite"></i>
                            <input type="text" placeholder="输入你的邀请码" ref="inviteCode"
                                   onFocus={() => this.handleAnimate(0)}
                                   onBlur={() => this.handleAnimate(0,true)}
                            />
                            <div className={this.state.animateArr[0]?this.state.animateArr[0]:""}></div>
                        </div>
                        <div className={this.state.config.reg_need_mobile==="1"?"input-wrap":"hidden"}>
                            <i className="i-login i-phone"></i>
                            <input type="text" placeholder="手机号码" ref="phone"
                                   onFocus={() => this.handleAnimate(1)}
                                   onBlur={() => this.handleAnimate(1,true)}
                            />
                            <div className={this.state.animateArr[1]?this.state.animateArr[1]:""}></div>
                        </div>
                        <div className="input-wrap">
                            <i className="i-login i-"></i>
                            <input type="text" placeholder="输入账号（6-12个字母数字混合）" ref="username"
                                   onFocus={() => this.handleAnimate(2)}
                                   onBlur={() => this.handleAnimate(2,true)}
                            />
                            <div className={this.state.animateArr[2]?this.state.animateArr[2]:""}></div>
                        </div>
                        <div className={this.state.config.real_name==="1"?"input-wrap":"hidden"}>
                            <i className="i-login i-realname"></i>
                            <input type="text" placeholder="真实姓名（必须是中文）" ref="realname"
                                   onFocus={() => this.handleAnimate(3)}
                                   onBlur={() => this.handleAnimate(3,true)}
                            />
                            <div className={this.state.animateArr[3]?this.state.animateArr[3]:""}></div>
                        </div>


                        <div className="input-wrap">
                            <i className="i-login i-password"></i>
                            <input type="password" placeholder="设定密码（6-15个字母数字混合）" ref="password"
                                   onFocus={() => this.handleAnimate(4)}
                                   onBlur={() => this.handleAnimate(4,true)}
                            />
                            <div className={this.state.animateArr[4]?this.state.animateArr[4]:""}></div>
                        </div>
                        <div className="input-wrap">
                            <i className="i-login i-password"></i>
                            <input type="password" placeholder="确认密码（6-15个字母数字混合）" ref="repassword"
                                   onFocus={() => this.handleAnimate(5)}
                                   onBlur={() => this.handleAnimate(5,true)}
                            />
                            <div className={this.state.animateArr[5]?this.state.animateArr[5]:""}></div>
                        </div>

                        <div className={this.state.config.reg_need_qq==="1"?"input-wrap":"hidden"}>
                            <i className="i-login i-qq"></i>
                            <input type="text" placeholder="输入你的QQ号，此项必填" ref="qq"
                                   onFocus={() => this.handleAnimate(6)}
                                   onBlur={() => this.handleAnimate(6,true)}
                            />
                            <div className={this.state.animateArr[6]?this.state.animateArr[6]:""}></div>
                        </div>

                        <div className="input-wrap" >
                            <label htmlFor="vcode">验证码</label>
                            <input type="text" id="vcode" ref="vcode" className="vcode-input" placeholder="输入验证码"
                                   onFocus={() => this.handleAnimate(7)}
                                   onBlur={() => this.handleAnimate(7,true)}
                            />
                            <canvas onClick={() => this.getVcode()} className="vcode-canvas" id="canvas" width="140"
                                    height="40"></canvas>
                            {!this.state.codeStr ?
                                <Btn className="btn btn-get-vcode" onClick={() => this.getVcode()}>获取验证码</Btn> : null}
                            <div className={this.state.animateArr[7]?this.state.animateArr[7]:""}></div>

                        </div>

                    </div>
                    <div className={this.state.hasInviteCode?"hidden":"has-invite-code"} onClick={()=>{this.setState({hasInviteCode:true})}}>
                        我有注册邀请码
                    </div>
                    <Btn className="btn" onClick={() => this.handleRegister()}>注册并登录</Btn>
                    <div className="links">
                        {/*检查是否为UC浏览器，如果是，页面低部显示温馨提示*/}
                        {navigator.userAgent.indexOf("UCBrowser") !== -1 ?
                            <p className="tip">如多次刷新后无法显示验证码，请尝试更换谷歌浏览器重新登录</p> : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Register)
