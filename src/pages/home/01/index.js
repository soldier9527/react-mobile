import React, { Component} from 'react'
import {Link} from 'react-router-dom';
import Modal from 'antd/lib/modal';
import {Carousel,NoticeBar} from 'antd-mobile';
import Navbar from '../../common/navbar';
import Footer from '../../common/footer';
import Api from '../../api';
import'./home.scss';
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.changePath = this.changePath.bind(this);
        let user = sessionStorage.getItem("user");
        this.state = {
            user:user,
            series_number: '---',
            lottery_number: ['-', '-', '-', '-', '-'],
            carouse_data:['','',''], //首页轮播图片
            Popular_lottery_data:[],//热门彩票
            TheColor_img:[], //彩种小图片
            latest_lotteryData:[],  //最新开奖
            announ_cement:[],   //首页公告
            announ_title:[],//首页标题
            myFavorite:[],//我的最爱
            disPlay:window.sessionStorage.myFavorite?'none':'block',//显示或者隐藏
            popularSetTime:null ,  //定时器序号
            visible:false,//弹窗
            title:"",//弹窗标题
            content:"",//弹窗内容
            isUnMount:false,//通过调用isUnMount（）判断组件是否被卸载
            welcomeDisplay:"",
            Openinfo:false,//轮播公告
            card_num: 'init',
            psdvisible: false,
            cardvisible: false,
            isset_secpwd: '',
            egameTips:'',
            egameshow:false,
            tempwindow:"",
            href:"",
            tempwindow1:"",
            showVideo:window.sessionStorage.og_protect==1?1:0,//真人视讯维护的情况处理

            signShow:false,
        };
        this.window = this.window.bind(this);
        this.sportsLottery = this.sportsLottery.bind(this);
        this.live_video = this.live_video.bind(this);
        this.windowopen = this.windowopen.bind(this);
    };
    getWelcome(callback){
        Api("c=default&a=welcome",null,(res)=>{
            callback(res)
        })

    }
    //真人视讯跳转
    live_video(){
        const user = JSON.parse(sessionStorage.getItem("user"));
        if(user){
            Api("c=livegame&a=play",{user_id:user.user_id},(res)=>{
                    // 获取UserAgent
                    var u = navigator.userAgent;
                    // 安卓
                    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
                    // IOS
                    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                    //针对苹果uc以及QQ浏览器做当前页面嵌套
                    if( isiOS === true && navigator.userAgent.indexOf("UCBrowser") !== -1 || navigator.userAgent.indexOf("MQQBrowser") !== -1 || navigator.userAgent.indexOf("baidubrowser") !== -1) {
                        location.href = res.data;
                    }else if(this.state.tempwindow1){
                        this.state.tempwindow1.location=res.data;
                        setTimeout(()=>{
                            this.setState({tempwindow1:null})
                        },500)
                    }
            })
        }
    }
    windowopen(){
        const user = JSON.parse(sessionStorage.getItem("user"));
        let Reg=/^[a-z0-9]+$/;
        let showVideo;
        if(window.sessionStorage.og_protect){
            showVideo=JSON.parse(sessionStorage.getItem("og_protect"));
        }else{
            showVideo=this.state.showVideo;
        }
        if(user){
            // 获取UserAgent
            var u = navigator.userAgent;
            // 安卓
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            // IOS
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            //针对苹果uc以及QQ浏览器做当前页面嵌套
            if(!Reg.test(user.username)){
                message.config({
                    top: 20,
                    duration:4,
                });
                message.warning('账号不合法')
                return
            }else if(showVideo===1){
                message.config({
                    top: 20,
                    duration:4,
                });
                message.warning('系统维护')
                return
            }else if(showVideo==0){
                if( isiOS === true && navigator.userAgent.indexOf("UCBrowser") !== -1 || navigator.userAgent.indexOf("MQQBrowser") !== -1 || navigator.userAgent.indexOf("baidubrowser") !== -1) {
                    // location.href = this.state.url;/
                    this.live_video();
                } else {
                    this.setState({tempwindow1:window.open("","",'_blank')});
                    this.live_video();
                }
            }
        }else {
            message.config({
                top: 20,
                duration:4,
            });
            message.warning("请先登录");
        }

    }
    sportsLottery(){
        const user = JSON.parse(sessionStorage.getItem("user"));
        if(user){
            Api("c=sportGame&a=login",{user_id:user.user_id},(res)=>{
                // 获取UserAgent
                if(res.data){
                    var u = navigator.userAgent;
                    // 安卓
                    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
                    // IOS
                    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                    //针对苹果uc以及QQ浏览器做当前页面嵌套
                    if( isiOS === true && navigator.userAgent.indexOf("UCBrowser") !== -1 || navigator.userAgent.indexOf("MQQBrowser") !== -1 || navigator.userAgent.indexOf("baidubrowser") !== -1) {
                        location.href = res.data.login_url;
                    }else if(this.state.tempwindow){
                        this.state.tempwindow.location=res.data.login_url;
                        setTimeout(()=>{
                            this.setState({tempwindow:null})
                        },500)
                    }
                }
            })
        }

    };
    window(){
        const user = JSON.parse(sessionStorage.getItem("user"));
        let showVideo;
        if(window.sessionStorage.og_protect){
            showVideo=JSON.parse(sessionStorage.getItem("og_protect"));
        }else{
            showVideo=this.state.showVideo;
        }
        if(user){
            // 获取UserAgent
            var u = navigator.userAgent;
            // 安卓
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            // IOS
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            //针对苹果uc以及QQ浏览器做当前页面嵌套
            if(showVideo==1){
                return
            }else if(showVideo==0){
                if( isiOS === true && navigator.userAgent.indexOf("UCBrowser") !== -1 || navigator.userAgent.indexOf("MQQBrowser") !== -1 || navigator.userAgent.indexOf("baidubrowser") !== -1) {
                    // location.href = this.state.url;/
                    this.sportsLottery();
                } else {
                    this.setState({tempwindow:window.open("","",'_blank')})
                    this.sportsLottery();
                }
            }
        }else {
            message.config({
                top: 20,
                duration:4,
            });
            message.warning("请先登录");
        }

    }
    //弹窗
    info() {
        if(this.isUnMount()){//组件卸载判断
            return;
        }
        this.getWelcome((res)=>{
            this.carouselFun(res);
            if(window.sessionStorage.user&&window.sessionStorage.visible){
                return
            }else if(window.sessionStorage.user&&!window.sessionStorage.visible){
                    sessionStorage.setItem("visible",false);
                    if(res.errno==0){
                    let data=res.data.userAlert;
                    let title=data.title;
                    let content=data.content;
                    let welcome_page=data.m_main_img;
                    let img=<img src={welcome_page}/>
                    if(data.type=="image"){
                        if(welcome_page){
                            this.setState({
                                content:img,
                                visible: true,
                                welcomeDisplay:true,
                                signShow:false,
                            })
                        }else{
                            this.setState({
                                visible:false,
                                welcomeDisplay:false,
                                signShow:false,
                            })
                        }
                    }else if(data.type=="text"){
                        if(data.title&&data.content){
                            this.setState({
                                title:title,
                                content:content,
                                visible: true,
                                welcomeDisplay:false,
                            })
                        }else{
                            this.setState({
                                visible:false,
                                welcomeDisplay:false,
                            })
                        }
                    }
                }
            }else if(!window.sessionStorage.user&&window.sessionStorage.visible){
                    if(res.errno==0){
                        sessionStorage.removeItem("visible");
                        let data=res.data.userAlert;
                        let title=data.title;
                        let content=data.content;
                        let welcome_page=data.m_main_img;
                        let img=<img src={welcome_page}/>
                        if(data.type=="image"&&res.data.noticeList.length!==0){
                            if(welcome_page){
                                this.setState({
                                    content:img,
                                    visible: false,
                                    welcomeDisplay:false,
                                    signShow:true,
                                })
                            }else{
                                this.setState({
                                    visible:false,
                                    welcomeDisplay:false,
                                })
                            }
                        }else if(data.type=="text"){
                            if(data.title&&data.content){
                                this.setState({
                                    title:title,
                                    content:content,
                                    visible: true,
                                    welcomeDisplay:false,
                                })
                            }else{
                                this.setState({
                                    visible:false,
                                    welcomeDisplay:false,
                                })
                            }
                        }
                    }
            }else{
                    if(res.errno==0){
                        let data=res.data.userAlert;
                        let title=data.title;
                        let content=data.content;
                        let welcome_page=data.m_main_img;
                        let img=<img src={welcome_page}/>
                        let hasSign=JSON.parse(sessionStorage.getItem('hasSign'));
                        if(data.type=="image"&&hasSign.length!==0){
                            if(welcome_page){
                                this.setState({
                                    content:img,
                                    visible: false,
                                    welcomeDisplay:false,
                                    signShow:true,
                                })
                            }else{
                                this.setState({
                                    visible:false,
                                    welcomeDisplay:false,
                                })
                            }
                        }else if(data.type=="text"){
                            if(data.title&&data.content){
                                this.setState({
                                    title:title,
                                    content:content,
                                    visible: true,
                                    welcomeDisplay:false,
                                })
                            }else{
                                this.setState({
                                    visible:false,
                                    welcomeDisplay:false,
                                })
                            }
                        }
                    }
            }
        });

    };
    handleCancel (){
        this.setState({ visible: false });
    };
    handleOpeninfo(){
        this.setState({ signShow: false });
    }
    changePath(lottery_id){
        let path = '';
        if([1, 4, 8,24,18,11].indexOf(lottery_id) !== -1) {
            path = 'ssc/' + lottery_id;
        } else if([2, 5, 6, 7,16].indexOf(lottery_id) !== -1) {
            path = '11x5/' + lottery_id;
        }else if([9].indexOf(lottery_id) !== -1) {
            path = 'fc3d/' + lottery_id;
        }else if([12,13,19,20,27,28,29,30].indexOf(lottery_id) !== -1) {
            path = 'k3/' + lottery_id;
        }else if([21,25].indexOf(lottery_id) !== -1) {
            path = 'lhc/' + lottery_id;
        } else if([14].indexOf(lottery_id) !== -1) {
            path = 'klpk/' + lottery_id;
        }else if([10].indexOf(lottery_id) !== -1) {
            path = 'p3p5/' + lottery_id;
        }else if([22].indexOf(lottery_id) !== -1) {
            path = 'ssq/' + lottery_id;
        }else if([23].indexOf(lottery_id) !== -1) {
            path = 'xy28/' + lottery_id;
        }else if([17].indexOf(lottery_id) !== -1) {
            path = 'pk10/' + lottery_id;
        }else if([26].indexOf(lottery_id) !== -1) {
            path = 'xyft/' + lottery_id;
        }else if([15].indexOf(lottery_id) !== -1){
            path = 'mmc/' + lottery_id;
        }
        else {
            path = 'hall';
        }
        return path
    }
    //我的最爱
    defaultLike(){
        let myFavorite=[1,2,7,9,12,16,17,26];//首页默认彩种;
        let lottery=[];
        let alllottery=sessionStorage.getItem("alllottery",alllottery);
        if(!alllottery){
            return null;
        }else{
            lottery = alllottery.split(",");
            for(let i=0;i<lottery.length;i++){
                lottery[i]=parseInt(lottery[i])
            }
        }
        for(let i=0;i<myFavorite.length;i++){
            let n=myFavorite[i];
            if(lottery.indexOf(n)==-1){
                myFavorite.splice(i,1);
            };
        }
        let str=[];
        for(var i=0;i<myFavorite.length;i++){
            str.push(
                <li key={i}>
                    <Link to={this.state.user?this.changePath(myFavorite[i]):"login"}>
                        <i className={"lt-icon lt-icon-"+myFavorite[i]}
                           data-name={myFavorite[i]}>
                        </i>
                    </Link>
                </li>
            )
        }
        return str
    }
    myLike(){
        let str=[];
        if(window.sessionStorage.myFavorite){
            var myFavorite=JSON.parse(window.sessionStorage.myFavorite);
            for(var i=0;i<myFavorite.length;i++){
                str.push(
                    <li key={i}>
                        <Link to={this.state.user?this.changePath(myFavorite[i]):"login"}>
                            <i className={"lt-icon lt-icon-"+myFavorite[i]}
                               data-name={myFavorite[i]}>
                            </i>
                        </Link>>
                    </li>
                )
                if(i==7){
                    return str
                }
            }
        }
        return str
    };
    componentDidMount(){
        this.getAlllottery();
        this.info();
        this.signShow();
    }

    //提现
    getMoney(callback) {
        Api("c=user&a=info", null, (res) => {
            let data = res.data;
            if (res.errno === 0) {
                this.setState({
                    card_num: data.card_num,
                    isset_secpwd: data.isset_secpwd
                },()=>{
                    if(callback){
                        callback();
                    }
                })
            }
        })
    }

    //判断是否能跳转
    jumptoWithraw() {
        let user = JSON.parse(sessionStorage.getItem("user"));
        if (user.isset_secpwd !== 1) {
            this.showPsdModal()
        } else if (this.state.card_num === "init") {
            this.getMoney(()=>{
                if(!this.state.card_num){
                    this.showModal();
                }else{
                    this.props.history.push("withdrawMoney")
                }
            })
        }else if(!this.state.card_num){
            this.showModal();
        } else {
            this.props.history.push("withdrawMoney")
        }


    }
    //提现弹窗
    showModal() {
        this.setState({
            cardvisible: true,
        });
    }
    showPsdModal() {
        this.setState({
            psdvisible: true,
        });
    }
    handleOk() {
        this.setState({
            cardvisible: false,
        }, () => {
            this.props.history.push("bankCardBind")
        });

    };
    handlePsdOk() {
        this.setState({
            psdvisible: false,
        }, () => {
            this.props.history.push("setpassword")
        });

    };


    componentWillUnmount(){
        this.setState({
            isUnMount:true,
        });
        if(this.state.popularSetTime){
            clearTimeout(this.state.popularSetTime);
        }
        }

    isUnMount(){
        return this.state.isUnMount;

    }
    //获取彩种的信息
    getAlllottery(){
        Api('c=default&a=lotteryListIcon', null, (res) => {
            if (this.isUnMount()) {//组件卸载判断
                return;
            }
            if(res.errno==0){
                let alllottery=[];
                if(res.data.lotteryList){
                    for(let i=0;i<res.data.lotteryList.length;i++){
                        alllottery.push(res.data.lotteryList[i].lottery_id)
                    }
                }
                //拿到所有彩种信息
                alllottery.sort((a,b)=>a-b);
                sessionStorage.setItem("alllottery",alllottery);
                sessionStorage.setItem("og_protect",res.data.og_protect);
            }
        })
    }

    /*首页图片轮播*/
    carouselFun(res){
        if(res.errno==0){
            //轮播大图
            let data = res.data.bannerList;
            //拿到关于轮播公告的信息
            let announ_title=[];
            let announ_cement=[];
            announ_cement=res.data.noticeList;
            res.data.noticeList.map((item,i)=>{
                announ_title.push(item.title);
            })
            if(res.data){
                //用于热门彩票小图标展示
                let TheColorData  = res.data.lotteryList;

                if(this.isUnMount()){//组件卸载判断
                    return;
                }
                this.setState({
                    carouse_data:data,
                    TheColor_img:TheColorData,
                    announ_title:announ_title,
                    announ_cement:announ_cement
                })
                sessionStorage.setItem('hasSign',JSON.stringify(this.state.announ_title));
            }
        }

    }

    Openinfo(){
        this.setState({signShow:true})
    }
    sign(){
        let items="";
        let listMessage = this.state.announ_title;
        if(listMessage.length!==0) {
            for(let i=0;i<listMessage.length;i++){
                items += listMessage[i];
                items+='&nbsp&nbsp&nbsp&nbsp&nbsp';
            }
        }else {
            items="暂无公告"
        }
        return items
    }

    //判断是否可以跳过电子游戏页面
    isJumpEgame(){
        Api('c=egame&a=lobby&remind='+0,{},(res)=>{
            if(res.errno===0){
                this.props.history.push('egame')
            }else{
                // message.config({
                //     top: 20,
                //     duration: 1
                // });
                // Modal.info({
                //     title:'提示',
                //     content:res.errstr,
                // })
                this.setState({
                    egameTips:res.errstr,
                    egameshow:true,
                })



            }
        })
    }
    //跳到展示电子游戏页面
    playGame(gameId){
        const user = JSON.parse(sessionStorage.getItem("user"));
        if(user){
            Api('c=egame&a=play',{user_id:user.user_id,game_id:gameId},(res)=>{
                let gameAdress='';
                if(res.errno===0){
                    gameAdress=res.data.interface;
                    location.href=gameAdress;
                }
            })
        }else {
            this.props.history.push('login')
        }
    }
    //判断下载app====>因为每个盘口的地址不一样,同步之后需要手工修改一下
    Appdownload(){
        var user = navigator.userAgent;
        // 安卓
        var isAndroid = user.indexOf('Android') > -1 || user.indexOf('Adr') > -1;
        // IOS
        var isiOS = !!user.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if(isAndroid){
            location.href='https://static-pc.0631110.com/xy00001/images_fh/upload/lucky.apk'
        }else if(isiOS){
            location.href='https://9797mr.com';
        }
    }

    //公告一登陆就弹出来--->来回切换都不重复弹了
    signShow(){
        if(this.isUnMount()){//组件卸载判断
            return;
        }
        let signShow=JSON.parse(sessionStorage.getItem('signShow'));
        let hasSign=JSON.parse(sessionStorage.getItem('hasSign'));
        if(!this.state.user&&signShow){
            if(hasSign.length!==0){
                this.setState({
                    signShow:signShow,
                },()=>{
                    sessionStorage.setItem('signShow',JSON.stringify(!this.state.signShow));
                })
            }else {
                this.setState({
                    signShow:false,
                })
            }
        }
    }


    render() {
        let openInfoHtml=[];
        let announCement = this.state.announ_cement;
        if(announCement.length!==0){
            announCement.map((item,i)=>(
                openInfoHtml.push(<div key={i}  >
                    <div style={{minHeight:"198px"}}>
                        <div dangerouslySetInnerHTML={{__html: item.title}} />
                        <div dangerouslySetInnerHTML={{__html: item.content}} />
                    </div>
                </div>)
            ))
        }else{
            openInfoHtml=[]
        }
        return (
            <div>
                <Modal
                    className={!this.state.welcomeDisplay?'welcome':""}
                    visible={this.state.visible}
                    title={this.state.title}
                    footer={null}
                    onOk={()=>{this.handleOk()}}
                    onCancel={()=>{this.handleCancel()}}
                    wrapClassName={this.state.welcomeDisplay?'welcome_page':""}
                >
                    {this.state.welcomeDisplay?this.state.content:<div className="info" dangerouslySetInnerHTML={{__html: this.state.content}} />}
                </Modal>
                <Modal
                    visible={this.state.signShow}
                    wrapClassName="sign-wrapper"
                    className='openInfo'
                    title="公告"
                   okText={"关闭"}
                    closable={false}
                    onOk={()=>{this.handleOpeninfo()}}
                >
                    <Carousel className="noticeList">
                        {openInfoHtml}
                    </Carousel>
                </Modal>
                <Modal
                    wrapClassName="isbind-wrapper"
                    closable={false}
                    title="提示"
                    visible={this.state.cardvisible}
                    footer={null}
                >
                    <div className="x-confirm-data">
                        <p className="tips">
                            您还没绑定银行卡，请先去绑定银行卡
                        </p>
                    </div>
                    <div className="x-btn-wrapper">
                            <span onClick={() => {
                                this.setState({cardvisible: false})
                            }}>取消</span>
                        <span onClick={() => {
                            this.handleOk()
                        }}>确定</span>
                    </div>
                </Modal>
                <Modal
                    wrapClassName="isbind-wrapper"
                    closable={false}
                    title="提示"
                    visible={this.state.psdvisible}
                    footer={null}
                >
                    <div className="x-confirm-data">
                        <p className="tips">
                            请先设置资金密码
                        </p>
                    </div>
                    <div className="x-btn-wrapper">
                            <span onClick={() => {
                                this.setState({psdvisible: false})
                            }}>取消</span>
                        <span onClick={() => {
                            this.handlePsdOk()
                        }}>确定</span>
                    </div>
                </Modal>
                <Modal
                    wrapClassName="isbind-wrapper"
                    closable={false}
                    title="提示"
                    visible={this.state.egameshow}
                    footer={null}
                >
                    <div className="x-confirm-data">
                        <p className="tips">
                            {this.state.egameTips}
                        </p>
                    </div>
                    <div className="x-btn-wrapper">
                            <span onClick={() => {
                                this.setState({egameshow: false})
                            }}>取消</span>
                        <span onClick={() => {
                            this.setState({egameshow:false})
                        }}>确定</span>
                    </div>
                </Modal>
                <Navbar title="幸运彩票" />
                <div className="home fadeInRight">
                    <div className="banner">
                        {this.state.carouse_data?<Carousel
                            autoplay={true}
                            infinite={true}
                            selectedIndex={0}
                            dotStyle={{bottom:"5px"}}
                        >
                            {this.state.carouse_data.map((item,i) => (
                                <Link key={i} to={{pathname:'home/promodetail',query:{query:JSON.stringify(item)}}}>
                                    <img src={item.image_path} />
                                </Link>
                            ))}
                        </Carousel>:""}
                    </div>
                    <NoticeBar marqueeProps={{ loop: true  }} onClick={openInfoHtml.length>0?()=>this.Openinfo():null} className="noticeBar">
                        <div dangerouslySetInnerHTML={{__html: this.sign()}} />
                    </NoticeBar>
                    <section className="fast-link">
                        {this.state.user?<Link to="pay" className="btn-deposit"><i></i>充值</Link>:<Link to="login" className="btn-login"><i></i>登录</Link>}

                        {this.state.user?<a onClick={()=>{this.jumptoWithraw()}} className="btn-withdrawal"><i></i>提现</a>:<Link to="Register" className="btn_registered"><i></i>注册</Link>}
                        {/*<Link to={{pathname:"lotteryTrend",query:{id:1}}} className="btn-trend"><i></i>走势图</Link>*/}
                        <Link  className="btn_egame"  to={this.state.user?"wallet":'login'}><i></i>额度转换</Link>

                        <Link  className="btn-service" to="getService"><i></i>在线客服</Link>
                    </section>

                    <div className="credit">
                        <p><b>彩</b>热门游戏</p>
                        <li>
                            <Link to={this.changePath(11)}>
                                <img src={require("../../../img/global/lt_xyffc.png")}/>
                                <span>分分彩</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={this.changePath(13)}>
                                <img src={require("../../../img/global/lt_k3ffc.png")}/>
                                <span>快三分分彩</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={this.changePath(18)}>
                                <img src={require("../../../img/global/lt_dj15fc.png")}/>
                                <span>东京1.5分彩</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={this.changePath(1)}>
                                <img src={require("../../../img/global/lt_cqssc.png")}/>
                                <span>重庆时时彩</span>
                            </Link>
                        </li>

                        <li>
                            <Link to={this.changePath(12)}>
                                <img src={require("../../../img/global/lt_jsk3.png")}/>
                                <span>江苏快三</span>
                            </Link>
                        </li>

                        <li>
                            <Link to={this.changePath(17)}>
                                <img src={require("../../../img/global/lt_bjpk10.png")}/>
                                <span>北京PK拾</span>
                            </Link>
                        </li>

                        <li>
                            <Link to={this.changePath(21)}>
                                <img src={require("../../../img/global/lt_xg6hc.png")}/>
                                <span>香港六合彩</span>
                            </Link>
                        </li>

                        <li>
                            <Link to={this.changePath(25)}>
                                <img src={require("../../../img/global/lt_js6hc.png")}/>
                                <span>极速六合彩</span>
                            </Link>
                        </li>
                        <li>
                            <div onClick={()=>{this.playGame(1051)}}>
                                <img src={require("../../../img/global/fish.png")}/>
                                <span>千炮捕鱼</span>
                            </div>
                        </li>

                        <li>
                            <div onClick={()=>{this.Appdownload()}}>
                                <img src={require("../../../img/global/APP-download.png")}/>
                                <span>APP下载</span>
                            </div>
                        </li>

                        <li>
                            <div onClick={()=>{this.isJumpEgame()}}>
                                <img src={require("../../../img/global/more_egame.png")}/>
                                <span>电子游戏</span>
                            </div>
                        </li>
                        <li>
                            <div onClick={this.windowopen}>
                                <img src={require("../../../img/global/zhen.png")}/>
                                <span>真人视讯</span>
                            </div>
                        </li>
                        <li>
                            <Link to="hall">
                                <img src={require("../../../img/global/more-lottery.png")}/>
                                <span>更多彩票</span>
                            </Link>
                        </li>
                        <li>
                        <div onClick={this.window}>
                            <img src={require("../../../img/global/sport-1.png")}/>
                            <span>皇冠体育</span>
                        </div>
                        </li>
                    </div>

                    <section className="favorite favorite2">
                        <h3>
                            <span>我的最爱</span>
                            <Link to="/mySetting"><i className="icon-setting"></i></Link>
                        </h3>
                        <div style={{display:this.state.disPlay}}>
                            <ul>
                                {this.defaultLike()}
                            </ul>
                        </div>
                        <ul>
                            {this.myLike()}
                        </ul>
                    </section>
                </div>
                <Footer />
            </div>
        )
    }
}
