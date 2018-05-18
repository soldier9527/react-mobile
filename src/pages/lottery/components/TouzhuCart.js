import React, { Component } from "react"
import { PopupConfirm, Spin ,Icon} from 'antd';
class TouzhuCart extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let modeBtn=[];
        let modeArr = this.props.modeArr;
        let mode=this.props.mode;
        modeArr.map((item,i)=>{
            modeBtn.push(
                <button key={i}
                        className={item.modes_value===mode?"active":null}
                        onClick={() => {this.props.modeChange(item.modes_value)}}>{item.modes_name}
                        </button>)
        });
        return (
            <div className="lotto-cart">
                <Spin tip="正在加载，请稍候..." spinning={this.props.loading}>
                    <ul className="tzlist">
                        <li><span>玩法</span><span>号码</span><span>注数</span><span>倍数/元</span></li>
                        {this.props.tableList.map((list, index) =>
                            <li key={index}>
                                <span>{list.title}</span>
                                <span>{list.content.map((list,i)=>{
                                    let nums = list.concat("，");
                                    nums = nums.replace(/T/g,"10");
                                    return nums;
                                })}</span>
                                <span>{list.zhushu}</span>
                                <span>{list.money}</span>
                                <span onClick={()=>this.props.cancelOrder(index)}><Icon type="close-circle" /></span>
                            </li>
                        )}
                    </ul>
                    <div className="beishu-wrap">
                        <div className="beishu">倍数：
                            <input type="button" value="-" onClick={()=>this.props.onReduce(this.props.beishu)}/>
                            <input type="number" onBlur={this.props.beishuOnBlur.bind(this)}  onChange={this.props.beishuChange.bind(this)} value={this.props.beishu} />
                            <input type="button" value="+" onClick={()=>{this.props.onAdd(this.props.beishu)}}/>
                        </div>
                        <div className="cishu">次数：<input type="number"  onChange={this.props.cishuChange.bind(this)} value={this.props.cishu} /></div>
                        {["9","21","22","25"].indexOf(this.props.lottery_id) !== -1 ? null :
                            <button className="zhuihao-btn" onClick={this.props.startTrace.bind(this)}>追号</button>
                        }
                        <button onClick={this.props.clearCart.bind(this)}>清空</button>
                    </div>
                    <div className="modes-wrap">
                        {modeBtn}
                    </div>
                    <p>注数：<span ref="nums">{this.props.total_zhushu}注</span></p>
                    <p>总计：<span ref="money">{parseFloat(this.props.total_money.toFixed(3))}元</span></p>
                    <p>余额：<span ref="balance">{this.props.balance}元</span></p>

                    <div className="row-cart">
                        <button onClick={this.props.submitbuy.bind(this)}>确认投注</button>
                    </div>
                </Spin>
            </div>
        )
    }
}
export default TouzhuCart
