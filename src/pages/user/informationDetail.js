import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Navbar from '../common/navbar';
import Api from '../api';


export default class InformationDetail extends Component {
	constructor(props) {
		super(props);
    this.state={
       text:"",title:""
    }
	}
	componentWillMount(){
    this.getList()
	}
   getList(){
     let id=this.props.location.query;
     Api("c=help&a=latestNew&article_id="+id.article_id,null,(e)=>{
       this.setState({
           text:e.data.content,title:e.data.title
       })
     })
   }
	render() {
    let html=this.state.text;
		return (
      <div>
            <Navbar  title={this.state.title} back="/informationList"/>
            <div className="informationDetail">
             <div className="infoContent" dangerouslySetInnerHTML={{__html: html}}></div>
            </div>
      </div>
		);
	}
}
