const helper = {
    SXBD: {
        0: 1,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 7,
        7: 8,
        8: 10,
        9: 12,
        10: 13,
        11: 14,
        12: 15,
        13: 15,
        14: 15,
        15: 15,
        16: 14,
        17: 13,
        18: 12,
        19: 10,
        20: 8,
        21: 7,
        22: 5,
        23: 4,
        24: 3,
        25: 2,
        26: 1,
        27: 1
    },
    EXBD: {
        0: 1,
        1: 1,
        2: 2,
        3: 2,
        4: 3,
        5: 3,
        6: 4,
        7: 4,
        8: 5,
        9: 5,
        10: 5,
        11: 4,
        12: 4,
        13: 3,
        14: 3,
        15: 2,
        16: 2,
        17: 1,
        18: 1
    },
    SXHZ: {
        0: 1,
        1: 3,
        2: 6,
        3: 10,
        4: 15,
        5: 21,
        6: 28,
        7: 36,
        8: 45,
        9: 55,
        10: 63,
        11: 69,
        12: 73,
        13: 75,
        14: 75,
        15: 73,
        16: 69,
        17: 63,
        18: 55,
        19: 45,
        20: 36,
        21: 28,
        22: 21,
        23: 15,
        24: 10,
        25: 6,
        26: 3,
        27: 1
    },
    EXHZ: {
        0: 1,
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        5: 6,
        6: 7,
        7: 8,
        8: 9,
        9: 10,
        10: 9,
        11: 8,
        12: 7,
        13: 6,
        14: 5,
        15: 4,
        16: 3,
        17: 2,
        18: 1
    },
    SXZXHZ: {
        1: 1,
        2: 2,
        3: 2,
        4: 4,
        5: 5,
        6: 6,
        7: 8,
        8: 10,
        9: 11,
        10: 13,
        11: 14,
        12: 14,
        13: 15,
        14: 15,
        15: 14,
        16: 14,
        17: 13,
        18: 11,
        19: 10,
        20: 8,
        21: 6,
        22: 5,
        23: 4,
        24: 2,
        25: 2,
        26: 1
    },
    TMHZ: {
        0: 1,
        1: 3,
        2: 6,
        3: 10,
        4: 15,
        5: 21,
        6: 28,
        7: 36,
        8: 45,
        9: 55,
        10: 63,
        11: 69,
        12: 73,
        13: 75,
        14: 75,
        15: 73,
        16: 69,
        17: 63,
        18: 55,
        19: 45,
        20: 36,
        21: 28,
        22: 21,
        23: 15,
        24: 10,
        25: 6,
        26: 3,
        27: 1
    }
    
}

