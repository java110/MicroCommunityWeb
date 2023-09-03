(function (vc, vm) {
    vc.extends({
        data: {
            editContractTypeInfo: {
                contractTypeId: '',
                typeName: '',
                audit: '',
                remark: '',
                audits: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editContractType', 'openEditContractTypeModal', function (_params) {
                vc.getDict('contract_type', "audit", function(_data) {
                    vc.component.editContractTypeInfo.audits = _data;
                });
                vc.component.refreshEditContractTypeInfo();
                $('#editContractTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editContractTypeInfo);
                vc.component.editContractTypeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editContractTypeValidate: function () {
                return vc.validate.validate({
                    editContractTypeInfo: vc.component.editContractTypeInfo
                }, {
                    'editContractTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "类型名称不能超过64位"
                        },
                    ],
                    'editContractTypeInfo.audit': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否审核不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "是否审核格式错误"
                        },
                    ],
                    'editContractTypeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述超过200位"
                        },
                    ],
                    'editContractTypeInfo.contractTypeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型ID不能为空"
                        }
                    ]
                });
            },
            editContractType: function () {
                if (!vc.component.editContractTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/contract/updateContractType',
                    JSON.stringify(vc.component.editContractTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editContractTypeModel').modal('hide');
                            vc.emit('contractTypeManage', 'listContractType', {});
                            vc.toast("修改成功");
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
            refreshEditContractTypeInfo: function () {
                vc.component.editContractTypeInfo = {
                    contractTypeId: '',
                    typeName: '',
                    audit: '',
                    remark: '',
                    audits: []
                }
            }
        }
    });
})(window.vc, window.vc.component);
