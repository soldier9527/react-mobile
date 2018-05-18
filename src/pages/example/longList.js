//长列表，下拉刷新，无限滚动
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PullToRefresh, ListView } from 'antd-mobile';
import Api from '../api';
import 'antd-mobile/lib/list-view/style/css';//加载选择样式

export default class LongList extends Component {
    constructor(props) {
        super(props);
        this.state={

        }

    }
    componentWillMount(){

    }

    render() {

        return (
            <div>
                <TestListview />
            </div>
        );
    }
}
class TestListview extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            refreshing: true,//刷新状态
            isLoading: true,
            height: document.documentElement.clientHeight,
            data:[],
            pageIndex:1,
            totalPages:0,
            hasMore:true,//是否还有更多,
            footer:'正在加载...'
        };
    }
    genData(callback) {
        let data=JSON.parse(sessionStorage.getItem("user"));
        let pageIndex = this.state.pageIndex;
        Api("c=fin&a=orderList"+"&user_id="+data.user_id+"&page="+pageIndex,null,(res)=>{
            const dataArr = [];
            let data=res.data.showDatas;
            this.setState({
                data:data.reverse(),//排序
                totalPages:res.data.totalPages
            },()=>{
                let length =data.length;
                data.map((item,i)=>{
                    dataArr.push((pageIndex * length) + i);
                });

                callback(dataArr);
            })

        });
    }
    componentDidUpdate() {
        document.body.style.overflow = 'hidden';
    }

    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;//获取滚动高度
        this.genData((data)=>{
            this.rData = this.state.data;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                height: hei,
                refreshing: false,
                isLoading: false,
            });
        })
    }

    onRefresh = () => {
        setTimeout(() => {
            this.setState({
                refreshing: true,
                isLoading: true,
                pageIndex:1,
                hasMore:true,
                footer: '正在加载...'
            },()=>{
                this.genData((data)=>{
                    this.rData = this.state.data;
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.rData),
                        refreshing: false,
                        isLoading: false,
                    });
                })
            });
        }, 600);
    };

    onEndReached = (event) => {

        if (!this.state.hasMore) {
            this.setState({
                footer:'滑到底部了'
            });
            return;
        }
        this.setState({ isLoading: true });
        let pageIndex = this.state.pageIndex+1;
        if(pageIndex===this.state.totalPages){
            this.setState({
                hasMore : false
            })
        }
        this.setState({
            pageIndex : pageIndex
        },()=>{
            this.genData((data)=>{
                this.rData = [...this.rData, ...this.state.data];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    isLoading: false,
                });
            })
        })
    };

    render() {

        let data = this.state.data;
        let index = data.length - 1;
        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                index = data.length - 1;
            }
            const obj = data[index--];
            return (
                <div key={rowID}
                     style={{
                         padding: '30px 0',
                         backgroundColor: 'white',
                     }}
                >
                    <h2>{rowID}</h2>
                    {obj.create_time}
                </div>
            );
        };
        return (
            <div>
                <div style={{height:"50px",borderBottom:"1px solid"}}>头部</div>
                <ListView
                    key='1'
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderHeader={() => <span>头部</span>}
                    renderFooter={() => (<div style={{ padding: 3, textAlign: 'center' }}>
                        {this.state.footer}
                    </div>)}
                    renderRow={row}
                    style={{
                        height: this.state.height,
                    }}
                    pullToRefresh={<PullToRefresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />}
                    onEndReached={this.onEndReached}
                    pageSize={10}
                />
            </div>
        );
    }
}