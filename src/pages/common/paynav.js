import React, { Component, PropTypes } from 'react'
import {Link } from 'react-router-dom';
import { Icon } from 'antd';

export default class PayNav extends Component {
    constructor(props) {
        super(props);

    }






    render() {
        return (
          <div className="paynav" >
              <ul>
                  <li><Link activeClassName="active" to="pay"><span>在线</span></Link></li>
                  <li><Link activeClassName="active" to="payzhifubao"><span>支付宝</span></Link></li>
                  <li><Link activeClassName="active" to="payweixin"><span>微信</span></Link></li>
                  <li><Link activeClassName="active" to="paybankcard"><span>银行卡</span></Link></li>
              </ul>
          </div>
        )
    }
}
