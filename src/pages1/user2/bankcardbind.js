import React, {Component} from 'react';
import Navbar from '../common/navbar';
import Api from '../api';
import {message} from 'antd';
import {List, InputItem, Picker} from 'antd-mobile';
import {createForm} from 'rc-form';
import 'antd-mobile/lib/input-item/style/css';//加载选择样式
import 'antd-mobile/lib/picker/style/css';//加载选择样式
import MaskLoading from '../common/maskLoading';// 防止重复点击
//取PC端数据
const first = ["深圳","安徽","北京","广东","云南","福建","甘肃","广西","贵州","海南","河北","河南","黑龙江","湖北","湖南","吉林","江苏","江西","辽宁","内蒙古","宁夏","青海","山东","山西","陕西","上海","四川","天津","西藏","新疆","浙江","重庆","香港","澳门","台湾"];
const secend=[["罗湖区","福田区","盐田区","南山区","龙岗区","宝安区","光明新区","市内"],["安庆","蚌埠","巢湖","池州","滁州","阜阳","合肥","淮北","淮南","黄山","六安","马鞍山","宿州","铜陵","芜湖","宣城","亳州"],["北京"],["深圳","潮州","东莞","佛山","广州","河源","惠州","江门","揭阳","茂名","梅州","清远","汕头","汕尾","韶关","阳江","云浮","湛江","肇庆","中山","珠海"],["昆明","曲靖","大理","保山","玉溪","楚雄","丽江","德宏","迪庆","红河","临沧","昭通","怒江","思茅","文山","西双版纳"],["福州","龙岩","南平","宁德","莆田","泉州","三明","厦门","漳州"],["白银","定西","甘南藏族自治州","嘉峪关","金昌","酒泉","兰州","临夏回族自治州","陇南","平凉","庆阳","天水","武威","张掖"],["南宁","玉林","百色","北海","崇左","防城港","桂林","贵港","河池","贺州","来宾","柳州","钦州","梧州"],["安顺","毕节","贵阳","六盘水","黔东南苗族侗族自治州","黔南布依族苗族自治州","黔西南布依族苗族自治州","铜仁","遵义"],["白沙黎族自治县","保亭黎族苗族自治县","昌江黎族自治县","澄迈县","定安县","东方","海口","乐东黎族自治县","临高县","陵水黎族自治县","琼海","琼中黎族苗族自治县","三亚","屯昌县","万宁","文昌","五指山","儋州"],["保定","沧州","承德","邯郸","衡水","廊坊","秦皇岛","石家庄","唐山","邢台","张家口"],["安阳","鹤壁","济源","焦作","开封","洛阳","南阳","平顶山","三门峡","商丘","新乡","信阳","许昌","郑州","周口","驻马店","漯河","濮阳"],["大庆","大兴安岭","哈尔滨","鹤岗","黑河","鸡西","佳木斯","牡丹江","七台河","齐齐哈尔","双鸭山","绥化","伊春"],["鄂州","恩施土家族苗族自治州","黄冈","黄石","荆门","荆州","潜江","神农架林区","十堰","随州","天门","武汉","仙桃","咸宁","襄樊","孝感","宜昌"],["常德","长沙","郴州","衡阳","怀化","娄底","邵阳","湘潭","湘西土家族苗族自治州","益阳","永州","岳阳","张家界","株洲"],["白城","白山","长春","吉林","辽源","四平","松原","通化","延边朝鲜族自治州"],["常州","淮安","连云港","南京","南通","苏州","宿迁","泰州","无锡","徐州","盐城","扬州","镇江"],["抚州","赣州","吉安","景德镇","九江","南昌","萍乡","上饶","新余","宜春","鹰潭"],["鞍山","本溪","朝阳","大连","丹东","抚顺","阜新","葫芦岛","锦州","辽阳","盘锦","沈阳","铁岭","营口"],["阿拉善盟","巴彦淖尔盟","包头","赤峰","鄂尔多斯","呼和浩特","呼伦贝尔","通辽","乌海","乌兰察布盟","锡林郭勒盟","兴安盟"],["固原","石嘴山","吴忠","银川"],["果洛藏族自治州","海北藏族自治州","海东","海南藏族自治州","海西蒙古族藏族自治州","黄南藏族自治州","西宁","玉树藏族自治州"],["滨州","德州","东营","菏泽","济南","济宁","莱芜","聊城","临沂","青岛","日照","泰安","威海","潍坊","烟台","枣庄","淄博"],["长治","大同","晋城","晋中","临汾","吕梁","朔州","太原","忻州","阳泉","运城","五指山"],["安康","宝鸡","汉中","商洛","铜川","渭南","西安","咸阳","延安","榆林"],["上海"],["阿坝藏族羌族自治州","巴中","成都","达州","德阳","甘孜藏族自治州","张家口","广安","广元","乐山","凉山彝族自治州","眉山","绵阳","南充","内江","攀枝花","遂宁","雅安","宜宾","资阳","自贡","泸州"],["天津"],["阿里","昌都","拉萨","林芝","那曲","日喀则","山南"],["阿克苏","阿拉尔","巴音郭楞蒙古自治州","博尔塔拉蒙古自治州","昌吉回族自治州","哈密","和田","喀什","克拉玛依","克孜勒苏柯尔克孜自治州","石河子","图木舒克","吐鲁番","乌鲁木齐","五家渠","伊犁哈萨克自治州"],["杭州","湖州","嘉兴","金华","丽水","宁波","绍兴","台州","温州","舟山","衢州"],["重庆"],["香港岛","九龙半岛","新界本土","新界离岛"],["澳门半岛","氹仔岛","路环岛"],["台湾"]];



