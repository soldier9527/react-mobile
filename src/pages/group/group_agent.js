import React, {Component, PropTypes} from 'react';


import Modal from 'antd/lib/modal';
import  Select from 'antd/lib/select';
import  message from 'antd/lib/message';
import Navbar from '../common/navbar';
import Api from '../api';

export default class Group_agent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prizeData: [],
            prizeMode: '输入奖金/赔率',
            userName: "",
            pwd: "",
            repwd: "",
            inputValue: "",
            // fixation_odds:'',//是否默认赔率总代
        }
    }

    componentWillMount() {
        this.getRegChild();
    }

    getRegChild() {
        Api("c=user&a=regChild", null, (res) => {

            let data = res.data;
            //后台异常信息
            let error = res.errstr;

            //服务状态(0/成功)
            let status = res.errno;
            if (status > 0) {
                Modal.error({
                    title: '新增代理' + error
                });
            } else {
                this.setState({
                    prizeData: data.prizes,
                })

            }
        })

    }

    handleChange(field, value) {
        this.setState({
            [field]: value
        });
    }

    handleSelectClick(value) {
        this.setState({
            prizeMode: value,
        });
    }

    handleClick() {
        if (this.state.userName == "") {
            message.error("请输入用户名");

            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            return;
        }
        if (this.state.prizeMode == "" || this.state.prizeMode == "输入奖金/赔率") {
            message.error("请选择返点");
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            return;
        }
        if (this.state.pwd == "") {
            message.error("请输入密码");
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            return;
        }
        if (this.state.repwd == "") {
            message.error("请输入确认密码");
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            return;
        }
        if (this.state.pwd != this.state.repwd) {
            message.error("两次输入密码不一致");
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            return;
        }

        const user = JSON.parse(sessionStorage.getItem("user"));
        Api("c=user&a=regChild", {
            username: this.state.userName,
            password: this.state.pwd,
            prize_mode: this.state.prizeMode,
            user_id: user.user_id
        }, (res) => {

            let data = res.data;

            //后台异常信息
            let error = res.errstr;

            //服务状态(0/成功)
            let status = res.errno;
            if (status > 0) {

            } else {
                Modal.success({
                    content: '新增代理' + res.errstr
                });
                this.setState({
                    prizeMode: '输入奖金/赔率',
                    userName: "",
                    pwd: "",
                    repwd: "",
                    inputValue: null
                });
                this.refs.un.value = "";
                this.refs.pwd.value = "";
                this.refs.repwd.value = "";
            }
        })

    }

    render() {
        let children = [];
        for (let i = 0; i < this.state.prizeData.length; i++) {
            children.push(<Select.Option
                key={this.state.prizeData[i].prizeMode}>{this.state.prizeData[i].rebate + '%'}</Select.Option>);

        }
        return (
            <div>
                <Navbar title="新增下级代理" back="/group"/>
                <div className="group_agent">
                    <p><span>代理开户</span></p>
                    <div className="group_agent_top">
                        <ul>
                            <li className="bottom_border"><span className="fl">用户名</span><input ref="un"
                                                                                                onChange={(e) => this.handleChange('userName', e.target.value)}
                                                                                                className="input fr"
                                                                                                style={{fontSize: "100%"}}
                                                                                                type="text"
                                                                                                defaultValue={this.state.inputValue}
                                                                                                placeholder="请输入用户名"/>
                            </li>
                            <li className="bottom_border"><span className="fl">用户返点</span>
                                <Select size="small" ref="sele" defaultValue="请选择返点"
                                        onChange={this.handleSelectClick.bind(this)}
                                        style={{width: "2.5rem", float: "right", marginTop: "0.2rem"}}>
                                    {children}
                                </Select>
                            </li>
                            <li><span className="fl">奖金/赔率</span>
                                <div style={{
                                    color: "#D3D3D3",
                                    float: "right",
                                    marginRight: "0.6rem",
                                    fontSize: "0.35rem"
                                }}>{this.state.prizeMode}</div>
                            </li>

                        </ul>
                    </div>
                    <div className="group_agent_bottom">
                        <ul>
                            <li className="bottom_border"><span className="fl">密码</span><input ref="pwd"
                                                                                               className="input fr"
                                                                                               onChange={(e) => this.handleChange('pwd', e.target.value)}
                                                                                               type="password"
                                                                                               placeholder="请输入密码"
                                                                                               style={{fontSize: "100%"}}
                                                                                               defaultValue={this.state.inputValue}/>
                            </li>
                            <li><span className="fl">确认密码</span><input className="input fr" ref="repwd"
                                                                       onChange={(e) => this.handleChange('repwd', e.target.value)}
                                                                       type="password" placeholder="请输入确认密码"
                                                                       style={{fontSize: "100%"}}
                                                                       defaultValue={this.state.inputValue}/></li>
                        </ul>
                    </div>
                    <div className="bonusodds">

                        <button type="submit" onClick={this.handleClick.bind(this)}>确认开户</button>

                    </div>
                </div>
            </div>
        );
    }
}
