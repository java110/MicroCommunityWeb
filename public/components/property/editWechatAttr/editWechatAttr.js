(function (vc) {

    vc.extends({
        data: {
            editWechatAttrInfo: {
                attrId: '',
                wechatId: '',
                specCdName: '',
                specCd: '',
                value: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editWechatAttr', 'openEditWechatAttrModal', function (_wechatAttr) {
                vc.copyObject(_wechatAttr, vc.component.editWechatAttrInfo);
                $('#editWechatAttrModel').modal('show');
            });
        },
        methods: {
            editWechatAttrValidate() {
                return vc.validate.validate({
                    editWechatAttrInfo: vc.component.editWechatAttrInfo
                }, {
                    'editWechatAttrInfo.attrId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "填写错误"
                        }
                    ],
                    'editWechatAttrInfo.value': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请填写值"
                        },
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "长度不能超过200位"
                        }
                    ]

                });
            },
            editWechatAttrMethod: function () {

                if (!vc.component.editWechatAttrValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editWechatAttrInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'smallWechat.updateSmallWechatAttr',
                    JSON.stringify(vc.component.editWechatAttrInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editWechatAttrModel').modal('hide');
                            vc.emit('wechatAttrInfo', 'getWechatAttrInfo',
                                vc.component.editWechatAttrInfo);
                            vc.component.clearEditWechatAttrInfo();
                            return;
                        }

                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.component.editWechatAttrInfo.errorInfo = errInfo;

                    });
            },
            clearEditWechatAttrInfo: function () {
                vc.component.editWechatAttrInfo = {
                    attrId: '',
                    wechatId: '',
                    specCdName: '',
                    specCd: '',
                    value: ''
                };
            }
        }
    });

})(window.vc);