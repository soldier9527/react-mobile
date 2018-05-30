import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router-dom';
import {Carousel, Icon, Row, Col, Modal} from 'antd';
import Footer from '../common/footer';
import Navbar from '../common/navbar';
import Api from '../api';

export default class User_login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconMessageClass: "icon-message",
            card_num: 'init',
            balance: '',//用户余额
            psdvisible: false,
            cardvisible: false,
            isjump: false,
            isset_secpwd: '',
        }
    }

    componentWillMount() {
        const user = JSON.parse(sessionStorage.getItem("user"));
        this.setState({user});
        this.getMessageClass();
        this.getMoney();//展示余额
        this.changeSessionstorage();
    }

    /**render前设置jumpPage为登录成功**/
    changeSessionstorage() {
        sessionStorage.setItem("jumpPage", "登录成功");
    }

    getMessageClass() {
        Api("c=user&a=receiveBox&curPage=1", null, (e) => {
            if (e.data) {
                let data = e.data;
                let j = data.length;
                //map循环无法终止，故使用for循环
                for (let i = 0; i < j; i++) {
                    if (data[i].has_read === 0) {
                        this.setState({
                            iconMessageClass: "icon-message_red"
                        });
                        return;
                    }
                }
            }
        })
    }

    //一进入user_login刷新余额
    getMoney(callback) {
        const user = JSON.parse(sessionStorage.getItem("user"));
        Api("c=user&a=info&user_id" + user.user_id, null, (res) => {
            let data = res.data;
            if (res.errno === 0) {
                this.setState({
                    balance: data.balance,
                    card_num: data.card_num,
                    isset_secpwd: data.isset_secpwd
                },()=>{
                    if(callback){
                        callback();
                    }
                })
            }
        })
    }

    jumptoWithraw() {
        let user = JSON.parse(sessionStorage.getItem("user"));
        if (user.isset_secpwd !== 1) {
            this.showPsdModal()
        } else if (this.state.card_num === "init") {
            this.getMoney(()=>{
                if(!this.state.card_num){
                    this.showModal();
                }else{
                    this.props.history.push("withdrawMoney")
                }
            })
        }else if(!this.state.card_num){
            this.showModal();
        } else {
            this.props.history.push("withdrawMoney")
        }


    }

    jumptoGroup() {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user.level !== 100) {
            this.props.history.push("group")
        } else {
            Modal.error({
                title: '提示:抱歉，您暂时还没有权限访问',
            });
        }

    }

    showModal() {
        this.setState({
            cardvisible: true,
        });
    }

    showPsdModal() {
        this.setState({
            psdvisible: true,
        });
    }

    handleOk() {
        this.setState({
            cardvisible: false,
        }, () => {
            this.props.history.push("bankCardBind")
        });

    };

    handlePsdOk() {
        this.setState({
            psdvisible: false,
        }, () => {
            this.props.history.push("setpassword")
        });

    };

    render() {
        let user = JSON.parse(sessionStorage.getItem("user"));

        let iconMessageClass = this.state.iconMessageClass;
        return (
            <div>
                <Navbar title="我的" navbarRight={<Link to="setting"><i className="lt-mysetting"></i></Link>}/>

                <div className="user_login fadeInRight">
                    <div className="info">
                        <div className="login-reg">
                            <Link to="user_state">
                                <div className="login-reg_left fl"><i className="icon_touxiang"></i></div>
                                <div className="login-reg_right fl">
                                    <p className=""><span>账户：</span><span>{user.username}</span></p>
                                    <p className=""><span className="">余额：</span><span
                                        className="">{(this.state.balance ? parseFloat(this.state.balance) : "0.00")}</span><span>元</span>
                                    </p>
                                </div>
                                <div className="login-reg_rr fl"><Icon type="right" style={{
                                    fontSize: 24,
                                    color: '#fff',
                                    padding: '0.5rem 0 0 0.1rem'
                                }}/></div>
                            </Link>
                        </div>
                    </div>
                    <div className="btns">
                        <Row className="row">
                            <Col className="col" span={8}>
                                <Link to="pay">
                                    <i className="icon-deposit"></i>
                                    <span>充值</span>
                                </Link>
                            </Col>
                            <Col className="col" span={8}>
                                {/*<Link to={this.state.isjump?"withdrawMoney":'user_login'} onClick={()=>{this.isBindCard()}}>*/}
                                <div onClick={() => {
                                    this.jumptoWithraw()
                                }}>
                                    <i className="icon-withdrawal"></i>
                                    <span>提款</span>
                                </div>
                                {/*</Link>*/}
                            </Col>
                            <Col className="col" span={8}>
                                <Link to="order">
                                    <i className="icon-orders"></i>
                                    <span>注单</span>
                                </Link>
                            </Col>
                        </Row>
                        <Row className="row">
                            <Col className="col" span={8}>
                                <Link to="account">
                                    <i className="icon-account"></i>
                                    <span>个人帐变</span>
                                </Link>
                            </Col>
                            <Col className="col" span={8}>
                                <div onClick={() => {
                                    this.jumptoGroup()
                                }}>
                                    <i className="icon-team"></i>
                                    <span>代理中心</span>
                                </div>
                            </Col>
                            <Col className="col" span={8}>
                                <Link to="information">
                                    <i className={iconMessageClass}></i>
                                    <span>系统信息</span>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                    <ul className="list">
                        <li><Link to="getService"><i className="icon_service fl"></i><span>在线客服</span>
                            <Icon type='right' className="fr"></Icon>
                        </Link></li>
                        <li className="bottom_border"><Link to="promo/user">
                            <i className="active_center_icon fl"></i><span>活动中心</span>
                            <Icon type='right' className="fr"></Icon>
                        </Link></li>
                    </ul>
                    <Modal
                        wrapClassName="isbind-wrapper"
                        closable={false}
                        title="提示"
                        visible={this.state.cardvisible}
                        footer={null}
                    >
                        <div className="x-confirm-data">
                            <p className="tips">
                                您还没绑定银行卡，请先去绑定银行卡
                            </p>
                        </div>
                        <div className="x-btn-wrapper">
                            <span onClick={() => {
                                this.setState({cardvisible: false})
                            }}>取消</span>
                            <span onClick={() => {
                                this.handleOk()
                            }}>确定</span>
                        </div>
                    </Modal>
                    <Modal
                        wrapClassName="isbind-wrapper"
                        closable={false}
                        title="提示"
                        visible={this.state.psdvisible}
                        footer={null}
                    >
                        <div className="x-confirm-data">
                            <p className="tips">
                                请先设置资金密码
                            </p>
                        </div>
                        <div className="x-btn-wrapper">
                            <span onClick={() => {
                                this.setState({psdvisible: false})
                            }}>取消</span>
                            <span onClick={() => {
                                this.handlePsdOk()
                            }}>确定</span>
                        </div>
                    </Modal>
                </div>
                <Footer/>
            </div>
        );
    }
}
