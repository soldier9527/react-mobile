import React, {Component} from 'react'
import {Link} from 'react-router-dom';
import Footer from '../common/footer';
import Navbar from '../common/navbar';
import {Grid,Icon} from 'antd-mobile';
import "./index.scss"

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    icon: "i-user i-user-deposit",
                    text: "充值",
                    type: "deposit",
                }, {
                    icon: "i-user i-user-withdrawal",
                    text: "提款",
                    type: "withdrawal",
                }, {
                    icon: "i-user i-user-orders",
                    text: "注单",
                    type: "orders",
                }, {
                    icon: "i-user i-user-account",
                    text: "个人账变",
                    type: "account",
                }, {
                    icon: "i-user i-user-team",
                    text: "代理中心",
                    type: "team",
                }, {
                    icon: "i-user i-user-message",
                    text: "系统信息",
                    type: "message",
                },
            ]
        }
    }

    handleGrid(type) {
        switch (type) {
            case "pay":
                console.log("pay");
                break;
            default:
                this.props.history.push(type)
        }
    }

    render() {
        return (
            <div>
                <Navbar title="我的" navbarRight={<Link to="setting"><i className="lt-mysetting"></i></Link>}/>
                <div className="container user-wrap">
                    <div className="user-guest">
                        <div className="login-btn">
                            <Link to="login">登录</Link> / <Link to="login">注册</Link>
                        </div>
                    </div>
                    <div className="user-normal">
                        <Link className="user-info-link" to="userInfo">
                            <i className="icon_touxiang"></i>
                            <div className="user-info">
                                <p>账户：</p>
                                <p>余额：</p>
                            </div>
                            <Icon className="" type="right"></Icon>
                        </Link>
                    </div>
                    <Grid
                        className="content"
                        data={
                            this.state.data
                        }
                        renderItem={dataItem => (
                            <div>
                                <div>
                                    <i className={dataItem.icon}></i>
                                </div>
                                <div>
                                    <span>{dataItem.text}</span>
                                </div>
                            </div>
                        )}
                        hasLine={false}
                        columnNum={3}
                        onClick={_el => this.handleGrid(_el.type)}
                    />
                    <ul className="list">
                        <li>
                            <Link to="getService">
                                <i className="icon_service fl"></i>
                                <span>在线客服</span>
                                <i className="arrow-right fr"></i>
                            </Link>
                        </li>
                        <li className="bottom_border"><Link to="promo/user"><i
                            className="active_center_icon fl"></i><span>活动中心</span><i
                            className="arrow-right fr"></i></Link></li>
                    </ul>
                </div>
                <Footer/>
            </div>
        );
    }
}
