import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router-dom';
import { Carousel, Icon, Row, Col } from 'antd';
import Navbar from '../common/navbar';
import PayNav from '../common/paynav';
import Api from '../api';

export default class Ours extends Component {
	constructor(props) {
		super(props);
    this.state={data:""}
	}

  componentDidMount(){
		this.ours()
	}
	ours(){
		var self=this;
		Api("c=help&a=aboutme",null,function(e){
		 self.setState({ data:e.data.html})
	 })
	}

	render() {
  let html=this.state.data;
		return (
			<div>
         <Navbar  title="关于我们" back="setting"/>
         <div className="ours" dangerouslySetInnerHTML={{__html: html}}></div>
			</div>
		);
	}
}

