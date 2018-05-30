import React, { Component} from 'react'
import {Link} from 'react-router-dom';
import Navbar from '../common/navbar';
import Footer from '../common/footer';
import Api from '../api';

export default class MySetting extends Component {
    constructor(props) {
        super(props);
        this.state={
          myFavorite:window.sessionStorage.myFavorite?JSON.parse(window.sessionStorage.myFavorite):[1,2,7,9,12,16,17,26],
          allFavorite:[]
        };
    };
    getLottery(){
            let lottery=[];
            let alllottery=sessionStorage.getItem("alllottery",alllottery);
            lottery = alllottery.split(",");
            for(let i=0;i<lottery.length;i++){
                lottery[i]=parseInt(lottery[i])
            }
            let myFavorite = this.state.myFavorite;
            let allFavorite=[];
            for(var i=0;i<lottery.length;i++){
              let id=lottery[i];
              if(myFavorite.indexOf(id) === -1){
                allFavorite.push(id)
              }
            };
            if(!window.sessionStorage.myFavorite){
                for(let i=0;i<myFavorite.length;i++){
                    if(lottery.indexOf(myFavorite[i])==-1){
                        myFavorite.splice(i,1)
                    }
                }
            }
            allFavorite.sort((a,b)=>a-b);
            this.setState({
              allFavorite:allFavorite
            })
    };
    componentWillMount(){
      this.getLottery()
    };
    //点击添加最爱
    handleAdd(e){
      let dataName=e.target.getAttribute("data-name");
      let add=[];
      let myFavorite=this.state.myFavorite;
      let allFavorite=this.state.allFavorite;
      for(var i=0;i<allFavorite.length;i++){
        if(dataName==allFavorite[i]){
          add=allFavorite.splice(i,1);
          myFavorite.unshift(add[0]);
          this.setState({
            myFavorite:myFavorite,
            allFavorite:allFavorite
          });
        }
      }
        myFavorite.sort((a,b)=>a-b);
      sessionStorage.myFavorite=JSON.stringify(this.state.myFavorite);
    };
     //点击移除
     handleRemove(e){
       let dataName=e.target.getAttribute("data-name");
       let allFavorite=this.state.allFavorite;
       let myFavorite=this.state.myFavorite;
       let remove=[];
       for(var i=0;i<myFavorite.length;i++){
         if(dataName==myFavorite[i]){
           remove=myFavorite.splice(i,1);
           allFavorite.unshift(remove[0]);
           this.setState({
             myFavorite:myFavorite,
             allFavorite:allFavorite
           });
         }
       }
       sessionStorage.myFavorite=JSON.stringify(this.state.myFavorite);
     };
    myLike(){
      let str=[];
      let myFavorite=this.state.myFavorite;
      if(window.sessionStorage.myFavorite){
        let sessionFavorite=JSON.parse(window.sessionStorage.myFavorite);
        myFavorite=sessionFavorite;
        for(var i=0;i<myFavorite.length;i++){
          str.push(
            <li key={i}>
              <i className={"lt-icon lt-icon-"+myFavorite[i]}
               data-name={myFavorite[i]}></i>
            </li>
          )
        }
      }else{
          for(var i=0;i<myFavorite.length;i++){
              str.push(
                  <li key={i}>
                      <i className={"lt-icon lt-icon-"+myFavorite[i]}
                         data-name={myFavorite[i]}></i>
                  </li>
              )
          }
      }
      return str
    };
    allLike(){
      var str=[];
      var allFavorite=this.state.allFavorite;
      for(var i=0;i<allFavorite.length;i++){
          str.push(
            <li key={i}>
              <i className={"lt-icon lt-icon-"+allFavorite[i]}
               data-name={allFavorite[i]}></i>
            </li>
          )
      }
      return str
    };
    render() {
        let navbarRight=<Link to="/home" className="set">完成</Link>;
        return (
            <div>
                <Navbar title="我的最爱编辑" back={"/home"} navbarRight={navbarRight}/>
                <div className="home">
                    <section className="favorite favorite1">
                        <h3>
                            <span>我的彩票</span>
                            <span>(点击添加删除)</span>
                        </h3>
                        <ul onClick={(e)=>{this.handleRemove(e)}}>
                            {this.myLike()}
                        </ul>
                    </section>

                    <section className="favorite favorite1">
                        <h3>
                            <span>猜你喜欢</span>
                            <span>(点击添加删除)</span>

                        </h3>
                        <ul onClick={(e)=>{this.handleAdd(e)}}>
                              {this.allLike()}
                        </ul>
                    </section>
                </div>
                <Footer />
            </div>
        )
    }
}
