    import React, {Component} from 'react'
import Navbar from '../common/navbar';
import {Tabs} from 'antd-mobile';
import  message from 'antd/lib/message';
import ReactDOM from 'react-dom';
import  Icon from 'antd/lib/icon';
import GetLotteryList from '../get_lottery_list';

import Api from '../api';

export default class LotteryTrend extends Component {
    constructor(props) {
        super(props);
        let id=1;
        if(props.history.location.search&&new URLSearchParams(props.history.location.search).get('id') - 0!==15){
            id=new URLSearchParams(props.history.location.search).get('id') - 0;
        }
        this.state = {
            id: id,//转number
            title: "",
            initData: [],
            renderData: [],
            tabs: [],
            lotteryArr:[],
            filterIndex:0,
            canvas:[],
            locateData:[],
            numsArr:[],
            splitStr:"",//分割code规则
            type:"normal"
        }
    }

    componentWillMount() {
        this.setFilterTabs();
        this.getHistory();
        this.getLotteryList();
    }
    componentDidMount() {
    }

    //获取数据
    getHistory(id = this.state.id) {
        Api("c=default&a=getOpen&lottery_id=" + id, null, (res) => {
            if (res.errno === 0) {

                let initData = this.initDate(res.data);
                this.setState({
                    initData:initData,
                    renderData:initData,
                });
                this.transData(initData);
                if(this.state.lotteryArr){
                    let title='';
                    this.state.lotteryArr.map((item,i)=>{
                        if(id==item[0]){
                            title=item[1]
                        }
                    });
                    this.setState({
                        title:title,
                    });
                }
            }
        })
    }
    //彩种列表
    getLotteryList(){
        GetLotteryList((data)=>{
            let lotteryArr =[];
            let title ="";
            data.map((item,i)=>{
                if(this.state.id==item.lottery_id){
                    title=item.cname
                }
                if([15].indexOf(parseInt(item.lottery_id))===-1){
                    lotteryArr.push([item.lottery_id,item.cname])
                }
            });
            this.setState({
                title:title,
                lotteryArr:lotteryArr
            });
        })
    }
    //彩种列表切换
    change(index){
        this.setState({
            id:index,
            filterIndex:0,
        },function () {
            try{
                ReactDOM.findDOMNode(document.getElementsByClassName("am-tabs-default-bar-tab")[0]).click();
            }catch (err){

            }
            this.setFilterTabs();
            this.getHistory(index);//获取历史之后初始化tab（通过点击）
        })

    }
    initDate(data) {
        if (data.openIssues&&data.openIssues.length>0) {
            let initData=[];
            let splitStr=this.state.splitStr;

            data.openIssues.map((item,i)=>{
                initData.push({
                    issue:item.issue,
                    code:item.code.split(splitStr)
                })
            });
            return initData;
        }else{
            return [];
        }
    }
    setFilterTabs(){
        let id = this.state.id;
        let numsArr = [];
        let splitStr = "";//分割code规则
        let tabs =[];
        switch (id){
            case 1:
            case 4:
            case 8:
            case 11:
            case 18:
            case 24:
            //时时彩
                numsArr=["0","1","2","3","4","5","6","7","8","9"];
                splitStr="";
                tabs=[
                    {title: "全部",tableHead:["期号","开奖号码"],type:""},
                    {title: "大小",tableHead:["期号","万","千","百","十","个"],type:"big-small",compare:4,noRenderBall:true},
                    {title: "单双",tableHead:["期号","万","千","百","十","个"],type:"old-even",noRenderBall:true},
                    {title: "总和",tableHead:["期号","总和","大小","单双"],type:"ssc-zhlh",compare:22,noRenderBall:true},
                    {title: "万位",tableHead:["期号",...numsArr],type:"normal",codeIndex:0,hasLine:true},
                    {title: "千位",tableHead:["期号",...numsArr],type:"normal",codeIndex:1,hasLine:true},
                    {title: "百位",tableHead:["期号",...numsArr],type:"normal",codeIndex:2,hasLine:true},
                    {title: "十位",tableHead:["期号",...numsArr],type:"normal",codeIndex:3,hasLine:true},
                    {title: "个位",tableHead:["期号",...numsArr],type:"normal",codeIndex:4,hasLine:true},

                ];
                break;
            case 10:
                //p3p5
                numsArr=["0","1","2","3","4","5","6","7","8","9"];
                splitStr="";
                tabs=[
                    {title: "全部",tableHead:["期号","开奖号码"],type:""},
                    {title: "万位",tableHead:["期号",...numsArr],type:"normal",codeIndex:0,hasLine:true},
                    {title: "千位",tableHead:["期号",...numsArr],type:"normal",codeIndex:1,hasLine:true},
                    {title: "百位",tableHead:["期号",...numsArr],type:"normal",codeIndex:2,hasLine:true},
                    {title: "十位",tableHead:["期号",...numsArr],type:"normal",codeIndex:3,hasLine:true},
                    {title: "个位",tableHead:["期号",...numsArr],type:"normal",codeIndex:4,hasLine:true},
                ];
                break;
            case 2:
            case 5:
            case 6:
            case 7:
            case 16:
                //11选5
                numsArr=["01","02","03","04","05","06","07","08","09","10","11"];
                splitStr = " ";
                tabs=[
                    {title: "全部",tableHead:["期号","开奖号码"],type:""},
                    {title: "万位",tableHead:["期号",...numsArr],type:"normal",codeIndex:0,hasLine:true},
                    {title: "千位",tableHead:["期号",...numsArr],type:"normal",codeIndex:1,hasLine:true},
                    {title: "百位",tableHead:["期号",...numsArr],type:"normal",codeIndex:2,hasLine:true},
                    {title: "十位",tableHead:["期号",...numsArr],type:"normal",codeIndex:3,hasLine:true},
                    {title: "个位",tableHead:["期号",...numsArr],type:"normal",codeIndex:4,hasLine:true},
                ];
                break;
            case 9:
            //福彩3D
            case 23:
                //幸运28
                numsArr=["0","1","2","3","4","5","6","7","8","9"];
                splitStr = "";
                tabs=[
                    {title: "全部",tableHead:["期号","开奖号码"],type:""},
                    {title: "百位",tableHead:["期号",...numsArr],type:"normal",codeIndex:0,hasLine:true},
                    {title: "十位",tableHead:["期号",...numsArr],type:"normal",codeIndex:1,hasLine:true},
                    {title: "个位",tableHead:["期号",...numsArr],type:"normal",codeIndex:2,hasLine:true},
                ];
                break;


            case 17:
                //PK10
            case 26:
                //幸运飞艇
                numsArr=["01","02","03","04","05","06","07","08","09","10"];
                splitStr = " ";
                tabs=[
                    {title: "全部",tableHead:["期号","开奖号码"],noRenderBall:true},
                    {title: "大小",tableHead:["期号","一","二","三","四","五","六","七","八","九","十"],type:"big-small",compare:5,noRenderBall:true},
                    {title: "单双",tableHead:["期号","一","二","三","四","五","六","七","八","九","十"],type:"old-even",noRenderBall:true},
                    {title: "冠亚军和",tableHead:["期号","冠亚军和","冠亚军大小","冠亚军单双"],type:"pck10-gyjh",compare:10,noRenderBall:true},
                    {title: "龙虎",tableHead:["期号","龙位","虎位","龙","虎"],type:"pck10-lh",noRenderBall:true},
                    {title: "冠军",tableHead:["期号",...numsArr],type:"normal",codeIndex:0,hasLine:true},
                    {title: "亚军",tableHead:["期号",...numsArr],type:"normal",codeIndex:1,hasLine:true},
                    {title: "三名",tableHead:["期号",...numsArr],type:"normal",codeIndex:2,hasLine:true},
                    {title: "四名",tableHead:["期号",...numsArr],type:"normal",codeIndex:3,hasLine:true},
                    {title: "五名",tableHead:["期号",...numsArr],type:"normal",codeIndex:4,hasLine:true},
                    {title: "六名",tableHead:["期号",...numsArr],type:"normal",codeIndex:5,hasLine:true},
                    {title: "七名",tableHead:["期号",...numsArr],type:"normal",codeIndex:6,hasLine:true},
                    {title: "八名",tableHead:["期号",...numsArr],type:"normal",codeIndex:7,hasLine:true},
                    {title: "九名",tableHead:["期号",...numsArr],type:"normal",codeIndex:8,hasLine:true},
                    {title: "十名",tableHead:["期号",...numsArr],type:"normal",codeIndex:9,hasLine:true},

                ];
                break;
            case 12:
            case 13:
            case 19:
            case 20:
            case 27:
            case 28:
            case 29:
            case 30:
                //快3
                numsArr=["1","2","3","4","5","6"];
                var numsArr2=["3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"];
                splitStr="";
                tabs=[
                    {title: "全部",tableHead:["期号","开奖号码"],type:""},
                    {title: "大小",tableHead:["期号","百","十","个"],type:"big-small",compare:3,noRenderBall:true},
                    {title: "单双",tableHead:["期号","百","十","个"],type:"old-even",noRenderBall:true},
                    {title: "总和",tableHead:["期号","总和","大小","单双"],type:"k3-zhdxds",compare:10,noRenderBall:true},
                    {title: "号码分布",tableHead:["期号",...numsArr],type:"type-k3"},
                    {title: "和值走势",tableHead:["期号",...numsArr2],type:"type-k3",hasLine:true},
                ];
                break;
            case 21:
            case 25:
                //六合彩
                numsArr=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49"];
                splitStr=" ";
                tabs=[
                    {title: "全部",tableHead:["期号","开奖号码"],type:"",noRenderBall:true},
                    {title: "大小",tableHead:["期号","一码","二码","三码","四码","五码","六码","特码"],type:"big-small",noRenderBall:true,compare:24,},
                    {title: "单双",tableHead:["期号","一码","二码","三码","四码","五码","六码","特码"],type:"old-even",noRenderBall:true},
                    {title: "生肖",tableHead:["期号","一码","二码","三码","四码","五码","六码","特码"],type:"lhc-shengxiao",noRenderBall:true},
                    {title: "混合",tableHead:["期号","大小","单双","总和"],type:"lhc-mix",noRenderBall:true,compare:175},

                    {title: "正码",tableHead:["期号",...numsArr],type:"type-lhc"},
                    {title: "特码",tableHead:["期号",...numsArr],type:"type-lhc"},
                ];
                break;
            case 22:
                //双色球
                numsArr=["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33"];
                var numsArr2=["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16"];
                splitStr=" ";
                tabs=[
                    {title: "全部",tableHead:["期号","开奖号码"],type:""},
                    {title: "红球区",tableHead:["期号",...numsArr],type:"type-ssq"},
                    {title: "篮球区",tableHead:["期号",...numsArr2],type:"type-ssq"},
                ];
                break;
            case 14:
                //扑克
                splitStr=" ";
                numsArr=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
                tabs=[
                    {title: "全部",tableHead:["期号","开奖号码"],type:"",noRenderBall:true},
                    {title: "号码分布",tableHead:["期号",...numsArr],type:"type-poker"},
                    {title: "形态",tableHead:["期号","散牌","同花","顺子","同花顺","豹子","对子"],type:"type-pattern",noRenderBall:true},
                    {title: "花色",tableHead:["期号","红桃","梅花","黑桃","方块"],type:"poker-huase",noRenderBall:true},
                ];
                break;

            default:
                tabs=[];
                message.error("没有该走势");

        }
        this.setState({
            numsArr:numsArr,
            tabs:tabs,
            splitStr:splitStr,
        })
    }
    transData(initData=this.state.initData){
        if([21,25].indexOf(this.state.id) !==-1){
            let newData=[];

            initData.map((item,i)=>{
                let codeArr = [];
                item.code.map((code,c)=>{
                    codeArr.push(LhcGetColor(code));
                })
                newData[i]={
                    issue:item.issue,
                    code:codeArr
                };
            });
            this.setState({
                renderData:newData,
            })
        }else if([17,26].indexOf(this.state.id) !==-1){
            let newData=[];
            // let className = this.state.id===17?"pk-":"xy-";
            let className = "pk-";
            initData.map((item,i)=>{
                let codeArr = [];
                item.code.map((code,c)=>{
                    codeArr.push(<span className={"ballpk10 "+className+code}>{code}</span>);
                })
                newData[i]={
                    issue:item.issue,
                    code:codeArr
                };
            });
            this.setState({
                renderData:newData,
            })
        }else if([14].indexOf(this.state.id) !==-1){
            let newData=[];
            initData.map((item,i)=>{
                let codeArr = [];

                item.code.map((code,c)=>{
                    let arr = pokerColor(code);
                    codeArr.push(arr[0]);
                    codeArr.push(arr[1]);
                });
                newData[i]={
                    issue:item.issue,
                    code:codeArr
                };
            });
            this.setState({
                renderData:newData,
            })
        } else{
            this.setState({
                renderData:initData,
            })
        }

    }
    //切换时filterIndex
    changeTabs(index) {
        if(index===0){
            this.transData();
            this.setState({
                filterIndex:index,
                locateData:[],
            })
        }else{
            let initData = JSON.parse(JSON.stringify(this.state.initData));
            let numsArr = JSON.parse(JSON.stringify(this.state.numsArr));
            let tab = this.state.tabs[index];
            let tableHead = tab["tableHead"];
            let compare = tab.compare;
            let codeIndex = tab.codeIndex;
            let hasLine =tab.hasLine;
            let type = tab.type;
            let renderData = [];
            initData.map((item,i)=>{
                let num;
                let code = [];
                switch(type){
                    case "normal":
                        num = item.code[codeIndex];
                        numsArr.map((a,index)=>{
                            if(a===num){
                                code.push(num)
                            }else{
                                code.push("")
                            }
                        });
                        break;
                    case "big-small":
                        item.code.map((a,index)=>{
                            a=parseInt(a);
                            if(a>compare){
                                code.push(<span className="cell-big">大</span>)
                            }else{
                                code.push(<span className="cell-small">小</span>)
                            }

                        })
                        break;
                    case "old-even":
                        item.code.map((a,index)=>{
                            a=parseInt(a);
                            if(a%2 ===1){
                                code.push(<span className="cell-even">单</span>)
                            }else{
                                code.push(<span className="cell-odd">双</span>)
                            }

                        });
                        break;
                    //时时彩总和龙虎总和/龙虎
                    case "ssc-zhlh":
                    {
                        let count = 0
                        item.code.map((a,index)=>{
                            count += parseInt(a)
                        });
                        code.push(count);
                        if(count>compare){
                            code.push(<span className="cell-big">总大</span>)
                        }else{
                            code.push(<span className="cell-small">总小</span>)
                        }
                        if(count%2 ===1){
                            code.push(<span className="cell-even">总单</span>)
                        }else{
                            code.push(<span className="cell-odd">总双</span>)
                        }

                        // code.push(isDragon(item.code[0],item.code[4]));
                    }
                        break;
                    //快三总和大小单双
                    case "k3-zhdxds":
                    {
                        let count = 0
                        item.code.map((a,index)=>{
                            count += parseInt(a)
                        });
                        code.push(count);
                        if(count>compare){
                            code.push(<span className="cell-big">总大</span>)
                        }else{
                            code.push(<span className="cell-small">总小</span>)
                        }
                        if(count%2 ===1){
                            code.push(<span className="cell-even">总单</span>)
                        }else{
                            code.push(<span className="cell-odd">总双</span>)
                        }

                    }
                        break;

                    case "type-ssq":
                        if(index !==2){
                            code = [];
                            item.code.length=item.code.length-1;
                            numsArr.map((a,index)=>{
                                if(item.code.indexOf(a)!==-1){
                                    code.push(a);
                                }else{
                                    code.push("");
                                }
                            });
                        }else{
                            numsArr.length=16;
                            num = item.code[6];
                            numsArr.map((a,index)=>{
                                if(a===num){
                                    code.push(num)
                                }else{
                                    code.push("")
                                }
                            });
                        }
                        break;
                    case "type-lhc":
                        if(tab.title==="正码"){
                            code = [];
                            item.code.length=item.code.length-1;
                            numsArr.map((a,index)=>{
                                if(item.code.indexOf(a)!==-1){
                                    code.push(a);
                                }else{
                                    code.push("");
                                }
                            });
                        }else if(tab.title==="特码"){
                            num = item.code[6];
                            numsArr.map((a,index)=>{
                                if(a===num){
                                    code.push(num)
                                }else{
                                    code.push("")
                                }
                            });
                        }
                        break;
                    case "lhc-shengxiao":
                        item.code.map((a,index)=>{
                            a=parseInt(a);
                            code.push(getshengxiao(a))
                        })

                        break;
                    case "lhc-mix":
                    {
                        let count = 0;
                        item.code.map((a,index)=>{
                            count += parseInt(a)
                        });
                        if(count>compare){
                            code.push(<span className="cell-big">总大</span>)
                        }else{
                            code.push(<span className="cell-small">总小</span>)
                        }
                        if(count%2 ===1){
                            code.push(<span className="cell-even">总单</span>)
                        }else{
                            code.push(<span className="cell-odd">总双</span>)
                        }
                        code.push(count);
                    }
                        break;
                    case "type-k3":
                        if(index ===4){
                            numsArr.map((a,index)=>{
                                let count=0;
                                item.code.map((itemcode,c)=>{
                                    if(itemcode===a){
                                        count++
                                    }
                                });
                                if(count===0){
                                    code.push("")
                                }else if(count===1){
                                    code.push(a)
                                }else{
                                    code.push(<div>
                                        {a}
                                        <i className="top">{count}</i>
                                    </div>)
                                }
                            });

                        }else if(index ===5){
                            let count = 0;
                            item.code.map((itemcode,c)=>{
                                count+=parseInt(itemcode);
                            });
                            for(let i=3;i<19;i++){
                                if(i===count){
                                    code.push(i)
                                }else{
                                    code.push("")
                                }
                            }
                        }
                        break;
                    case "pck10-gyjh":
                    {
                        let count = parseInt(item.code[0])+parseInt(item.code[1]);
                        code.push(count);

                        if(count>compare){
                            code.push(<span className="cell-big">大</span>)
                        }else{
                            code.push(<span className="cell-small">小</span>)
                        }
                        if(count%2 ===1){
                            code.push(<span className="cell-even">单</span>)
                        }else{
                            code.push(<span className="cell-odd">双</span>)
                        }
                    }

                        break;
                    case "pck10-lh":
                        code.push(item.code[0]);
                        code.push(item.code[9]);
                        code.push(isDragon(item.code[0],item.code[9],true));
                        code.push(isDragon(item.code[9],item.code[0],true));
                        break;
                    case "type-poker":
                    {
                        numsArr.map((a,index)=>{

                            let count=0;
                            item.code.map((itemcode,c)=>{
                                let num = itemcode.split("")[0];
                                num=num==="T"?"10":num;
                                if(num===a){
                                    count++
                                }
                            });
                            if(count===0){
                                code.push("")
                            }else if(count===1){
                                code.push(a)
                            }else{
                                code.push(<div>
                                    {a}
                                    <i className="top">{count}</i>
                                </div>)
                            }
                        });
                        break;


                    }
                    case "type-pattern":
                    {
                        let pattern = pokerPattern(item.code);

                        for(let i=1;i<7;i++){
                            if(pattern.indexOf(tableHead[i])===-1){
                                code.push("")
                            }else{
                                code.push(<span className={"poker-pattern poker-pattern-"+i}>{tableHead[i]}</span>)
                            }
                        }
                    }
                    break;

                    case "poker-huase":
                    {
                        let huase = ["s","h","c","d"];
                        huase.map((a,index)=>{

                            let count=0;
                            item.code.map((itemcode,c)=>{
                                let num = itemcode.split("")[1];
                                if(num===a){
                                    count++
                                }
                            });
                            if(count===0){
                                code.push("")
                            }else if(count===1){
                                code.push(<span className={"poker-ball poker-ball-"+a}></span>)
                            }else{
                                code.push(<div>
                                    <span className={"poker-ball poker-ball-"+a}>
                                         <i className="top">{count}</i>
                                    </span>

                                </div>)
                            }
                        });
                        break;


                    }

                    default:
                        code=item.code

                }

                renderData.push({
                    issue:item.issue,
                    code:code,
                })

            });
            this.setState({
                renderData:renderData,
                filterIndex:index,
                locateData:[],
            },()=>{
                if(hasLine){
                    setTimeout(()=>{
                        this.calcLocation();
                    })
                }
            });
        }

    }
    calcLocation(){
        let relativeTop = ReactDOM.findDOMNode(this.refs.wrap).getBoundingClientRect().top;
        let locateData =[];
        let filterIndex=this.state.filterIndex;
        let offset=0;
        let oldData;
        for(let i=0;i<100;i++){
            let dom=document.getElementById("ball-"+filterIndex+"-"+i);
            if(dom){
                let object=ReactDOM.findDOMNode(dom).getBoundingClientRect();

                let newData;
                if(offset===0){
                    offset=object.width/2;
                    oldData={
                        x:object.left+offset,
                        y:object.top+offset-relativeTop
                    };
                }else{
                    newData={
                        x:object.left+offset,
                        y:object.top+offset-relativeTop
                    };
                    locateData.push([oldData,newData]);
                    oldData=JSON.parse(JSON.stringify(newData));
                }



            }else{
                i=100;
            }
        }
        this.setState({
            locateData:locateData,
        });
    }
    render() {
        let initData=this.state.renderData;
        let tabs=this.state.tabs;
        if(!tabs){
            return null;
        }
        let filterIndex=this.state.filterIndex;
        let noRenderBall = tabs[filterIndex].noRenderBall;

        let tableHead=tabs[filterIndex]?tabs[filterIndex].tableHead:[];
        let tableBody=[];
        let num=0;
        initData.map((tr,r)=>{
            let labelHtml = [];
            tr.code.map((code,c)=>{
                let codeHtml="";
                if(noRenderBall){
                    codeHtml =code
                }else if(code){
                    codeHtml=<i className="ball" id={"ball-"+filterIndex+"-"+num}>{code}</i>
                    num++;
                }
                labelHtml.push(<label key={c}>{codeHtml}</label>);
            });
            tableBody.push(<div key={r} className="trend-table-tr ">
                <label key={-1}>{tr.issue}</label>
                {labelHtml}
            </div>);
        });

        let locateData = this.state.locateData;
        let canvasArr=[];
        if(locateData.length>0&&filterIndex>0){
            locateData.map((data,d)=>{
                canvasArr.push(<CanvasRender
                    key={filterIndex+"-"+d}
                    data={data}
                />)
            })
        }

        //下拉菜单
        let renderMenu;
        if(this.state.lotteryArr.length>0){
            renderMenu = new Map(this.state.lotteryArr);

        }else{
            renderMenu= new Map([]);
        }
        return (
            <div>
                <Navbar
                    title={<span>{this.state.title}<Icon type="caret-down" /></span>}
                    back={"back"}
                    change={(index)=>{this.change(index)}}
                    dropdown = {renderMenu}
                    id={this.state.id}
                />
                <div className="lottery-trend-wrap">
                    <Tabs ref="myInput" tabs={this.state.tabs}
                          animated={false}
                          useOnPan={false}
                          swipeable={false}
                          destroyInactiveTab={true}
                          prerenderingSiblingsNumber={0}
                          onChange={(tab, index) => {
                              this.changeTabs(index)
                          }}>
                        <div className="trend-table-wrap" ref="wrap" >
                            <div className="trend-table-tr trend-table-head">
                                {tableHead.map((tab, t) => {
                                    return <b key={t}>{tab}</b>
                                })}
                            </div>
                            <div className="trend-table-body">
                                {tableBody}
                                {canvasArr}
                            </div>
                        </div>
                    </Tabs>
                </div>

            </div>
        )
    }
}



