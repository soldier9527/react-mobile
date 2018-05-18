import React, { Component } from "react"
import { PopupConfirm, Button, Checkbox } from 'antd';

class GenerateNumList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let _this = this;
        const arrs = [];
        let i;

        for(i=0;i<this.props.num;i++) {
            arrs.push(
            <NumShowList
            key={i} toggleActive={this.props.toggleActive}
            ticket_num={i} ch_num={this.props.ch_num_arr[i]}
            allNumActive={this.props.allNumActive}
            numList={this.props.numList}
            selBig={this.props.selBig}
            selSmall={this.props.selSmall}
            selOdd={this.props.selOdd}
            selEven={this.props.selEven}
            total={this.props.total}
            text_list={this.props.text_list}
            start = {this.props.start}
            show_btn={this.props.show_btn}
            title={this.props.title}
            clearNumActive={this.props.clearNumActive}
            ref="num_show_list">

            {this.props.show_btn ?
        <div className="ch_num_btns">
            <button onClick={_this.props.allNumActive.bind(this, i)}>全</button>
            <button onClick={_this.props.selBig.bind(this, i)}>大</button>
            <button onClick={_this.props.selSmall.bind(this, i)}>小</button>
            <button onClick={_this.props.selOdd.bind(this, i)}>奇</button>
            <button onClick={_this.props.selEven.bind(this, i)}>偶</button>
            <button onClick={_this.props.clearNumActive.bind(this, i)}>清</button>
            </div>: null}
        </NumShowList>)
        }
        return (
            <div className="ch_chart_wrap">
        {this.props.isRenxuan ? <CbCheckBox CheckBoxOnchange={this.props.CheckBoxOnchange} title={this.props.title} location_count={this.props.location_count} fangan={this.props.fangan} />: null}
        {arrs}
    </div>
    )
    }
}

export default GenerateNumList

class CbCheckBox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const CheckboxGroup = Checkbox.Group;
        const plainOptions = ['万位', '千位', '百位', '十位', '个位'];
        const defaultCheckedList = ['万位', '千位', '百位', '十位', '个位'];
        return (
            <div className="ch_bfn">
            <CheckboxGroup options={plainOptions} defaultValue={defaultCheckedList} onChange={this.props.CheckBoxOnchange.bind(this)} />
    <p>温馨提示：您选择了{this.props.location_count}个位置，系统自动根据位置组合成{this.props.fangan}个方案</p>
        </div>
    )
    }
}

// 生成位数，默认为0-9
class NumShowList extends Component {
    constructor(props) {
        super(props);
        this.state = {numList: this.props.numList}
    }

    render() {
        const rows = [];
        let num_arr = [];
        let el_rows = '';
        for(let i=this.props.start;i<this.props.total;i++) {
            if(this.props.text_list.length > 0) {
                num_arr.push({id: i, value: this.props.text_list[i]})
            } else {
                num_arr.push({id: i, value: i})
            }
        }
        let id = 1000;
        while(num_arr.length) {
            rows.push({id: id, row: num_arr.splice(0, 5)})
            id += 1;
        }
        let _this = this;
        return (
            <div className="ch_chart">
            <div className="ch_num_w">{this.props.ch_num}</div>
        <div className="ch_num_box">
            {this.props.children}
        {rows.map((item) => {
            return (
        <ul key={item.id} className="ch_num_show">
            {item.row.map((num) => {
                return (
            <li key={num.id}>
        <Button type="primary" onClick={_this.props.toggleActive.bind(this, this.props.ticket_num, num.id, this.props.title)} className={this.state.numList[this.props.ticket_num][num.id]? "on": "off"}>{num.value}</Button>
        </li>
        )
        })}
        </ul>
        )
        })}
    </div>
        </div>
    )
    }
}