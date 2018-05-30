import React,{Component,PropTypes} from 'react'
import Navbar from '../common/navbar';

export default class HomePromoDetail extends Component{
    constructor(props){
        super(props);
        this.state={
        }
    }

    render(){
        let param=this.props.location.query.query;
        param = JSON.parse(param);
        return(
            <div>
                <Navbar title="活动详情" back="/home"/>
                <div className="PromoDetailContent">
                    <img className="activity-detail-image"  src={param.m_main_img} />
                </div>
            </div>
        )
    }
}