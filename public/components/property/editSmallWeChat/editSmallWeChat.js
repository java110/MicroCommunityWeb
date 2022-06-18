(function(vc, vm) {

    vc.extends({
        data: {
            editSmallWeChatInfo: {
                wechatId: '',
                weChatId:'',
                name: '',
                appId: '',
                appSecret: '',
                payPassword: '',
                createTime: '',
                objType: '',
                objId: '',
                mchId: '',
                mchName:'',
                remarks: '',
                objTypes: '1000',
                certPath: ''

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editSmallWeChat', 'openEditSmallWeChatModal', function(_params) {
                vc.component.refreshEditSmallWeChatInfo();
                vc.getDict('small_wechat', "obj_type", function(_data) {
                    vc.component.editSmallWeChatInfo.objTypes = _data;
                });
                $('#editSmallWeChatModel').modal('show');
                vc.copyObject(_params, vc.component.editSmallWeChatInfo);
                if ($that.editSmallWeChatInfo.certPath) {
                    vc.emit('editSmallWeChat', 'uploadFile', 'notifyVedio', $that.editSmallWeChatInfo.certPath)
                }
            });
            vc.on('editSmallWeChat', 'notifyCert', function(_param) {
                $that.editSmallWeChatInfo.certPath = _param.realFileName;
            })
        },
        methods: {
            editSmallWeChatValidate: function() {
                return vc.validate.validate({
                    editSmallWeChatInfo: vc.component.editSmallWeChatInfo
                }, {
                    'editSmallWeChatInfo.name': [{
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxIn",
                            param: "1,100",
                            errInfo: "名称不能超过100位"
                        },
                    ],
                    'editSmallWeChatInfo.appId': [{
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
                    'editSmallWeChatInfo.appSecret': [{
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
                    'editSmallWeChatInfo.payPassword': [{
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
                    'editSmallWeChatInfo.wechatId': [{
                        limit: "required",
                        param: "",
                        errInfo: "编码不能为空"
                    }, ],
                    'editSmallWeChatInfo.objType': [{
                        limit: "required",
                        param: "",
                        errInfo: "配置不能为空"
                    }],
                    'editSmallWeChatInfo.mchId': [{
                        limit: "required",
                        param: "",
                        errInfo: "商户id不能为空"
                    }],

                });
            },
            editSmallWeChat: function() {
                if (!vc.component.editSmallWeChatValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //1000表示改小程序作用于当前小区 否则作用于所有小区
                vc.component.editSmallWeChatInfo.objId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'smallWeChat.updateSmallWeChat',
                    JSON.stringify(vc.component.editSmallWeChatInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editSmallWeChatModel').modal('hide');
                            vc.emit('smallWeChatManage', 'listSmallWeChat', {});
                            return;
                        }
                        vc.message(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditSmallWeChatInfo: function() {
                vc.component.editSmallWeChatInfo = {
                    wechatId: '',
                    weChatId:'',
                    name: '',
                    appId: '',
                    appSecret: '',
                    payPassword: '',
                    createTime: '',
                    objType: '',
                    objId: '',
                    mchId: '',
                    mchName:'',
                    remarks: '',
                    objTypes: '1000',
                    certPath: ''
                }
                vc.emit('editSmallWeChat', 'uploadFile', 'clearVedio', {});
            }
        }
    });

})(window.vc, window.vc.component);