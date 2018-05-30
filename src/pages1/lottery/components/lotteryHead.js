import React, { Component } from "react";
import { PopupConfirm,  Icon} from 'antd';
import LotteryNum from '../../open/lotteryNum';
import LotteryNameMap from '../../lottery_name_map';
import { Link } from 'react-router-dom';
//头部信息展示
export default class LotteryHead extends Component {
    constructor(props) {
        super(props);
        this.state={
            showOpenedIssue:false
        }
    }
    componentWillMount(){

    }
    toggleOpenIssue(e,bool){
        if(bool==="close"){
            this.setState({
                showOpenedIssue:false
            })
        }else{
            this.setState({
                showOpenedIssue:!this.state.showOpenedIssue
            })
        }

        e.stopPropagation();
    }
    formatTime(t){
        if(!t){
            return"00:00:00";
        }
        let sec_num = parseInt(t, 10);
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }
    analysisFunc(code,type,issue){
        let id =this.props.lottery_id;
        if([26,17].indexOf(parseInt(id))!==-1){
            return this.analysisPK10(code);
        }else if([1, 4, 8,11,18,24].indexOf(parseInt(id))!==-1){
            return this.analysisSSC(code,type);
        }else if([21,25].indexOf(parseInt(id))!==-1){
            return this.analysisLHC(code,issue);

        }else if([12,13,19,20,27,28,29,30].indexOf(parseInt(id))!==-1){
            return this.analysisK3(code,type);
        }

    }
    analysisSSC(code,type){
        if(code){
            let codeArr = code.split("");
            let count = 0;
            codeArr.map((item,i)=>{
                count += parseInt(item);
            });
            let isBig = count>22.5?"大":"小";
            let isEven = count%2===1?"单":"双";
            if(type==="array"){
                return <div className="inline">[和值：{isBig}/{isEven}]</div>
            }else {
                return <div className="right">
                    <span>{isBig}</span>
                    <span>{isEven}</span>
                </div>
            }
        }else{
            return "";
        }
    }
    analysisK3(code,type){
        if(code){
            let codeArr = code.split("");
            let count = 0;
            codeArr.map((item,i)=>{
                count += parseInt(item);
            });
            let isBig = count>10?"大":"小";
            let isEven = count%2===1?"单":"双";


            if(type==="array"){
                return  <div className="inline">[和值：{count}/{isBig}/{isEven}]</div>
            }else{
                return <div className="right k3-right">
                    <span>{count}</span>
                    <span>{isBig}</span>
                    <span>{isEven}</span>
                </div>
            }

        }else{
            return "";
        }
    }

