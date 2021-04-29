/**
vc 校验 工具类 -method
(1)、required:true               必输字段
(2)、remote:"remote-valid.jsp"   使用ajax方法调用remote-valid.jsp验证输入值
(3)、email:true                  必须输入正确格式的电子邮件
(4)、url:true                    必须输入正确格式的网址
(5)、date:true                   必须输入正确格式的日期，日期校验ie6出错，慎用
(6)、dateISO:true                必须输入正确格式的日期(ISO)，例如：2009-06-23，1998/01/22 只验证格式，不验证有效性
(7)、number:true                 必须输入合法的数字(负数，小数)
(8)、digits:true                 必须输入整数
(9)、creditcard:true             必须输入合法的信用卡号
(10)、equalTo:"#password"        输入值必须和#password相同
(11)、accept:                    输入拥有合法后缀名的字符串（上传文件的后缀）
(12)、maxlength:5                输入长度最多是5的字符串(汉字算一个字符)
(13)、minlength:10               输入长度最小是10的字符串(汉字算一个字符)
(14)、rangelength:[5,10]         输入长度必须介于 5 和 10 之间的字符串")(汉字算一个字符)
(15)、range:[5,10]               输入值必须介于 5 和 10 之间
(16)、max:5                      输入值不能大于5
(17)、min:10                     输入值不能小于10
**/
(function(vc){
    var validate = {

        state:true,
        errInfo:'',

        setState:function(_state,_errInfo){
            this.state = _state;
            if(!this.state){
                this.errInfo = _errInfo
                throw "校验失败:"+_errInfo;
            }
        },

        /**
            校验手机号
        **/
        phone:function(text){
             var regPhone =/^0?1[3|4|5|6|7|8][0-9]\d{8}$/;
             return regPhone.test(text);
        },
        /**
            校验邮箱
        **/
        email:function(text){
            var regEmail = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
            return regEmail.test(text);
        },
        /**
         * 必填
         * @param {参数} text
         */
        required:function(text){
            if(text == undefined || text == null || text == "" ){
                return false;
            }

            return true;
        },
        /**
         * 校验长度
         * @param {校验文本} text
         * @param {最小长度} minLength
         * @param {最大长度} maxLength
         */
        maxin:function(text,minLength,maxLength){
            if(text.length <minLength || text.length > maxLength){
                return false;
            }

            return true;
        },
        /**
         * 校验长度
         * @param {校验文本} text
         * @param {最大长度} maxLength
         */
        maxLength:function(text,maxLength){
            if(text.length > maxLength){
                return false;
            }

            return true;
        },
        /**
         * 校验最小长度
         * @param {校验文本} text
         * @param {最小长度} minLength
         */
        minLength:function(text,minLength){
            if(text.length < minLength){
                return false;
            }
            return true;
        },
        /**
         * 全是数字
         * @param {校验文本} text
         */
        num:function(text){
            var regNum = /^[0-9][0-9]*$/;
            return regNum.test(text);
        },
        date:function(str) {
            var regDate = /^(\d{4})-(\d{2})-(\d{2})$/;
            return regDate.test(str);
        },
        dateTime:function(str){
            var reDateTime = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
            return reDateTime.test(str);
        },
        /**
            金额校验
        **/
        money:function(text){
            var regMoney = /^\d+\.?\d{0,2}$/;
            return regMoney.test(text);
        },
        idCard:function(num){
            num = num.toUpperCase();
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
            if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
                return false;
            }
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            //下面分别分析出生日期和校验位
            var len, re;
            len = num.length;
            if (len == 15) {
                re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                var arrSplit = num.match(re);

                //检查生日日期是否正确
                var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
                var bGoodDay;
                bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                    return false;
                }
                else {
                    //将15位身份证转成18位
                    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var nTemp = 0, i;
                    num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                    for (i = 0; i < 17; i++) {
                        nTemp += num.substr(i, 1) * arrInt[i];
                    }
                    num += arrCh[nTemp % 11];
                    return true;
                }
            }
            if (len == 18) {
                re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                var arrSplit = num.match(re);

                //检查生日日期是否正确
                var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                var bGoodDay;
                bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                   // alert(dtmBirth.getYear());
                  //  alert(arrSplit[2]);
                    return false;
                }
                else {
                    //检验18位身份证的校验码是否正确。
                    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                    var valnum;
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var nTemp = 0, i;
                    for (i = 0; i < 17; i++) {
                        nTemp += num.substr(i, 1) * arrInt[i];
                    }
                    valnum = arrCh[nTemp % 11];
                    if (valnum != num.substr(17, 1)) {
                        return false;
                    }
                    return true;
                }
            }
            return false;
        }

    };
    vc.validate = validate;

})(window.vc);

