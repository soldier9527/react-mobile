import React, { Component} from 'react';
import {Link} from 'react-router-dom';
import Navbar from '../common/navbar';
import Api from '../api';


export default class ReceiveBoxDetail extends Component {
	constructor(props) {
		super(props);
    this.state={
       text:"",title:"",create_time:""
    }
	}
	componentWillMount(){
    this.getList();
		this.infoRead();
	}
   getList(){
     let id=this.props.location.query;
     Api("c=user&a=receiveBox",{curPage:1,op:"msgInfo",msg_id:id.msg_id},(e)=>{
					 this.setState({
		           text:e.data.content,
							 title:e.data.title,
							 create_time:e.data.create_time
		       });
     })
   }
	 infoRead(){
		 let has_read=this.props.location.query.has_read;
		 if(has_read==0){
			 let id=this.props.location.query;
			 let mt_ids=[];
			 mt_ids.push(id.mt_id);
			 Api("c=user&a=receiveBox",{curPage:1,
				 op:"readed",
				 mt_ids:mt_ids
			 },(e)=>{
			 })
		 }
	 }
	render() {
    let html=this.state.text;
		let title=this.state.title;
		let create_time=this.state.create_time;
		return (
      <div>
            <Navbar  title={this.state.title} back="/receiveBoxList"/>
            <div className="informationDetail">
							<div className="infoTitle">
								<p>{title}</p>
								<p>{create_time}</p>
							</div>
             <div className="infoContent textIndent" dangerouslySetInnerHTML={{__html: html}}></div>
            </div>
      </div>
		);
	}
}
