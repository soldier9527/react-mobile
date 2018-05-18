
//下拉刷新
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PullToRefresh, Button } from 'antd-mobile';
import 'antd-mobile/lib/pull-to-refresh/style/css';//加载选择样式
function genData() {
    const dataArr = [];
    for (let i = 0; i < 20; i++) {
        dataArr.push(i);
    }
    return dataArr;
}
export default class PullDown extends Component {
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
                <Demo />
            </div>
        );
    }
}

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            down: true,
            data: [],
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({

                data: genData(),
            })
        }, 0);
    }

    render() {
        return (<div>
            下拉刷新和上拉刷新
            <Button
                style={{ marginBottom: 15 }}
                onClick={() => this.setState({ down: !this.state.down })}
            >
                direction: {this.state.down ? 'down' : 'up'}
            </Button>

                    <PullToRefresh
                        style={{
                            // position:"absolute",
                            // top:"1rem",
                            // bottom:"0",
                            // width:"100%",
                            height:"500px",
                            overflow: 'auto',
                        }}
                        indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
                        direction={this.state.down ? 'down' : 'up'}
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            this.setState({ refreshing: true });
                            setTimeout(() => {
                                this.setState({ refreshing: false });
                            }, 1000);
                        }}
                    >
                        {this.state.data.map(i => (
                            <div key={i} style={{ textAlign: 'center', padding: 20 }}>
                                {this.state.down ? 'pull down' : 'pull up'} {i}
                            </div>
                        ))}
                    </PullToRefresh>


        </div>);
    }
}