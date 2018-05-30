import React, { Component, PropTypes } from 'react'
import {NavLink } from 'react-router-dom';

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
                        <NavLink activeClassName="active" to="home">
                            <i className="i-home"></i>
                            <span>首页</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="active" to="hall">
                            <i className="i-hall"></i>
                            <span>购彩</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="active" to="open">
                            <i className="i-cup"></i>
                            <span>开奖</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="active" to="promo">
                            <i className="i-gift"></i>
                            <span>优惠</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="active" to={userWay}>
                            <i className="i-user"></i>
                            <span>我的</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        )
    }
}
