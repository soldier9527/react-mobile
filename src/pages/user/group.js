import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router-dom';
import Navbar from '../common/navbar';

export default class Group extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
         <Navbar  title="代理中心" back={"/user_login"}/>
            <div className="group">
								<ul>
									 <li><Link to="group_recharge1"><i className="icon_reacharge icon fl"></i><span>团队充值明细</span><i className="arrow-right fr"></i></Link></li>
									 <li><Link to="group_withdraw1"><i className="icon_withdraw icon fl"></i><span>团队提现明细</span><i className="arrow-right fr"></i></Link></li>
									 <li><Link to="group_profit1"><i className="icon_profit icon fl"></i><span>投注盈亏报表</span><i className="arrow-right fr"></i></Link></li>
									 <li><Link to="group_profit_change1"><i className="icon_profit_change icon fl"></i><span>团队帐变报表</span><i className="arrow-right fr"></i></Link></li>
									 <li><Link to="group_custom1"><i className="icon_custom icon fl"></i><span>用户管理</span><i className="arrow-right fr"></i></Link></li>
									 <li><Link to="group_add_custom1"><i className="icon_add_custom icon fl"></i><span>新增下级用户</span><i className="arrow-right fr"></i></Link></li>
									 <li><Link to="group_agent"><i className="icon_agent icon fl"></i><span>新增下级代理</span><i className="arrow-right fr"></i></Link></li>
									<li><Link to="Agency_explain"><i className="icon_agent icon fl"></i><span>代理说明</span><i className="arrow-right fr"></i></Link></li>
							 </ul>
            </div>
			</div>
		);
	}
}
