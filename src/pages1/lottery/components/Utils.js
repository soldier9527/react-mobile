import React, { Component } from "react"
import { PopupConfirm, message} from 'antd';

class Utils extends Component {
    constructor(state) {
        super(state);
        this.state = state;
    }

    clearNum() {
        this.clearNumActive(0)
        this.clearNumActive(1)
        this.clearNumActive(2)
        this.clearNumActive(3)
        this.clearNumActive(4)
    }

    toggleActive(ticket_num, n, title) {
        let newState = Object.assign({}, this.state.numList[ticket_num]);
        if(title == '后三组六胆拖' || title == '前三组六胆拖' || title == '中三组六胆拖' || title == '前二组选胆拖' || title == '后二组选胆拖') {
            newState[n] = !newState[n];
            if(ticket_num == 0) {
                this.state.numList[ticket_num+1][n] = false
            } else {
                this.state.numList[ticket_num-1][n] = false
            }
            this.state.numList[ticket_num] = newState
            this.setState(this.state.numList);
            let numcount = 0
            let flag = "true";
            if(title == '后三组六胆拖' || title == '前三组六胆拖' || title == '中三组六胆拖') {
                const touzhu = new Touzhu(this.state);
                const count = touzhu.fetchList(0).length;
                if(count > 2) {
                    message.warning('胆码个数超出范围');
                    this.clearNum();
                    return false;
                }
            }
        } else {
            newState[n] = !newState[n];
            this.state.numList[ticket_num] = newState
            this.setState(this.state.numList);
        }
    }
    //全选
    allNumActive(ticket_num) {
        let length
        const newState = Object.assign({}, this.state.numList[ticket_num]);
        length = Object.keys(newState).length
        let i;
        for(i=0;i<length;i++) {
            newState[i] = false
        }
        for(i=0;i<length;i++) {
            newState[i] = !newState[i];
            if(i > 9) {
                delete newState[i]
            }
        }
        this.state.numList[ticket_num] = newState
        this.setState(this.state.numList);
    }
    //清
    clearNumActive(ticket_num) {
        const newState = Object.assign({}, this.state.numList[ticket_num]);
        const length = Object.keys(newState).length
        let i;
        for(i=0;i<length;i++) {
            newState[i] = false;
        }
        this.state.numList[ticket_num] = newState
        this.setState(this.state.numList);
    }
    // 大
    selBig(ticket_num) {
        const newState = Object.assign({}, this.state.numList[ticket_num]);
        const length = Object.keys(newState).length
        let i;
        for(i=0;i<length;i++) {
            newState[i] = false
        }
        for(i=5;i<length;i++) {
            newState[i] = !newState[i];
            if(i > 9) {
                delete newState[i]
            }
        }
        this.state.numList[ticket_num] = newState
        this.setState(this.state.numList);
    }

    // 小
    selSmall(ticket_num) {
        const newState = Object.assign({}, this.state.numList[ticket_num]);
        const length = Object.keys(newState).length
        let i;
        for(i=0;i<length;i++) {
            newState[i] = false
        }
        for(i=0;i<length/2;i++) {
            newState[i] = !newState[i];
            if(i > 9) {
                delete newState[i]
            }
        }
        this.state.numList[ticket_num] = newState
        this.setState(this.state.numList);

    }
    // 奇数
    selOdd(ticket_num) {
        const newState = Object.assign({}, this.state.numList[ticket_num]);
        const length = Object.keys(newState).length
        let i;
        for(i=0;i<length;i++) {
            newState[i] = false
        }
        for(i=0;i<length;i++) {
            if(i%2!=0) {
                newState[i] = !newState[i];
                if(i > 9) {
                    delete newState[i]
                }
            }
        }
        this.state.numList[ticket_num] = newState
        this.setState(this.state.numList);
    }

    // 偶
    selEven(ticket_num) {
        const newState = Object.assign({}, this.state.numList[ticket_num]);
        const length = Object.keys(newState).length
        let i;
        for(i=0;i<length;i++) {
            newState[i] = false
        }
        for(i=0;i<length;i++) {
            if(i%2==0) {
                newState[i] = !newState[i];
                if(i > 9) {
                    delete newState[i]
                }
            }
        }
        this.state.numList[ticket_num] = newState
        this.setState(this.state.numList);
    }
}

export default Utils