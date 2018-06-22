//所有配置信息
console.log(JSON.parse(process.env.REACT_APP_PANKOU))
localStorage.setItem("config",process.env.REACT_APP_PANKOU)
export default  JSON.parse(process.env.REACT_APP_PANKOU)
