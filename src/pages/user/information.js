import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Icon} from 'antd';
import Navbar from '../common/navbar';
import Api from '../api';

export default class Information extends Component {
	constructor(props) {
		super(props);
		this.state={
			receiveBoxTitle:"暂无未读消息",
			latestNewTitle:"暂无热点消息",
			iconClass:"lt-mail"
		}
	}
	componentWillMount(){
		this.receiveBox();
		this.latestNew();
	}

receiveBox(){
	Api("c=user&a=receiveBox&curPage=1",null,(e)=>{
		if(e.data){
			let data=e.data;
			let len=data.length;
			//map循环无法终止，故使用for循环
			for(let i=0;i<len;i++){
				if(data[i].has_read === 0){//如果有未读消息
					 this.setState({
						receiveBoxTitle:"您有最新系统消息未查看",
						iconClass:"lt-mail_red"
					});
					return;
				}
			}
		}
 })
}

latestNew(){
	Api("c=help&a=latestNew&curPage=1",null,(e)=>{
		if(e.data){
			this.setState({
			 latestNewTitle:e.data[0].title
		 })
		}
 })
}

	render() {
let latestNewTitle=this.state.latestNewTitle;
let receiveBoxTitle=this.state.receiveBoxTitle;
let iconClass=this.state.iconClass;
		return (
			<div>
         <Navbar  title="信息中心" back="/user_login"/>
          <div className="information">
							<ul>

									<li className="li_stely_short"><span>公共消息</span></li>
									<li className="li_stely" >
											<Link to="informationList">
											    <div className="left">
		                           <i className="lt-mail"></i>
													</div>
													<div className="right">
		                            <p><span>今日热点</span></p>
																<p>{latestNewTitle}</p>
													</div>
													<i className="fr"><Icon type="right" /></i>
		                  </Link>
									</li>
									<li className="li_stely">
									    <Link to="receiveBoxList">
													<div className="left">
															 <i className={iconClass}></i>
												  </div>
													<div className="right">
		                           <p><span>系统消息</span></p>
															 <p>{receiveBoxTitle}</p>
													</div>
													<i className="fr"><Icon type="right" /></i>
											</Link>
									</li>
							</ul>
					</div>
			</div>
		);
	}
}
