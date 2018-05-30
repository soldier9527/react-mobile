import React, { Component } from "react"
import { PopupConfirm,  Select,  Checkbox } from 'antd';

const Option = Select.Option;
class Trace extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        if(this.props.traceList.length===0){
            return null;
        }
        const issues = this.props.traceIssues;
        let elIssues = issues.map((issue, i) => {
            return (
                <Option key={i} value={String(i)}>{issue}</Option>
            );
        });
        let traceList = this.props.traceList;
        let qishu=0;
        traceList.map((item,i)=>{
            if(item.checked){
                qishu ++;
            }

        });
        return (
            <div className="lt-trace">
                <div className="trace-filter">
                    <div className="row">
                        倍数：<input type="number" value={this.props.traceBeishu} onChange={this.props.traceBeishuChange.bind(this)} onBlur={this.props.traceBeishuOnBlur.bind(this)} />
                        期数：<input type="number" value={this.props.traceQishu} onChange={this.props.traceQishuChange.bind(this)}  onBlur={this.props.traceQishuOnBlur.bind(this)}/>
                        <Checkbox onChange={this.props.stopOnWinChange.bind(this)}>中奖即停：</Checkbox>
                    </div>
                    <div className="row">起始：
                        <Select defaultValue={issues[0]} onChange={this.props.traceStartChange.bind(this)}>
                            {elIssues}
                        </Select>
                    </div>
                </div>
                <div className="trace-issues">
                    <dl>
                        <dt><span className={this.props.traceAllChecked ? '' : 'unselect'} onClick={this.props.traceSelectAllChange.bind(this)}><i>&#10003;</i>期号</span><span>倍数</span><span>当前投入</span><span>累计投入</span></dt>
                        {this.props.traceList.map((t, i) => {
                            return (
                                <dd key={i} className={t.checked ? '' : 'unselect'}>
                                    <span onClick={this.props.traceSelectChange.bind(this, i)}><i>&#10003;</i>{t.issue}</span>
                                    <span><input type="number" value={t.beishu} onChange={this.props.traceSingleBeishuChange.bind(this, i)} /></span>
                                    <span><em>{parseFloat(t.money).toFixed(2)}</em></span>
                                    <span><em>{parseFloat(t.amount).toFixed(2)}</em></span>
                                </dd>
                            );
                        })}
                    </dl>
                    <p>包含当前期最多追加 {issues.length} 期</p>
                </div>
                <div className="trace-amount">
                    单倍注数：{this.props.zhushu}注<br/>
                    购买：{qishu}期<br/>
                    合计：{parseFloat(this.props.traceList[this.props.traceList.length-1]['amount']).toFixed(2)}元
                </div>
                <button onClick={this.props.traceSubmit.bind(this)}>确认追号</button>
            </div>
        );
    }
}

export default Trace