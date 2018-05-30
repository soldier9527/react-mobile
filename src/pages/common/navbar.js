import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state={
            displayDrop:"none",//默认隐藏

            navbarRight:null,//右侧渲染
        }
    }
    componentWillMount(){
       
    }
    //选中
    select(index){
        this.props.change(index);
        this.setState({
            displayDrop:"none"
        })
    }
    //显示，隐藏下拉框
    toggleDrop(){
        this.setState({
            displayDrop:this.state.displayDrop==="none"?"block":"none"
        })
    }
    back(){
        if(this.props.back==="back"){//各个页面自己设置回退，
            // console.log(this.props.history)
            this.props.history.goBack()
        }else{
            this.props.history.push(this.props.back)
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
      let randerDropdown ="";
      if(this.props.dropdown){
          let arr =[];
          //渲染下拉
          for (let [index,item] of this.props.dropdown){
              arr.push(
                  <li className={this.props.id==index?"dropdown-select":""} key={index} onClick={()=>{this.select(index)}} >
                      {item}
                  </li>
              );
          }
          randerDropdown = <div>
            <div className="dropdown-wrap" onClick={()=>{this.setState({displayDrop:"none"})}} style={{display:this.state.displayDrop,height:document.documentElement.clientHeight+"px"}}>
              <ul>
                  {arr}
              </ul>
            </div>
          </div>
      }
      //back判断路由
        //backFunc判断方法
      return (
        <div className="navbar" >
            { this.props.back ? <div onClick={()=>{this.back()}} className="fl"><i className="arrow-left"></i></div>
                : null }
            { this.props.backFunc ? <div onClick={()=>{this.props.backFunc()}} className="fl"><i className="arrow-left"></i></div>
                : null }
            {/*onClick={this.props.overlay}*/}
            <span onClick={()=>{this.toggleDrop()}}>{ title }</span>
            {randerDropdown}
            {this.props.navbarRight?<div className="navbar-right">
                {this.props.navbarRight}
            </div>:null}

        </div>
      )
    }
}
export default withRouter(Navbar)