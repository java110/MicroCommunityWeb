(function(vc){
      vc.extends({
        data:{
            registerInfo:{
                username:'',
                passwd:'',
                repasswd:'',
                errorInfo:'',
                validateInfo:'',
                logo:''
            }
        },
        _initMethod:function(){
            //vc.component.validate();
            vc.component._initSysInfo();
        },
        _initEvent:function(){
             vc.component.$on('errorInfoEvent',function(_errorInfo){
                    vc.component.registerInfo.errorInfo = _errorInfo;
                    console.log('errorInfoEvent 事件被监听',_errorInfo)
                });

             vc.component.$on('validate_tel_change_event',function(params){
                         for(var tmpAttr in params){
                             vc.component.registerInfo[tmpAttr] = params[tmpAttr];
                         }
                         console.log('validate_tel_component_param_change_event 事件被监听',params)
                     });
        },
        methods:{
            _initSysInfo: function () {
                var sysInfo = vc.getData("_sysInfo");
                if (sysInfo == null) {
                    //this.logo = "HC";
                    vc.component._loadSysInfo();
                    return;
                }
                this.logo = sysInfo.logo;
            },
            _loadSysInfo: function () {
                var param = {
                    params: {
                        sys: 'HC'
                    }
                }
                vc.http.get(
                    'register',
                    'getSysInfo',
                    param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status != 200) {
                            console.log("加载系统信息失败");
                            vc.saveData("_sysInfo", {logo: 'HC'});
                            vc.copyObject(json, vc.component.registerInfo);
                            return;
                        }
                        vc.copyObject(JSON.parse(json), vc.component.registerInfo);
                        //保存到浏览器
                        vc.saveData("_sysInfo", JSON.parse(json));
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.saveData("_sysInfo", {logo: 'HC'});
                        vc.copyObject(json, vc.component.registerInfo);
                        vc.component.loginInfo.errorInfo = errInfo;
                    });
            },
            validate:function(){
                return vc.validate.validate({
                    registerInfo:vc.component.registerInfo
                },{
                    'registerInfo.username':[
                        {
                            limit:"required",
                            param:"",
                            errInfo:"用户名不能为空"
                        },
                        {
                            limit:"maxin",
                            param:"4,12",
                            errInfo:"用户名长度必须在4位至6位"
                        },
                    ],
                    'registerInfo.passwd':[
                        {
                            limit:"required",
                            param:"",
                            errInfo:"密码不能为空"
                        },
                        {
                            limit:"maxin",
                            param:"6,12",
                            errInfo:"密码长度必须在6位至12位"
                        },
                    ],
                    'registerInfo.tel':[
                        {
                            limit:"required",
                            param:"",
                            errInfo:"手机号不能为空"
                        },
                        {
                            limit:"phone",
                            param:"",
                            errInfo:"不是有效的手机号"
                        }
                    ],
                    'registerInfo.messageCode':[
                        {
                            limit:"required",
                            param:"",
                            errInfo:"验证码不能为空"
                        },
                        {
                            limit:"num",
                            param:"",
                            errInfo:"验证码必须是数字"
                        }
                    ],

                });
            },
            doRegister:function(){

                if(!vc.component.validate()){
                    vc.component.registerInfo.errorInfo = vc.validate.errInfo;
                    return ;
                }
                vc.http.post(
                            'register',
                            'doRegister',
                            JSON.stringify(vc.component.registerInfo),
                            {
                                emulateJSON:true
                             },
                             function(json,res){
                                //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                                if(res.status == 200){
                                    vc.jumpToPage("/user.html#/pages/frame/login");
                                    return ;
                                }
                                vc.toast(json);
                                vc.component.registerInfo.errorInfo = json;
                             },
                             function(errInfo,error){
                                console.log('请求失败处理');
                                vc.toast(errInfo);
                                vc.component.registerInfo.errorInfo = errInfo;
                             });

            },
            test:function(val){
                if('username' == val){
                    vc.messageTips("*用户名长度必须在4位至6位");

                }else if('passwd' == val){
                    vc.messageTips("*密码长度必须在6位至12位");

                }
            },
            _doLogin:function(){
                vc.jumpToPage('/user.html#/pages/frame/login');
            }
        }
    });


})(window.vc);