    analysisLHC(code,issue){

        if(code){
            let codeArr = code.split(" ");
            let count = 0;
            codeArr.map((item,i)=>{
                count += parseInt(item);
            });


            let index = 0;


            //急速六合彩
            if(parseInt(this.props.lottery_id)===25){
                let issueNum = parseInt(issue.substring(0,8));
                if(issueNum>20180215){
                    index=1;
                }
            }else{
                let issueNum = parseInt(issue);
                if(issueNum>2018016){
                    index=1;
                }
            }
            let ShengXiao=['鸡','猴','羊','马','蛇','龙','兔','虎','牛','鼠','猪','狗'];
            let num = codeArr[6];//特码
            if(index !==0){
                for (let i=0;i<index;i++){
                    ShengXiao.unshift(ShengXiao[11]);
                    ShengXiao.length=12;
                }
            }
            let shengxiaoIndex =ShengXiao[(num-1)%12];

            let isBig = count>175?"大":"小";
            let isEven = count%2===1?"单":"双";
            let data ="[<b>特肖</b>:"+shengxiaoIndex+" 和值:"+ +" ]";

            return <div className="analysis">
                [<b>特肖</b>:{shengxiaoIndex}
                &nbsp;
                <b>和值</b>:{count+"/"+isBig +"/"+isEven}]

            </div>;
        }else{
            return "";
        }
    }
    analysisPK10(code){
        if(code){
            let codeArr = code.split(" ");
            let count =parseInt(codeArr[0])+parseInt(codeArr[1]);
            let isBig = count>10?"大":"小";
            let isEven = count%2===1?"单":"双";
            let data = "[冠亚和值:"+count+"/"+isBig+"/"+isEven+"]";
            // "[冠亚和值:03/小/单]"
            return <div className="analysis">{data}</div>;
        }else{
            return "";
        }
    }
    render(){
        let game_key=this.props.game_key;
        let lottery_id= parseInt(this.props.lottery_id);
        let LotteryName = LotteryNameMap(this.props.lottery_id);

        //获得彩种数据
        let lotteryitem=this.props.lotterys;
        let lotteryitemarr=[];
        lotteryitem.map((item,i)=>{
            lotteryitemarr.push(

                  <li key={i} onClick={()=>{this.props.changeLottery(item.lottery_id)}} className={item.lottery_id===lottery_id?"active":null}>
                      <label>
                        {item.cname}
                      </label>
                      {item.lottery_id===lottery_id?<em><Icon type="check"/></em>:null}
                  </li>
            );

      });
        let buttonRender="";//信用官方按钮
        if ([15].indexOf(lottery_id) !== -1) {//mm彩只有官方
            buttonRender = <div>
                <button className="active">官方</button>
            </div>
        } else if ([26].indexOf(lottery_id) !== -1) {
            buttonRender = <div>
                <button className="active">信用</button>
            </div>
        }else if (game_key === "g") {

                buttonRender = <div>
                    <button onClick={() => {
                        this.props.handleChangeGameKey()
                    }}>信用
                    </button>
                    <button className="active">官方</button>
                </div>
        } else {
            buttonRender = <div>
                <button className="active">信用</button>
                <button onClick={() => {
                    this.props.handleChangeGameKey()
                }}>官方
                </button>
            </div>
        }
        let timeRender="";//时间渲染
        // countDownType {普通normal //封盘ltPause //休市kTime}
        // countDownTime倒计时时间
        let countDownType = this.props.countDownType;
        if(countDownType==="kTime"){
            timeRender=<div>
                <span>距离下次开市</span>
                <span className="time">
                    {this.formatTime(this.props.countDownTime)}
                </span>
            </div>
        }else if(countDownType==="ltPause"){
            timeRender=<div>
                <span>正在封盘时间</span>
                <span className="time">
                    {this.formatTime(this.props.countDownTime)}
                </span>
            </div>
        }else {
            timeRender=<div>
                <span>距离封盘时间</span>
                <span className="time">
                {this.formatTime(this.props.countDownTime)}
            </span>
            </div>

        }
        let openedIssues = this.props.openedIssues;
        let openedIssuesLength = openedIssues.length;
        let renderoPenIssues=[];
        if([1, 4, 8,11,18,24].indexOf(parseInt(this.props.lottery_id)) !== -1){
            renderoPenIssues.push(<li key={-1}>
                <span>期号</span>
                <span className="open-title">开奖号码</span>
                <div className="right">
                    <span>和值大小</span>
                    <span>和值单双</span>
                </div>

            </li>)
        }else if([12,13,19,20,27,28,29,30].indexOf(parseInt(this.props.lottery_id)) !== -1){
            renderoPenIssues.push(<li key={-1}>
                <span>期号</span>
                <span className="open-title">开奖号码</span>
                <div className="right k3-right">
                    <span>和值</span>
                    <span>大小</span>
                    <span>单双</span>
                </div>

            </li>)
        }
        //最多显示8期 部分小屏手机显示7期
        let length = window.screen.availHeight>600?8:7;
        for(let i=0;i<openedIssues.length&&i<length;i++){
                if(openedIssues[i]){
                    let date = openedIssues[i].issue;
                    if(date.length>10){
                        date = date.substring(4);
                    }
                    renderoPenIssues.push(<li key={i}>
                        <span>第{date}期</span>
                        <div className="opened-nums-wrap">
                            <div className="prize-num">
                                {/*彩球样式*/}
                                <LotteryNum
                                    data={{
                                        lottery_id:this.props.lottery_id,
                                        code:openedIssues[i].code
                                    }}
                                />
                            </div>
                            {this.analysisFunc(openedIssues[i].code,null,openedIssues[i].issue)}
                        </div>
                    </li>)
                }else{
                    renderoPenIssues.push(<li key={i}>
                    </li>)
                }
        }
        let analysisHtml;
        let analysisHtml2;
        //pk10，幸运飞艇，六合彩，急速六合彩   显示在上面
        if([26,17,21,25].indexOf(parseInt(this.props.lottery_id))!==-1){
            if(this.props.countDownType!=="kTime"){
                analysisHtml=this.analysisFunc(this.props.lastOpenCode,null,this.props.lastOpenissue)
            }
        }
        //六合彩，k3 显示在底下
        if([1, 4, 8,11,18,24,12,13,19,20,27,28,29,30].indexOf(parseInt(this.props.lottery_id))!==-1){
            if(this.props.countDownType!=="kTime"){
                analysisHtml2=this.analysisFunc(this.props.lastOpenCode,"array")
            }
        }

            return (
            <div className="lottery-wrap">
                <div className="lottery-head">
                    <div className="lt-info">
                        <div className={lottery_id===15||this.props.kTime===0?"col-left":"col-left col-left1"}>
                            {lottery_id!==15&&this.props.kTime===0?<p>第{this.props.issue}期</p>:<p></p>}
                            <span onClick={(e)=>{this.props.showLotteryList(e);}} className="up">{LotteryName}</span>
                            {/*开奖时间: {this.props.opentime.substr(-8)}*/}
                            {this.props.showList?<div className="lottery-list">
                                <ul>
                                    {lotteryitemarr}
                                </ul>
                            </div>:null}
                        </div>
                        <div className="col-middle">
                            {/*信用官方玩法*/}
                            {buttonRender}
                        </div>
                        <div className="col-right">
                            {/*时间*/}
                            {timeRender}
                        </div>
                    </div>
                    {lottery_id!==15?<div className="last-open">

                        {this.props.countDownType!=="kTime"?<span className={"open-num-title open-num-title"+this.props.lottery_id}>第{this.props.lastOpenissue}期&nbsp;&nbsp;开奖号码 {analysisHtml}</span>:null}
                        <div className="prize-num">
                            {/*彩球样式*/}
                            <LotteryNum
                                data={{
                                    lottery_id:this.props.lottery_id,
                                    code:this.props.lastOpenCode,
                                    kTime:this.props.countDownType!=="kTime"?0:1,
                                    type:"analysis"
                                }}
                            />
                        </div>
                        {analysisHtml2}
                    </div>:<div className="last-open">
                        即买即开
                    </div>
                    }
                </div>
                {lottery_id!==15||openedIssuesLength===0?
                <div className={this.state.showOpenedIssue?"opened-issues opened-issues-show":"opened-issues"}>
                    <ul>
                        {renderoPenIssues}
                    </ul>
                    <div className="addWidth" onClick={(e)=>{this.toggleOpenIssue(e)}}></div>
                    <i className="drop-down-btn" onClick={(e)=>{this.toggleOpenIssue(e)}}></i>
                </div>:null}
            </div>
        )
    }
}

