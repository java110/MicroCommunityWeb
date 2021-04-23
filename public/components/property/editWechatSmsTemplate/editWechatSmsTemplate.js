(function (vc, vm) {

    vc.extends({
        data: {
            editWechatSmsTemplateInfo: {
                templateId: '',
                templateType: '',
                smsTemplateId: '',
                remark: '',
                wechatId: '',
                wechats: []
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editWechatSmsTemplate', 'openEditWechatSmsTemplateModal', function (_params) {
                vc.component.refreshEditWechatSmsTemplateInfo();
                $that._listEditWechat();
                $('#editWechatSmsTemplateModel').modal('show');
                vc.copyObject(_params, vc.component.editWechatSmsTemplateInfo);
                vc.component.editWechatSmsTemplateInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editWechatSmsTemplateValidate: function () {
                return vc.validate.validate({
                    editWechatSmsTemplateInfo: vc.component.editWechatSmsTemplateInfo
                }, {
                    'editWechatSmsTemplateInfo.templateType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "模板类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "模板格式错误"
                        },
                    ],
                    'editWechatSmsTemplateInfo.smsTemplateId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "微信模板ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "微信模板ID太长"
                        },
                    ],
                    'editWechatSmsTemplateInfo.wechatId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "微信对象ID不能为空"
                        }
                    ],
                    'editWechatSmsTemplateInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "说明不能超过500位"
                        },
                    ],
                    'editWechatSmsTemplateInfo.templateId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "ID不能为空"
                        }]

                });
            },
            editWechatSmsTemplate: function () {
                if (!vc.component.editWechatSmsTemplateValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/wechat/updateWechatTemplate',
                    JSON.stringify(vc.component.editWechatSmsTemplateInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editWechatSmsTemplateModel').modal('hide');
                            vc.emit('wechatSmsTemplateManage', 'listWechatSmsTemplate', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditWechatSmsTemplateInfo: function () {
                vc.component.editWechatSmsTemplateInfo = {
                    templateId: '',
                    templateType: '',
                    smsTemplateId: '',
                    remark: '',
                    wechatId: '',
                    wechats: []

                }
            },
            _listEditWechat: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('smallWeChat.listSmallWeChats',
                    param,
                    function (json, res) {
                        var _wechatSmsTemplateManageInfo = JSON.parse(json);
                        vc.component.editWechatSmsTemplateInfo.wechats = _wechatSmsTemplateManageInfo.smallWeChats;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc, window.vc.component);
