(function (vc, vm) {
    vc.extends({
        data: {
            editAttrValueInfo: {
                specCd: '',
                valueId: '',
                value: '',
                valueName: '',
                valueShow: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editAttrValue', 'openEditAttrValueModal', function (_params) {
                vc.component.refreshEditAttrValueInfo();
                $('#editAttrValueModel').modal('show');
                vc.copyObject(_params, vc.component.editAttrValueInfo);
                vc.component.editAttrValueInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editAttrValueValidate: function () {
                return vc.validate.validate({
                    editAttrValueInfo: vc.component.editAttrValueInfo
                }, {
                    'editAttrValueInfo.value': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "值不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "值超过200位"
                        },
                    ],
                    'editAttrValueInfo.valueName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "值名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "值名称超过200位"
                        },
                    ],
                    'editAttrValueInfo.valueShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "显示不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "2",
                            errInfo: "显示格式错误"
                        },
                    ],
                    'editAttrValueInfo.valueId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "值ID不能为空"
                        }
                    ]
                });
            },
            editAttrValue: function () {
                if (!vc.component.editAttrValueValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/attrValue/updateAttrValue',
                    JSON.stringify(vc.component.editAttrValueInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editAttrValueModel').modal('hide');
                            vc.emit('attrValueManage', 'listAttrValue', {});
                            vc.toast(_json.msg);
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditAttrValueInfo: function () {
                vc.component.editAttrValueInfo = {
                    specCd: '',
                    valueId: '',
                    value: '',
                    valueName: '',
                    valueShow: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
