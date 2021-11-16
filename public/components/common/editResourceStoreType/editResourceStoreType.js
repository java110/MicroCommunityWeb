(function (vc, vm) {
    vc.extends({
        data: {
            editResourceStoreTypeInfo: {
                rstId: '',
                name: '',
                description: ''
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
                vc.http.post(
                    'editResourceStoreType',
                    'update',
                    JSON.stringify(vc.component.editResourceStoreTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editResourceStoreTypeModel').modal('hide');
                            vc.emit('resourceStoreTypeManage', 'listResourceStoreType', {});
                            return;
                        }
                        vc.toast(json);
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
                    description: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
