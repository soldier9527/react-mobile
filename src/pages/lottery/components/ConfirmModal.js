//确认投注 弹框
// 用于 commonjs和traceSingle的投注确认弹框
import React, { Component} from 'react'
import {Modal} from 'antd';
import Calc from "./calc";
export default class ConfirmModal extends Component {
    render() {

        let type=this.props.confirmtype;
        let content=null;
        if(type==="x"){
            content = <div className="confirm-content">
                <p>*******************************************</p>
                <p>玩法：{this.props.md?this.props.md.cname:""}</p>
                <p>期号：第{this.props.issue}期</p>
                <p>注数：{this.props.zhushu}注</p>
                <p>金额：{this.props.money*this.props.zhushu}元</p>
                <p>******************************************</p>
            </div>
        }else if(type==="g"){
            content = <div className="confirm-content">
                <p>*******************************************</p>
                <p>注数：{this.props.total_zhushu}注</p>
                <p>模式：{Calc.getCurentModeName(this.props.mode)}模式</p>
                <p>倍数：{this.props.beishu}倍</p>
                <p>金额：{this.props.total_money}元</p>
                <p>******************************************</p>
            </div>
        }else{
            let traceList=this.props.traceList;
            if(traceList&&traceList.length===0){
                return null;
            }
            let qishu=0;
            for (let i = 0; i < traceList.length; i++) {
                if(traceList[i].checked&&traceList[i].beishu){
                    qishu++
                }
            }
            content = <div className="confirm-content">
                <p>*******************************************</p>
                <p>是否追号：是</p>
                <p>单倍注数：{this.props.total_zhushu}注</p>
                <p>总金额：￥{this.props.traceList[this.props.traceList.length-1]['amount']}</p>
                <p>起始期号：{this.props.issue}</p>
                <p>追号期数：{qishu}期</p>
                <p>模式：{Calc.getCurentModeName(this.props.mode)}模式</p>
                <p>******************************************</p>
            </div>
        }
        return (
            <Modal
                wrapClassName="confirm-wrapper"
                closable={false}
                title="投注信息"
                visible={this.props.visible}
                footer={null}
            >
                {content}
                <div className="btn-wrapper">
                    <span onClick={()=>{this.props.onCancel()}}>取消</span>
                    <span onClick={()=>{this.props.onOk()}}>确定</span>
                </div>
            </Modal>
        );
    }
}