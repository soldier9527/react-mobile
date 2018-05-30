import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../common/navbar';
import Api from '../api';
import Modal from 'antd/lib/modal';
import { PullToRefresh ,SearchBar ,Toast} from 'antd-mobile';
import {Link} from 'react-router-dom';
import 'antd-mobile/lib/search-bar/style/css';//加载选择样式
export default class Group_custom1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalText: 'HELLO',
            visible: false,
            confirmLoading: false,
            myDate: "",
            memberDatas: [],
            refreshing: false,
            down: false,
            height: document.documentElement.clientHeight,
            page: 1,
        }
        this.search = this.search.bind(this);
    }

    getMemberData() {
        Api("c=user&a=childList&limit=10&page=" + this.state.page, null, (res) => {

            let data = res.data;

            //后台异常信息
            let error = res.errstr;

            //服务状态(0/成功)
            let status = res.errno;
            if (status > 0) {
                Modal.error({
                    title: '会员管理' + error
                });
            } else {
                let temp = this.state.memberDatas;
                if (this.state.page <= data.totalPages) {
                    for (let i = 0; i < data.show_datas.length; i++) {
                        temp.push(data.show_datas[i]);
                    }
                    this.setState({
                        page: this.state.page + 1,
                        memberDatas: temp,
                    })

                }
            }
        })
    }

    componentWillMount() {
        this.getMemberData();
    }

    componentDidMount() {
        const hei = ReactDOM.findDOMNode(document.getElementsByClassName("teamlist1")[0]).offsetHeight;
        let itemHei = ReactDOM.findDOMNode(document.getElementsByClassName("teamcustom1header")[0]).offsetHeight;
        setTimeout(() => this.setState({
            height: hei - itemHei,
        }), 0);
    }
    search(value){
        Api("c=user&a=childList&u_name="+value+"&remind=0", null, (res) => {
            if(res.errno > 0){
                Toast.info('抱歉!没有符合的用户名...', 2, null, false)
            }else{
                this.setState({memberDatas: res.data.show_datas,})
            }
        });
    }

  render(){
    const { visible, confirmLoading, ModalText } = this.state;
  let memberData=[];
      for (var i=0;i<this.state.memberDatas.length;i++) {
       let lv = this.state.memberDatas[i].level;
       if(lv == 0){
         lv = "总代";
       }else if(lv == 100){
         lv = "会员";
       }else{
         lv = lv+"级代理";
       }
    memberData.push(<div key = {i}>
        <Link to={{pathname:'group_member_detail/'+this.state.memberDatas[i].user_id+"/"+this.state.memberDatas[i].username+"/"+this.state.memberDatas[i].level}}>
          <ul  className="teamprofitchange1detail">
            <li>{this.state.memberDatas[i].username}<br/>({(lv)})</li>
            <li>{this.state.memberDatas[i].price_rebate}</li>
            <li>{this.state.memberDatas[i].balance}</li>
            <li>{(this.state.memberDatas[i].last_time=="0000-00-00 00:00:00")?"无登录记录":this.state.memberDatas[i].last_time.split(" ")[0]}<br/>
    {(this.state.memberDatas[i].last_time=="0000-00-00 00:00:00")?"":this.state.memberDatas[i].last_time.split(" ")[1]}
          </li>
          </ul>
      </Link>
    </div>);
}
    return (
      <div>
          <Navbar title="会员管理" back="/group" />

      <div className="teamlist1" style={{position:"fixed"}}>


         <div className="behindNavbar"  style ={{marginTop:"-0.9rem"}}>
          <div>
            <ul className="teamcustom1header" >
              <li>账户</li>
              <li>奖金/返点</li>
              <li>余额</li>
              <li>最近登录</li>
            </ul>
          </div>
             <SearchBar placeholder="请输入用户名进行搜索" maxLength={16} onSubmit={(value)=>this.search(value)} onClear={this.getMemberData.bind(this)}/>
        <PullToRefresh
        ref={el => this.ptr = el}
        style={{
          height: this.state.height,
          overflow: 'auto',
        }}
        indicator={this.state.down ? {} : { activate:'松开立即加载' ,deactivate: '上拉加载更多',finish: '完成加载' }}
        direction={this.state.down ? 'down' : 'up'}
        refreshing={this.state.refreshing}
        onRefresh={() => {
  this.getMemberData();
          this.setState({ refreshing: true });
          setTimeout(() => {
            this.setState({ refreshing: false });
          }, 1000);

        }}
      >
        {memberData}
      </PullToRefresh>
      </div>
      </div>
      </div>
    )
  }
}


