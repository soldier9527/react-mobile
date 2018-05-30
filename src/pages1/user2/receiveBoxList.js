import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import { message,Icon,Modal} from 'antd';
const confirm = Modal.confirm;
import {PullToRefresh } from 'antd-mobile';
import Navbar from '../common/navbar';
import MaskLoading from '../common/maskLoading';// 防止重复点击
import Api from '../api';


export default class ReceiveBoxList extends Component {
	constructor(props) {
		super(props);
    this.state={
      list:[],
			curPage:1,
	    refreshing: false,
	    height: document.documentElement.clientHeight,
	    down: true
    }
	}
	componentDidMount() {
			this.getList();
			this.getDown();
			const hei = ReactDOM.findDOMNode(document.getElementsByClassName("receiveBoxList")[0]).offsetHeight;
		    setTimeout(() => this.setState({
		      height: hei,
		    }), 0);
  }
	componentWillUnmount(){
		document.getElementsByClassName('receiveBoxList')[0].removeEventListener('touchstart',(ev)=> {
				startY = ev.changedTouches[0].pageY;
		}, true);

		document.getElementsByClassName('receiveBoxList')[0].removeEventListener('touchend',(ev)=> {
				let endY = ev.changedTouches[0].pageY;
				let direction = endY - startY;
				if(direction==0){
					return;
				}else if(direction>0){
					this.setState({
						down:true
					})
				}else{
					this.setState({
						down:false
					})
				}
		}, true);
	}
	getDown(){
		//滑动处理
        let startY;
        document.getElementsByClassName('receiveBoxList')[0].addEventListener('touchstart',(ev)=> {
            startY = ev.changedTouches[0].pageY;
        }, true);

        document.getElementsByClassName('receiveBoxList')[0].addEventListener('touchend',(ev)=> {
            let endY = ev.changedTouches[0].pageY;
            let direction = endY - startY;
						if(direction==0){
							return;
						}else if(direction>0){
							this.setState({
								down:true
							})
						}else{
							this.setState({
								down:false
							})
						}
        }, true);
	}
	loadMore(){
		let curPage=this.state.curPage+1;
		this.setState({
			curPage:curPage
		})
		this.getList();
	}
	reLoad(){
		this.setState({
			curPage:1,
			list:[]
		})
		this.getList();
	}
   getList(){
		 let curPage=this.state.curPage;
		 let list=this.state.list;
     Api("c=user&a=receiveBox&curPage="+curPage,null,(e)=>{
			 if(e.errstr == " 我是有底线的,已经没有更多消息了"){
			 message.config({
					top: 100
					});
				 if(curPage==1){
					 this.setState({
						 list:[]
					 })
					  message.error('暂无未读消息',1,()=>{
							setTimeout(()=>{
			          this.props.history.push("information")
			        },300)
						});
				 }else{
					 message.warn('暂无更多系统消息',2)
				 }

			}else{
				e.data.map((item,j)=>{
					list.push(item);
				})
				this.setState({
						list:list
				})
			}
     })
   }

	 deleteItem(e){
		 		let _this=this;
			 let id=e.mt_id;
			 confirm({
				 title:"提示",
				 content:"是否删除本条消息？",
				 onOk(){
						MaskLoading(5);
					 let mt_ids=[];
					 mt_ids.push(id);
					 Api("c=user&a=receiveBox",{curPage:1,
						 op:"delete",
						 mt_ids:mt_ids
					 },(e)=>{
							MaskLoading(false);
						 _this.reLoad();
					 })
				 }
			 })
	 }

	render() {
    let list=this.state.list;
		if(list == []){
			return null
		}
    let randerHtml = [];
    list.map((e,i)=>{
			let seendId={
	      msg_id:e.msg_id,
				mt_id:e.mt_id,
				has_read:e.has_read
	    };
      randerHtml.push(
        <li key={i} id={e.mt_id} >
					<Link to={{ pathname: '/receiveBoxDetail', query: seendId}} >
						<span className={e.has_read==0 ? "info-status" : "info-status info-status-off"}></span>
						<p>{e.title}</p>
						<p className="create_time">{e.create_time}</p>
						<i className="fr"><Icon type="right" /></i>
					</Link>
					<button onClick={this.deleteItem.bind(this,e)}>删除</button>
        </li>

    )
    })
		return (
      <div>
            <Navbar  title="系统消息" back="/information"/>
            <div className="receiveBoxList">
								 <PullToRefresh
								 ref={el => this.ptr = el}
								 style={{
									 height: this.state.height,
									 overflow: 'auto'
								 }}
								 indicator={this.state.down ? { activate:'松开立即刷新' ,deactivate: '下拉刷新',finish: '完成刷新'} : { activate:'松开立即加载' ,deactivate: '上拉加载更多',finish: '完成加载' }}
								 direction={this.state.down ? 'down' : 'up'}
								 refreshing={this.state.refreshing}
								 onRefresh={() => {
									 this.state.down ? this.reLoad() : this.loadMore();
									 this.setState({ refreshing: true });
									 setTimeout(() => {
										 this.setState({ refreshing: false });
									 }, 1000);

								 }}
							 >
	     						 <ul>
								 {randerHtml}
	    						 </ul>
							 </PullToRefresh>
            </div>
      </div>
		);
	}
}
