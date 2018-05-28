import React, {Component} from 'react';
import Navbar from '../common/navbar';
import {hashHistory} from 'react-router-dom';
import MaskLoading from '../common/maskLoading';
import Api from '../api';
import {Modal, message} from 'antd';
import {Tabs, Toast} from 'antd-mobile';
import QRCode from 'qrcode.react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import 'antd-mobile/lib/toast/style/css';//加载选择样式

export default class Pay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            initData: [],//初始数据
            initRender: [],
            money: "",
            warmPrompt:'',
            balance:"0.000"
        }
    }
    componentDidMount() {
        this.initRender();
        this.getBalance();
    }

    getBalance(){
        Api("c=user&a=info", null, (res) => {
            let data = res.data;
            if (res.errno === 0) {
                this.setState({
                    balance: parseFloat(data.balance),
                })
            }
        })
    }
    initRender() {
        Api("c=fin&a=pay&type=2", null, (res) => {
            let warmPrompt=res.data.warm_prompt;
            let data = res.data.show_data;
            let tabs = [];
            data.map(function (item, i) {
                tabs.push({
                    title: item.group_name,
                    sub: item.cdg_id
                })
            });
            this.setState({
                tabs: tabs,
                initData: data,
                warmPrompt:warmPrompt.replace(/\r\n/g,"<br>").replace(/\n/g,"<br>"),
            });
        })
    }

    //在线客服
    onlineService() {
        hashHistory.push("getService");
    }

    render() {
        let initData = this.state.initData;
        let warmPrompt=this.state.warmPrompt;


        let renderHtml = [];
        initData.map((item, i) => {
            if (item.cdg_id === 1) {//银行卡特殊
                renderHtml.push(<CompanyForm
                    onlineService={() => {
                        this.onlineService()
                    }}
                    data={item}
                    key={i}
                    warmPrompt={warmPrompt}
                    balance={this.state.balance}
                />)
            } else {//普通充值
                renderHtml.push(<NormalForm
                    onlineService={() => {
                        this.onlineService()
                    }}
                    data={item}
                    key={i}
                    warmPrompt={warmPrompt}
                    balance={this.state.balance}
                />)
            }
        });
        let service = <i className="icon_service" onClick={() => {this.onlineService()}}></i>;

        return (
            <div className="pay-wrap">
                <Navbar back="back" title="充值中心" navbarRight={service}/>

                <div className="pay">

                    <Tabs tabs={this.state.tabs}
                          initialPage={0}
                          swipeable={false}
                    >

                        {renderHtml}

                    </Tabs>
                </div>
            </div>
        );
    }
}


class CompanyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            money: "",
            cardList: this.props.data.child_cards.cardList,
            cardIndex: 0,//银行卡序号
            real_name: "",
            value: '',
            copied: false,
            companyTypeIndex: 0,
            typeSel: [],
            typeSelArr: [],
            show: false,
        }
    }

    handleSelectMoney(i) {
        let arr = [100, 300, 500, 5000];
        this.setState({
            money: arr[i],
            moneySelectIndex: i,

        });
    }

    //类型选择
    handleSelectType(i) {
        this.setState({
            companyTypeIndex: i
        });
    }

    handlechangeName(e) {
        this.setState({
            real_name: e.target.value,
        });
    }//输入框改变
    handlechangeMoney(e) {
        this.setState({
            money: e.target.value,
            moneySelectIndex: -1
        });
    }



    handleSubmit() {
        let payInfo = this.state.cardList[this.state.companyTypeIndex];
        let money = this.state.money;
        let real_name = this.state.real_name;
        let token = getRandChar();
        if (!real_name) {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error('请输入姓名', 1);
            return;
        } else if ((!money) && money <= 0) {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error('请输入金额', 1);
            return;
        }
        MaskLoading(5);
        Api("c=pay&a=offlinePay", {
            card_id: payInfo.card_id,
            bank_id: payInfo.bank_id,
            real_name: real_name,
            money: money,
            token: token,
            area_flag: 1
        }, (res) => {
            MaskLoading(false);
            if (res.errno === 0) {
                if (res.data.url) {
                    const modal = Modal.success({
                        title: '提示',
                        content: '已生成订单，请及时使用网银充值，或前往线下银行充值！',
                        onOk() {
                            // hashHistory.push(res.data.url);
                            location.href = res.data.url
                        },
                    });
                } else {
                    const modal = Modal.success({
                        title: '提示',
                        content: '已生成订单号：' + res.data.local_order_num + '，请及时使用网银充值，或前往线下银行充值！',
                        onOk() {

                        },
                    });
                }


            }
        })
    }
    showBigScancode(url){
        if(url){
            this.setState({
                Scancode:url
            })
        }else{
            this.setState({
                Scancode:""
            })
        }
    }

    //一键复制
    onCopy() {
        this.setState({
            copied: true
        })
        Toast.success('复制成功', 1);

    }

    render() {
        let moneyList = [100, 300, 500, 5000];
        let moneySelect = [];
        let _this = this;
        let moneySelectIndex = this.state.moneySelectIndex;
        moneyList.map(function (item, i) {
            if (i === moneySelectIndex) {
                moneySelect.push(<li className="money-select" key={i}>{item}</li>)
            } else {
                moneySelect.push(<li onClick={() => {
                    _this.handleSelectMoney(i)
                }} key={i}>{item}</li>)
            }
        });

        let cardList = this.props.data.child_cards.cardList;
        let renderList;
        let companyTypeIndex = this.state.companyTypeIndex;


        cardList.map((item, i) => {

            if (i === companyTypeIndex) {
                let id =item.bank_id;
                if(id===98||id===99){
                    renderList=<div className="pay-normal-list">
                        <ul>
                            <li>
                                <span>{id===98?"微信":"支付宝"}昵称: {item.card_name}</span>
                                <CopyToClipboard
                                    text={item.card_name}
                                    onCopy={() => {
                                        this.onCopy()
                                    }}>
                                    <input type="button" value="复制"/>
                                </CopyToClipboard>

                            </li>
                            <li>
                                <span>账号:{item.card_num}</span>
                                <CopyToClipboard
                                    text={item.card_num}
                                    onCopy={() => {
                                        this.onCopy()
                                    }}>
                                    <input type="button" value="复制"/>
                                </CopyToClipboard>
                            </li>
                        </ul>
                        {item.remark?<div className="remark">备注：{item.remark}</div>:null}
                        {item.netway?<div className="scancode">
                            <img onClick={()=>this.showBigScancode(item.netway)} src={item.netway} />
                        </div>:null}
                        {this.state.Scancode?<Modal
                            footer={null}
                            visible={true}
                            wrapClassName="big-scancode-modal"
                            onCancel={()=>this.showBigScancode()}
                        >
                            <img  src={item.netway} />
                        </Modal>:null}
                        {/*备注*/}


                    </div>
                }else if(id<50){
                    renderList=<div className="pay-bank-list">
                        <ul>
                            <li className={"select-li normal"}>
                                <h5>{item.bank_name}</h5>
                                <div>
                                    收款人：{item.card_name}
                                    <CopyToClipboard
                                        text={item.card_name}
                                        onCopy={() => {
                                            this.onCopy()
                                        }}>
                                        <span>复制</span>
                                    </CopyToClipboard>

                                </div>
                                <div>
                                    {item.card_num}
                                    <CopyToClipboard
                                        text={item.card_num}
                                        onCopy={() => {
                                            this.onCopy()
                                        }}>
                                        <span>复制</span>
                                    </CopyToClipboard>
                                </div>
                                <p>
                                    {item.postscript}
                                </p>
                            </li>
                        </ul>
                        {/*备注*/}
                        {item.remark?<div className="remark">备注：{item.remark}</div>:null}
                    </div>
                }

            }

        });
        return (
            <div>
                <div className="pay-content">
                    <div className="form-wrap">
                        <div  className="balance-item">
                            <label >余额：</label>
                            <div>
                                {this.props.balance+"元"}
                            </div>
                        </div>
                        <div className="company-pay">
                            <div className="pay-type">
                                <ul>
                                    {cardList.map((item,i)=>{
                                        return <li onClick={() => {this.handleSelectType(i)}} className={i === companyTypeIndex?"active":null} key={i}>{item.login_name}</li>
                                    })}
                                </ul>
                            </div>
                            <div>
                                {renderList}
                            </div>
                        </div>
                        <div className="form-item">
                            <label htmlFor="bandId">付款人姓名 :</label>
                            <div>
                                <input type="text" value={this.state.real_name} onChange={(e) => {
                                    this.handlechangeName(e)
                                }} placeholder="付款人姓名"/>
                            </div>
                        </div>
                        <div className="form-item">
                            <label htmlFor="bandId">充值金额 :</label>
                            <div>
                                <input type="number" value={this.state.money} onChange={(e) => {
                                    this.handlechangeMoney(e)
                                }} placeholder="输入金额"/>
                                <span>元</span>
                            </div>
                        </div>
                        <div className="select-money-wrap">
                            <ul>
                                {moneySelect}
                            </ul>
                        </div>
                        <div className="submit-wrap">
                            <button className="submit-btn" onClick={() => {
                                this.handleSubmit()
                            }}>确认充值
                            </button>
                        </div>
                        <div className="warning-info">
                            <p dangerouslySetInnerHTML={{__html: this.props.warmPrompt}}></p>
                        </div>

                    </div>
                </div>

            </div>
        );
    }
}



class NormalForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            money: "",
            moneySelectIndex: -1,
            pipeIndex: 0,
            cardList: this.props.data.child_cards.cardList,
            qrcode: "",
            visible: false,
            payModalItem: {
                visible: false,
            },
            html:""
        }
    }

    handleSelectMoney(i) {
        let arr = [100, 300, 500, 5000];
        this.setState({
            money: arr[i],
            moneySelectIndex: i
        });
    }

    //输入框改变
    handlechangeMoney(e) {
        this.setState({
            money: e.target.value,
            moneySelectIndex: -1
        });
    }

    handlechangePipe(i) {
        this.setState({
            pipeIndex: parseInt(i)
        });
        let payInfo = this.state.cardList[parseInt(i)];
    };

    handleSubmit() {
        let payInfo = this.state.cardList[this.state.pipeIndex];
        let money = this.state.money;
        let token = getRandChar();
        if ((!money) && money <= 0) {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error('请输入金额', 1);
            return;
        }

        //芒果单独判断 start || payInfo.shop_url_wap==1
        //

        if((["mgWap","quannengFu","gaoTong","yzWap","xingLian"].indexOf(payInfo.obj_name)!==-1)||payInfo.shop_url_wap==1){
            MaskLoading(5);
            Api("c=pay&a=pay", {
                requestURI: payInfo.requestURI,
                card_id: payInfo.card_id,
                token: token,
                money: money,
                area_flag: 1
            }, (res) => {
                MaskLoading(false);
                if (res.errno === 0) {
                    if (res.data.code === "url") {//直接跳转
                        let isQQ_WAP = payInfo.netway.indexOf("QQ_WAP")!==-1;
                        if(isQQ_WAP&&navigator.userAgent.indexOf('UCBrowser') !== -1){
                            let qrcode = res.data.url;
                            this.setState({
                                payModalItem: {
                                    visible: true,
                                    title: "长按扫描/保存二维码",
                                    type: "qrcode",
                                    qrcode: qrcode,
                                },
                                order_number: res.data.order_number
                            }, () => {
                                //二维码渲染出来替换成img，不然用户不能保存二维码
                                setTimeout(() => {
                                    let qrcodeImg = document.getElementById("qrcode").getElementsByTagName("canvas")[0].toDataURL();
                                    this.setState({
                                        payModalItem: {
                                            visible: true,
                                            title: "支付二维码",
                                            type: "qrcode",
                                            qrcodeImg: qrcodeImg,
                                            info:"请保存图片，打开"+(isQQ_WAP?"qq":"微信")+"识别"
                                        }
                                    })
                                }, 200)
                            });
                        }else{
                            location.href = (res.data.url);
                        }
                    } else if (res.data.code === "html") {//后台返回html
                        document.write(res.data.html);
                    } else {//二维码显示
                        let qrcode = res.data.url;
                        if(qrcode){
                            this.setState({
                                payModalItem: {
                                    visible: true,
                                    title: "长按扫描/保存二维码",
                                    type: "qrcode",
                                    qrcode: qrcode,
                                },
                                order_number: res.data.order_number
                            }, () => {
                                //二维码渲染出来替换成img，不然用户不能保存二维码
                                setTimeout(() => {
                                    let qrcodeImg = document.getElementById("qrcode").getElementsByTagName("canvas")[0].toDataURL();
                                    this.setState({
                                        payModalItem: {
                                            visible: true,
                                            title: "长按扫描/保存二维码",
                                            type: "qrcode",
                                            qrcodeImg: qrcodeImg,
                                        }
                                    })
                                }, 200)
                            });
                        }else{
                            let img = res.data.img;
                            this.setState({
                                payModalItem: {
                                    visible: true,
                                    title: "长按扫描/保存二维码",
                                    type: "qrcode",
                                    qrcode:"",
                                    qrcodeImg: img,
                                },
                                order_number: res.data.order_number
                            })
                        }



                    }
                }
            });
            return;
        }
        //芒果单独判断 end


        let myWindow;
        let ios = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if(ios&&(navigator.userAgent.indexOf('UCBrowser') !== -1 ||navigator.userAgent.indexOf('QBWebViewType') !== -1)) {
            myWindow=window;
        }else{
            myWindow=window.open();
        }
        MaskLoading(5);
        Api("c=pay&a=pay", {
            requestURI: payInfo.requestURI,
            card_id: payInfo.card_id,
            token: token,
            money: money,
            area_flag: 1
        }, (res) => {
            MaskLoading(false);
            if (res.errno === 0) {
                if (res.data.code === "url") {//直接跳转
                    let isQQ_WAP = payInfo.netway.indexOf("QQ_WAP")!==-1;
                    //ios uc浏览器 类型为qq_wap 转成二维码
                    if(isQQ_WAP&&navigator.userAgent.indexOf('UCBrowser') !== -1){
                        if(myWindow!==window){
                            myWindow.close();
                        }
                        let qrcode = res.data.url;
                        this.setState({
                            payModalItem: {
                                visible: true,
                                title: "长按扫描/保存二维码",
                                type: "qrcode",
                                qrcode: qrcode,
                            },
                            order_number: res.data.order_number
                        }, () => {
                            //二维码渲染出来替换成img，不然用户不能保存二维码
                            setTimeout(() => {
                                let qrcodeImg = document.getElementById("qrcode").getElementsByTagName("canvas")[0].toDataURL();
                                this.setState({
                                    payModalItem: {
                                        visible: true,
                                        title: "支付二维码",
                                        type: "qrcode",
                                        qrcodeImg: qrcodeImg,
                                        info:"请保存图片，打开"+(isQQ_WAP?"qq":"微信")+"识别"
                                    }
                                })
                            }, 200)
                        });
                    }else{
                        myWindow.location.href = res.data.url;
                    }

                } else if (res.data.code === "html") {//后台返回html
                    myWindow.document.write(res.data.html);
                } else {//二维码显示
                    if(myWindow!==window){
                        myWindow.close();
                    }
                    let qrcode = res.data.url;
                    if(qrcode){
                        this.setState({
                            payModalItem: {
                                visible: true,
                                title: "长按扫描/保存二维码",
                                type: "qrcode",
                                qrcode: qrcode,
                            },
                            order_number: res.data.order_number
                        }, () => {
                            //二维码渲染出来替换成img，不然用户不能保存二维码
                            setTimeout(() => {
                                let qrcodeImg = document.getElementById("qrcode").getElementsByTagName("canvas")[0].toDataURL();
                                this.setState({
                                    payModalItem: {
                                        visible: true,
                                        title: "长按扫描/保存二维码",
                                        type: "qrcode",
                                        qrcodeImg: qrcodeImg,
                                    }
                                })
                            }, 200)
                        });
                    }else{
                        let img = res.data.img;
                        this.setState({
                            payModalItem: {
                                visible: true,
                                title: "长按扫描/保存二维码",
                                type: "qrcode",
                                qrcode:"",
                                qrcodeImg: img,
                            },
                            order_number: res.data.order_number
                        })
                    }



                }
            }else{
                if(myWindow!==window){
                    myWindow.close();
                }
            }
        })
    }

    checkoutPayResult() {

        this.setState({
            payModalItem: {visible: false}
        });
        let number = this.state.order_number;
        Api("c=pay&a=lookOrder&remind=0", {
            order_number: number
        }, (res) => {
            message.warning(res.errstr);
        })

    }

    render() {
        let arr = this.state.cardList;
        let render = [];
        let pipeIndex = this.state.pipeIndex;
        let _this = this;
        arr.map(function (item, i) {
            if (i === pipeIndex) {
                render.push(<li key={i}>{item.login_name}<span style={{paddingLeft:'0.2rem',color:"#ccc",fontSize:'0.33rem'}}>单笔充值额度:{item.pay_small_input}元~{item.pay_max_input}元</span> <i className="pipe-slect"></i></li>)
            } else {
                render.push(<li onClick={() => {
                    _this.handlechangePipe(i)
                }} key={i}>{item.login_name}</li>)
            }
        });
        let moneyList = [100, 300, 500, 5000];
        let moneySelect = [];
        let moneySelectIndex = this.state.moneySelectIndex;
        moneyList.map(function (item, i) {
            if (i === moneySelectIndex) {
                moneySelect.push(<li className="money-select" key={i}>{item}</li>)
            } else {
                moneySelect.push(<li onClick={() => {
                    _this.handleSelectMoney(i)
                }} key={i}>{item}</li>)
            }
        });
        return (
            <div>
                <div className="pay-content">
                    <div className="form-wrap">
                        <div  className="balance-item">
                            <label >余额：</label>
                            <div>
                                {this.props.balance+"元"}
                            </div>
                        </div>
                        <div className="form-item">
                            <label htmlFor="bandId">请输入充值金额 :</label>
                            <div>
                                <input type="number" value={this.state.money} onChange={(e) => {
                                    this.handlechangeMoney(e)
                                }} placeholder="输入金额"/>
                                <span>元</span>
                            </div>
                        </div>
                        <div className="select-money-wrap">
                            <ul>
                                {moneySelect}
                            </ul>
                        </div>
                        <div className="select-pipe-wrap">
                            <h3>通道选择</h3>
                            <ul>
                                {render}
                            </ul>
                        </div>
                        <div className="submit-wrap">
                            <button className="submit-btn" onClick={() => {
                                this.handleSubmit()
                            }}>确认充值
                            </button>
                        </div>

                        <div className="warning-info">
                            <p dangerouslySetInnerHTML={{__html: this.props.warmPrompt}}></p>

                        </div>

                        {/*弹出框*/}
                        {this.state.payModalItem.visible ? <PayModal
                            item={this.state.payModalItem}
                            onCancel={() => {
                                this.checkoutPayResult();
                            }}
                        /> : null}

                    </div>
                </div>
            </div>
        );
    }
}

//生成支付token
const getRandChar = function () {
    let len = 36;
    let timestamp = new Date().getTime();
    let x = "0123456789qwertyuiopasdfghjklzxcvbnm";
    let random = '';
    for (let i = 0; i < len; i++) {
        random += x.charAt(Math.floor(Math.random() * x.length));
    }
    return timestamp + random;
}

//支付二维码，弹框

class PayModal extends Component {
    render() {
        let item = this.props.item;
        let content = null;
        if (item.type === "qrcode") {
            content = <div className="qrcode-wrap" id="qrcode">
                {item.qrcodeImg ? <img src={item.qrcodeImg} alt=""/> : <QRCode size={250} value={item.qrcode}/>}
            </div>
        }
        return (
            <Modal
                wrapClassName={"pay-modal-" + item.type + "-wrapper"}
                title={item.title}
                onCancel={() => {
                    this.props.onCancel()
                }}
                cancelText={null}
                visible={true}
                footer={null}
            >
                {content}
                <p>{item.info?item.info:""}</p>

            </Modal>
        );
    }
}
