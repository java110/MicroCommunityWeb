(function (vc, vm) {

    vc.extends({
        data: {
            editResourceStoreSpecificationInfo: {
                rssId: '',
                specName: '',
                rstId: '',
                description: '',
                resourceStoreTypes: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editResourceStoreSpecification', 'openEditResourceStoreSpecificationModal', function (_params) {
                vc.component.refreshEditResourceStoreSpecificationInfo();
                $('#editResourceStoreSpecificationModel').modal('show');
                vc.copyObject(_params, vc.component.editResourceStoreSpecificationInfo);
                vc.component.editResourceStoreSpecificationInfo.communityId = vc.getCurrentCommunity().communityId;
                $that._listResourceStoreTypesEdit();
            });
        },
        methods: {
            editResourceStoreSpecificationValidate: function () {
                return vc.validate.validate({
                    editResourceStoreSpecificationInfo: vc.component.editResourceStoreSpecificationInfo
                }, {
                    'editResourceStoreSpecificationInfo.specName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "255",
                            errInfo: "规格名称太长"
                        },
                    ],
                    'editResourceStoreSpecificationInfo.rstId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "商品类型格式错误"
                        },
                    ],
                    'editResourceStoreSpecificationInfo.description': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        },
                    ]

                });
            },
            editResourceStoreSpecification: function () {
                if (!vc.component.editResourceStoreSpecificationValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'resourceStore.updateResourceStoreSpecification',
                    JSON.stringify(vc.component.editResourceStoreSpecificationInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editResourceStoreSpecificationModel').modal('hide');
                            vc.emit('resourceStoreSpecificationManage', 'listResourceStoreSpecification', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            _listResourceStoreTypesEdit: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.get('resourceStoreTypeManage',
                    'list',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.editResourceStoreSpecificationInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            refreshEditResourceStoreSpecificationInfo: function () {
                vc.component.editResourceStoreSpecificationInfo = {
                    rssId: '',
                    specName: '',
                    rstId: '',
                    description: '',
                    resourceStoreTypes: []
                }
            }
        }
    });

})(window.vc, window.vc.component);
