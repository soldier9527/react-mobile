
import React from 'react';
import {
    HashRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import Loadable from 'react-loadable';
// import Login from '../pages/login/login'
// import Register from '../pages/login/register'
// import Hall from '../pages/hall/index'; // 大厅
// import OpenList from '../pages/open/index' // 开奖信息
// import UserIndex from '../pages/user/index' // 开奖信息
const Loading = () => <div>Loading...</div>;
// import Home from '../pages/home/index'
const Home = Loadable({
    loader: () => import(process.env.REACT_APP_HOME?process.env.REACT_APP_HOME:"../pages/home/index"),
    loading: Loading,
});


//个人中心
import Login from '../pages/login/index'; // 未登录
import Register from '../pages/login/register'; // 注册

import User from '../pages/user/index' // 用户中心
import WithDrawMoney from '../pages/user/withdrawMoney' //  提现
import Order from '../pages/user/order' //  订单
import Information from '../pages/user/information' //  信息中心
import Account from '../pages/user/account' //  信息中心
import User_login from '../pages/user/user_login' //已登录
import User_state from '../pages/user/user_state' //个人信息
import SetUserInfo from '../pages/user/setUserInfo' //个人信息
import GetService from '../pages/user/getService'//在线客服
import Order_Deatil from '../pages/user/order_deatil'//订单详情
import TraceSingle from '../pages/lottery/components/traceSingle' // 追号单页面  从订单详情进入
import Setpassword from '../pages/user/setpasswrod'//提现密码
import BankCardBind from '../pages/user/bankcardbind'//绑定银行卡
import InformationList from '../pages/user/informationList'//今日热点
import InformationDetail from '../pages/user/informationDetail'//今日热点详情
import ReceiveBoxList from '../pages/user/receiveBoxList'//系统消息
import ReceiveBoxDetail from '../pages/user/receiveBoxDetail'//系统消息详情
import Guidance from '../pages/home/guidance' //引导页
import To_load from  '../pages/home/to_load'
import ResetLoginPsd from '../pages/user/resetloginpsd' //个人信息
//开奖信息
import OpenList from '../pages/open/index' // 开奖信息
import HistoryList from '../pages/open/historyList' // 开奖信息
import WinDetail from '../pages/open/winDetail'
import LotteryTrend from '../pages/open/lotteryTrend'
// 大厅
import Hall from '../pages/hall/index'; // 大厅
// 各个彩种入口 START
// import ltSSC from '../pages/lottery/ssc/index';
import ltSSC from '../pages/lottery/ssc/index';
import Lt11x5 from '../pages/lottery/11x5/index';
import Ltpks from '../pages/lottery/pk10/index';//PK10
import Ltxyft from '../pages/lottery/xyft/index';
import LtFC3D from '../pages/lottery/fc3D/index';
import Ltlhc from '../pages/lottery/lhc/index'
import ltP3P5 from '../pages/lottery/p3p5/index';
import Ltklpk from '../pages/lottery/klpk/index';
import LtSSQ from '../pages/lottery/ssq/index';
import LtK3 from '../pages/lottery/k3/index';
import Ltxy28 from '../pages/lottery/lucky28/index'

import Mmc from '../pages/lottery/mmc/index'
// 各个彩种入口 END
//其他
import PromoDetailforuser from '../pages/promo/promoDetail-for-user'//个人中心和首页跳转优惠活动详情页面
import Promoforuser from '../pages/promo/indexForuser'//个人中心和首页跳转优惠活动页面
import Promo from '../pages/promo/index' // 优惠活动
import PromoDetail from '../pages/promo/promoDetail' //优惠活动详情
import MySetting from '../pages/mySetting/index' // 我的最爱设置
//充值
import Pay from '../pages/user/pay' //  充值
//电子钱包，电子游戏
import Wallet from '../pages/wallet/index';//电子钱包
import Inegame from '../pages/wallet/inegame';//转入
import Outegame from '../pages/wallet/outegame';//转出
//设置
import Setting from '../pages/user/setting';//我的设置
import Ours from '../pages/user/ours';//关于我们
// 帮助
import Help from '../pages/help/help';//帮助列表
import HelpDetail from '../pages/help/helpDetail';//帮助详情
import Feedback from '../pages/help/feedback'//意见反馈
//代理中心
import Group_add_custom1 from '../pages/group/group_add_custom1'//新增会员,更新
import Group_custom1 from '../pages/group/group_custom1'//会员管理，更新
import Group_member_detail from '../pages/group/group_member_detail'//会员及代理详情
import Group_member_change_level from '../pages/group/group_member_change_level'//会员转代理
import Group_profit_change1 from '../pages/group/group_profit_change1'//团队帐变报表,更新
import Group_profit1 from '../pages/group/group_profit1'//团队盈亏报表,更新
import Group_withdraw1 from '../pages/group/group_withdraw1'//团队提现明细，更新
import Group_recharge1 from '../pages/group/group_recharge1'//团队充值明细,更新
import Group from '../pages/user/group' //  代理中心
import Group_agent from '../pages/group/group_agent' //  代理中心
import Agency_explain from '../pages/group/agency_explain'//代理说明

import Vindicate from '../pages/vindicate/vindicate' //维护
import getStaticData from '../pages/common/getStatic' //维护


const PageRouter  = () =>(
    <HashRouter>
        <div>
            <Switch>
                <Redirect exact path="/" to="/home" />
                <Route path="/home" component={Home}></Route>
                <Route path="/receiveBoxDetail" component={ReceiveBoxDetail}></Route>
                <Route path="/receiveBoxList" component={ReceiveBoxList}></Route>
                <Route path="/informationDetail" component={InformationDetail}></Route>
                <Route path="/informationList" component={InformationList}></Route>
                <Route path="/setpasswrod" component={Setpassword}></Route>
                <Route path="/order_deatil" component={Order_Deatil}></Route>
                <Route path="/tracesingle" component={TraceSingle}></Route>{/* 追号单页面  从订单详情进入*/}
                <Route path="/bankCardBind" component={BankCardBind}></Route>
                <Route path="/getService" component={GetService}></Route>
                <Route path="/login" component={Login}></Route>
                <Route path="/user_login" component={User_login}></Route>
                <Route path="/user_state" component={User_state}></Route>
                <Route path="/setUserInfo" component={SetUserInfo}></Route>
                <Route path="/resetLoginPsd" component={ResetLoginPsd}></Route>



                <Route path="/group_agent" component={Group_agent}></Route>
                <Route path="/feedback" component={Feedback}></Route>
                <Route path="/helpDetail" component={HelpDetail}></Route>
                <Route path="/wallet" component={Wallet}></Route>
                <Route path="/ours" component={Ours}></Route>
                <Route path="/help" component={Help}></Route>
                <Route path="/inegame" component={Inegame}></Route>
                <Route path="/setting" component={Setting}></Route>
                <Route path="/outegame" component={Outegame}></Route>
                <Route path="/register" component={Register}></Route>
                {/*<Route path="/home/promodetail" component={HomePromodetail}></Route>*/}
                <Route path="/user" component={User}></Route>
                <Route path="/guidance" component={Guidance}></Route>

                {/* 购彩 */}
                <Route path="/hall" component={Hall}></Route>
                <Route path="/ssc/:id" component={ltSSC}></Route>
                <Route path="/11x5/:id" component={Lt11x5}></Route>
                <Route path="/pk10/:id" component={Ltpks}></Route>
                <Route path="/xyft/:id" component={Ltxyft}></Route>
                <Route path="/fc3D/:id" component={LtFC3D}></Route>
                <Route path="/ssq/:id" component={LtSSQ}></Route>
                <Route path="/p3p5/:id" component={ltP3P5}></Route>
                <Route path='/lhc/:id' component={Ltlhc}></Route>

                <Route path="/klpk/:id" component={Ltklpk}></Route>
                <Route path="/xy28/:id" component={Ltxy28}></Route>
                <Route path='/K3/:id' component={LtK3}></Route>
                <Route path="/mmc/:id" component={Mmc}></Route>
                {/*开奖  start*/}
                <Route path="/open" component={OpenList}></Route>
                <Route path="/history" component={HistoryList}></Route>
                <Route path="/open/winDetail" component={WinDetail}></Route>
                <Route path="/lotteryTrend" component={LotteryTrend}></Route>
                <Route path="/promo/userimg/:id" component={PromoDetailforuser}></Route>
                <Route path="/promo/user" component={Promoforuser}></Route>
                <Route path="/promo/id/:name" component={Promo}></Route>
                <Route path="/promo/img/:id" component={PromoDetail}></Route>
                <Route path="/promo" component={Promo}></Route>
                <Route path="/mySetting" component={MySetting}></Route>
                <Route path="/pay" component={Pay}></Route>
                <Route path="/withdrawMoney" component={WithDrawMoney}></Route>
                <Route path="/order" component={Order}></Route>information
                <Route path="/group" component={Group}></Route>
                <Route path="/information" component={Information}></Route>
                <Route path="/account" component={Account}></Route>
                <Route path="/group_recharge1" component={Group_recharge1}></Route>
                <Route path='/group_withdraw1' component={Group_withdraw1}></Route>
                <Route path='/group_profit1' component={Group_profit1}></Route>
                <Route path='/group_profit_change1' component={Group_profit_change1}></Route>
                <Route path='/group_custom1' component={Group_custom1}></Route>
                <Route path='/group_member_detail/:memberId/:memberName/:memberLevel' component={Group_member_detail}></Route>
                <Route path={'/group_member_change_level/:memberId/:rebate/:bonusOdds/:memberName/:memberLevel'} component={Group_member_change_level}></Route>
                <Route path='/group_add_custom1' component={Group_add_custom1}></Route>
                <Route path="/setpassword" component={Setpassword}></Route>{/*//设置资金密码*/}
                <Route path="/vindicate" component={Vindicate}/>
                <Route path="/agency_explain" component={Agency_explain}></Route>
                {/*<Route path="/login" component={Login}></Route>*/}
                {/*<Route path="/register" component={Register}></Route>*/}
                {/*<Route path="/hall" component={Hall}></Route>*/}
                {/*<Route path="/open" component={OpenList}></Route>*/}
                {/*<Route path="/user" component={UserIndex}></Route>*/}
            </Switch>
        </div>
    </HashRouter>
    )

export default PageRouter;