class BankCardBindForm extends Component {
    constructor(props) {
        super(props);
        let district=[];
        first.map((one,i)=>{
            let children=[];
            secend[i].map((two,i)=>{
                children.push({
                    label:two,
                    value:two,
                })
            });
            district.push({
                "value":one,
                "label":one,
                "children":children
            })
        });


        this.state = {
            sValue: [],
            district:district,
            areas:[]
        }
    }

    selectBank(id) {
        this.setState({sValue: id});
        this.props.selectBank(id);
    }

    format(values) {
        if (values.length > 0) {
            return values[0].props.children[1].props.children
        } else {
            return "选择银行"
        }
    }

    handleChangeAreas(e){
        this.props.handleChangeAreas(e);
       this.setState({
           areas:e
       })
    }
    render() {
        const { getFieldProps } = this.props.form;
        return (
            <div>
                {/*防止填充表单 start*/}
                <input type="password" className="auto-complete-input"/>
                {/*防止填充表单 end*/}
                <List>
                    <InputItem
                        // type="bankCard"
                        type="number"
                        placeholder="储蓄卡"
                        clear
                        moneyKeyboardAlign="left"
                        id="bankNum"
                    >卡号</InputItem>
                </List>

                <List style={{ backgroundColor: 'white' }} className="picker-list">
                    <Picker extra="请选择(必选)"
                            data={this.state.district}
                            {...getFieldProps('district')}
                            title="开户城市"
                            cols={2}
                            onOk={e => {this.handleChangeAreas(e)}}
                    >
                        <List.Item arrow="horizontal">开户城市</List.Item>
                    </Picker>
                </List>
                <List className="picker-list">
                    <Picker
                        data={this.props.list}
                        title="银行列表"
                        format={(values) => {
                            return this.format(values);
                        }}
                        cols="1"
                        value={this.state.sValue}
                        onChange={(id) => {
                            this.selectBank(id)
                        }}
                    >
                        <List.Item arrow="horizontal">银行</List.Item>
                    </Picker>
                </List>
                <List>
                    <InputItem
                        id="bankBranch"
                        type="text"
                        placeholder="请填写银行支行名称"
                        clear
                    >支行名称</InputItem>
                </List>
                <List>
                    <InputItem
                        id="bankName"
                        type="text"
                        placeholder="持卡人姓名"
                        clear
                    >姓名</InputItem>
                </List>
                <List>
                    <InputItem
                        id="secpwd"
                        type="password"
                        placeholder="资金密码"
                        clear
                    >资金密码</InputItem>
                </List>
            </div>
        );
    }
}

