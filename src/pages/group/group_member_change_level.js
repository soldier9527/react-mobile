import React,{Component} from 'react';
import Navbar from '../common/navbar';
import {Link,hashHistory} from 'react-router-dom';
import Api from '../api';
import { Col,Select,message,Modal,Form} from 'antd';

const confirm = Modal.confirm;

export default class Group_member_change_level extends Component{
    constructor(props){
        super(props);
        this.state={
            prizeData:[],
            prizeMode:"",
            userName:"",
            pwd:"",
            repwd:"",
            inputValue:"",
        }
    }

    getRegChild(){
        let userId=this.props.params.memberId;
        let param="&user_id="+userId;
        Api("c=user&a=membershipTransferAgent"+param,null,(res)=>{
            let data=res.data.aPrizeMode;
            //后台异常信息
            let error = res.errstr;
            let status=res.errno;
            if(status>0){
                Modal.error({title:'转代理'+error})
            }else{
                let prizeMode=this.props.params.bonusOdds;
                prizeMode=prizeMode+"/"+(prizeMode/2);
                this.setState({
                    prizeMode:prizeMode,
                    prizeData:data
                })
            }
        })
    }

    componentWillMount(){
        this.getRegChild();
    }

    handleChange(field, value){
        this.setState({
            [field]: value
        });
    }

    handleSelectClick(value){
        let prizeMode=value;
        prizeMode=prizeMode+"/"+(prizeMode/2);
        this.setState({
            prizeMode:prizeMode,
        });
    }

    showConfirm() {   //警告弹窗
        let userId=this.props.params.memberId;
        let prizeMode=this.state.prizeMode;
        prizeMode=prizeMode.split("/")[0];
        confirm({
            title: '会员转代理',
            content: '您确定要把此会员转成代理吗？',
            onOk() {
                Api("c=user&a=membershipTransferAgent",{user_id:userId,prize_mode:prizeMode},(res)=>{
                    if(res.errno>0){
                        Modal.error({title:'确认转为代理'+error})
                    }else{
                        message.info(res.errstr);
                    }
                    setTimeout(()=>{
                        hashHistory.push("group_custom1");
                    },1000)
                })
            },
            onCancel() {
            },
        });
    }

    render(){
        let children = [];
        let rebate=this.props.params.rebate;
        let data=this.state.prizeData;
        let userId=this.props.params.memberId;
        let userName=this.props.params.memberName;
        let userLevel=this.props.params.memberLevel;
        let back="/group_member_detail/"+userId+"/"+userName+"/"+userLevel;
        for (let i in data) {
            children.push(<Select.Option key={i}>{data[i]}</Select.Option>);
        }
        return(
            <div className="change-level-page">
                <Navbar title="转代理" back={back} />
                <div className="change-level-content">
                    <p>会员转代理</p>
                    <p>
                        <span>用户名</span>
                        <span className="spanSecond">{userName}</span>
                    </p>
                    <p>
                        <span>用户返点</span>
                        <Select   size="small" ref="sele"  defaultValue={rebate}  onChange={this.handleSelectClick.bind(this)}  style={{ width: "1.5rem",float:"right",marginTop:"0.2rem",marginRight:"0.3rem"}} >
                            {children}
                        </Select>
                    </p>
                    <p>
                        <span>奖金/赔率</span>
                        <span className="spanSecond">{this.state.prizeMode}</span>
                    </p>
                    {/*<button onClick={this.changeToAgent.bind(this)}>确认转为代理</button>*/}
                    <button onClick={this.showConfirm.bind(this)}>确认转为代理</button>
                </div>

            </div>
        )
    }
}
