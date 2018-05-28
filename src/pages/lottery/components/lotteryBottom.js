import React, { Component } from "react";
import { PopupConfirm, Slider} from 'antd';
import ShowMessage from '../../common/globalMessage';
//底部投注条
export default class LotteryBottom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSafari:navigator.userAgent.indexOf("Safari") > -1
        }
    }
    componentWillUnmount() {
        window.removeEventListener('scroll',this.inputBlur);
    }
    handleFoucs(){
        if(!this.state.isSafari){
            setTimeout(()=>{
                window.addEventListener("scroll",this.inputBlur)
            },500);
        }

    }
    handleBlur(){
        if(!this.state.isSafari){
            setTimeout(()=>{
                window.removeEventListener("scroll",this.inputBlur)
            },500);
        }

    }

    inputBlur(){
        document.getElementById("jsInputMoney").blur()
    }
    //判断是否有返点
    hasFandian(){
        let lottery_id = parseInt(this.props.lottery_id);

        if([22,23].indexOf(lottery_id) !==-1){//22:双色球，23:幸运28
            return false
        }else if(this.props.md&&this.props.md.name==="TMZX"){
            return false
        }else{
            return true
        }
    }
    //禁用彩种弹窗
    disableMessage(){
        ShowMessage("该玩法没有返点","warning");
    }
    render(){
        let game_key = this.props.game_key;
        //返点
        let rebate = this.props.sliderConfig;
        let lottery_id= parseInt(this.props.lottery_id);
        let renderBar;
        let btnRender;
        //封盘，休市，普通 按钮样式判断
        if(this.props.countDownType!=="normal"){
            btnRender = <button disabled className="close-btn"  onClick={()=>{this.props.handleTouzhu()}}  >下注<span ref="nums"> 共{this.props.zhushu}注</span></button>
        }else{
            btnRender = <button className="active"  onClick={()=>{this.props.handleTouzhu()}}  >下注<span ref="nums"> 共{this.props.zhushu}注</span></button>
        }

        let defaultValue=0;
        if(rebate&&rebate.to){
            defaultValue = rebate.to+rebate.from-this.props.sliderValue;
        }
        //官方，信用 投注条判断
        if(game_key==="g" || lottery_id===15){
              if(lottery_id===26){
                  renderBar=<div  className="lottery-bottom-x">
                      { rebate&&rebate.gap!==0&&this.props.showSlider ?
                          <div className="slider-wrap">
                              <Slider defaultValue={defaultValue} min={rebate.from * 1} max={rebate.to * 1} step={rebate.gap * 1} onChange={(e)=>{this.props.sliderOnChange(e)}} tipFormatter={null}/>
                              <span>{(this.props.sliderValue * 100).toFixed(1)}%</span>
                          </div> : null}
                      <button onClick={()=>{this.props.handleClearAll()}}>清空</button>
                      {this.hasFandian()?<button onClick={() => {this.props.handleToggleSlider()}} >返点</button>:<button className="disabled-input" onClick={()=>this.disableMessage()}>返点</button>}

                      <input type="number" placeholder="输入金额" onChange={(e)=>{this.props.handleChangeMoney(e)}} id="jsInputMoney" ref="inputMoney" />
                      {btnRender}
                  </div>;
              }else{
                  renderBar=<div className="lottery-bottom-g">
                      { rebate&&rebate.gap!==0&&this.props.showSlider ?
                          <div className="slider-wrap">
                              <Slider defaultValue={defaultValue} min={rebate.from * 1} max={rebate.to * 1} step={rebate.gap * 1} onChange={(e)=>{this.props.sliderOnChange(e)}} tipFormatter={null}/>
                              <span>{(this.props.sliderValue * 100).toFixed(1)}%</span>
                          </div> : null}
                      <button onClick={()=>{this.props.handleClearAll()}}>清空</button>
                      {this.hasFandian()?<button onClick={() => {this.props.handleToggleSlider()}} >返点</button>:<button className="disabled-input" onClick={()=>this.disableMessage()}>返点</button>}
                      <button disabled>{"共"+this.props.zhushu+"注"}</button>
                      {btnRender}
                  </div>;
              }

        }else{
            renderBar=<div  className="lottery-bottom-x">
                { rebate&&rebate.gap!==0&&this.props.showSlider ?
                    <div className="slider-wrap">
                        <Slider defaultValue={defaultValue} min={rebate.from * 1} max={rebate.to * 1} step={rebate.gap * 1} onChange={(e)=>{this.props.sliderOnChange(e)}} tipFormatter={null}/>
                        <span>{(this.props.sliderValue * 100).toFixed(1)}%</span>
                    </div> : null}
                <button onClick={()=>{this.props.handleClearAll()}}>清空</button>
                {this.hasFandian()?<button onClick={() => {this.props.handleToggleSlider()}} >返点</button>:<button className="disabled-input" onClick={()=>this.disableMessage()}>返点</button>}

                <input type="number" placeholder="输入金额" maxLength="5" pattern="[0-9]*" onFocus={()=>this.handleFoucs()} onBlur={()=>this.handleBlur()} onChange={(e)=>{this.props.handleChangeMoney(e)}} id="jsInputMoney" ref="inputMoney" />
                {btnRender}
            </div>;
        }

        return (
            <div className="touzhu" >
                    {renderBar}
                </div>

        )
    }
}
