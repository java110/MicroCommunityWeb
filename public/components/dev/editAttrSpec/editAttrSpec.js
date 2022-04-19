(function (vc, vm) {
    vc.extends({
        data: {
            editAttrSpecInfo: {
                specCd: '',
                tableName: '',
                specName: '',
                specHoldplace: '',
                required: '',
                specShow: '',
                specValueType: '',
                specType: '',
                listShow: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editAttrSpec', 'openEditAttrSpecModal', function (_params) {
                vc.component.refreshEditAttrSpecInfo();
                $('#editAttrSpecModel').modal('show');
                vc.copyObject(_params, vc.component.editAttrSpecInfo);
                vc.component.editAttrSpecInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editAttrSpecValidate: function () {
                return vc.validate.validate({
                    editAttrSpecInfo: vc.component.editAttrSpecInfo
                }, {
                    'editAttrSpecInfo.tableName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "属性表不能为空"
                        }],
                    'editAttrSpecInfo.specName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "规格名称太长"
                        },
                    ],
                    'editAttrSpecInfo.specHoldplace': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "说明不能超过500位"
                        },
                    ],
                    'editAttrSpecInfo.required': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "必填不能为空"
                        }],
                    'editAttrSpecInfo.specShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "展示不能为空"
                        }],
                    'editAttrSpecInfo.specValueType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "值类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "值类型格式错误"
                        },
                    ],
                    'editAttrSpecInfo.specType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "规格类型错误"
                        },
                    ],
                    'editAttrSpecInfo.listShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "查询显示不能为空"
                        }],
                    'editAttrSpecInfo.specCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格不能为空"
                        }
                    ]
                });
            },
            editAttrSpec: function () {
                if (!vc.component.editAttrSpecValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/attrSpec/updateAttrSpec',
                    JSON.stringify(vc.component.editAttrSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editAttrSpecModel').modal('hide');
                            vc.emit('attrSpecManage', 'listAttrSpec', {});
                            vc.toast(_json.msg);
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditAttrSpecInfo: function () {
                vc.component.editAttrSpecInfo = {
                    specCd: '',
                    tableName: '',
                    specName: '',
                    specHoldplace: '',
                    required: '',
                    specShow: '',
                    specValueType: '',
                    specType: '',
                    listShow: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
