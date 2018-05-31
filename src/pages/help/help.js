import React, { Component} from 'react'
import {Link } from 'react-router-dom';
import  Icon from 'antd/lib/icon';
import Navbar from '../common/navbar';
export default class Help extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div>
             <Navbar title="使用帮助" back="/setting" />
             <div className="help">
                <ul>
                    <li>
                        <Link   to={{ pathname: '/helpDetail', query: {id:1}}}>
                            <span>安全相关</span>
                            <Icon type="right" className='fr'/>
                        </Link></li>
                    <li>
                        <Link to={{ pathname: '/helpDetail', query: {id:2}}}>
                            <span>充值相关</span>
                            <Icon type="right" className='fr'/>
                        </Link></li>
                    <li>
                        <Link to={{ pathname: '/helpDetail', query: {id:3}}}>
                            <span>购彩相关</span>
                            <Icon type="right" className='fr'/>
                        </Link></li>
                    <li>
                        <Link to={{ pathname: '/helpDetail', query: {id:4}}}>
                            <span>提现相关</span>
                            <Icon type="right" className='fr'/>
                        </Link></li>
                    <li>
                        <Link to={{ pathname: '/helpDetail', query: {id:5}}}>
                            <span>用户协议</span>
                            <Icon type="right" className='fr'/>
                        </Link></li>
                    <li>
                        <Link to={{ pathname: '/helpDetail', query: {id:6}}}>
                            <span>责任声明</span>
                            <Icon type="right" className='fr'/>
                        </Link></li>
                </ul>
             </div>
          </div>

        )
    }
}
