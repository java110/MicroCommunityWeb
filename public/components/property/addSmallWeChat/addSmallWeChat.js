(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addSmallWeChatInfo: {
                weChatId: '',
                name: '',
                appId: '',
                appSecret: '',
                payPassword: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addSmallWeChat', 'openAddSmallWeChatModal', function () {
                $('#addSmallWeChatModel').modal('show');
            });
        },
        methods: {
            addSmallWeChatValidate() {
                return vc.validate.validate({
                    addSmallWeChatInfo: vc.component.addSmallWeChatInfo
                }, {
                    'addSmallWeChatInfo.name': [
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
                    'addSmallWeChatInfo.appId': [
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
                    'addSmallWeChatInfo.appSecret': [
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
                    'addSmallWeChatInfo.payPassword': [
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


                });
            },
            saveSmallWeChatInfo: function () {
                if (!vc.component.addSmallWeChatValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addSmallWeChatInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addSmallWeChatInfo);
                    $('#addSmallWeChatModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'smallWeChat.saveSmallWeChat',
                    JSON.stringify(vc.component.addSmallWeChatInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addSmallWeChatModel').modal('hide');
                            vc.component.clearAddSmallWeChatInfo();
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
            clearAddSmallWeChatInfo: function () {
                vc.component.addSmallWeChatInfo = {
                    name: '',
                    appId: '',
                    appSecret: '',
                    payPassword: '',

                };
            }
        }
    });

})(window.vc);
