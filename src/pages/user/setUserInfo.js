import React, {Component} from 'react';
import Navbar from '../common/navbar';
import Api from '../api';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
const FormItem = Form.Item;


export default class SetUserInfo extends Component {

    constructor(props) {
        super(props);
        console.log(props.history.location)
        let param = props.history.location.search?new URLSearchParams(props.history.location.search).get("param"):"nick_name"
        this.state = {
            param:param,
            title:"",
            form:""
        };
    }
    componentWillMount() {
        if (!sessionStorage.getItem("user")) {
            this.props.history.push("/login");
        };
        this.setTitle(this.state.param);
    }

    setTitle(param){
        let title = "";
        let form = "";
        switch(param){
            case "nick_name":
                title = "昵称";
                form = SetNickNameForm;
                break;
            case "mobile":
                title = "手机号";
                form = SetMobileForm;
                break;
            case "real_name":
                title = "真实姓名";
                form = SetRealNameForm;
                break;

        }
        this.setState({
            title:title+"设置",
            form:form
        })
    }
    render() {

        const WrappedForm = Form.create()(this.state.form);
        return (
           <div>
               <Navbar back="/user_state" title={this.state.title}/>
               <div className="setuserinfo-wrap">

                   <WrappedForm />
               </div>
               {this.state.param}
           </div>
        );
    }
}

//设置昵称
class SetNickNameForm extends Component {
    state = {
        confirmDirty: false
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let user=JSON.parse(sessionStorage.getItem("user"));
                Api("c=user&a=info",{
                    nick_name:values.nick_name,
                    user_id:user.user_id,
                    is_wap:1
                },function(res){
                    if(res.errno ===0){
                        let newuser =JSON.parse(sessionStorage.getItem("user"));
                        newuser.nick_name = values.nick_name;
                        sessionStorage.setItem("user",JSON.stringify(newuser));
                        message.config({
                            top: 50,
                            duration: 1,
                        });
                        message.success("设置成功",2);
                        this.props.history.push("/user_state");
                    }
                });

            }
        });
    };

    namevalid = (rule, value, callback) => {
        if(!/^[\s\S]{1,16}$/.test(value)){
            callback("昵称为1-16位任意字符");
        }
        callback();
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        let user =JSON.parse(sessionStorage.getItem("user"));
        return (
            <Form onSubmit={this.handleSubmit}>
                <div className="input-wrap">
                    <FormItem
                        label="昵称"
                        hasFeedback
                    >
                        {getFieldDecorator('nick_name', {
                            initialValue: user.nick_name,
                            rules: [{
                                validator:this.namevalid
                            }
                            ],
                        })(
                            <Input type="text" name="nick_name" />
                        )}
                    </FormItem>
                </div>
                <FormItem>
                    <button className="submit-btn" type="submit">确认</button>
                </FormItem>
            </Form>
        );
    }
}


//设置手机
class SetMobileForm extends Component {
    state = {
        confirmDirty: false
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let user=JSON.parse(sessionStorage.getItem("user"));
                Api("c=user&a=info",{
                    mobile:values.mobile,
                    user_id:user.user_id,
                    is_wap:1
                },function(res){
                    if(res.errno ===0){
                        message.config({
                            top: 50,
                            duration: 1,
                        });
                        message.success('设置成功',2);
                        this.props.history.push("/user_state");
                    }
                });

            }
        });
    };

    mobilevalid = (rule, value, callback) => {
        if(!/^[0-9]{11}$/.test(value)){
            callback("请输入11位手机号");
        }
        callback();
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <div className="input-wrap">
                    <FormItem
                        label="手机"
                        hasFeedback
                    >
                        {getFieldDecorator('mobile', {
                            rules: [{
                                validator:this.mobilevalid
                            }
                            ],
                        })(
                            <Input type="text" name="mobile" />
                        )}
                    </FormItem>
                </div>
                <FormItem>
                    <button className="submit-btn" type="submit">确认</button>
                </FormItem>
            </Form>
        );
    }
}
//设置真实姓名
class SetRealNameForm extends Component {
    state = {
        confirmDirty: false
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let user=JSON.parse(sessionStorage.getItem("user"));
                Api("c=user&a=info",{
                    real_name:values.real_name,
                    user_id:user.user_id,
                    is_wap:1
                },function(res){
                    if(res.errno ===0){
                        let newuser =JSON.parse(sessionStorage.getItem("user"));
                        newuser.real_name = values.real_name;
                        sessionStorage.setItem("user",JSON.stringify(newuser));
                        message.config({
                            top: 20,
                            duration: 1,
                        });
                        message.success('设置成功',2);
                        this.props.history.push("/user_state");
                    }
                });

            }
        });
    };

    namevalid = (rule, value, callback) => {
        if(!/^[\s\S]{1,10}$/.test(value)){
            callback("真实姓名为1-10位任意字符");
        }
        callback();
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        let user=JSON.parse(sessionStorage.getItem("user"));

        return (
            <Form onSubmit={this.handleSubmit}>
                <div className="input-wrap">
                    <FormItem
                        label="真实姓名"
                        hasFeedback
                    >
                        {getFieldDecorator('real_name', {
                            initialValue: user.real_name,
                            rules: [{
                                validator:this.namevalid
                            }
                            ],
                        })(
                            <Input type="text" name="real_name" />
                        )}
                    </FormItem>
                </div>
                <FormItem>
                    <button className="submit-btn" type="submit">确认</button>
                </FormItem>
            </Form>
        );
    }
}

