import Api from "../api";

export default function getStaticData(type="x",callback) {
    let staticData=sessionStorage.getItem("staticData"+type);
    if(staticData){
        staticData= JSON.parse(staticData);
        if(callback){
            return callback(staticData)
        }
    }else{
        Api("c=game&a=initLotteryForType&type="+type,null,(res)=>{
            if(res.errno===0){
                staticData=res.data;
                sessionStorage.setItem("staticData"+type,JSON.stringify(staticData))
                if(callback){
                    return callback(staticData)
                }
            }
        });
    }
}
