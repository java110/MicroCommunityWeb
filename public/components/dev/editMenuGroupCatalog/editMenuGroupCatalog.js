(function (vc, vm) {
    vc.extends({
        data: {
            editMenuGroupCatalogInfo: {
                gcId: '',
                gId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editMenuGroupCatalog', 'openEditMenuGroupCatalogModal', function (_params) {
                vc.component.refreshEditMenuGroupCatalogInfo();
                $('#editMenuGroupCatalogModel').modal('show');
                vc.copyObject(_params, vc.component.editMenuGroupCatalogInfo);
                vc.component.editMenuGroupCatalogInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editMenuGroupCatalogValidate: function () {
                return vc.validate.validate({
                    editMenuGroupCatalogInfo: vc.component.editMenuGroupCatalogInfo
                }, {
                    'editMenuGroupCatalogInfo.gId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "菜单组ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "菜单组ID不能超过30"
                        },
                    ],
                    'editMenuGroupCatalogInfo.gcId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editMenuGroupCatalog: function () {
                if (!vc.component.editMenuGroupCatalogValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'menuGroupCatalog.updateMenuGroupCatalog',
                    JSON.stringify(vc.component.editMenuGroupCatalogInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMenuGroupCatalogModel').modal('hide');
                            vc.emit('menuGroupCatalogManage', 'listMenuGroupCatalog', {});
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
            refreshEditMenuGroupCatalogInfo: function () {
                vc.component.editMenuGroupCatalogInfo = {
                    gcId: '',
                    gId: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