//canvas组件
class CanvasRender extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let prev = this.props.data[0];
        let next = this.props.data[1];
        let width=0;
        let height=0;
        let startPoint=[];
        let line="left";
        if(prev.x>next.x){
            width=prev.x - next.x;
            startPoint.push(next.x);
            line="right"
        }else{
            width=next.x - prev.x;
            startPoint.push(prev.x)
        }
        if(prev.y>next.y){
            height=prev.y - next.y;
            startPoint.push(next.y)
        }else{
            height=next.y - prev.y;
            startPoint.push(prev.y)
        }
        if(width===0){
            startPoint[0]=startPoint[0]-1;
            width=1;
        }

        this.setState({
            width:width,
            height:height,
            startPoint:startPoint,
            line:line,
        })


    }
    componentDidMount() {
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        if (canvas.getContext) {
            let ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.strokeStyle = '#d22018';
            if(this.state.line==="left"){
                ctx.moveTo(0, 0);
                ctx.lineTo(this.state.width, this.state.height);
            }else{
                ctx.moveTo(this.state.width, 0);
                ctx.lineTo(0, this.state.height);
            }
            ctx.stroke()
        }
    }


    render() {
        return (
            <div>
                <canvas ref="canvas"
                        height={this.state.height}
                        width={this.state.width}
                        style={{
                            position:"absolute",
                            top:this.state.startPoint[1],
                            left:this.state.startPoint[0],
                        }}
                >
                    不支持canvas
                </canvas>
            </div>
        )
    }
}

    //判断龙虎(loseOrWin为true，则返回输赢)
    function isDragon(pre,after,loseOrWin) {
        if(loseOrWin){
            if(pre>after){
                return <span className="cell-dragon">赢</span>
            }else if(pre === after){
                return "和"
            }else{
                return <span className="cell-tiger">输</span>
            }
        }else{
            if(pre>after){
                return <span className="cell-dragon">龙</span>
            }else if(pre === after){
                return "和"
            }else{
                return <span className="cell-tiger">虎</span>
            }
        }

    }


    //六合彩获得颜色 参数 号码 num
    export  function LhcGetColor(num) {
        let redBo =[1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46]
        let blueBo =[3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48 ]
        // let greenBo =[5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49]

        if(redBo.indexOf(parseInt(num)) !== -1){
            return(<span className="ball cell-red">{num}</span>)
        }else if(blueBo.indexOf(parseInt(num)) !== -1){
            return(<span className="ball cell-blue">{num}</span>)
        }else{
            return(<span className="ball cell-green">{num}</span>)
        }

    }
    //波段 num 号码
    function getBoDuan(num){
        let redBo =[1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46];
        let blueBo =[3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48 ];
        // let greenBo =[5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49]

        if(redBo.indexOf(parseInt(num)) !== -1){
            return(<span className="ball cell-red">红波</span>)
        }else if(blueBo.indexOf(parseInt(num)) !== -1){
            return(<span className="ball cell-blue">蓝波</span>)
        }else{
            return(<span className="ball cell-green">绿波</span>)
        }
    }
    //获取生肖 参数 （特肖 num）（year 当前年份）
    function getshengxiao(num){
        let index = 2018-2017;
        let ShengXiao=['鸡','猴','羊','马','蛇','龙','兔','虎','牛','鼠','猪','狗'];

        if(index !==0){
            for (let i=0;i<index;i++){
                ShengXiao.unshift(ShengXiao[11]);
                ShengXiao.length=12;
            }
        }
        let data =ShengXiao[(num-1)%12];
        return (<span className="ball cell-red">{data}</span>)
    }
    //扑克号码转换
    function pokerColor(pokerNum) {

        let numArr = pokerNum.split("");
        numArr[0]=numArr[0]==="T"?"10":numArr[0];
        let color = ["s","c"].indexOf(numArr[1])===-1?"color-red":"";
        return [
            <span className={"poker-ball poker-ball-"+numArr[1]}></span>,
            <span className={color}>{numArr[0]}</span>
        ]
    }
    //扑克形态   ["散牌","同花","顺子","同花顺","豹子","对子"]
    function pokerPattern(code) {
        let colorArr= [];
        let numArr= [];
        code.map((c,i)=>{
            let codeObj = c.split("");
            numArr.push(codeObj[0]);
            colorArr.push(codeObj[1])
        });;
        let colorSet =new Set(colorArr);
        let numSet =new Set(numArr);
        let normal =["A","2","3","4","5","6","7","8","9","T","J","Q","K","A"];
        let Pattern=[];//形态
        if(colorSet.size===1){
            Pattern.push("同花")
        }
        if(numSet.size===1){
            Pattern.push("豹子")
        }else if(numSet.size===2){
            Pattern.push("对子")
        }else{
            if(numSet.has(normal[11]) && numSet.has(normal[12]) && numSet.has(normal[13])){//减少3次遍历
                Pattern.push("顺子");
            }else{
                for(let i=0,j=normal.length-3;i<j;i++){
                    if(numSet.has(normal[i]) && numSet.has(normal[i+1]) && numSet.has(normal[i+2])){
                        Pattern.push("顺子");
                        i=j;
                    }
                }
            }
        }

        if(Pattern.length===0){
            Pattern.push("散牌")
        }else  if(Pattern.length===2){
            Pattern.push("同花顺")
        }
        return Pattern

    }