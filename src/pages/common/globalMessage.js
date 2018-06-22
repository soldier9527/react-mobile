import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

class GlobalMessage extends Component {
    constructor(props) {
        super(props);
        this.state={
            show:true
        }
    }
    handleHide(){
        this.setState({
            show:false
        })
    }
    render() {
        return (
            this.state.show?<div className="globalMessage" onClick={this.handleHide.bind(this)}>
                <div className="message-notice-content">
                    <div className={"message-"+this.props.type}><i
                        className="anticon anticon-exclamation-circle"></i><span>{this.props.text}</span>
                    </div>
                </div>
            </div>:null

        )
    }
}
/**
 * type 可选
 * info
 * success
 * error
 * warning
 * */
export default function ShowMessage(text="",type="success",time=3) {
    let body = document.body;
    let showDom;
    let dom = document.getElementsByClassName("globalMessage");
    if(dom){
        for(let i=0;i<dom.length;i++){
            if(dom[i]){
                dom[i].remove();
            }
        }
    }
    showDom = document.createElement("div")
    setTimeout(()=>{
        if(showDom){
            body.removeChild(showDom);
        }
    },time*1000);
    body.appendChild(showDom);
    ReactDOM.render(
        <GlobalMessage type={type} text={text} />,
        showDom
    );
}