export default class BankCardBind extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],//银行列表
            bind_bank_id: "",
            province:"",
            city:""
        }
    }

    selectBank(bank_id) {
        this.setState({
            bind_bank_id: bank_id[0]
        })
    }
    handleChangeAreas(areas) {
        this.setState({
            province:areas[0],
            city:areas[1]
        })
    }

    shouldComponentUpdate() {
        if (this.state.list.length > 0) {
            return false
        } else {
            return true
        }
    }

    componentWillMount() {
        this.getBankList();
    }

    getBankList() {
        let user = JSON.parse(sessionStorage.getItem("user"));
        Api("c=fin&a=bindCard&user_id=" + user.user_id + "&is_wap=1", null, (res) => {
            let list = res.data.banklist;
            let newList = [];
            list.map(function (item, i) {
                newList.push({
                    label:
                        <div><i className={"icon-bank icon-bank-" + item.bank_id}></i><span
                            className="bank-item">{item.bank_name}</span></div>, value: item.bank_id
                })
            });
            this.setState({
                list: newList
            });
        })
    }

    handleSubmit() {
        let bind_bank_id = this.state.bind_bank_id;
        let bind_card_num = document.getElementById("bankNum").value;
        let bind_bank_username = document.getElementById("bankName").value;
        let secpwd = document.getElementById("secpwd").value.trim();
        let bankBranch =document.getElementById("bankBranch").value; //银行支行
        let data = JSON.parse(sessionStorage.getItem("user"));
        //验证卡号跟用户名
        let regCardnum = /^\d{16,19}$/g;
        let regbind_bank_username = /^[\u4e00-\u9fa5]*$/;
        //卡验证
        if (!bind_card_num) {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error("银行卡号不能为空(必须为16位数字或者19位数字)", 2);

            return false;
        } else if (!regCardnum.test(bind_card_num)) {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error("银行卡号必须为16位数字或者19位数字", 2);

            return false;
        }else if(!this.state.city){
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error("开户城市不能为空！", 2);

            return false;
        } else if (!bind_bank_username) {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error("姓名不能为空(必须为中文)", 2);

            return false;
        } else if (!regbind_bank_username.test(bind_bank_username)) {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error("姓名必须为中文", 2);
            return false;
        } else if (regbind_bank_username.test(bind_bank_username)) {
            let province =this.state.province;
            let city =this.state.city;
            MaskLoading(5);
            Api("c=fin&a=bindCard", {
                user_id: data.user_id,
                bind_bank_id: bind_bank_id,
                bind_card_num: bind_card_num,
                bind_bank_username: bind_bank_username,
                secpwd: secpwd,
                branch_name: bankBranch,
                province:province,
                city:city
            }, (res) => {
                MaskLoading(false);
                if (res.errno == 0) {
                    //实现不累加显示，重复点击只显示一个
                    message.config({
                        top: 20,
                        duration: 1,
                    });
                    message.success("您已经成功绑定银行卡", 2);

                    this.props.history.push("user_state");
                }
            });
            return true;
        }

    }

    render() {
        const BankCardBindFormWrapper = createForm()(BankCardBindForm);

        return (
            <div>
                <Navbar title="绑定银行卡" back="back"/>
                <div className="bank-card-bind-wrap">
                    <div className="form-wrap">
                        <BankCardBindFormWrapper
                            list={this.state.list}
                            ref="bankCardBindForm"
                            selectBank={(bank_id) => {
                                this.selectBank(bank_id)
                            }}
                            handleChangeAreas={(areas)=>{
                                this.handleChangeAreas(areas)
                            }}
                        />
                    </div>

                    <button className="submit-btn" onClick={this.handleSubmit.bind(this)}>确定</button>
                    <div className="bank-card-bind-warining">
                        <p className="red">温馨提示：</p>
                        <ol>
                            <li className="red"><span className="fl">1.银行卡绑定主要用于会员提现使用，最多可绑定1张银行卡。<br/>
                            如需更换绑定银行卡，请联系在线客服。</span>
                            </li>
                            <li className="red"><span className="fl">2.请注意，一旦银行卡绑定不能修改、删除、请认真核对填写。</span></li>
                            <li className="red"><span className="fl">3.会员提现时，请选择需要提现到的已绑定银行卡，并仔细核对。</span></li>
                            <li className="red"><span className="fl">4.建议会员填写支行信息，以保证快速出款。</span></li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
}
