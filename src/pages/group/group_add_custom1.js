import React, {Component, PropTypes} from 'react';
import  Select from 'antd/lib/select';
import  Radio from 'antd/lib/radio';
import  Tooltip from 'antd/lib/tooltip';
import  message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import Navbar from '../common/navbar';
import Api from '../api';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Toast} from  "antd-mobile";
//复制
var QRCode = require('qrcode.react');


export default class Group_add_custom1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkAdd: '请生成推广链接',
            SpreadNum: "",
            equp: "1",
            prizeMode: "",
            prizeData: [],
            visb: "none",
            disabled: false,
            flag: '1'//m默认会员1或者代理2
        }
    }

    componentWillMount() {
        this.getRegChild();
    }

    onError() {
        Toast.fail('请先生成推广链接', 1);
    }

    onCopy() {
        this.setState({
            copied: true
        })
        Toast.success('复制成功', 1);

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
                    title: '新增会员' + error
                });
            } else {

                this.setState({
                    prizeData: data.prizes
                })

            }
        })

    }

    handleClick() {
        if (this.state.SpreadNum == "") {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error("请输入推广码");
            return;
        }
        if (this.state.prizeMode == "") {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error("请选择返点");
            return;
        }
        const user = JSON.parse(sessionStorage.getItem("user"));
        let host = window.location.host;
        Api("c=user&a=makeLink", {
            market_code: this.state.SpreadNum,
            prize_mode: this.state.prizeMode,
            user_id: user.user_id,
            domain: host,
            flag: this.state.flag
        }, (res) => {
            let data = res.data;
            //后台异常信息
            let error = res.errstr;

            //服务状态(0/成功)
            let status = res.errno;
            if (status > 0) {
            } else {

                this.setState({
                    linkAdd: data.link + "#/register",
                    visb: "block",
                    disabled: true
                })

            }
        })

    }

    handleChange() {
        let input = this.refs.myInput.value;
        this.setState({
            SpreadNum: input,
        });
    }

    handleRadioChange(value) {
        this.setState({
            SpreadNum: value.target.value,
            flag: value.target.value ? value.target.value : 1
        });
        const user = JSON.parse(sessionStorage.getItem("user"));
        Api("c=user&a=getRebatePrizeAjax", {flag:value.target.value ,user_id: user.user_id}, (res) => {
            if(res.errno==0){
                let data = res.data;
                let value =this.state.prizeMode;
                for (var i = 0; i < data.length; i++) {
                    let prizeDate = data[i];
                    if (prizeDate.prizeMode == value) {
                        if (prizeDate.link) {
                            this.refs.myInput.value = prizeDate.market_code;
                            this.setState({
                                linkAdd: prizeDate.link + "#/register",
                                visb: 'block',
                                disabled: true
                            });
                        } else {
                            this.refs.myInput.value = "";
                            this.setState({
                                linkAdd: '请生成推广链接',
                                visb: 'none',
                                disabled: false
                            })
                        }
                    }
                }
            }
        })
    }

    handleSelectClick(value) {//value为奖金组，即1990
        this.setState({
            prizeMode: value,
        });
        const user = JSON.parse(sessionStorage.getItem("user"));
        Api("c=user&a=getRebatePrizeAjax", {flag:this.state.flag ,user_id: user.user_id}, (res) => {
            if(res.errno==0){
                let data = res.data;
                for (var i = 0; i < data.length; i++) {
                    let prizeDate = data[i];
                    if (prizeDate.prizeMode == value) {
                        if (prizeDate.link) {
                            this.refs.myInput.value = prizeDate.market_code;
                            this.setState({
                                linkAdd: prizeDate.link + "#/register",
                                visb: 'block',
                                disabled: true
                            });
                        } else {
                            this.refs.myInput.value = "";
                            this.setState({
                                linkAdd: '请生成推广链接',
                                visb: 'none',
                                disabled: false
                            })
                        }
                    }
                }
            }
        })
    }

    render() {
        const RadioGroup = Radio.Group;
        let children = [];
        for (let i = 0; i < this.state.prizeData.length; i++) {
            children.push(<Select.Option
                key={this.state.prizeData[i].prizeMode}>{this.state.prizeData[i].prizeMode}/{this.state.prizeData[i].rebate+'%'}</Select.Option>);
        }

        return (
            <div>
                <Navbar title="新增下级用户链接" back="/group"/>
                <div className="behindNavbar" style={{background: "transparent", height: "14rem"}}>

                    <div className="group_add_custom_detail">
                        <p style={{fontSize: "0.475rem"}}>推广信息</p>

                        <div className="promotion">
                            <div className="promotion_type">
                                <div className="checkboxflex">
                                    <RadioGroup onChange={this.handleRadioChange.bind(this)} name="radiogroup"
                                                style={{width: "100%", paddingTop: "0.35rem"}}
                                                defaultValue={this.state.equp}>
                                        <span>会员</span> <Radio value="1" style={{float: "right"}}></Radio>
                                        <br/>
                                        <br/>
                                        <hr/>
                                        <br/>

                                        <span>代理</span> <Radio value="2" style={{float: "right"}}></Radio>
                                    </RadioGroup>
                                    <br/>
                                    <br/>
                                    <hr/>
                                    <br/>
                                    <span>返点</span>
                                    <div style={{float: "right"}}>

                                        <Select size="small" defaultValue="请选择返点"
                                                onChange={this.handleSelectClick.bind(this)} style={{width: "3rem"}}>
                                            {children}
                                        </Select>

                                    </div>
                                    <br/>
                                    <br/>
                                    <hr/>
                                    <br/>
                                    <span style={{position: "relative", bottom: "0.25rem"}}>推广码</span>
                                    <Tooltip
                                        trigger={['focus']}
                                        title="请输入3-10位数字或字母组合"
                                        placement="topLeft"
                                        overlayClassName="numeric-input"
                                    >
                                    <input ref="myInput" type="text" placeholder="请输入推广码"
                                           onChange={this.handleChange.bind(this)} style={{
                                        float: "right",
                                        border: "0px",
                                        backgroundColor: "transparent",
                                        width: "2.3rem"
                                    }}/>
                                    </Tooltip>
                                </div>
                            </div>


                        </div>
                        <div className="bonusodds">

                            <button type="submit" onClick={this.handleClick.bind(this)}>{this.state.linkAdd=="请生成推广链接"?"生成":"重新生成"}</button>

                        </div>
                        <div className="promotionnumber" style={{display:this.state.linkAdd=="请生成推广链接"?'none':'block'}}>

                            <span style={{fontSize: "0.475rem"}}>推广链接</span>

                        </div>
                        <div className="promoArea" style={{display:this.state.linkAdd=="请生成推广链接"?'none':'block'}}>
                            <div className="promoLink">
                                <br/>
                                <span>推广链接</span>
                                <CopyToClipboard
                                    text={this.state.linkAdd}
                                    onCopy={() => {
                                        if (this.state.linkAdd == "请生成推广链接") {
                                            this.onError()
                                        } else {
                                            this.onCopy()
                                        }
                                    }}>
                                    <input type="button" value="复制" className="ccopy"/>
                                </CopyToClipboard>
                                <p>{this.state.linkAdd}</p>
                                <hr style={{marginRight: "0.346875rem", marginTop: "0.3rem"}}/>
                            </div>

                            <div className="wechaterweima" style={{display: this.state.visb}} >
                                <QRCode value={this.state.linkAdd}/>
                            </div>
                        </div>
                    </div>
                    <br/>

                </div>


            </div>


        )
    }
}
