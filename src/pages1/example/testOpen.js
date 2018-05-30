import React, { Component } from 'react';
import "./css/testOpen.scss"

export default class TestOpen extends Component {
    constructor(props) {
        super(props);
        this.state={
            numArr:[1,2,1,1,5]
        }
    }
    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                numArr:[2,2,1,1,5]
            })
        },3000)
    }
    render() {
        let open =  <OpenAnimate
            key={Math.random()*1000}
            numArr={this.state.numArr}
        />;


        return (
            <div className="testOpen">
                {open}
            </div>
        );
    }
}


class OpenAnimate extends Component {
    constructor(props) {
        super(props);
        this.state={
            transform: ""
        }
    }
    componentDidMount(){
            setTimeout(()=>{
                this.setState({
                    transform: "translate3d(0px, -2020px, 0px)"
                });
            },0);
    }
    render() {
        let numArr = this.props.numArr;
        let transform = this.state.transform;
        let numRender = [];
        let normal = [];
        for(let i=0;i<10;i++){
            for(let j=0;j<10;j++){
                normal.push(<i key={Math.random()*10000}>{j}</i>);
            }
        }
        numArr.map((item,i)=>{
            numRender.push(
                <div key={i} className="num" >
                    <i key={Math.random()*10000}> </i>
                    <span style={{
                        transition: 'all '+(.9+i*.1)+'s ease-in .1s',
                        transform: transform
                    }}>
                        {normal}
                        <i key={Math.random()*10000}>{item}</i>
                    </span>
                </div>
            )
        });


        return (
            <div className="testOpen">
                <div className="mmc-animation-content">
                    {numRender}
                </div>
            </div>
        );
    }
}

