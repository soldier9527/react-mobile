import React, { Component} from 'react'
import {Link} from 'react-router-dom';
import Navbar from '../common/navbar';
export default class Outegame extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                  <Navbar title="转入电子钱包" />
                  <div className="inegame">
                      <ul>
                         <li><span>金额</span><input className="input" placeholder="请输入转入金额"/></li>
                         <li><span>密码</span><input className="input" placeholder="请输入密码"/></li>
                         <li className="sur_li"><Link to="surebutton">确定</Link></li>
                      </ul>
                      <p><Link to="game_information">游戏币说明在此</Link></p>
                  </div>

            </div>
        )
    }
}
