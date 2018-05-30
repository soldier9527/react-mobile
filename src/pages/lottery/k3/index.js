import React, {Component} from "react"
import '../../../css/k3.scss';
import {LotteryCommon} from '../components/common';
import Game from '../components/game';
import  Icon from 'antd/lib/icon';

class LtK3 extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    //计算注数，参数cart： 购物车数组
    calcItem(cart) {
        //=============计算注数 start=============
        let md = this.props.md;
        if (!md) {
            return null;
        }
        const game = new Game(this.props);
        let zhushu = 0;
        let content = [];
        cart.map((item, i) => {
            if (item) {
                item.sort()//排序
            }
        });
        let data = "";
        if (['JSETDX'].indexOf(md.name) === -1) {
            md.field_def.map((num, i) => {
                if (cart[i]) {
                    if (['JSETFX', 'JSHZ', 'JSSTTX', 'JSSTDX', 'KS-HZDXDS', "KSCP"].indexOf(md.name) !== -1) {
                        data += cart[i].join("_")
                    } else if (['JSSTTX', 'JSSLTX', 'JSSBT', 'JSEBT'].indexOf(md.name) !== -1) {
                        data += cart[i].join("")
                    }
                }
                content.push(data);
            });
        } else {
            if (cart[0] && cart[1]) {
                content.push(cart[0].join("_"));
                content.push(cart[1].join(""));
            }
        }
        if (content.length === md.field_def.length) {
            zhushu = game.isLegalCode(content, md.name)['singleNum'];
        }
        return {
            content: content,
            zhushu: zhushu,
        };
        //=============计算注数end=============
    }

    //参数cart
    setCart(i, num, arr, type) {
        let cart = this.props.cart;
        cart = JSON.parse(JSON.stringify(cart));
        if (['JSETDX'].indexOf(this.props.md.name) !== -1) {//单独判断2同号
            if (cart[i] && cart.length > 0) {
                if (cart[i].indexOf(num) === -1) {
                    cart[i].push(num)
                    if (i === 0) {
                        if (cart[1] && cart[1].indexOf(num.substr(1)) != -1) {
                            cart[1].splice(cart[1].indexOf(num.substr(1)), 1)
                        }
                    } else {
                        if (cart[0] && cart[0].indexOf(num + "" + num) !== -1) {
                            cart[0].splice(cart[0].indexOf(num + "" + num), 1)
                        }
                    }
                } else {
                    cart[i].splice(cart[i].indexOf(num), 1)
                }
            } else {
                cart[i] = [num];
                if (i === 0) {
                    if (cart[1] && cart[1].indexOf(num.substr(1)) != -1) {
                        cart[1].splice(cart[1].indexOf(num.substr(1)), 1)
                    }
                } else {
                    if (cart[0] && cart[0].indexOf(num + "" + num) !== -1) {
                        cart[0].splice(cart[0].indexOf(num + "" + num), 1)
                    }
                }
            }

        } else {
            if (cart[i] && cart.length > 0) {
                if (cart[i].indexOf(num) === -1) {
                    cart[i].push(num)
                } else {
                    cart[i].splice(cart[i].indexOf(num), 1)
                }
            } else {
                cart[i] = [num];

            }
        }
        let item = this.calcItem(cart);
        let cartItem = {
            zhushu: item.zhushu,//注数
            content: item.content,//content
            cart: cart//购物车
        };
        this.props.setCartItem(cartItem);
    }

    //设置整合购物车
    setCartSpecil(i, num, arr, type, index) {
        let md = this.props.md;
        let cart = this.props.cart;
        let liangmianZhushu = {};
        let zhushu = 0;
        let contentArr = [];
        cart = JSON.parse(JSON.stringify(cart));
        let cartData = cart[index] ? cart[index] : [];
        if (cartData[i]) {
            if (cartData[i].indexOf(num) === -1) {
                cartData[i].push(num)
            } else {
                cartData[i].splice(cartData[i].indexOf(num), 1)
            }
        } else {
            cartData[i] = [num];
        }
        cart[index] = cartData;
        const game = new Game(this.props);
        for (let i = 0; i < cart.length; i++) {
            let content = [];
            let item = cart[i];
            if (item) {
                for (let index = 0, len = md.field_def[i].length; index < len; index++) {
                    if (item[index] && (item[index][0] < 6)) {
                        content.push(item[index].join(""))
                    } else {
                        content.push(item[index].join("_"))
                    }
                }
                ;
            } else {

            }
            let singleNum = game.isLegalCode(content, md.name[i])['singleNum'];
            zhushu += singleNum;
            liangmianZhushu[i] = singleNum
            contentArr.push(content);
        }
        let cartItem = {
            zhushu: zhushu,//注数
            liangmianZhushu: liangmianZhushu,
            content: contentArr,//contentArr
            cart: cart//购物车
        };
        this.props.setCartItem(cartItem);
    }

    render() {
        let cart = this.props.cart;//购物车
        let md = this.props.md;
        let game = new Game(this.props);
        if (!md) {
            return null;
        }
        let methodId = this.props.md.name;
        let touzhu = [];
        if (md.type === "special") { //玩法整合
            touzhu = <LtSpecial
                md={this.props.md}//当前玩法数据
                cart={this.props.cart}//当前购物车
                handlechooseNum={(i, num, arr, type, index) => {
                    this.setCartSpecil(i, num, arr, type, index)
                }}
                buttonType={this.props.buttonType}
                prize={this.props.md.prize}//赔率
                gamePrize={this.props.gamePrize}//拉杆赔率
                divisor={this.props.divisor}
            />
        } else if ('KS-HZDXDS' == methodId || 'JSHZ' == methodId) {
            touzhu = <NumList
                gamePrize={this.props.gamePrize}
                md={this.props.md}//当前玩法数据
                handlechooseNum={(e, num) => {
                    this.setCart(e, num)
                }}
                cart={this.props.cart}//当前购物车
                prize={this.props.md.prize}//赔率
                divisor={this.props.divisor}
            />
        } else if ('JSETDX' == methodId) {
            let prize = game.toFixed(parseFloat(this.props.md.prize[1] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3);
            md.field_def.map((item, i) => {
                let numArr = item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className={i === 1 ? "one_num1" : ""}></div>
                        <div className="nav">
                            <Icon type="down-circle" style={{fontSize: "15px", color: '#d22018'}}/>
                            <span className='long-short'>{item.prompt}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i === 0 ? "two_num" : "one_num"}>
                            <ul>
                                {numArr.map((num, j) => {
                                    return <li key={j}
                                               className={cart[i] && cart[i].indexOf(num) !== -1 ? "k3-0" + num : "k3-" + num}
                                               onClick={() => {
                                                   this.setCart(i, num)
                                               }}></li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        } else if ('JSETFX' == methodId) {
            let prize = game.toFixed(parseFloat(this.props.md.prize[1] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3);
            md.field_def.map((item, i) => {
                let numArr = item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <Icon type="down-circle" style={{fontSize: "15px", color: '#d22018'}}/>
                            <span className='long-short'>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i === 0 ? "two_num" : "one_num"}>
                            <ul>
                                {numArr.map((num, j) => {
                                    return <li key={j}
                                               className={cart[i] && cart[i].indexOf(num) !== -1 ? "k3-0" + num : "k3-" + num}
                                               onClick={() => {
                                                   this.setCart(i, num)
                                               }}></li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        } else if ('JSEBT' == methodId) {
            let prize = game.toFixed(parseFloat(this.props.md.prize[1] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3);
            md.field_def.map((item, i) => {
                let numArr = item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <Icon type="down-circle" style={{fontSize: "15px", color: '#d22018'}}/>
                            <span className='long-short'>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i === 0 ? "one_num" : "two_num"}>
                            <ul>
                                {numArr.map((num, j) => {
                                    return <li key={j}
                                               className={cart[i] && cart[i].indexOf(num) !== -1 ? "k3-0" + num : "k3-" + num}
                                               onClick={() => {
                                                   this.setCart(i, num)
                                               }}></li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        } else if ('JSSTDX' == methodId) {
            let prize = game.toFixed(parseFloat(this.props.md.prize[1] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3);
            md.field_def.map((item, i) => {
                let numArr = item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <Icon type="down-circle" style={{fontSize: "15px", color: '#d22018'}}/>
                            <span className='long-short'>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i === 0 ? "three_num" : "null"}>
                            <ul>
                                {numArr.map((num, j) => {
                                    return <li key={j}
                                               className={cart[i] && cart[i].indexOf(num) !== -1 ? "k3-0" + num : "k3-" + num}
                                               onClick={() => {
                                                   this.setCart(i, num)
                                               }}></li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        } else if ('JSSTTX' == methodId) {
            let prize = game.toFixed(parseFloat(this.props.md.prize[1] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3);
            md.field_def.map((item, i) => {
                let numArr = item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <Icon type="down-circle" style={{fontSize: "15px", color: '#d22018'}}/>
                            <span className='long-short'>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i === 0 ? "three_all" : "null"}>
                            <ul>
                                {numArr.map((num, j) => {
                                    return <li key={j}
                                               className={cart[i] && cart[i].indexOf(num) !== -1 ? "san" : "san1"}
                                               onClick={() => {
                                                   this.setCart(i, num)
                                               }}>{md.cname}</li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        } else if ('JSSBT' == methodId) {
            let prize = game.toFixed(parseFloat(this.props.md.prize[1] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3);
            md.field_def.map((item, i) => {
                let numArr = item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <Icon type="down-circle" style={{fontSize: "15px", color: '#d22018'}}/>
                            <span className='long-short'>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i === 0 ? "one_num" : "null"}>
                            <ul>
                                {numArr.map((num, j) => {
                                    return <li key={j}
                                               className={cart[i] && cart[i].indexOf(num) !== -1 ? "k3-0" + num : "k3-" + num}
                                               onClick={() => {
                                                   this.setCart(i, num)
                                               }}></li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        } else if ('JSSLTX' == methodId) {
            let prize = game.toFixed(parseFloat(this.props.md.prize[1] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3);
            md.field_def.map((item, i) => {
                let numArr = item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <Icon type="down-circle" style={{fontSize: "15px", color: '#d22018'}}/>
                            <span className='long-short'>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i === 0 ? "three_all" : "null"}>
                            <ul>
                                {numArr.map((num, j) => {
                                    return <li key={j}
                                               className={cart[i] && cart[i].indexOf(num) !== -1 ? "san" : "san1"}
                                               onClick={() => {
                                                   this.setCart(i, num)
                                               }}>{md.cname}</li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        } else if ('KSCP' == methodId) {
            let prize = game.toFixed(parseFloat(this.props.md.prize[1] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3);
            md.field_def.map((item, i) => {
                let numArr = item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <Icon type="down-circle" style={{fontSize: "15px", color: '#d22018'}}/>
                            <span className='long-short'>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className="long_board">
                            <ul>
                                {numArr.map((num, j) => {
                                    let a = num.substr(0, 1);
                                    let b = num.substr(1, 1);
                                    return <li key={j} onClick={() => {
                                        this.setCart(i, num)
                                    }}>
                                        <span
                                            className={cart[i] && cart[i].indexOf(num) !== -1 ? "k3-0" + a : "k3-" + a}></span>
                                        <span
                                            className={cart[i] && cart[i].indexOf(num) !== -1 ? "k3-0" + b : "k3-" + b}></span>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        }
        return (
            <div className="lt-k3-wrapper">
                {touzhu}
            </div>
        )
    }
}

class NumList extends Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    render() {
        let md = this.props.md;
        let game = new Game(this.props);
        let simple = [];
        if (this.props.md.num_level.simple) {
            simple = this.props.md.num_level.simple.split(" ");
        }
        if (!md) {
            return null;
        }
        let cart = this.props.cart;
        let renderNumList = [];
        md.field_def.map((item, i) => {
            if (!item.nums) {
                return
            }
            let codeArr = item.nums.split(" ");
            renderNumList.push(
                <div className="ch_chart" key={i}>
                    <div className="ch_num_w">
                        <Icon type="down-circle" style={{fontSize: "15px", color: '#d22018'}}/>
                        &nbsp;&nbsp;&nbsp;{md.name == "JSHZ" ? md.cname : item.prompt}
                    </div>
                    <div className="ch_num_box">
                        {item.has_filter_btn == 1 ? <div className="ch_num_btns"></div> : null}
                        <ul className="ch_num_show">
                            {codeArr.map((num, j) => {
                                return (<li key={j}>
                                    <button onClick={() => {
                                        this.props.handlechooseNum(i, num)
                                    }} type="button"
                                            className={cart[i] && cart[i].indexOf(num) !== -1 ? "ant-btn on " : "ant-btn off "}>
                                        {num}
                                    </button>
                                    <p>{this.props.md.num_level.simple ? game.toFixed(parseFloat(this.props.md.prize[simple[j]] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3) : game.toFixed(parseFloat(this.props.md.prize[1] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3)}</p>
                                </li>)
                            })
                            }
                        </ul>
                    </div>
                </div>
            )
        });
        return (
            <div>
                {renderNumList}
            </div>
        )
    }
}

//整合
class LtSpecial extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let field_defArr = this.props.md.field_def;
        let num_levelArr = this.props.md.num_level;
        let prizeArr = this.props.md.prize;
        let cart = this.props.cart;
        let renderNumList = [];
        let pic_show = ["全骰", "大小单双"];//显示图片不要汉字内容的
        let game = new Game(this.props);
        let mg_name = this.props.md.mg_name;
        field_defArr.map((field_def, f) => {
            let prize = [];
            let numleval = [];
            if (num_levelArr[f]) {
                numleval = num_levelArr[f].simple.split(" ");
                numleval.map((num, i) => {

                    prize.push(game.toFixed(parseFloat(prizeArr[f][num] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3));
                })
            } else {
                prize.push(game.toFixed(parseFloat(prizeArr[f][1] * 10000) * this.props.gamePrize * 10000 / (this.props.divisor * 10000) / 10000, 3));
            }


            field_def.map((item, i) => {
                let codeArr = item.nums.split(" ");
                renderNumList.push(
                    <div className="ch_chart " key={f + "_" + i}>
                        <div className="ch_num_w">
                            <Icon type="down-circle" style={{fontSize: "15px", color: '#d22018'}}/>
                            &nbsp;&nbsp;&nbsp;{mg_name[f]}
                            {num_levelArr[f] ? "" : <span>赔率：{prize[0]}</span>}
                        </div>
                        <div className={this.props.md.mg_name[0] == "三军" ? "one_num" : "three_num"}>
                            <ul>

                                {codeArr.map((num, j) => {
                                    return (<li key={j}
                                                onClick={() => {
                                                    this.props.handlechooseNum(i, num, "", "", f)
                                                }}
                                                className={cart[f] && cart[f][i] && cart[f][i].indexOf(num) !== -1 ? "on k3-0" + num : "off k3-" + num}>
                                        <p className={num == "全骰" || num == "大" || num == "小" || num == "单" || num == "双" ? "btn" : ""}>{num == "全骰" || num == "大" || num == "小" || num == "单" || num == "双" ? num : ""}</p>
                                    </li>)
                                })
                                }

                            </ul>
                        </div>
                    </div>
                )
            });
        });

        return (
            <div>
                {renderNumList}
            </div>
        )
    }
}

export default LotteryCommon(LtK3);