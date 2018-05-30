import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
class GlobalMessage extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="globalMessage">
                <div className="message-notice-content">
                    <div className={"message-"+this.props.type}><i
                        className="anticon anticon-exclamation-circle"></i><span>{this.props.text}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default function ShowMessage(text="",type="success",time=3) {

    let body = document.body;
    let showDom;
    if(document.getElementsByClassName("globalMessage")&&document.getElementsByClassName("globalMessage")[0]){
        try{
            let dom = document.getElementsByClassName("globalMessage");
            dom.map((item)=>{
                body.removeChild(item);
            })
        }catch (err){

        }

        showDom = document.createElement("div")

    }else{
        showDom = document.createElement("div")
    }
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