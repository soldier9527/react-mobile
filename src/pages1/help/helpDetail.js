import React, { Component} from 'react';
import Navbar from '../common/navbar';
import Api from '../api';


export default class HelpDetail extends Component {
	constructor(props) {
		super(props);
    this.state={
       text:"",
        title:"",
    }
	}
	componentWillMount(){
    this.getList()
	}
   getList(){
     let id=this.props.location.query.id;
     if(id==1){
         this.state.title="安全相关";
     }else if(id==2){
         this.state.title="充值相关";
     }else if(id==3){
         this.state.title="购彩相关";
     }else if(id==4){
           this.state.title="提现相关";
       }else if(id==5){
         this.state.title="用户协议";
     }else if(id==6){
         this.state.title="责任声明";
     }
     var self=this;
     let user=JSON.parse(sessionStorage.getItem("user"));
     Api("c=help&a=doc&type="+id,null,function(e){
       self.setState({
           text:e.data.html
       })
     })
   }
	render() {
    let html=this.state.text;
		return (
      <div>
            <Navbar  title={this.state.title} back="help"/>
            <div className="helpDetail">
             <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>
            </div>
      </div>
		);
	}
}
