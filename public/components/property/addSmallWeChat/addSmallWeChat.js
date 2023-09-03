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
                objType: '1000',
                objId: '',
                mchId: '',
                mchName: '',
                remarks: '',
                objTypes: '',
                types: '',
                weChatType: '',
                certPath: ''
            }
        },
        _initMethod: function () {
            vc.getDict('small_wechat', "obj_type", function (_data) {
                vc.component.addSmallWeChatInfo.objTypes = _data;
            });
            vc.getDict('small_wechat', "wechat_type", function (_data) {
                vc.component.addSmallWeChatInfo.types = _data;
            });
        },
        _initEvent: function () {
            vc.on('addSmallWeChat', 'openAddSmallWeChatModal', function (type) {
                vc.component.addSmallWeChatInfo.weChatType = type;
                $('#addSmallWeChatModel').modal('show');
            });
            vc.on('addSmallWeChat', 'notifyCert', function (_param) {
                $that.addSmallWeChatInfo.certPath = _param.realFileName;
            })
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
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxIn",
                            param: "1,100",
                            errInfo: "名称不能超过100位"
                        }
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
                        }
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
                        }
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
                        }
                    ],
                    'addSmallWeChatInfo.mchId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小程序商户id不能为空"
                        }
                    ]
                });
            },
            saveSmallWeChatInfo: function () {
                if (!vc.component.addSmallWeChatValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addSmallWeChatInfo);
                    $('#addSmallWeChatModel').modal('hide');
                    return;
                }
                vc.component.addSmallWeChatInfo.objId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'smallWeChat.saveSmallWeChat',
                    JSON.stringify(vc.component.addSmallWeChatInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == '0') {
                            //关闭model
                            $('#addSmallWeChatModel').modal('hide');
                            vc.component.clearAddSmallWeChatInfo();
                            vc.emit('smallWeChatManage', 'listSmallWeChat', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddSmallWeChatInfo: function () {
                vc.component.addSmallWeChatInfo = {
                    weChatId: '',
                    name: '',
                    appId: '',
                    appSecret: '',
                    payPassword: '',
                    objType: '',
                    objId: '',
                    mchId: '',
                    mchName: '',
                    weChatType: '',
                    types: vc.component.addSmallWeChatInfo.types,
                    remarks: '',
                    objTypes: vc.component.addSmallWeChatInfo.objTypes,
                    certPath: '',
                };
                vc.emit('addSmallWeChat', 'uploadFile', 'clearVedio', {})
            },
            getObjType: function () {
            }
        }
    });
})(window.vc);