import React, { Component } from 'react';
export default class Animate extends Component {
    constructor(props) {
        super(props);
        this.state={
            transform: ""
        }
    }
    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                transform: "translate3d(0px, -4040px, 0px)"
            });
        },0);
    }
    render() {
        let numArr = this.props.numArr;
        let transform = this.state.transform;
        let numRender = [];
        let normal = [];

        if(!this.props.stop){
            for(let i=0;i<10;i++){
                for(let j=0;j<10;j++){
                    normal.push(<i key={Math.random()*10000}>{j}</i>);
                }
            }
            numArr.map((item,i)=>{
                numRender.push(
                    <div key={i} className="num" >

                    <span style={{
                        transition: 'all '+(.9+i*.5)+'s ease-in .1s',
                        transform: transform
                    }}>
                        <i key={Math.random()*10000}> </i>
                        {normal}
                        <i key={Math.random()*10000}>{item}</i>
                    </span>
                    </div>
                )
            });
        }else{
            numArr.map((item,i)=>{
                numRender.push(
                    <div key={i} className="num" >
                        <span>
                            <i key={Math.random()*10000}>{item}</i>
                        </span>
                    </div>
                )
            });
        }


        return (
                <div className="open-animation-content">
                    {numRender}
                </div>
        );
    }
}

