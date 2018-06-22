import React from 'react'
import Spin from 'antd/lib/spin'
const LoadingSpin = ()=>(<div className="loading-spin">
    <Spin size="large" tip="正在载入"/>
</div>)
export default LoadingSpin;