import React, { Component} from 'react'
import Navbar from '../common/navbar';
import {message,Modal} from 'antd';
import Api from '../api';
import  "../../css/resetpsd.scss"
import MaskLoading from '../common/maskLoading';// 防止重复点击

export default class ResetLoginPsd extends Component {
  constructor(props) {
    super(props);

  }

  handlesubmit(){
    const user = JSON.parse(sessionStorage.getItem("user"));
    let oldPsd=document.getElementById("oldPsd").value.trim();
    let newPsd=document.getElementById("newPsd").value.trim();
    let makesurePsd=document.getElementById("comfimPsd").value.trim();

    if(!oldPsd){
      message.config({
        top: 50,
        duration: 1,
        });
      message.error('请输入正确的旧密码');
      return false;
    }else if(oldPsd===newPsd){
      message.config({
        top: 50,
        duration: 1,
        });
      message.error('修改前和修改后的密码不能一样');
      return false;
    }else if(newPsd===""||makesurePsd===""){
      message.config({
        top: 50,
        duration: 1,
        });
      message.error('请输入您的新密码和确认密码')
    }else if(newPsd!==makesurePsd){
      message.config({
        top: 50,
        duration: 1,
        });
      message.error('新密码跟确认密码不一样');
      return false;
    }else {
        MaskLoading(5);
      Api("c=user&a=resetPwd&remind=0",{
        user_id:user.user_id,
        password:newPsd,
        old_pwd:oldPsd,
      },(res)=>{
          MaskLoading(false);
        if(res.errno===0){
          Modal.success({
            title:'提示',
            content:'修改登录密码成功,点击确定后请重新登录',
            onOk(){
            sessionStorage.removeItem("user");
            this.props.history.push("login");
          }
          })
        }else{
          Modal.info({
            title:'提示',
            content:res.errstr,
          })
        }

      });
      return true;
    }

  }

  render() {
    return (
      <div>
        <Navbar back="back" title="修改登录密码"/>
          <div className="resetPsd">
            <ul>
              <li>
                <span>旧的登录密码</span>
                <input id="oldPsd" type="password" placeholder="(6-15位字母和数字)"/>
              </li>
              <li>
                <span>新的登录密码</span>
                <input id="newPsd" type="password" placeholder="(6-15位字母和数字)"/>
              </li>
              <li>
                <span>确认登录密码</span>
                <input id="comfimPsd" type="password" placeholder="(6-15位字母和数字)"/>
              </li>
            </ul>
            <p>为了您的账户安全，请勿使用您用于登录其他网站的密码或容易被猜到的密码（例如您的名字或生日）；如您忘记密码，请联系在线客服</p>
            <input className="submit_btn" type="button" value="确定" onClick={()=>{this.handlesubmit()}}/>
          </div>
      </div>
    );
  }
}
