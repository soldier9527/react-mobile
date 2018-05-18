import React,{Component} from 'react';
import Navbar from "../common/navbar";
import '../../css/agency_explain.scss';
import {Icon} from 'antd'

export default class Agency_explain extends Component{
    constructor(props){
        super(props);
    }

    render(){
            return(
                <div className="agency">
                    <Navbar title="代理说明" back="/group"/>
                    <img src={require("../../img/user/agentIntro.jpg")}/>
                    <div className="agency_explain">

                        <p>当您能看到这个页面，说明您的账号即是玩家账号也是代理账号，即可以自己投注，也可以发展下级玩家，赚取返点佣金。</p>
                        <h3>
                            <Icon type="user-add" style={{ fontSize: 22, color: '#d22018',    marginRight: '.3em' }} />
                            如何为下级开户？
                        </h3>
                        <p>点击“新增会员”，选择“手机”或"电脑"客户端，再为您的下级会员设置返点填写推广码（之前生成过推广链接的系统会自动保存，可反复使用）
                            点击生成后会生成一个推广链接以及推广二维码，
                            将推广链接或推广二维码发送给您的下级会员注册，注册后他就是您的下级会员，点击会员管理，就能查看他注册的账号；</p>
                        <p>点击“新增代理”，为您的下级代理设置用户名、返点与密码后点击“确认开户”</p>
                        <p>如果您为下级设置的是代理类型的账号，那么您的下级就能继续发展下级，
                            如果设置的是玩家类型，那么您的下级只能投注，不能再发展下级，也看不到代理中心；</p>
                        <h3>
                            <Icon type="star" style={{ fontSize: 22, color: '#d22018',    marginRight: '.3em' }} />
                            温馨提示：
                        </h3>
                        <p>返点不同赔率也不同；</p>
                        <p>返点越低，赔率就越低，建议为下级设置的返点不要过低；</p>
                        <p>可在代理报表、投注明细、注单明细查看代理的发展情况；</p>
                        <p>建议开设的下级也是代理类型，无论发展了几级，您都能获得返点。</p>
                    </div>
                </div>


            )
    }
}