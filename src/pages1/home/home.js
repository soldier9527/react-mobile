import React, { Component} from 'react'
import {Link,withRouter} from 'react-router-dom';

import {Carousel,NoticeBar,Icon} from 'antd-mobile';
import Navbar from '../common/navbar';
import Footer from '../common/footer';
import Api from '../api';
import config from '../config';
import PopularLottery from './popular_lottery';  //热门彩票
import TheLatestLottery from './The_latest_lottery'; //最新开奖

class Home extends Component {
    constructor(props) {
        super(props);
        this.changePath = this.changePath.bind(this);
        let user = sessionStorage.getItem("user");
        this.state = {
            user:user,
            series_number: '---',
            lottery_number: ['-', '-', '-', '-', '-'],
            carouse_data:['','',''], //首页轮播图片
            echartCarousel:['','',''],
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

        }
    };
    getWelcome(callback){
        Api("c=default&a=welcome",null,(res)=>{
            callback(res)
        })

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
            }else if(!window.sessionStorage.user&&window.sessionStorage.visible){
                if(res.errno==0){
                    sessionStorage.removeItem("visible");
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
                    if(data.type=="image"){
                        if(welcome_page){
                            this.setState({
                                content:img,
                                visible: true,
                                welcomeDisplay:true,
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
        this.setState({ Openinfo: false });
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
        this.PopularLotteryFun();
        this.LatestLottery();
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
            echartCarousel:[]
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
            }

        }

    }
    /*热门彩票*/
    PopularLotteryFun(){
        Api("c=default&a=hotShow",null,(res)=>{
            let  data = res.data;
            //后台异常信息
            let error = res.errstr;
            //服务状态(0/成功)
            let status = res.errno;

            if(status>0){
                // Modal.error({
                //     title: '热门彩票'+error
                // });
            }else{
                if(this.isUnMount()){//组件卸载判断
                    return;
                }
                this.setState({
                    Popular_lottery_data:data
                },function(){
                    this.hotlottery();
                });
                this.setState({
                    popularSetTime:setTimeout(()=>{
                        this.PopularLotteryFun()
                    },60000),
                });
            }

        })

    }

    hotlottery(){
        //热门彩票
        let  randerPopular = [];
        let  Popularlottery = this.state.Popular_lottery_data;
        let TheData = this.state.TheColor_img;
        for (var i=0;i<Popularlottery.length;i++){
            //热门彩票列表只显示三组
            if(i==4){

                break;
            }
            let data = Popularlottery[i];


            randerPopular.push(
                <PopularLottery  key={i} item={data}  data={TheData} changePath={this.changePath} />
            )

        }
        return randerPopular
    }




    /**最新开奖**/
    LatestLottery(){


        Api("c=default&a=newOpen",null,(res)=>{

            let  data = res.data;


            //后台异常信息
            let error = res.errstr;

            //服务状态(0/成功)
            let status = res.errno;

            if(status>0){
                // Modal.error({
                //     title: '最新开奖'+error
                // });
            }else{
                if(this.isUnMount()){//组件卸载判断
                    return;
                }
                this.setState({
                    latest_lotteryData:data
                },function(){
                    this.latest();
                })
            }
        })
    }

    latest(){
        //最新开奖
        let  randerLatestLottery =[];

        let   LatestLotteryList = this.state.latest_lotteryData;

        for(var i=0;i<LatestLotteryList.length;i++){

            //只显示一组彩种
            if(i==1){
                break;
            }
            let list = LatestLotteryList[i];

            randerLatestLottery.push(
                <TheLatestLottery ref="theLatestLottery"  key={i} item={LatestLotteryList}/>
            )
        }

        return randerLatestLottery

    }



    Openinfo(){
        this.setState({Openinfo:true})
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

    hideLatestLottery(){
        if(this.refs.theLatestLottery){
            this.refs.theLatestLottery.showList("",false);
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
            <div onClick={()=>{this.hideLatestLottery()}}>

                <Navbar title={config.title} />
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
                        <Link to={{pathname:"lotteryTrend",query:{id:1}}} className="btn-trend"><i></i>走势图</Link>
                        <Link  className="btn-service" to="getService"><i></i>在线客服</Link>
                    </section>
                    <section className="popular">
                        <h3>
                            <span>热门彩票</span>
                            <Link to="hall">更多<Icon type="right" /></Link>
                        </h3>

                        {this.hotlottery()}

                    </section>

                    <section className="latest">
                        <h3>
                            <span>最新开奖</span>
                        </h3>
                        {this.latest()}
                    </section>

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

export default withRouter(Home)
