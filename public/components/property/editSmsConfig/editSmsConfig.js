(function (vc, vm) {

    vc.extends({
        data: {
            editSmsConfigInfo: {
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
            vc.on('editSmsConfig', 'openEditSmsConfigModal', function (_params) {
                vc.component.refreshEditSmsConfigInfo();
                $('#editSmsConfigModel').modal('show');
                vc.copyObject(_params, vc.component.editSmsConfigInfo);
                vc.component.editSmsConfigInfo.objId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editSmsConfigValidate: function () {
                return vc.validate.validate({
                    editSmsConfigInfo: vc.component.editSmsConfigInfo
                }, {
                    'editSmsConfigInfo.smsType': [
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
                    'editSmsConfigInfo.smsBusi': [
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
                    'editSmsConfigInfo.templateCode': [
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
                    'editSmsConfigInfo.signName': [
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
                    'editSmsConfigInfo.accessSecret': [
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
                    'editSmsConfigInfo.accessKeyId': [
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
                    'editSmsConfigInfo.region': [
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
                    'editSmsConfigInfo.logSwitch': [
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
                    'editSmsConfigInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        },
                    ],
                    'editSmsConfigInfo.smsId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "短信编号不能为空"
                        }]

                });
            },
            editSmsConfig: function () {
                if (!vc.component.editSmsConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/smsConfig/updateSmsConfig',
                    JSON.stringify(vc.component.editSmsConfigInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editSmsConfigModel').modal('hide');
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
            refreshEditSmsConfigInfo: function () {
                vc.component.editSmsConfigInfo = {
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
            }
        }
    });

})(window.vc, window.vc.component);
