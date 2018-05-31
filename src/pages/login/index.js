import React, {Component} from 'react'
import {Link,withRouter} from 'react-router-dom';
import Modal from 'antd/lib/modal';
import  message from 'antd/lib/message';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import  Checkbox from 'antd/lib/checkbox';

import Navbar from '../common/navbar';
import Footer from '../common/footer';
import MaskLoading from '../common/maskLoading';// 防止重复点击
import Api,{sendData} from '../api';
import {Toast} from "antd-mobile";

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: "",
            captchaId: "",
            code: "",
            checkCode: "",
            className: ["", "", ""],
            userName: "",
            count:0,//获取验证码次数
            setTime:null,
            checked: false,
            disabled: false,
            isRemember:false,
            password:'',
            codeStr:'',
            verificationCode:true, //初次加载登录隐藏验证码
            passwordCount:0, //获取登录密码次数
        };
    }
    getCode() {
        Toast.loading("",0.5);
        Api("c=default&a=verifyCode&type=2", null, (res) => {
            if (res.errno===0) {
                let data = res.data;
                let result=data.codeArr;
                if(result){
                    if(this.state.setTime){
                        clearInterval(this.state.setTime);
                    }
                    this.setState({
                        result: result,
                        captchaId: data.captcha_id,
                        code: data.code,
                        count:0,
                        codeStr:data.codeStr,
                    },()=>{
                        this.drawPic();
                    })
                }else{
                    message.error("获取验证码失败");
                }
            }
        })
    }

    backPassWord() {
        Modal.info({
            content: '找回密码，请联系客服',
        });
        setTimeout(()=> {
            this.props.history.push("/getService");
        }, 2000);
    }

    handleSubmit = (e) => {
        message.config({
            top: 20,
            duration: 4,
        });
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                if (!values.username) {
                    message.warning('请输入用户名');
                    return;
                }
                if (!values.password) {
                    message.warning('请输入密码');
                    return;
                }
                if(this.state.verificationCode===false){
                    if (!values.verifyCode) {
                        message.warning('请输入验证码');
                        return;
                    }
                    let VerifyCode = this.state.result;
                    VerifyCode=VerifyCode.join("");
                    if(VerifyCode !==values.verifyCode){
                        message.warning('验证码错误');
                        return;
                    }
                }
                MaskLoading(5);
                let userName = values.username.replace(/\s/ig, '');
                //去掉密码的前后空格
                let password = values.password.trim();
                //判断是否真的有密码登陆
                let sid=JSON.parse(localStorage.getItem('sid'));
                if(!sid){
                    Api("c=user&a=login", {
                        username: userName,
                        password: password,
                        str: 1,
                        is_wap: 1,
                        captcha_id: this.state.captchaId,
                        verifyCode: values.verifyCode
                    },  (e)=> {
                        MaskLoading(false);

                        if(e.errno===7005){

                            let count  = this.state.passwordCount;
                            count++;
                            this.setState({
                                passwordCount:count
                            })
                            if(count>2 && this.state.verificationCode){
                                message.config({
                                    top: 20,
                                    duration:4,
                                });
                                this.setState({
                                    verificationCode:false
                                });
                                message.error("多次输入错误密码，需要输入验证码");
                            }
                        }else{

                            if(e.errno===0){
                                sessionStorage.user = JSON.stringify(e.data);
                                if(this.state.isRemember&&this.state.checked){
                                    localStorage.setItem('sid',JSON.stringify(e.data.sid));
                                    localStorage.setItem('user_id',JSON.stringify(e.data.user_id));
                                    localStorage.setItem('username',JSON.stringify(e.data.username));
                                    localStorage.setItem('user',JSON.stringify(e.data));
                                    localStorage.setItem('checked',JSON.stringify(this.state.checked));
                                    this.props.history.push("/home");
                                }else if(this.state.isRemember===false){
                                    localStorage.removeItem('sid');
                                    localStorage.removeItem('user_id');
                                    localStorage.removeItem('username');
                                    localStorage.removeItem('checked');
                                    this.props.history.push("/home");
                                }
                            }else{
                                this.getCode();
                            }

                        }


                    })
                }else {
                    let sid=JSON.parse(localStorage.getItem('sid'));
                    let user_id=JSON.parse(localStorage.getItem('user_id'));
                    let user=JSON.parse(localStorage.getItem('user'));
                    localStorage.setItem('checked',JSON.stringify(this.state.checked));
                        Api('c=user&a=info&user_id='+user_id+'&sid='+sid,null,(res)=>{
                            if(res.errno===0){
                                MaskLoading(false);
                                sessionStorage.user = JSON.stringify(user);
                                this.props.history.push('/home')
                            }
                        })
                }

            }
        });
    }
    componentWillUnMount(){
        if(this.state.setTime){
            clearInterval(this.state.setTime);
        }
    }

    componentDidMount() {
        this.setState({
            count:0
        });
        try{
            this.getCode();
        }catch (err){
            sendData("获取验证码失败",""+err);
        }
        this.setState({
            setTime:setInterval(()=>{
                if(this.state.result===""){
                    let count =this.state.count;
                    count++;
                    this.setState({
                        count:count,
                    });
                    //5次之后提示用户
                    if(count>5){
                        message.config({
                            top: 20,
                            duration:4,
                        });
                        this.getCode();
                        this.setState({
                            count:0
                        });
                        message.error("验证码获取失败，请从新刷新页面或清除浏览器缓存再次访问");
                        sendData("多次获取验证码失败",""+err);
                    }
                }else{
                    clearInterval(this.state.setTime);
                }
            },3000)
        });
        this.isPreWrite();
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

    myFunction(index) {
        let className = JSON.parse(JSON.stringify(this.state.className));
        className[index] = !this.state.className[index];
        this.setState({className: className});
    }

    lose(index) {
        let className = JSON.parse(JSON.stringify(this.state.className));
        className[index] = !this.state.className[index];
        this.setState({className: className});
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
        if (str != "") {
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
    //记住密码
     onChange() {
        let psd=document.getElementById("password").value.trim();
        if(!psd){
            this.setState({
                disabled:!this.state.disabled,
                checked:this.state.checked,
            });
            message.warning('请先输入密码',0.5,()=>{
                this.setState({
                    disabled:!this.state.disabled,
                    checked:this.state.checked,
                })
            })
        }else {
            this.setState({
                disabled:false,
                checked:!this.state.checked,
                isRemember:!this.state.isRemember,
            })
        }
    }
    //是否预填写账号密码和验证码
    isPreWrite(){
        let sid=JSON.parse(localStorage.getItem('sid'));
        let username=JSON.parse(localStorage.getItem('username'));
        let checked=JSON.parse(localStorage.getItem('checked'));
        if(sid&&checked){
            this.setState({
                checked:true,
                userName:username,
                password:'*******',
            });
        }else {
            this.setState({
                checked:false,
                userName:'',
                password:'',
            });
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form login">
                <div className="login_top">
                    <ul>
                        <li className="bottom_border">
                            <FormItem>
                                <i className="icon_username fl"></i>
                                {getFieldDecorator('username', {
                                    rules: [{}],
                                    initialValue:this.state.userName,
                                    getValueFromEvent: (e) => {
                                        return e.target.value.replace(/[" "]/g, "")
                                    }
                                })(
                                    <Input className="input fl" name="username" style={{marginLeft: "0.1rem"}}
                                           placeholder="用户名" ref={(input) => this.input = input}
                                           onFocus={() => this.myFunction(0)} onBlur={() => this.lose(0)}/>
                                )}
                                <div
                                    className={this.state.className[0] === "" ? "" : this.state.className[0] ? "div1" : "div2"}></div>
                            </FormItem>
                        </li>
                        <li className="bottom_border">
                            <FormItem>
                                <i className="icon_password fl"></i>
                                {getFieldDecorator('password', {
                                    rules: [{}],
                                    initialValue:this.state.password,
                                })(
                                    <Input className="input fl" style={{marginLeft: "0.1rem"}} type="password"
                                           placeholder="密码" ref={(input) => this.input = input}
                                           onFocus={() => this.myFunction(1)} onBlur={() => this.lose(1)}/>
                                )}
                                <div
                                    className={this.state.className[1] === "" ? "" : this.state.className[1] ? "div1" : "div2"}></div>
                            </FormItem>
                        </li>
                        <li className="bottom_border" style={this.state.verificationCode?{display:'none'}:{display:'block'}}>
                            <FormItem>
                                <span className="fl span" style={{paddingLeft: "0.5rem"}}>验证码</span>
                                {getFieldDecorator('verifyCode', {
                                    rules: [{}],
                                    getValueFromEvent: (e) => {
                                        return e.target.value.replace(/[" "]/g, "")
                                    }
                                })(
                                    <Input className="input fl verifyCode" type="tel" placeholder="点击获取"
                                           ref={(input) => this.input = input} onFocus={() => this.myFunction(2)}
                                           onBlur={() => this.lose(2)}/>
                                )}
                                {this.state.result===""?<div className="yzm"
                                                             onClick={()=>{this.getCode()}}
                                >
                                    获取验证码
                                </div>:<canvas className="yzm" id="canvas" width="140"
                                               onClick={()=>{this.getCode()}}
                                               height="40"
                                >
                                </canvas>}
                                <div
                                    className={this.state.className[2] === "" ? "" : this.state.className[2] ? "div1" : "div2"}></div>
                            </FormItem>
                        </li>
                    </ul>
                </div>
                <div className="login_button">
                    <FormItem>
                        <p><Button type="primary" htmlType="submit" className="login-form-button">登录</Button></p>
                        <p><Link to="register"><Button onClick={this.showModal} type="primary" className="login-form-button login_gary">注册</Button></Link></p>
                        <Checkbox onChange={()=>{this.onChange()}} checked={this.state.checked} disabled={this.state.disabled}>记住密码</Checkbox>
                        <a className="login-form-forgot login_tp " onClick={()=>this.backPassWord()}>找回密码</a>
                    </FormItem>
                    {/*检查是否为UC浏览器，如果是，页面低部显示温馨提示*/}
                    {navigator.userAgent.indexOf("UCBrowser") !== -1 ?
                        <p className="tip">如多次刷新后无法显示验证码，请尝试更换谷歌浏览器重新登录</p> : null}
                </div>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(withRouter(NormalLoginForm));
export default class Login extends Component {
    render() {
        return (
            <div>
                <Navbar title="登录" back="/user"/>
                <WrappedNormalLoginForm/>
                <Footer/>
            </div>
        )
    }
}
