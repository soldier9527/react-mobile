import React, {Component} from 'react'
import {Link} from 'react-router-dom';
import Navbar from '../common/navbar';
import './rebate.scss';
import Api from '../api';

export default class MySetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meg: ''//赔率
        };
    };

    componentWillMount() {

    };


    render() {
        let navbarRight = <Link to="/home" className="set">时时彩</Link>;
        return (
            <div className="rebate">
                <Navbar title="返点赔率表" back={"/home"} navbarRight={navbarRight}/>
                <div className="header">
                    <p className="notes">时时彩是基于2元1注的奖金模式，奖金÷2换算成赔率</p>
                    <ul className="nav">
                        <li><span>玩法</span><span>返点</span><span className=""></span></li>
                        <li>0.1</li>
                        <li>0.0</li>
                     </ul>
                    <ul className="play">
                        <li>一星-复式</li>
                        <li className="base">二星-直选复式</li>
                        <li>二星-直选单式</li>
                        <li className="base">二星-直选和值</li>
                        <li>大小单双-二星</li>
                        <li className="base">大小单双-三星</li>
                        <li>一星-复式</li>
                        <li className="base">二星-直选复式</li>
                        <li>二星-直选单式</li>
                        <li className="base">二星-直选和值</li>
                        <li>大小单双-二星</li>
                        <li className="base">大小单双-三星</li>
                        <li>一星-复式</li>
                        <li className="base">二星-直选复式</li>
                        <li>二星-直选单式</li>
                        <li className="base">二星-直选和值</li>
                        <li>大小单双-二星</li>
                        <li className="base">大小单双-三星</li>
                        <li>一星-复式</li>
                        <li className="base">二星-直选复式</li>
                    </ul>
                </div>
            </div>
        )
    }
}
