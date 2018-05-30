import Api from "./api";

export default function GetLotteryList(callback) {
    let lotteryList=sessionStorage.getItem("lotteryList");
    if(lotteryList){
        lotteryList= JSON.parse(lotteryList);
        callback(lotteryList)
    }else{
        Api("c=default&a=lotteryListIcon",null,(res)=>{
            if(res.errno===0){
                lotteryList=res.data.lotteryList;
                sessionStorage.setItem("lotteryList",JSON.stringify(lotteryList))
                callback(lotteryList)
            }
        });
    }
}