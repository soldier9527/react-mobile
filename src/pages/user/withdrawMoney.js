import React, { Component, PropTypes } from 'react';
import Navbar from '../common/navbar';
import Api from '../api';
import MaskLoading from '../common/maskLoading';
import  message from 'antd/lib/message';
import ReactDOM from 'react-dom';

//提现
export default class WithDrawMoney extends Component {
	constructor(props) {
		super(props);
		this.state={
            bind_card_id: 0,
            bank_id: 0,
            bank_username: "",
            card_num: "",
            bankName: "",
            amount: ""
		}
	}
	componentWillMount(){
        this.getUserInfo();
	}

	getUserInfo(){
        Api("c=fin&a=withdraw",null,(res)=>{
            if(res.errno !==0){

				if(res.errno === 7009){//未绑定银行卡
                    setTimeout(()=>{
                        this.props.history.push("bankCardBind");
                    },1000)
				}else{//未设置密码跳
                    setTimeout(()=>{
                        this.props.history.push("setpassword");
                    },1000)
				}
            }else{
                this.setState({
                    bind_card_id: res.data.bind_card_id,
                    bank_id: res.data.bank_id,
                    bank_username: res.data.bank_username,
                    card_num: res.data.card_num,
                    bankName: res.data.bankName,
                    amount: res.data.amount
                })
            }
        });
	}
    handleSubmit(){
		let money = ReactDOM.findDOMNode(document.getElementById("money")).value;
		let password = ReactDOM.findDOMNode(document.getElementById("password")).value;

		if(!/^[0-9]+(.[0-9]{1,2})?$/.test(money)){//判断数字
            message.info("请输入正确的提现金额,最多保留两位小数 !!!",2);
            return false;
		}else if(password.length<6||password.length>16){
            message.info("请输入正确的密码",2);
            return false;
		}
        MaskLoading(3);
        let data=JSON.parse(sessionStorage.getItem("user"));
		let state = this.state;
        Api("c=fin&a=withdraw&sid="+data.sid+"&user_id="+data.user_id,{
            user_id:data.user_id,
            is_wap:1,
            bind_card_id:state.bind_card_id,
            bank_id:state.bank_id,
            withdraw_amount:money,
            secpwd:password.trim()

        },(res)=>{
            MaskLoading(0);
            if(res.errno ===0){
            	//境外检测
                Api("c=fin&a=withdrawIpChk&remind=0",{
                    user_id:data.user_id,
                    withdraw_id:res.data.withdraw_id,

                },(res)=>{});

                message.success("您的提款订单已经成功提交",2);
                this.props.history.push("user_login");
            }
        });

	}

    render() {
		return (
			<div>
				<Navbar back='back' title="提现"/>
				<div className="withdraw-warp">
                    {/*防止填充表单 start*/}
                    <input type="password" className="auto-complete-input"/>
                    {/*防止填充表单 end*/}
					<div className="withdraw-info">
						<ul>
							<li >
								<span>账户余额</span>
								<i className="money">￥{this.state.amount}</i>
							</li>
							<li >
								<span>提现银行卡</span>
								<i>{this.state.bankName}</i>
							</li>
							<li >
								<span>姓名</span>
								<i>{this.state.bank_username}</i>
							</li>
							<li >
								<span>卡号</span>
								<i>{this.state.card_num}</i>
							</li>
						</ul>
					</div>
					<div className="withdraw-info">
						<ul>
							<li>
								<span>可提金额</span>
								<input type="number"  id="money" placeholder="请输入提现金额（元）"/>
							</li>
						</ul>
					</div>
					<div className="withdraw-info">
						<ul>
							<li>
								<span>资金密码</span>
								<input type="password" id="password" placeholder="请输入资金密码"/>
							</li>
						</ul>
					</div>
					<div className="withdraw-btn-wrap">
						{/*<div className="clearF">*/}
							{/*<p className="fr red">提现说明</p>*/}
						{/*</div>*/}

						<button className="submit-btn" onClick={this.handleSubmit.bind(this)} >确认</button>
					</div>
				</div>
			</div>
		);
	}
}
