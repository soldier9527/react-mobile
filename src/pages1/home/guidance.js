import React, { Component, } from 'react'
import {Link} from 'react-router-dom';
import {Button, Icon} from 'antd';
export default class Guidance extends Component{
    constructor(props){
        super(props);
    }

    //IOS下载链接
    downloadIos(){
      //打开新的窗口
      window.open("https://9797mr.com");
    }
    render(){
        return(
            <div className='guidance'>

                <span className='LOGO'></span>
                <Link to="Home" className='a-home'>
                    继续访问
                </Link>
                <p>温馨提示：WEB手机端直接点击链接按钮访问</p>
                <p className='APP-p'>推荐您使用手机APP购彩,请选择下载</p>
                <a className='a-but1' onClick={this.downloadIos.bind(this)}><Button className='guidance-But'><Icon type='apple' style={{fontSize:"28px" ,color:'#00FEA7', paddingRight:'12px'}}/>APP Store下载</Button></a>
              <Link to="Home" className='a-but2'>
              <Button className='guidance-But2'><Icon type='android' style={{fontSize:"28px",color:'#FEF200',paddingRight:'22px'}}/>Android 下载</Button>
              </Link>
            </div>
        )
    }

}
