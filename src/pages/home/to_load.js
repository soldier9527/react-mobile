import React, { Component, } from 'react'
import '../../css/to_load.scss'
export default class To_load extends Component{
    constructor(props){
        super(props);
        this.state={
            span:0,
        }
    }
    componentDidMount() {
        this.timer = setTimeout(() => {
            this.props.history.push("/guidance")
        }, 3000);
        this.timer=setInterval (()=>{
            this.setState({span:this.state.span+Math.floor(Math.random()*23+2)})
        },500)
    }
    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }
    render(){
        return(
            <div><div className="aaa"></div>
                <div className="bbb"></div>
                <span className="span2">{this.state.span}%</span>
            </div>
        )
    }
}