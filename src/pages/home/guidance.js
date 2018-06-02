import React, {Component,} from 'react'
import {Link} from 'react-router-dom';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import "./guidance.scss"
import config from '../config'
export default class Guidance extends Component {
    constructor(props) {
        super(props);
    }
    downloadIos(url) {
        window.open(url);
    }
    render() {
        return (
            <div className='guidance'>
                <span className='LOGO'></span>
                <Link to="/home" className='a-home'>
                    继续访问
                </Link>
                <p>温馨提示：WEB手机端直接点击链接按钮访问</p>
                <p className='APP-p'>推荐您使用手机APP购彩,请选择下载</p>
                <div className='a-but1' >
                    <Button className='guidance-But' onClick={()=>this.downloadIos(config.apple)}>
                    <Icon type='apple' style={{fontSize: "28px", color: '#00FEA7', paddingRight: '12px'}}/>
                        APP Store下载</Button>
                </div>
                <div className='a-but2'>
                    <Button className='guidance-But2' onClick={()=>this.downloadIos(config.android)}>
                        <Icon type='android' style={{
                        fontSize: "28px",
                        color: '#FEF200',
                        paddingRight: '22px'
                        }}/>
                        Android 下载
                    </Button>
                </div>
            </div>
        )
    }

}
