import React, { Component } from 'react';
import Navbar from '../common/navbar';
import "../../css/vindicate.scss"
import config from '../config';
import Api from "../api";
export default class Vindicate extends Component {
    constructor(props){
        super(props);
        this.state={
            data:this.props.location.state
        }

    }



    componentDidMount(){

        //只要是维护的情况下任何接口返回的都是99999
        Api("c=help&a=getService", null,  (res)=> {
            if(res.errno!==99999){
               this.props.history.push('/home')
            }
        })
        
    }


    render(){


        return(
            <div  className="vindicate">
                <Navbar title={config.title} />
                <h1>系统维护中</h1>
                <p>{this.state.data.content}</p>
                <label>维护时间:{this.state.data.time}</label>
                <p><b><a href={this.state.data.localtion}>在线客服</a></b></p>
                <i className="img"></i>
            </div>

        )
    }
}

