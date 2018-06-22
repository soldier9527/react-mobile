import React, {Component,} from 'react'
import {Button} from 'antd';
import "./guidance.scss"

export default class Guidance extends Component {
    constructor(props) {
        super(props);
    }
    handleContinue(){
        this.props.history.push("/home")
    }
    render() {
        return (
            <div className='guidance'>
                <Button onClick={this.handleContinue.bind(this)} className="guidance-btn continue-btn">继续访问</Button>
            </div>
        )
    }
}
