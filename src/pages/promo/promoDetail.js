import React,{Component,PropTypes} from 'react'
import Navbar from '../common/navbar';
import Api from '../api';

export default class PromoDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            activityList:[]
        }
    }

    componentWillMount(){
    this.getData();
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
    let param=new URLSearchParams(this.props.history.location.search).get('id');
    let renderActivity=[];
    let lotteryActivity=this.state.activityList;
    lotteryActivity.map(function(item,i){
        if(item.id!=param){
            return null;
        }else{
            renderActivity.push(
                <img className="activity-detail-image" key={i} src={item.m_main_img} />
            )
        }
    });
    return(
        <div>
            <Navbar title="活动详情" back="/Promo"/>
            <div className="PromoDetailContent">
                {renderActivity}
            </div>
        </div>
    )
}
}