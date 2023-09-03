(function (vc, vm) {
    vc.extends({
        data: {
            editItemReleaseTypeInfo: {
                typeId: '',
                typeName: '',
                flowName: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editItemReleaseType', 'openEditItemReleaseTypeModal', function (_params) {
                vc.component.refreshEditItemReleaseTypeInfo();
                $('#editItemReleaseTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editItemReleaseTypeInfo);
                vc.component.editItemReleaseTypeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editItemReleaseTypeValidate: function () {
                return vc.validate.validate({
                    editItemReleaseTypeInfo: vc.component.editItemReleaseTypeInfo
                }, {
                    'editItemReleaseTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "类型名称不能超过30"
                        }
                    ],
                    'editItemReleaseTypeInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        }
                    ],
                    'editItemReleaseTypeInfo.typeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editItemReleaseType: function () {
                if (!vc.component.editItemReleaseTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/itemRelease.updateItemReleaseType',
                    JSON.stringify(vc.component.editItemReleaseTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editItemReleaseTypeModel').modal('hide');
                            vc.emit('itemReleaseTypeManage', 'listItemReleaseType', {});
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
            refreshEditItemReleaseTypeInfo: function () {
                vc.component.editItemReleaseTypeInfo = {
                    typeId: '',
                    typeName: '',
                    flowName: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
