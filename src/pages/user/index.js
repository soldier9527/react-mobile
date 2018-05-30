import React, { Component, PropTypes } from 'react'
import {Link} from 'react-router-dom';
import  Row from 'antd/lib/row';
import  Col from 'antd/lib/col';
import Footer from '../common/footer';
import Navbar from '../common/navbar';


export default class User extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount(){
		this.changeSessionstorage();
	}

	/** render前设置jumpPage为个人中心 **/
	changeSessionstorage(){
		sessionStorage.setItem("jumpPage","个人中心");
	}

	render() {
		return (
			<div>
			 <Navbar  title="我的" navbarRight={<Link to="setting"><i className="lt-mysetting"></i></Link>} />
				<div className="user fadeInRight">
					<div className="info">
						<div className="login-reg">
							<div >
									<div>
									   <Link to="login">登录</Link> / <Link to="login">注册</Link>
									</div>
							</div>
						</div>
					</div>
					<div className="btns">
						<Row className="row">
							<Col className="col" span={8}>
								<Link to="login">
									<i className="icon-deposit"></i>
									<span>充值</span>
								</Link>
							</Col>
							<Col className="col" span={8}>
								<Link to="login">
									<i className="icon-withdrawal"></i>
									<span>提款</span>
								</Link>
							</Col>
							<Col className="col" span={8}>
								<Link to="login">
									<i className="icon-orders"></i>
									<span>注单</span>
								</Link>
							</Col>
						</Row>
						<Row className="row">
							<Col className="col" span={8}>
								<Link to="login">
									<i className="icon-account"></i>
									<span>个人帐变</span>
								</Link>
							</Col>
							<Col className="col" span={8}>
								<Link to="login">
									<i className="icon-team"></i>
									<span>代理中心</span>
								</Link>
							</Col>
							<Col className="col" span={8}>
								<Link to="login">
									<i className="icon-message"></i>
									<span>系统信息</span>
								</Link>
							</Col>
						</Row>
					</div>
					<ul className="list">
					    <li>
								<Link to="getService">
									<i className="icon_service fl"></i>
									<span>在线客服</span>
									<i className="arrow-right fr"></i>
								</Link>
							</li>
							<li className="bottom_border"><Link to="promo/user"><i className="active_center_icon fl"></i><span>活动中心</span><i className="arrow-right fr"></i></Link></li>
					</ul>
				</div>
				<Footer />
			</div>
		);
	}
}
