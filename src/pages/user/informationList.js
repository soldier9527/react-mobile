import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import message from 'antd/lib/message';
import {PullToRefresh} from 'antd-mobile';
import Navbar from '../common/navbar';
import Api from '../api';


export default class InformationList extends Component {
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
	  const hei =ReactDOM.findDOMNode(document.getElementsByClassName("informationList")[0]).offsetHeight;
	    setTimeout(() => this.setState({
	      height: hei,
	    }), 0);
  }
	componentWillUnmount(){
		document.getElementsByClassName('informationList')[0].removeEventListener('touchstart',(ev)=> {
				startY = ev.changedTouches[0].pageY;
		}, true);
		document.getElementsByClassName('informationList')[0].removeEventListener('touchend',(ev)=> {
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
        document.getElementsByClassName('informationList')[0].addEventListener('touchstart',(ev)=> {
            startY = ev.changedTouches[0].pageY;
        }, true);

        document.getElementsByClassName('informationList')[0].addEventListener('touchend',(ev)=> {
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
	     Api("c=help&a=latestNew&curPage="+curPage,null,(e)=>{
				 if(e.data == undefined || e.data == []){
					 message.config({
							top: 100
							});
					 if(curPage==1){
						  message.error('暂无热点消息',2,()=>{
								setTimeout(()=>{
				          this.props.history.push("information");
									return;
				        },300)
							});
					 }else{
						 message.warn('暂无更多热点消息',2)
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

	render() {
    let list=this.state.list;
		if(list == []){
			return null
		}
    let randerHtml = [];
    list.map((e,index)=>{
			let seendId={
	      article_id:e.article_id,
	    };
      randerHtml.push(
        <li key={index} id={e.article_id} >
          <Link to={{ pathname: '/informationDetail', query: seendId}} >
            <span className="span_left fl">{e.title}</span><span className="fr">{e.create_time}</span>
          </Link>
        </li>
    )
    })
		return (
      <div>
            <Navbar  title="今日热点" back="/information"/>
            <div className="informationList">
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
