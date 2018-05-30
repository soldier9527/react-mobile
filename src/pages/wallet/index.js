import React, { Component, PropTypes } from 'react'
import {Link} from 'react-router-dom';
import Navbar from '../common/navbar';

export default class Wallet extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navbar title="电子钱包" />
                  <div className="wallet">
                      <div className="blance">
                          <p>账户余额（元）</p>
                          <p className="bigsize">99.00</p>
                      </div>
                      <div className="change">
                           <ul>
                              <li>
                                  <Link to="inegame">
                                      <i className="lt-inegame fl"></i>
                                      <span className="fl">平台转入电子游戏</span>
                                      <i className="arrow-right fl"></i>
                                  </Link>
                              </li>
                              <li>
                                  <Link to="outegame">
                                      <i className="lt-outegame fl"></i>
                                      <span className="fl">电子游戏转出平台</span>
                                      <i className="arrow-right fl"></i>
                                  </Link>
                              </li>
                           </ul>
                      </div>
                  </div>
            </div>
        )
    }
}
