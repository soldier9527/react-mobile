
import React, { Component, PropTypes } from 'react'
import {Link} from 'react-router-dom';
import Navbar from '../common/navbar';
import Api from '../api';


export default class Promoforuser extends Component {
    constructor(props) {
        super(props);
        this.state={
            activityList:[],
            route:""
        }
    }

    componentWillMount(){
        this.getData();
        this.getSessionStorage();
    }

    /** 获取sessionStorage的jumpPage属性用判断 **/
    getSessionStorage(){
        let jumpPage=sessionStorage.getItem("jumpPage");
        if(jumpPage=="个人中心"){
            this.setState({
                route:"/user"
            })
        }else{
            this.setState({
                route:"/user_login"
            })
        }
    }

    getData(){
        Api("c=default&a=activityList",null,(res)=>{
            let activityList=res.data;
            this.setState({
                activityList:activityList
            })
        });
    }

    render(){
        let id=this.state.id;
        let renderActivity=[];
        let lotteryActivity=this.state.activityList;
        if(lotteryActivity.length==0){
            renderActivity.push(
                <div key={0}></div>
            )
        }else{
        lotteryActivity.map(function(item,i){
            renderActivity.push(
                <Link  to={{pathname:'promo/userimg/'+item.id}}  key={i}>
                    <img className="activity-image marginBottomForUser" src={item.m_thumb_img} />
                </Link>
            );
        });
        }
        return(
            <div>
                <Navbar title="优惠活动" back={this.state.route}/>
                <div className="PromoContent-wrapper bottomForUser">
                    <div className="PromoContent">
                        {renderActivity}
                    </div>
                </div>
            </div>
        )
    }
}
