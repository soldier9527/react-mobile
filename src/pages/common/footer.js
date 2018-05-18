import React, { Component, PropTypes } from 'react'
import {Link } from 'react-router-dom';

export default class Footer extends Component {
    constructor(props) {
        super(props);
          this.state ={
            userWay:"",
          };
    }

    render() {
        const user = JSON.parse(sessionStorage.getItem("user"));
        let userWay = "";
        if(user==null){
        userWay="user"
      }else{
        userWay="user_login"
      }
        return (
            <div className="footer">
                <ul>
                    <li>
                        <Link activeClassName="active" to="home">
                            <i className="i-home"></i>
                            <span>首页</span>
                        </Link>
                    </li>
                    <li>
                        <Link activeClassName="active" to="hall">
                            <i className="i-hall"></i>
                            <span>购彩</span>
                        </Link>
                    </li>
                    <li>
                        <Link activeClassName="active" to="open">
                            <i className="i-cup"></i>
                            <span>开奖</span>
                        </Link>
                    </li>
                    <li>
                        <Link activeClassName="active" to="promo">
                            <i className="i-gift"></i>
                            <span>优惠</span>
                        </Link>
                    </li>
                    <li>
                        <Link activeClassName="active" to={userWay}>
                            <i className="i-user"></i>
                            <span>我的</span>
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }
}
