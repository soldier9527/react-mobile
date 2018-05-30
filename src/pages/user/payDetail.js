import React, {Component} from 'react';
import Navbar from '../common/navbar';

export default class PayDetail extends Component {
    render() {
        let query = this.props.location.query;
        if(!query){
            return null
        }
        console.log(query)
        return <div>
            <Navbar back="back" title="充值详情"/>
            <div className="pay-detail-wrap">
                <ul>
                    <li>
                        <div>
                            <span>充值方式</span> <span>扫码</span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>订单号</span> <span>{query.order_number}</span>
                        </div>
                    </li>
                    {query.name?<li>
                        <div>
                            <span>付款账号</span> <span>{query.name}</span>
                        </div>
                    </li>:null

                    }

                    <li>
                        <div>
                            <span>充值金额</span> <span>{query.money}</span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>二维码</span> <span><img src={query.img} /></span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <label>保存二维码到相册扫码付款,尽量不要整数充值.请保证信息准确，以便及时到账！</label>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    }

}
