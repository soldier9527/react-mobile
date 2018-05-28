import React from 'react'
import {Button} from 'antd-mobile'
let Btn=(prop)=>(<Button type="warning" className={prop.className} onClick={()=>prop.onClick()}>
    {prop.children}
</Button>)

export default Btn;