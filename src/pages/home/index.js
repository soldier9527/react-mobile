import React, { Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../common/header'
import Footer from '../common/footer'
import "./home.scss"
export default class Home extends Component {
    render(){
        return (<div className="home-wrap">


            <Header></Header>
            <div className="home-content">
                <div className="w1200">
                    <div className="home-lottery-list">
                        <ul>
                            <li><Link to="/lottery"><span>时时彩</span></Link></li>
                            <li><Link to="/lottery"><span>时时彩</span></Link></li>
                            <li><Link to="/lottery"><span>时时彩</span></Link></li>
                            <li><Link to="/lottery"><span>时时彩</span></Link></li>
                            <li><Link to="/lottery"><span>时时彩</span></Link></li>
                        </ul>
                    </div>
                </div>

            </div>
            <Footer />
        </div>)
    }
}
