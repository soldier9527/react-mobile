import React, { Component, PropTypes } from 'react'
import {Toast} from "antd-mobile";
//重复点击  判断
//请求开始 MaskLoading(时间)
//请求成功 MaskLoading(false)
export default function MaskLoading(time) {
    if(time){
        Toast.loading("正在提交...", time,()=>{
            Toast.hide();
            Toast.loading("网络太差",time)
        });
    }else{
        setTimeout(()=>{
            Toast.hide();
        },500)

    }

}