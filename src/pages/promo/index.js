
import React, { Component, PropTypes } from 'react'
import {Link} from 'react-router-dom';
import Navbar from '../common/navbar';
import Footer from '../common/footer';
import Api from '../api';


export default class Promo extends Component {
    constructor(props) {
        super(props);
        this.state={
            activityList:[],
        }
}

   componentWillMount(){
        this.getData();
    }

    getData(){
        Api("c=default&a=activityList",null,(res)=>{
            let activityList=res.data;
            if(activityList){
                this.setState({
                    activityList:activityList
                })
            }


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
                <Link  to={{pathname:'promo/img/'+item.id}}  key={i}>
                    <img className="activity-image" src={item.m_thumb_img} />
                </Link>
            );
        });
        }
        return(
            <div>
                <Navbar title="优惠活动" />
                    <div className="PromoContent-wrapper fadeInRight">
                        <div className="PromoContent">
                            {renderActivity}
                        </div>
                    </div>
                <Footer />
            </div>
        )
}


}
