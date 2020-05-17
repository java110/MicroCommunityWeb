(function (vc, vm) {

    vc.extends({
        data: {
            editSmallWeChatInfo: {
                weChatId: '',
                name: '',
                appId: '',
                appSecret: '',
                payPassword: '',
                createTime:''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editSmallWeChat', 'openEditSmallWeChatModal', function (_params) {
                console.log("收到参数",_params);
                vc.component.refreshEditSmallWeChatInfo();
                $('#editSmallWeChatModel').modal('show');
                vc.copyObject(_params, vc.component.editSmallWeChatInfo);
            });
        },
        methods: {
            editSmallWeChatValidate: function () {
                return vc.validate.validate({
                    editSmallWeChatInfo: vc.component.editSmallWeChatInfo
                }, {
                    'editSmallWeChatInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小程序名称不能为空"
                        },
                        {
                            limit: "max",
                            param: "1,100",
                            errInfo: "小程序名称不能超过100位"
                        },
                    ],
                    'editSmallWeChatInfo.appId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "appId不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "appId不能超过100位"
                        },
                    ],
                    'editSmallWeChatInfo.appSecret': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "应用密钥不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,200",
                            errInfo: "应用密钥不能超过200个字符"
                        },
                    ],
                    'editSmallWeChatInfo.payPassword': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "支付密码不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,200",
                            errInfo: "支付密码不能超过200个字符"
                        },
                    ],
                    'editSmallWeChatInfo.weChatId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编码不能为空"
                        }]

                });
            },
            editSmallWeChat: function () {
                if (!vc.component.editSmallWeChatValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'smallWeChat.updateSmallWeChat',
                    JSON.stringify(vc.component.editSmallWeChatInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editSmallWeChatModel').modal('hide');
                            vc.emit('smallWeChatManage', 'listSmallWeChat', {});
                            return;
                        }
                        vc.message(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditSmallWeChatInfo: function () {
                vc.component.editSmallWeChatInfo = {
                    weChatId: '',
                    name: '',
                    appId: '',
                    appSecret: '',
                    payPassword: '',
                    createTime:''

                }
            }
        }
    });

})(window.vc, window.vc.component);
