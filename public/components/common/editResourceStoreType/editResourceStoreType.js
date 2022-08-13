(function (vc, vm) {
    vc.extends({
        data: {
            editResourceStoreTypeInfo: {
                rstId: '',
                name: '',
                description: '',
                parentId: '',
                flag: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editResourceStoreType', 'openEditResourceStoreTypeModal', function (_params) {
                vc.component.refreshEditResourceStoreTypeInfo();
                $('#editResourceStoreTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editResourceStoreTypeInfo);
                vc.component.editResourceStoreTypeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editResourceStoreTypeValidate: function () {
                return vc.validate.validate({
                    editResourceStoreTypeInfo: vc.component.editResourceStoreTypeInfo
                }, {
                    'editResourceStoreTypeInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品类型名称不能为空"
                        },
                    ],
                    'editResourceStoreTypeInfo.description': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述不能超过200位"
                        }
                    ]
                });
            },
            editResourceStoreType: function () {
                if (!vc.component.editResourceStoreTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/resourceStoreType.updateResourceStoreType',
                    JSON.stringify(vc.component.editResourceStoreTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editResourceStoreTypeModel').modal('hide');
                            if (vc.component.editResourceStoreTypeInfo.flag != null && vc.component.editResourceStoreTypeInfo.flag != '' &&
                                vc.component.editResourceStoreTypeInfo.flag != 'undefined' && vc.component.editResourceStoreTypeInfo.flag == '1') {
                                vc.emit('listSonResourceStoreType', 'listSonResourceStoreTypes', {});
                            } else {
                                vc.emit('resourceStoreTypeManage', 'listResourceStoreType', {});
                            }
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditResourceStoreTypeInfo: function () {
                vc.component.editResourceStoreTypeInfo = {
                    rstId: '',
                    name: '',
                    description: '',
                    parentId: '',
                    flag: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