class Game {
    constructor(state) {
        this.state = state;
    }

//保留四位小数
    toFixed (value, n) {
        value = value.toFixed(8);
        var f = parseInt(value*Math.pow(10,n))/Math.pow(10,n);
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            s += '.';
        }
        for(var i = s.length - s.indexOf('.'); i <= n; i++){
            s += "0";
        }
        return s;
    }
    fetchList(row) {
        const arr = []
        const aa = this.state.numList[row];
        const count = Object.keys(aa).length
        for(let i=0;i<count;i++) {
            if(aa[i]) {
                arr.push(i)
            }
        }
        return arr
    }

    factorial(n) {
        if (n <= 1) {
            return 1
        } else {
            return n * this.factorial(n - 1)
        }
    }

    /**
     * 提取issue的期号 By Davy
     * issue 有如下类型：20150403-001 20150615-01     2015040
     * 逻辑：有'-'的取其后所有字符,没有的取最后三位
     */
    getNumByIssue(issue) {
        if(issue.length == 0) {
            return false;
        }
        let pos = issue.indexOf("-");
        if (pos != -1) {
            return issue.substr(pos+1);
        } else {
            return issue.substr(issue.length-3);
        }
    }

    expandLotto($nums) {
        let result = [];
        let tempVars = [];
        let oneAreaIsEmpty = 0;

        for (let i = 0; i < $nums.length; i++) {
            let v = $nums[i];
            if (v.trim() == "") {
                oneAreaIsEmpty = 1;
                return [];
            }
            let tmp = v.split("_");
            tmp.sort();
            tempVars.push(tmp);
        }
        if (oneAreaIsEmpty) {
            return [];
        }

        let i, j, k, L, m;
        switch ($nums.length) {
            case 2:
                for (let i = 0; i < tempVars[0].length; i++) {
                    for (j = 0; j < tempVars[1].length; j++) {
                        result.push(tempVars[0][i] + " " + tempVars[1][j]);
                    }
                }
                break;
            case 3:
                for (let i = 0; i < tempVars[0].length; i++) {
                    for (j = 0; j < tempVars[1].length; j++) {
                        for (k = 0; k < tempVars[2].length; k++) {
                            result.push(tempVars[0][i] + " " + tempVars[1][j] + " " + tempVars[2][k]);
                        }
                    }
                }
                break;
            case 5:
                for (let i = 0; i < tempVars[0].length; i++) {
                    for (j = 0; j < tempVars[1].length; j++) {
                        for (k = 0; k < tempVars[2].length; k++) {
                            for (L = 0; L < tempVars[3].length; L++) {
                                for (m = 0; m < tempVars[4].length; m++) {
                                    result.push(tempVars[0][i] + " " + tempVars[1][j] + " " + tempVars[2][k] + " " + tempVars[2][L] + " " + tempVars[2][m]);
                                }
                            }
                        }
                    }
                }
                break;
            default:
                throw "unkown expand";
                break;
        }
        let $finalResult = [];

        for (let i = 0; i < result.length; i++) {
            let $parts = result[i].split(" ");
            let tmp = array_unique($parts);
            if (tmp.length == $parts.length) {
                $finalResult.push(result[i]);
            }
        }
        return $finalResult;
    }

    //判断是否每区都有值
    allHasValue(cds) {
        var flag = 1, charsNum = 0;
        for (let i = 0; i < cds.length; i++) {
            charsNum += cds[i].length;
            if (cds[i].length == 0) {
                flag = 0;
            }
        }
        return {
            flag: flag,
            charsNum: charsNum
        };
    }

    isLegalCode(codes, mdCode,max_selected) {
        //这一段加上否则直选和值类玩法不选号也能添加
        if (this.allHasValue(codes)['charsNum'] == 0) {
            return {
                singleNum: 0,
                isDup: 0,
            };
        }
        let singleNum = 0, isDup = 0, parts;
        switch (mdCode) {
            case 'SXZX':    //三星直选 12,34,567
            case "ZSZX":
            case 'QSZX':    //前三直选
                singleNum = codes[0].length * codes[1].length * codes[2].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SXZS':    //三星组三
            case "ZSZS":
            case 'QSZS':
                singleNum = codes[0].length * (codes[0].length - 1);
                isDup = singleNum > 2 ? 1 : 0;
                break;
            case 'SXZL':    //三星组六  1234
            case "ZSZL":
            case 'QSZL':
                singleNum = codes[0].length * (codes[0].length - 1) * (codes[0].length - 2) / this.factorial(3);
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SXLX':    //三星连选 12345,123,58
            case "ZSLX":
            case 'QSLX':
                //每区都必须有数字
                if (this.allHasValue(codes)['flag'] == 0) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }

                var $betNums3 = 0, $betNums2 = 0, $betNums1 = 0;
                //算注数 后三注数+后二注数+后一注数
                $betNums3 = codes[0].length * codes[1].length * codes[2].length;
                $betNums2 = codes[1].length * codes[2].length;
                $betNums1 = codes[2].length;
                singleNum = $betNums3 + $betNums2 + $betNums1;
                isDup = singleNum > 3 ? 1 : 0;
                break;
            case 'SXBD':    //三星包点 一注可以有多个号码 不同号码之间要用_分隔 因为有大于9的结果
            case "ZSBD":
            case 'QSBD':
                var config = { 0: 1, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 7, 7: 8, 8: 10, 9: 12, 10: 13, 11: 14, 12: 15, 13: 15, 14: 15, 15: 15, 16: 14, 17: 13, 18: 12, 19: 10, 20: 8, 21: 7, 22: 5, 23: 4, 24: 3, 25: 2, 26: 1, 27: 1 };
                parts = codes[0].split('_');
                parts.forEach(function(v) {
                    singleNum += config[v];
                });
                form
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'SXHHZX':    //三星混合组选 仅支持单式手工录入 12,34,567
            case "ZSHHZX":
            case 'QSHHZX':    //前三混合组选 仅支持单式手工录入 12,34,567
                singleNum = codes[0].length * codes[1].length * codes[2].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'EXZX':    //二星直选 0123456789,0123456789
            case 'QEZX':
                singleNum = codes[0].length * codes[1].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'EXZUX':    //二星组选 0123456789
            case 'QEZUX':
                singleNum = codes[0].length * (codes[0].length - 1) / 2;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'EXLX':    //二星连选 0123456789,0123456789
            case 'QELX':
                //每区都必须有数字
                if (this.allHasValue(codes)['flag'] == 0) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }

                //算注数 后二注数+后一注数
                var $betNums2 = 0, $betNums1 = 0;
                $betNums2 = codes[0].length * codes[1].length;
                $betNums1 = codes[1].length;
                singleNum = $betNums2 + $betNums1;
                isDup = singleNum > 2 ? 1 : 0;
                break;
            case 'EXBD':    //二星包点 一注可以有多个号码 不同号码之间要用_分隔 因为有大于9的结果
            case 'QEBD':
                var config = { 0: 1, 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 4, 7: 4, 8: 5, 9: 5, 10: 5, 11: 4, 12: 4, 13: 3, 14: 3, 15: 2, 16: 2, 17: 1, 18: 1 };
                parts = codes[0].split('_');
                parts.forEach(function(v) {
                    singleNum += config[v];
                });
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'YXZX':    //一星直选
                singleNum = codes[0].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'WXDW':    //五星定位
                var n = 4; //5!
                for (let i = 0; i < 5; i++) {
                    if(codes[i] != '-') {
                        singleNum += codes[i].length;
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SXDW':    //低频特有 三星定位
                singleNum = codes[0].length + codes[1].length + codes[2].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'EMBDW':   //三星二码不定位 一注仅限一组号码，如1,2，因为奖金本来就低，也为了判断方便
            case 'QSEMBDW': //新增前三二码
            case 'ZSEMBDW': //新增中三二码
            case 'SXEMBDW': //新增四星二码不定位
            case 'WXEMBDW': //新增五星二码不定位
                singleNum = codes[0].length * (codes[0].length - 1) / 2;
                isDup = 0;
                break;
            case 'WXSMBDW': //新增五星三码不定位
                singleNum = codes[0].length * (codes[0].length - 1) * (codes[0].length - 2) / 6;
                isDup = 0;
                break;
            case 'EXDXDS':    //二星大小单双 一注仅限一个号码 因为奖金本来就低
            case 'QEDXDS':  //低频3D特有 前二大小单双 一注仅限一个号码 因为奖金本来就低
                singleNum = codes[0].length * codes[1].length == 1 ? 1 : 0;
                isDup = 0;
                break;
            case 'SXDXDS':    //三星大小单双 一注仅限一个号码 因为奖金本来就低
                singleNum = codes[0].length * codes[1].length * codes[2].length == 1 ? 1 : 0;
                isDup = 0;
                break;
            case 'YMBDW':   //三星一码不定位 一注仅限一个号码，如1，因为奖金本来就低，也为了判断方便
            case 'ZSYMBDW': //新增中三一码不定位
            case 'SXYMBDW': //新增四星一码不定位
            case 'WXYMBDW': //新增五星一码不定位
            case 'QSYMBDW': //低频P3P5特有 前三一码不定位
                singleNum = codes[0].length;
                isDup = 0;
                break;
            case 'SXHZ':    //三星和值 一注可以有多个号码 不同号码之间要用_分隔 因为有大于9的结果
            case "ZSHZ":
            case 'QSHZ':
                var config = { 0: 1, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21, 6: 28, 7: 36, 8: 45, 9: 55, 10: 63, 11: 69, 12: 73, 13: 75, 14: 75, 15: 73, 16: 69, 17: 63, 18: 55, 19: 45, 20: 36, 21: 28, 22: 21, 23: 15, 24: 10, 25: 6, 26: 3, 27: 1 };
                parts = codes[0].split('_');
                parts.forEach(function(v) {
                    singleNum += config[v];
                });
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'EXHZ':    //二星和值 一注可以有多个号码 不同号码之间要用_分隔 因为有大于9的结果
            case 'QEHZ':
                var config = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1 };
                parts = codes[0].split('_');
                parts.forEach(function(v) {
                    singleNum += config[v];
                });
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'SXZXHZ':  //低频3D特有 组选和值
            case 'QSZXHZ':  //低频P3P5特有 组选和值
                var config = { 1: 1, 2: 2, 3: 2, 4: 4, 5: 5, 6: 6, 7: 8, 8: 10, 9: 11, 10: 13, 11: 14, 12: 14, 13: 15, 14: 15, 15: 14, 16: 14, 17: 13, 18: 11, 19: 10, 20: 8, 21: 6, 22: 5, 23: 4, 24: 2, 25: 2, 26: 1 };
                parts = codes[0].split('_');
                parts.forEach(function(v) {
                    singleNum += config[v];
                });
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'SIXZX':    //四星直选 12,34,567
            case 'QSIZX':    //前四直选
                singleNum = codes[0].length * codes[1].length * codes[2].length * codes[3].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'WXZX':    //五星直选
                //算注数 相乘即可
                singleNum = codes[0].length * codes[1].length * codes[2].length * codes[3].length * codes[4].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'WXLX':    //五星连选
                //每区都必须有数字
                if (this.allHasValue(codes)['flag'] == 0) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }

                var $betNums5 = 0, $betNums3 = 0, $betNums2 = 0, $betNums1 = 0;
                //算注数 后三注数+后二注数+后一注数
                $betNums5 = codes[0].length * codes[1].length * codes[2].length * codes[3].length * codes[4].length;
                $betNums3 = codes[2].length * codes[3].length * codes[4].length;
                $betNums2 = codes[3].length * codes[4].length;
                $betNums1 = codes[4].length;
                singleNum = $betNums5 + $betNums3 + $betNums2 + $betNums1;
                isDup = singleNum > 4 ? 1 : 0;
                break;

            case 'SYXW-ZHWL':
            case '115-ZHLM':
            case 'SYXW-LMLH':
            case 'SYXW-DYQ':
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'SYXW-DYQDXDS':
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'SYXW-DEQ':
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'SYXW-DEQDXDS':
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'SYXW-DSAQ':
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'SYXW-DSAQDXDS':
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'SYXW-DSIQ':
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'SYXW-DSIQDXDS':
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'SYXW-DWQ':
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'SYXW-DWQDXDS':
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'SYXW-EZHE'://一次只能选一注，一注为两个号码
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) / 2;
                if(parts.length>2){
                    singleNum=1;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SYXW-SAZHSA'://一次只能选一注，一注为三个号码
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
                if(parts.length>3){
                    singleNum=1;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SYXW-SIZHSI'://一次只能选一注，一注为四个号码
                parts = codes[0].split('_');
                singleNum = parts.length;
                var codeNum = parts.length;
                singleNum = codeNum * (codeNum - 1) * (codeNum - 2) * (codeNum - 3) / 24;
                if(parts.length>4){
                    singleNum=1;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SYXW-WZHW'://一次只能选一注，一注为五个号码
                parts = codes[0].split('_');
                var codeNum = parts.length;
                singleNum = codeNum * (codeNum - 1) * (codeNum - 2) * (codeNum - 3) * (codeNum - 4) / 120;
                if(parts.length>5){
                    singleNum=1;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SYXW-LZHW'://一次只能选一注，一注为六个号码
                parts = codes[0].split('_');
                var codeNum = parts.length;
                singleNum = codeNum * (codeNum - 1) * (codeNum - 2) * (codeNum - 3) * (codeNum - 4) * (codeNum - 5) / 720;
                if(parts.length>6){
                    singleNum=1;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SYXW-QZHW'://一次只能选一注，一注为七个号码
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) * (parts.length - 4) * (parts.length - 5) * (parts.length - 6) / 5040;
                if(parts.length>7){
                    singleNum=1;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SYXW-BZHW'://一次只能选一注，一注为八个号码
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) * (parts.length - 4) * (parts.length - 5) * (parts.length - 6) * (parts.length - 7) / 40320;
                if(parts.length>8){
                    singleNum=1;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case '115-LMDXDS':
                var result=0;
                singleNum = 0,
                    codes.forEach(function(code) {
                        if(code!=""){
                            result=code.split("_");
                            singleNum += result.length;
                        }
                    });
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SSC-ZH':
            case 'SSC-LMDXDS':
            case 'SSCDYQ':
            case 'SSCDEQ':
            case 'SSCDSAQ':
            case 'SSCDSIQ':
            case 'SSCDWQ':
                singleNum = 0,
                codes.forEach(function(code) {
                    singleNum += code.length
                });
                isDup = singleNum > 1 ? 1 : 0;
                break;  
            case 'SSCLH':
            case 'SSCDYQ-DXDS':
            case 'SSCDEQ-DXDS':
            case 'SSCDSAQ-DXDS':
            case 'SSCDSIQ-DXDS':
            case 'SSCDWQ-DXDS':
            case 'SSCQS':
            case 'SSCZS':
            case 'SSCHS':
            case 'SSCDN':
            case 'SSCSH':
                singleNum = 0;
                result = codes[0].split("_");
                singleNum=result.length;
                isDup = singleNum > 1 ? 1 :0;
                break;

                //========== sd11y ===========//
            case 'REZX':    //任二直选
                var n = 4; //5!
                for (let i = 0; i < 4; i++) {
                //如果注码不写'-'的话可以省略两个if判断,效率差不多
                        if(codes[i] != '-') {
                                for (let j = (i+1); j < 5; j++) {
                                        if(codes[j] != '-') {
                                                singleNum += codes[i].length * codes[j].length;
                                        }
                                }
                        }
                }
                for(let i=0;i<codes.length;i++){
                    if(codes[i]==="")
                        codes[i]="-";
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'RSZX':    //任三直选  ["678", "67", "7", "7", "7"]
                for (let i = 0; i < 3; i++) {
                    if(codes[i] != '-') {
                        for (let j = (i+1); j < 4; j++) {
                            if(codes[j] != '-') {
                                for (let k = (j+1); k < 5; k++) {
                                    if(codes[k] != '-') {
                                        singleNum += codes[i].length * codes[j].length * codes[k].length;
                                    }
                                }
                            }
                        }
                    }
                }
                for(let i=0;i<codes.length;i++){
                    if(codes[i]==="")
                    codes[i]="-";
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
                case 'RSIZX': //任四直选["678", "67", "7", "7", "7"]
                    for(let g = 0;g < 2;g++){
                        if(codes[g] != '-') {
                             for (let i = (g+1); i < 3; i++) {
                                if(codes[i] != '-') {
                                    for (let j = (i+1); j < 4; j++) {
                                        if(codes[j] != '-') {
                                            for (let k = (j+1); k < 5; k++) {
                                                if(codes[k] != '-') {
                                                        singleNum += codes[g].length * codes[i].length * codes[j].length * codes[k].length;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for(let i=0;i<codes.length;i++){
                        if(codes[i]==="")
                            codes[i]="-";
                    }
                    isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQSZX':  //前三直选 01_02_03_04,02_03,01_05
                if (codes.length != 3) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = this.expandLotto(codes);
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQEZX':     //前二直选 二段 01_02_03_04,02_03
                if (codes.length != 2) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = this.expandLotto(codes);

                singleNum = result.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQSZUX':     //前三组选 一段 01_02_03_04
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / this.factorial(3);
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQEZUX':     //前二组选 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) / 2;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX1':     //任选1 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX2':     //任选2 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) / 2;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX3':     //任选3 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX4':     //任选4 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) / 24;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX5':     //任选5 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) * (parts.length - 4) / 120;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX6':     //任选6 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) * (parts.length - 4) * (parts.length - 5) / 720;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX7':     //任选7 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) * (parts.length - 4) * (parts.length - 5) * (parts.length - 6) / 5040;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX8':     //任选8 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) * (parts.length - 4) * (parts.length - 5) * (parts.length - 6) * (parts.length - 7) / 40320;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQSBDW':     //前3不定位胆 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQSDWD':     //前3定位胆 01_02_03,04_05,06_07为一单 也可以只买一位，如'01_02_03,,'表示只买个位胆，没买的位留空
                codes.forEach(function(v) {
                    if (v != '') {
                        //号码不得重复
                        parts = v.split('_');
                        singleNum += parts.length;  //注意是数组长度，所以前面必须判断v != ''
                    }
                });
                isDup = singleNum > 3 ? 1 : 0;
                break;
            case 'SDDDS':     //0单5双:750.0000元 (1注) 5单0双:125.0000元 (6注)1单4双:25.0000元 (30注)4单1双:10.0000元 (75注)2单3双:5.0000元 (150注)3单2双:3.7000元 (200注)
            case 'SDCZW':     // 一次只能选一注
                singleNum = 1;
                isDup = 1;
                break;

            case 'YFFS':    //趣味玩法,一帆风顺
            case 'HSCS':    //趣味玩法,好事成双
            case 'SXBX':    //趣味玩法,三星报喜
            case 'SJFC':    //趣味玩法,四季发财
                singleNum = codes[0].length;    //传来的数据模式 13567
                isDup = singleNum > 1 ? 1 : 0;
                break;

            case 'ZUX120':    //组选120
                if (codes[0].length > 4){
                    singleNum = codes[0].length === 5?1:(this.factorial(codes[0].length) / (this.factorial(codes[0].length - 5) * 120));
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'ZUX24':    //组选24
                if (codes[0].length > 3){
                    singleNum = this.factorial(codes[0].length) / (this.factorial(codes[0].length - 4) * 24);
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'ZUX6':    //组选6
                if (codes[0].length > 1){
                    singleNum = this.factorial(codes[0].length) / (this.factorial(codes[0].length - 2) * 2);
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;


            case 'ZUX10':    //组选10
            case 'ZUX5':    //组选5
            case 'ZUX4':    //组选4
                if (codes[0].length > 0 && codes[1].length > 0){
                    let compareNum = codes[1].length;
                    for (let i = 0; i < codes[0].length; i++){
                        let tmp = compareNum;
                        if (codes[1].indexOf(codes[0].substr(i, 1)) > - 1){
                            tmp = compareNum - 1;
                        }
                        if (tmp > 0){
                            singleNum += this.factorial(tmp) / this.factorial(tmp - 1);
                        }
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;

            case 'ZUX20':    //组选20
            case 'ZUX12':    //组选12
                if (codes[0].length > 0 && codes[1].length > 1){
                    let compareNum = codes[1].length;
                    for (let i = 0; i < codes[0].length; i++){
                        let tmp = compareNum;
                        if (codes[1].indexOf(codes[0].substr(i, 1)) > - 1){
                            tmp = compareNum - 1;
                        }
                        if (tmp > 1){
                            singleNum += this.factorial(tmp) / (this.factorial(tmp - 2) * 2);
                        }
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;

            case 'ZUX60':    //组选60
                if (codes[0].length > 0 && codes[1].length > 2){
                    let compareNum = codes[1].length;
                    for (let i = 0; i < codes[0].length; i++){
                        let tmp = compareNum;
                        if (codes[1].indexOf(codes[0].substr(i, 1)) > - 1){
                            tmp = compareNum - 1;
                        }
                        if (tmp > 2){
                            singleNum += this.factorial(tmp) / (this.factorial(tmp - 3) * 6);
                        }
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;

            case 'ZUX30':    //组选30
                if (codes[0].length > 1 && codes[1].length > 0){
                    let compareNum = codes[0].length;
                    for (let i = 0; i < codes[1].length; i++){
                        let tmp = compareNum;
                        if (codes[0].indexOf(codes[1].substr(i, 1)) > - 1){
                            tmp = compareNum - 1;
                        }
                        if (tmp > 1){
                            singleNum += this.factorial(tmp) / (this.factorial(tmp - 2) * 2);
                        }
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;

                //江苏快三
            case 'JSETDX':  //二同单选 2个号区 11_22,34
                if (codes.length != 2) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var parts0 = codes[0].length ? codes[0].split('_') : [];
                var parts1 = codes[1].length ? codes[1].split('') : [];
                singleNum = parts0.length * parts1.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'JSETFX':  //二同复选 1个号区 11_22_33
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;

            case 'JSHZ':    //快三和值
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'JSSTTX':    //快三   江苏三同号通选
                //parts = codes[0].split('_');  //111_222_333_444_555_666
                codes[0]="111_222_333_444_555_666";
                singleNum = 1;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'JSSLTX'://快三三连号通选
                singleNum = 1;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'JSEBT':   //二不同号
                var codesLen = codes[0].length;
                singleNum = (codesLen - 1) * codesLen / 2;
                isDup = codesLen > 2 ? 1 : 0;
                break;
            case  "JSSTDX"://三同号
                // parts = codes[0].split('_');
                // if(codes[1]){
                //     codes[1]="111_222_333_444_555_666";
                //     parts=codes[0].split('_').concat(["111_222_333_444_555_666"])
                // }else if(codes[0]=="全骰"){
                //     codes[0]="111_222_333_444_555_666";
                // }
                // singleNum = parts.length;
                // isDup = singleNum > 1 ? 1 : 0;
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'JSSBT':   //三不同号
                var codesLen = codes[0].length;
                singleNum = (codesLen - 1) * (codesLen - 2) * codesLen / 6;
                isDup = codesLen > 3 ? 1 : 0;
                break;
            case   "KSSJ"://三军
                parts = codes[0].split('');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case   "KSCP"://长牌
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
                //快乐扑克
           case 'PKSZ'://顺子
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
           case 'PKBZ'://豹子
               parts = codes[0].split('_');
               singleNum = parts.length;
               isDup = singleNum > 1 ? 1 : 0;
               break;
           case 'PKDZ'://对子
               parts = codes[0].split('_');
               singleNum = parts.length;
               isDup = singleNum > 1 ? 1 : 0;
               break;
           case 'PKTH'://同花
               parts = codes[0].split('_');
               singleNum = parts.length;
               isDup = singleNum > 1 ? 1 : 0;
               break;
           case 'PKTHS'://同花顺
               parts = codes[0].split('_');
               singleNum = parts.length;
               isDup = singleNum > 1 ? 1 : 0;
               break;
           case 'PKBX'://包选
               parts = codes[0].split('_');
               singleNum = parts.length;
               isDup = singleNum > 1 ? 1 : 0;
               break;
           case 'PKRX1'://任选1
               parts = codes[0].split('_');
               singleNum = parts.length;
               isDup = singleNum > 1 ? 1 : 0;
               break;
           case 'PKRX2'://任选2
               parts = codes[0].split('_');
               singleNum = parts.length * (parts.length - 1) / 2;
               isDup = singleNum > 1 ? 1 : 0;
               break;
           case 'PKRX3'://任选3
               parts = codes[0].split('_');
               singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
               isDup = singleNum > 1 ? 1 : 0;
               break;
           case 'PKRX4'://任选4
               parts = codes[0].split('_');
               singleNum = parts.length;
               var codeNum = parts.length;
               singleNum = codeNum * (codeNum - 1) * (codeNum - 2) * (codeNum - 3) / 24;
               isDup = singleNum > 1 ? 1 : 0;
               break;
           case 'PKRX5'://任选5
               parts = codes[0].split('_');
               var codeNum = parts.length;
               singleNum = codeNum * (codeNum - 1) * (codeNum - 2) * (codeNum - 3) * (codeNum - 4) / 120;
               isDup = singleNum > 1 ? 1 : 0;
               break;
           case 'PKRX6'://任选6
               parts = codes[0].split('_');
               var codeNum = parts.length;
               singleNum = codeNum * (codeNum - 1) * (codeNum - 2) * (codeNum - 3) * (codeNum - 4) * (codeNum - 5) / 720;
               isDup = singleNum > 1 ? 1 : 0;
               break;


            //六合彩====
            case 'TMZX':
            case 'TMSX':
            case 'TMWS':
            case 'TMSB':
            case 'TMDXDS':
            case 'ZTYM':
            case 'ZTYX':
            case 'ZTWS':
            case 'TMBT'://特码半特
            case  'TMA'://特码A
            case  'JS-TMA':
            case  'TMB'://特码B
            case  'JS-TMB':
            case  'THDXDS'://"特合大小单双"
            case  'JS-THDXDS'://急速特和大小单双
            case  'TDX'://"特大小"
            case  'JS-TDX':
            case  'TDS'://"特单双"
            case  'JS-TDS':
            case  'TQS'://"特家禽野兽"
            case  'JS-TQS':
            case  'ZM' ://"正码"
            case   'JS-ZM':
            case  'ZM1' ://"正码1"
            case  'JS-ZM1' ://"正码1"
            case  'ZM2' ://"正码2"
            case  'JS-ZM2' ://"正码2"
            case  'ZM3' ://"正码3"
            case  'JS-ZM3' ://"正码3"
            case  'ZM4' ://"正码4"
            case  'JS-ZM4' ://"正码4"
            case  'ZM5' ://"正码5"
            case  'JS-ZM5' ://"正码5"
            case  'ZM6' ://"正码6"
            case  'JS-ZM6' ://"正码6"
            case  'TX'  ://"特肖"
            case  'JS-TX'  ://"特肖"
            case  'SB'  ://"色波"
            case  'JS-SB'  ://"色波"
            case  'ZMLM1'://"正码1两面"
            case  'ZMLM2'://"正码2两面"
            case  'ZMLM3'://"正码3两面"
            case  'ZMLM4'://"正码4两面"
            case  'ZMLM5'://"正码5两面"
            case  'ZMLM6'://"正码6两面"
            case  'ZMSB1'://"正码1色波"
            case  'ZMSB2'://"正码2色波"
            case  'ZMSB3'://"正码3色波"
            case  'ZMSB4'://"正码4色波"
            case  'ZMSB5'://"正码5色波"
            case  'ZMSB6'://"正码6色波"
            case  'JS-ZMLM1'://"正码1两面"
            case  'JS-ZMLM2'://"正码2两面"
            case  'JS-ZMLM3'://"正码3两面"
            case  'JS-ZMLM4'://"正码4两面"
            case  'JS-ZMLM5'://"正码5两面"
            case  'JS-ZMLM6'://"正码6两面"
            case  'JS-ZMSB1'://"正码1色波"
            case  'JS-ZMSB2'://"正码2色波"
            case  'JS-ZMSB3'://"正码3色波"
            case  'JS-ZMSB4'://"正码4色波"
            case  'JS-ZMSB5'://"正码5色波"
            case  'JS-ZMSB6'://"正码6色波"
            case  'ZX'   ://"正肖"
            case  'JS-ZX'   ://"正肖"
            case  'PTX' ://平特肖
            case  'JS-PTX' ://平特肖
            case  'LHC-BB'://半波
            case  'JSLHC-BB'://急速半波
            case  'TDXDS':
            case  'JS-TDXDS':
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'WBZ' ://"5不中"
            case  'JS-WBZ' ://"5不中"
                parts = codes[0].split('_');
                if (parts.length == 5) {
                    singleNum = 1;
                }else if(parts.length>max_selected){
                    isDup=true;
                    break;
                }else{
                    singleNum = 0;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'LBZ' ://六不中
            case  'JS-LBZ' ://六不中
                parts = codes[0].split('_');
                if (parts.length == 6) {
                    singleNum = 1;
                }else if(parts.length>max_selected){
                    isDup=true;
                    break;
                }else{
                    singleNum = 0;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'QBZ' ://七不中
            case  'JS-QBZ' ://七不中
                parts = codes[0].split('_');
                if (parts.length == 7) {
                    singleNum = 1;
                }else if(parts.length>max_selected){
                    isDup=true;
                    break;
                }else{
                    singleNum = 0;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'BBZ' ://八不中
            case  'JS-BBZ' ://八不中
                parts = codes[0].split('_');
                if (parts.length == 8) {
                    singleNum = 1;
                }else if(parts.length>max_selected){
                    isDup=true
                    break;
                }else{
                    singleNum = 0;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'JBZ' ://九不中
            case  'JS-JBZ' ://九不中
                parts = codes[0].split('_');
                if (parts.length == 9) {
                    singleNum = 1;
                }else if(parts.length>max_selected){
                    isDup=true;
                    break;
                }else{
                    singleNum = 0;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'SBZ' ://十不中
            case  'JS-SBZ' ://十不中
                parts = codes[0].split('_');
                if (parts.length == 10) {
                    singleNum = 1;
                }else if(parts.length>max_selected){
                    isDup=true;
                    break;
                }else{
                    singleNum = 0;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'SYBZ'://十一不中
            case  'JS-SYBZ'://十一不中
                parts = codes[0].split('_');
                if (parts.length == 11) {
                    singleNum = 1;
                }else if(parts.length>max_selected){
                    isDup=true;
                    break;
                }else{
                    singleNum = 0;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'SEBZ'://十二不中
            case  'JS-SEBZ'://十二不中
                parts = codes[0].split('_');
                if (parts.length == 12) {
                    singleNum = 1;
                }else if(parts.length>max_selected){
                    isDup=true;
                    break;
                }else{
                    singleNum = 0;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'HXZ' ://合肖中
            case  'JS-HXZ' ://合肖中
                parts = codes[0].split('_');
                if (parts.length < 12&&parts.length>1) {
                    singleNum = 1;
                }else{
                    singleNum = 0;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'HXBZ'://合肖不中
            case  'JS-HXBZ'://合肖不中
                parts = codes[0].split('_');
                if (parts.length < 12&&parts.length>1) {
                    singleNum = 1;
                }else{
                    singleNum = 0;
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'LMSQZ'://三全中
            case  'JS-LMSQZ'://三全中
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'LMSZE'://3中2
            case  'JS-LMSZE'://3中2
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'LMEQZ'://2全中
            case  'LMEZT'://2中特
            case  'LMTC' ://特串
            case  'LXEX' ://"连肖二肖"
            case  'LWEW' ://"连尾二尾"
            case  'JS-LMEQZ'://2全中
            case  'JS-LMEZT'://2中特
            case  'JS-LMTC' ://特串
            case  'JS-LXEX' ://"连肖二肖"
            case  'JS-LWEW' ://"连尾二尾"
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) / 2;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'LXSX' ://"连肖三肖"
            case  'LWSW' ://"连尾三尾"
            case  'JS-LXSX' ://"连肖三肖"
            case  'JS-LWSW' ://"连尾三尾"
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'LXSIX'://"连肖四肖"
            case  'LWSIW'://"连尾四尾"
            case  'JS-LXSIX'://"连肖四肖"
            case  'JS-LWSIW'://"连尾四尾"
                parts = codes[0].split('_');
                singleNum = parts.length;
                var codeNum = parts.length;
                singleNum = codeNum * (codeNum - 1) * (codeNum - 2) * (codeNum - 3) / 24;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case  'LXWX' ://"连肖五肖"
            case  'JS-LXWX' ://"连肖五肖"
                parts = codes[0].split('_');
                var codeNum = parts.length;
                singleNum = codeNum * (codeNum - 1) * (codeNum - 2) * (codeNum - 3) * (codeNum - 4) / 120;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'ELX':
            case 'EZE':
                parts = codes[0].split('_');
                if (parts.length >= 2) {
                    singleNum = parts.length * (parts.length - 1) / 2;
                }

                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SLX':
            case 'SZS':
            case 'SZE':
                parts = codes[0].split('_');
                if (parts.length >= 3) {
                    singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
                }

                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SILX':
                parts = codes[0].split('_');
                if (parts.length >= 4) {
                    singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) / 24;
                }

                isDup = singleNum > 1 ? 1 : 0;
                break;

            //幸运28
            case 'TMHZ':
                parts = codes[0].split('_');
                // for(var i=0;i<parts.length;i++){
                //     singleNum += helper.TMHZ[parts[i]];
                // }
                parts.map((v,k)=>{
                    singleNum += helper.TMHZ[v];
                })
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'XYDXDS':
            case 'JDX':
            case 'XYSB':
            case 'TMBZ':
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'TMBS':
                parts = codes[0].split('_');
                if(parts.length >= 3){
                    singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
                    isDup = singleNum > 1 ? 1 : 0;
                }
                break;

                //pk10

            case 'PKS-DXDS':
                singleNum = codes[0].length;
                isDup = 0;
                break;
            case 'PKS-GYHZ':  //冠亚和值
            case 'PKS-CGJ':  //猜冠军
                if (codes.length !== 1) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'PKS-CYJ':
                if (codes.length !== 1) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'PKS-CJJ':
                if (codes.length !== 1) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'PKS-CDS':
                if (codes.length !== 1) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'PKS-CDW':
                if (codes.length !== 1) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'PKS-CDL':
                if (codes.length !== 1) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'PKS-CDQ':
                if (codes.length !== 1) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'PKS-CDB':
                if (codes.length !== 1) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'PKS-CDJ':
                if (codes.length !== 1) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'PKS-CDSH':
                if (codes.length !== 1) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = codes[0].split('_');
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 :  0;
                break;
            case 'PKS-DWD':
            case 'PKS-DWDH5':

                for(let i=0;i<codes.length;i++){
                    if (codes[i] != '') {
                        //号码不得重复
                        parts = codes[i].split('_');
                        singleNum += parts.length;  //注意是数组长度，所以前面必须判断v != ''
                    }
                }
                isDup = singleNum > 5 ? 1 : 0;
                break;
            case 'PKS-CQS'://前三直选 01_02_03_04,02_03,01_05
                if (codes.length !== 3) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = this.expandLotto(codes);
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKS-CQE':    //pk拾前二直选01_02_03_04,02_03
                if (codes.length !== 2) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = this.expandLotto(codes);
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKS-OT':
            case 'PKS-TN':
            case 'PKS-TE':
            case 'PKS-FS':
            case 'PKS-FSIX':
                if(codes.length !== 1 || (codes[0] !== '龙' && codes[0] !== '虎')){
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                isDup = singleNum = 1;
                break;
            case 'PKS-GYDXDS'://两面冠亚和值
                singleNum = codes[0].split("").length;
                isDup = 0;
                break;
            case 'PKS-Q5LM':
            case 'PKS-Q5LMLH'://两面盘龙虎合并玩法
                var n=4;//5!
                for(var i=0;i<5;i++){
                    var code=codes[i].split('');
                    if(code!=''){
                        singleNum+=code.length;
                    }
                }
                isDup=singleNum>1 ? 1 : 0;
                break;
            case 'PKS-H5LM':
                var n = 4; //5!
                for (var i = 0; i < 5; i++) {
                    var code = codes[i].split('');
                    if (code != '') {
                        singleNum += code.length;
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'KS-HZDXDS':    //两面盘
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = parts.length > 1 ? 1 : 0;
                break;

            case 'HLZX'://["01_03_04_05", "02_03"]
                if(Object.prototype.toString.call(codes)=='[object Array]'){//复试
                  let  part1 = codes[0].split('_');
                  let   part2 = codes[1].split('_');
                    if(part1.length >= 5 && codes[1] != '' && part2.length >= 1 ){
                        singleNum = (part1.length * (part1.length-1) * (part1.length-2) * (part1.length-3) * (part1.length-4) / 120) * part2.length;
                        isDup = singleNum > 1 ? 1 : 0;
                    }
                }else if(/^(([012]\d)|(3[0123]))(_(([012]\d)|(3[0123]))){4},((0[1-9])|(1[0-6]))$/.test(codes)){//单式
                    singleNum = 1;
                    isDup = singleNum > 1 ? 1 : 0;
                }
                break;
            case 'LHC-HZLM'://和值两面
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'LHC-ZTMH'://正特码合
            case 'LHC-ZTLM'://正特两面
                singleNum = 0,
                    codes.forEach(function(code) {
                        if (code != '') {
                            singleNum += code.split("_").length;
                        }

                    });
                isDup = singleNum > 1 ? 1 : 0;
                break;
            default:
                throw "unknown method2 " + ps.curMethod.name;
                break;
        }

        return {
            singleNum: singleNum,
            isDup: isDup
        };
    }
}

export default Game

function array_unique(inputArr) {
    // http://kevin.vanzonneveld.net
    // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +      input by: duncan
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Nate
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Michael Grier
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // %          note 1: The second argument, sort_flags is not implemented;
    // %          note 1: also should be sorted (asort?) first according to docs
    // *     example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin']);
    // *     returns 1: {0: 'Kevin', 2: 'van', 3: 'Zonneveld'}
    // *     example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'});
    // *     returns 2: {a: 'green', 0: 'red', 1: 'blue'}
    var key = '',
      tmp_arr2 = {}, val = '', tmp_arr3 = [];
  
    var __array_search = function(needle, haystack) {
      var fkey = '';
      for (fkey in haystack) {
        if (haystack.hasOwnProperty(fkey)) {
          if ((haystack[fkey] + '') === (needle + '')) {
            return fkey;
          }
        }
      }
      return false;
    };
  
    for (key in inputArr) {
      if (inputArr.hasOwnProperty(key)) {
        val = inputArr[key];
        if (false === __array_search(val, tmp_arr2)) {
          tmp_arr2[key] = val;
          tmp_arr3.push(val);
        }
      }
    }
    //return tmp_arr2;  //返回对象
    return tmp_arr3;  //返回数组
  }