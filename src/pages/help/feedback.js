import React, { Component} from 'react'
import {Link } from 'react-router-dom';
import {Radio ,  Modal} from 'antd';
import {message} from 'antd';
import Navbar from '../common/navbar';
import Api from '../api';

const RadioGroup = Radio.Group;

export default class Feedback extends Component {
    constructor(props) {
        super(props);
        let data=JSON.parse(sessionStorage.getItem("user"));
        this.state = {
            type:1,
            value:1,
            value1:"",
            userMessage:data
        };
        this.onChange1 = this.onChange1.bind(this);
        this.content = this.content.bind(this);
        this.request = this.request.bind(this);
    }

    // 判断用户选定
    onChange1(e) {
        this.setState({
            value: e.target.value,
        });
        if(e.target.value==1){
             this.setState({
                 type:1
             })

        }else if(e.target.value==2){
            this.setState({
                type:2
            })
        }else if(e.target.value==0){
            this.setState({
                type:0
            })
        }
    }
    content(event){
        this.setState({value1: event.target.value});
    }
    request(){
        if(this.state.userMessage){
            Api("c=help&a=feedback",{user_id:this.state.userMessage.user_id,content:this.state.value1,type:this.state.type},(e)=>{
                let text=  this.refs.text.value;
                if(text.length<10){
                    message.warning("请输入不少于10位字符");
                    return;
                }
                //服务状态(0表表示成功)
                let state = e.errno;
                //异常信息
                if(state>0){
                    message.warning("您提交的信息不完整");
                }else{
                    Modal.success({
                        title: '提交成功',
                        onOk:()=>{
                            this.setState({
                                value1:""
                            })
                        }
                    });
                }
            })
        }
    }


    render() {
        const radioStyle = {
            width:'100%',
        };
        return (
          <div>
             <Navbar title="意见反馈" back="setting"/>
             <div onClick={this.request}><Link to={this.state.userMessage?"feedback":"login"}><span  className="top_right">提交</span></Link></div>
             <div className="feedback">
                <form action="" method="">
                    <ul>
                        <li className="li_bc bottom_border"><span>(必选)请选择您想反馈的问题点</span></li>
                        <RadioGroup onChange={this.onChange1} value={this.state.value} style={radioStyle}>
                            <li className="bottom_border">
                                <Radio value={1} ><span>功能异常：功能故障或不可用</span></Radio>
                            </li>
                            <li className="bottom_border">
                                <Radio value={2}>产品建议：用的不爽，我有建议</Radio>
                            </li>
                            <li className="bottom_border">
                                <Radio value={0}>其他问题</Radio>
                            </li>
                        </RadioGroup>
                        <li className="li_bc"><span>请补充详细问题和意见(必填)</span></li>
                        <li className="textarea">
                            <textarea placeholder="请输入不少于10个字的描述" rows="4" cols="50"  value={this.state.value1} onChange={this.content} ref="text"></textarea>
                        </li>
                    </ul>
                </form>
             </div>
          </div>
        )
    }
}
