(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addSmsConfigInfo: {
                smsId: '',
                smsType: '',
                smsBusi: '',
                templateCode: '',
                signName: '',
                accessSecret: '',
                accessKeyId: '',
                region: '',
                logSwitch: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addSmsConfig', 'openAddSmsConfigModal', function () {
                $('#addSmsConfigModel').modal('show');
            });
        },
        methods: {
            addSmsConfigValidate() {
                return vc.validate.validate({
                    addSmsConfigInfo: vc.component.addSmsConfigInfo
                }, {
                    'addSmsConfigInfo.smsType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "短信商不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,20",
                            errInfo: "短信商超长了"
                        },
                    ],
                    'addSmsConfigInfo.smsBusi': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "短信业务不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "短信业务格式有误"
                        },
                    ],
                    'addSmsConfigInfo.templateCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "短信模板不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "短信模板超过64位"
                        },
                    ],
                    'addSmsConfigInfo.signName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "短信签名不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "短信签名超过128位"
                        },
                    ],
                    'addSmsConfigInfo.accessSecret': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "短信秘钥不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "短信秘钥超过128位"
                        },
                    ],
                    'addSmsConfigInfo.accessKeyId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访问KEY不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "访问KEY超过128位"
                        },
                    ],
                    'addSmsConfigInfo.region': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "区域不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "区域超过64位"
                        },
                    ],
                    'addSmsConfigInfo.logSwitch': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "日志不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "20",
                            errInfo: "日志格式有误"
                        },
                    ],
                    'addSmsConfigInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        },
                    ],




                });
            },
            saveSmsConfigInfo: function () {
                if (!vc.component.addSmsConfigValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addSmsConfigInfo.objId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addSmsConfigInfo);
                    $('#addSmsConfigModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/smsConfig/saveSmsConfig',
                    JSON.stringify(vc.component.addSmsConfigInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addSmsConfigModel').modal('hide');
                            vc.component.clearAddSmsConfigInfo();
                            vc.emit('smsConfigManage', 'listSmsConfig', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddSmsConfigInfo: function () {
                vc.component.addSmsConfigInfo = {
                    smsType: '',
                    smsBusi: '',
                    templateCode: '',
                    signName: '',
                    accessSecret: '',
                    accessKeyId: '',
                    region: '',
                    logSwitch: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
