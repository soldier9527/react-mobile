import Api from '../pages/api'
export default function getAppVersion() {
    Api("c=default&a=getVersion",{
        type:2,
        lastOne:0
    },(res)=>{
        if(res.errno ===0){
            console.log(res)

        }
    })
}