/**
 * 校验 -core
 */
(function(validate){

    /**
     * 根据配置校验
     *
     * eg:
     * dataObj:
     * {
     *      name:"wuxw",
     *      age:"19",
     *      emailInfo:{
     *          email:"928255095@qq.com"
     *      }
     * }
     *
     * dataConfig:
     * {
     *      "name":[
                    {
                       limit:"required",
                       param:"",
                       errInfo:'用户名为必填'
                    },
                    {
                        limit:"maxin",
                       param:"1,10",
                       errInfo:'用户名必须为1到10个字之间'
                    }]
     * }
     *
     */
    validate.validate = function(dataObj,dataConfig){

        try{
            // 循环配置（每个字段）
            for(var key in dataConfig){
                //配置信息
                var tmpDataConfigValue = dataConfig[key];
                //对key进行处理
                var keys = key.split(".");
                console.log("keys :",keys);
                var tmpDataObj = dataObj;
                //根据配置获取 数据值
                keys.forEach(function(tmpKey){
                     console.log('tmpDataObj:',tmpDataObj);
                     tmpDataObj = tmpDataObj[tmpKey]
                });
//                for(var tmpKey in keys){
//                    console.log('tmpDataObj:',tmpDataObj);
//                    tmpDataObj = tmpDataObj[tmpKey]
//                }

                tmpDataConfigValue.forEach(function(configObj){
                    if(configObj.limit == "required"){
                        validate.setState(validate.required(tmpDataObj),configObj.errInfo);
                    }

                    if(configObj.limit == 'phone'){
                        validate.setState(validate.phone(tmpDataObj),configObj.errInfo);
                    }

                    if(configObj.limit == 'email'){
                        validate.setState(validate.email(tmpDataObj),configObj.errInfo);
                    }

                    if(configObj.limit == 'maxin'){
                        var tmpParam = configObj.param.split(",")
                        validate.setState(validate.maxin(tmpDataObj,tmpParam[0],tmpParam[1]),configObj.errInfo);
                    }

                    if(configObj.limit == 'maxLength'){
                        validate.setState(validate.maxLength(tmpDataObj,configObj.param),configObj.errInfo);

                    }

                    if(configObj.limit == 'minLength'){
                        validate.setState(validate.minLength(tmpDataObj,configObj.param),configObj.errInfo);
7
                    }

                    if(configObj.limit == 'num'){
                        validate.setState(validate.num(tmpDataObj),configObj.errInfo);
                    }

                    if(configObj.limit == 'date'){
                        validate.setState(validate.date(tmpDataObj),configObj.errInfo);
                    }
                    if(configObj.limit == 'dateTime'){
                        validate.setState(validate.dateTime(tmpDataObj),configObj.errInfo);
                    }

                    if(configObj.limit == 'money'){
                        validate.setState(validate.money(tmpDataObj),configObj.errInfo);
                    }

                    if(configObj.limit == 'idCard'){
                        validate.setState(validate.idCard(tmpDataObj),configObj.errInfo);
                    }
                });

            }
        }catch(error){
            console.log("数据校验失败",validate.state,validate.errInfo,error);
            return false;
        }

        return true;
    }

})(window.vc.validate);


/**
对 validate 进行二次封装
**/
(function(vc){
    vc.check = function(dataObj,dataConfig){
        return vc.validate.validate(dataObj, dataConfig);
    }
})(window.vc)