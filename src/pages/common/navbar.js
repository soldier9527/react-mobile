import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import config from '../config'
class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state={
            navbarRight:null,//右侧渲染
        }
    }
    back(){
        if(config.isAPP){
            if(window.embed){
                window.embed.close();
                window.embed=null;
            }else if(this.props.back==="back"){//各个页面自己设置回退，
                this.props.history.goBack()
            }else{
                this.props.history.push(this.props.back)
            }
        }else{
            if(this.props.back==="back"){//各个页面自己设置回退，
                this.props.history.goBack()
            }else{
                this.props.history.push(this.props.back)
            }
        }
    }
    render() {
      let title = '';
      if(this.props.title) {
        if (this.props.navBarClick) {
            title = <span className="title" onClick={this.props.navBarClick}>{this.props.title}</span>
        } else {
          title = <span className="title">{this.props.title}</span>
        }
      }

      //back判断路由
        //backFunc判断方法
      return (
        <div className="navbar" >
            { this.props.back ? <div onClick={()=>{this.back()}} className="fl"><i className="arrow-left"></i></div>
                : null }
            { this.props.backFunc ? <div onClick={()=>{this.props.backFunc()}} className="fl"><i className="arrow-left"></i></div>
                : null }
            <span >{ title }</span>
            {this.props.navbarRight?<div className="navbar-right">
                {this.props.navbarRight}
            </div>:null}

        </div>
      )
    }
}
export default withRouter(Navbar)