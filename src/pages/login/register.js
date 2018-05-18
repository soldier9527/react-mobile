import React, {Component} from 'react';
import {hashHistory} from 'react-router-dom';
import {Form, Input, Button, message, Modal} from 'antd';
import Navbar from '../common/navbar';
import MaskLoading from '../common/maskLoading';// 防止重复点击
import Api from '../api';
import {Toast} from "antd-mobile/lib/index";

const FormItem = Form.Item;

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        checkCode: false,
        checkOtherCode: true,
        result: "",
        captchaId: "",
        code: "",
        className: ["", "", "", "", "", "", "", ""],
        realname: false,
        mobile: false,
        qq: false,
        arr: "",//邀请码
        hasConfig: false
    };

    haveCode(e) {
        this.setState({
            checkCode: !this.state.checkCode,
            checkOtherCode: !this.state.checkOtherCode,
        })
    }

    myFunction(index) {
        let className = JSON.parse(JSON.stringify(this.state.className));
        className[index] = !this.state.className[index];
        this.setState({className: className});
    }

    //键入键出 动画
    //不传lose 为 键入时
    //lose为ture 为 键出时
    inputAnimate(index, lose) {
        if (lose) {
            let className = JSON.parse(JSON.stringify(this.state.className));
            className[index] = !this.state.className[index];
            this.setState({className: className});
        } else {
            let className = JSON.parse(JSON.stringify(this.state.className));
            className[index] = !this.state.className[index];
            this.setState({className: className});
        }
    }

    getConfig() {
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
        Api("c=user&a=regconf", null, (res) => {
            if (res.errno === 0) {
                if (res.data.need_invitation_code == 1) {
                    this.getCode();
                    this.setState({
                        realname: res.data.real_name !== "0",
                        mobile: res.data.reg_need_mobile !== "0",
                        qq: res.data.reg_need_qq !== "0",
                        hasConfig: true,
                        checkCode: true,
                        checkOtherCode: false
                    });
                } else {
                    this.getCode();
                    this.setState({
                        realname: res.data.real_name !== "0",
                        mobile: res.data.reg_need_mobile !== "0",
                        qq: res.data.reg_need_qq !== "0",
                        hasConfig: true
                    });
                }
            } else {
                //实现不累加显示，重复点击只显示一个

                message.warning('注册配置接口调用失败，请重试,3s后再次请求配置');
                setTimeout(() => {
                    this.getConfig();
                }, 3000)
            }
        })

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 3,
            });
            if (!err) {
                if (!values.verifyCode) {
                    message.warning('请输入验证码');
                    return;
                }
                let VerifyCode = this.state.result;
                VerifyCode = VerifyCode.join("");
                if (VerifyCode !== values.verifyCode) {
                    message.warning('验证码错误');
                    return;
                }
                if (this.state.mobile) {
                    if (!values.mobile) {
                        message.warning('请输入手机号码');
                        return;
                    }
                }
                if (!values.username) {
                    message.warning('请输入账号');
                    return;
                }

                if (this.state.realname) {
                    if (!values.realname) {
                        message.warning('请输入真实姓名');
                        return;
                    }
                }
                if (!values.password) {
                    message.warning('请输入密码');
                    return;
                }
                if (values.password !== values.repassword) {
                    message.warning('两次输入密码不相同');
                    return;
                }
                if (this.state.qq) {
                    if (!values.qq) {
                        message.warning('请输入qq号');
                        return;
                    }
                }
                MaskLoading(5);

                let mobile = values.mobile ? values.mobile.replace(/\s/g, '') : "";
                let username = values.username ? values.username.replace(/\s/g, '').toLowerCase() : "";
                let realname = values.realname ? values.realname.replace(/\s/g, '') : "";
                let qq = values.qq ? values.qq.replace(/\s/g, '') : "";
                //去掉密码的前后空格
                let password = values.password.trim();
                Api("c=user&a=register", {
                    register_from: "wap",
                    mobile: mobile,
                    username: username,
                    var: values.haveCode,
                    realname: realname,
                    password: password,
                    qq: qq,
                    is_wap: 1,
                    captcha_id: this.state.captchaId,
                    verifyCode: values.verifyCode,
                    domain: window.location.host
                }, (res) => {
                    MaskLoading(false);
                    if (res.errno === 0) {
                        Modal.success({
                            title: '注册成功',
                            content: (<div>
                                <p>用户名：{values.username}</p>
                                <p>密码：{values.password}</p>
                            </div>),
                            onOk() {
                                sessionStorage.user = JSON.stringify(res.data);
                                hashHistory.push("home");
                            },
                        });
                    } else {
                        this.getCode();
                    }
                })

            }
        });
    }

    getCode() {
        Toast.loading("", 0.5);
        Api("c=default&a=verifyCode&type=2", null, (res) => {
            if (res.errno === 0) {
                let data = res.data;
                let result = data.codeArr;
                if (result) {
                    this.setState({result: result, captchaId: data.captcha_id, code: data.code}, () => {
                        this.drawPic();
                    })
                } else {
                    message.error("获取验证码失败");
                }
            }

        })


    }


    componentWillMount() {

        this.getConfig();
    }


    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**生成一个随机色**/
    randomColor(min, max) {
        var r = this.randomNum(min, max);
        var g = this.randomNum(min, max);
        var b = this.randomNum(min, max);
        return "rgb(" + r + "," + g + "," + b + ")";
    }


    /**绘制验证码图片**/
    drawPic() {
        var canvas = document.getElementById("canvas");
        var width = canvas.width;
        var height = canvas.height;
        var ctx = canvas.getContext('2d');
        ctx.textBaseline = 'bottom';

        /**绘制背景色**/
        ctx.fillStyle = "#cccccc"; //颜色若太深可能导致看不清
        ctx.fillRect(0, 0, width, height);
        /**绘制文字**/
        var str = this.state.result;
        for (var i = 0; i < 4; i++) {
            var txt = str[i];
            ctx.fillStyle = "#000000";  //随机生成字体颜色

            ctx.font = this.randomNum(30, 40) + 'px SimHei'; //随机生成字体大小
            var x = 10 + i * 25;
            var y = this.randomNum(40, 40);
            var deg = this.randomNum(-10, 10);
            //修改坐标原点和旋转角度
            ctx.translate(x, y);
            ctx.rotate(deg * Math.PI / 180);
            ctx.fillText(txt, 0, 0);
            //恢复坐标原点和旋转角度
            ctx.rotate(-deg * Math.PI / 180);
            ctx.translate(-x, -y);
        }
        /**绘制干扰线**/
        for (var i = 0; i < 4; i++) {
            ctx.strokeStyle = this.randomColor(40, 180);
            ctx.beginPath();
            ctx.moveTo(this.randomNum(0, width), this.randomNum(0, height));
            ctx.lineTo(this.randomNum(0, width), this.randomNum(0, height));
            ctx.stroke();
        }
        /**绘制干扰点**/
        for (var i = 0; i < 100; i++) {
            ctx.fillStyle = this.randomColor(0, 255);
            ctx.beginPath();
            ctx.arc(this.randomNum(0, width), this.randomNum(0, height), 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    render() {
        if (!this.state.hasConfig) {
            return null;
        }
        const {getFieldDecorator} = this.props.form;
        let checkCode = this.state.checkCode ? "block" : "none";
        let checkOtherCode = this.state.checkOtherCode ? "block" : "none";
        return (
            <Form className="register" onSubmit={this.handleSubmit}>
                <div className="register_top">
                    <ul>
                        <li className="bottom_border " style={{display: checkCode}}>
                            <FormItem hasFeedback><i className="icon_team fl"></i>
                                {getFieldDecorator('haveCode', {
                                    initialValue: this.state.arr,
                                    getValueFromEvent: (e) => {
                                        return e.target.value.replace(/[" "]/g, "")
                                    }
                                })(
                                    <Input style={{paddingLeft: "0.5rem"}} placeholder="输入你的邀请码" className="input "
                                           ref={(input) => this.input = input} onFocus={() => this.inputAnimate(7)}
                                           onBlur={() => this.inputAnimate(7, true)}/>
                                )}
                                <div
                                    className={this.state.className[7] === "" ? "" : this.state.className[7] ? "div3" : "div4"}>
                                </div>
                            </FormItem>
                        </li>
                        {this.state.mobile ? <li className="bottom_border" key={3}>
                            <FormItem><i className="icon_phone fl"></i>
                                {getFieldDecorator('mobile', {
                                    rules: [{}],
                                    getValueFromEvent: (e) => {
                                        return e.target.value.replace(/[" "]/g, "")
                                    }
                                })(
                                    <Input style={{paddingLeft: "0.5rem"}} className="input " maxLength="11"
                                           placeholder="手机号码" ref={(input) => this.input = input}
                                           onFocus={() => this.inputAnimate(0)}
                                           onBlur={() => this.inputAnimate(0, true)}/>
                                )}
                                <div
                                    className={this.state.className[0] === "" ? "" : this.state.className[0] ? "div3" : "div4"}>
                                </div>
                            </FormItem>
                        </li> : null}
                        <li className="bottom_border">
                            <FormItem>
                                <i className="icon_username fl"></i>
                                {getFieldDecorator('username', {
                                    rules: [{}],
                                    getValueFromEvent: (e) => {
                                        return e.target.value.replace(/[" "]/g, "")
                                    }
                                })(
                                    <Input style={{paddingLeft: "0.5rem", width: "6.5rem"}} size="large"
                                           className="input " placeholder="输入账号（6-12个字母数字混合）"
                                           ref={(input) => this.input = input} onFocus={() => this.inputAnimate(1)}
                                           onBlur={() => this.inputAnimate(1, true)}/>
                                )}
                                <div
                                    className={this.state.className[1] === "" ? "" : this.state.className[1] ? "div3" : "div4"}>
                                </div>
                            </FormItem>
                        </li>
                        {this.state.realname ? <li className="bottom_border" key={1}>
                            <FormItem>
                                <i className="icon_realname fl"></i>
                                {getFieldDecorator('realname', {
                                    rules: [{}],
                                    getValueFromEvent: (e) => {
                                        return e.target.value.replace(/^[" "]$/g, "")
                                    }
                                })(
                                    <Input style={{paddingLeft: "0.5rem"}} size="large" className="input "
                                           placeholder="真实姓名（必须是中文）" ref={(input) => this.input = input}
                                           onFocus={() => this.inputAnimate(2)}
                                           onBlur={() => this.inputAnimate(2, true)}/>
                                )}
                                <div
                                    className={this.state.className[2] === "" ? "" : this.state.className[2] ? "div1" : "div2"}>
                                </div>
                            </FormItem>
                        </li> : null}
                        <li className="bottom_border">
                            <FormItem hasFeedback>
                                <i className="icon_password fl"></i>
                                {getFieldDecorator('password', {})(
                                    <Input style={{paddingLeft: "0.5rem"}} type="password" className="input "
                                           placeholder="设定密码（6-15个字母数字混合）" ref={(input) => this.input = input}
                                           onFocus={() => this.inputAnimate(3)}
                                           onBlur={() => this.inputAnimate(3, true)}/>
                                )}
                                <div
                                    className={this.state.className[3] === "" ? "" : this.state.className[3] ? "div3" : "div4"}>
                                </div>
                            </FormItem>
                        </li>
                        <li className="bottom_border">
                            <FormItem hasFeedback>
                                <i className="icon_password fl"></i>
                                {getFieldDecorator('repassword', {})(
                                    <Input style={{paddingLeft: "0.5rem"}} type="password" className="input "
                                           placeholder="确认密码（6-15个字母数字混合）" ref={(input) => this.input = input}
                                           onFocus={() => this.inputAnimate(4)}
                                           onBlur={() => this.inputAnimate(4, true)}/>
                                )}
                                <div
                                    className={this.state.className[4] === "" ? "" : this.state.className[4] ? "div3" : "div4"}>
                                </div>
                            </FormItem>
                        </li>
                        {this.state.qq ? <li className="bottom_border" key={4}>
                            <FormItem hasFeedback>
                                <i className="icon_qq fl"></i>
                                {getFieldDecorator('qq', {
                                    getValueFromEvent: (e) => {
                                        return e.target.value.replace(/[" "]/g, "")
                                    }
                                })(
                                    <Input style={{paddingLeft: "0.5rem"}} placeholder="输入你的QQ号，此项必填" className="input "
                                           ref={(input) => this.input = input} onFocus={() => this.inputAnimate(5)}
                                           onBlur={() => this.inputAnimate(5, true)}/>
                                )}
                                <div
                                    className={this.state.className[5] === "" ? "" : this.state.className[5] ? "div3" : "div4"}>
                                </div>
                            </FormItem>
                        </li> : null}
                        <li className="bottom_border">
                            <FormItem hasFeedback>
                                <i style={{
                                    width: "1.3rem",
                                    lineHeight: "0.6rem",
                                    paddingLeft: "0.15rem",
                                    fontStyle: "normal",
                                    fontSize: "0.35rem"
                                }}>验证码</i>
                                {getFieldDecorator('verifyCode')(
                                    <Input placeholder="输入验证码" style={{width: "4.5rem"}} className="input " type="tel"
                                           ref={(input) => this.input = input} onFocus={() => this.inputAnimate(6)}
                                           onBlur={() => this.inputAnimate(6, true)}/>
                                )}

                                {this.state.result === "" ? <div className="rgyzm"
                                                                 onClick={() => {
                                                                     this.getCode()
                                                                 }}
                                >
                                    获取验证码
                                </div> : <canvas className="rgyzm" id="canvas" width="140"
                                                 onClick={() => {
                                                     this.getCode()
                                                 }}
                                                 height="40"
                                >
                                </canvas>}


                                <div
                                    className={this.state.className[6] === "" ? "" : this.state.className[6] ? "div3" : "div4"}>
                                </div>
                            </FormItem>
                        </li>
                    </ul>
                </div>
                <div className="register_button">
                    <p className="red" onClick={(e) => {
                        this.haveCode(e)
                    }} style={{display: checkOtherCode, paddingTop: "0.3rem", zIndex: "99"}}>我有注册邀请码</p>

                    <p className="register_p">
                        <Button type="primary" htmlType="submit">
                            注册并登录
                        </Button>
                    </p>
                </div>
            </Form>

        );
    }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default class Register extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navbar title="注册" back="/login"/>
                <div className="register">
                    <WrappedRegistrationForm/>
                </div>
            </div>
        );
    }
}


