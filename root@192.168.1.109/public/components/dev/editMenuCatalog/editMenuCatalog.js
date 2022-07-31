(function(vc, vm) {

    vc.extends({
        data: {
            editMenuCatalogInfo: {
                caId: '',
                name: '',
                icon: '',
                seq: '',
                storeType: '',
                url: '',
                isShow: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editMenuCatalog', 'openEditMenuCatalogModal', function(_params) {
                vc.component.refreshEditMenuCatalogInfo();
                $('#editMenuCatalogModel').modal('show');
                vc.copyObject(_params, vc.component.editMenuCatalogInfo);
            });
        },
        methods: {
            editMenuCatalogValidate: function() {
                return vc.validate.validate({
                    editMenuCatalogInfo: vc.component.editMenuCatalogInfo
                }, {
                    'editMenuCatalogInfo.name': [{
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "名称不能超过10"
                        },
                    ],
                    'editMenuCatalogInfo.icon': [{
                            limit: "required",
                            param: "",
                            errInfo: "图片不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "20",
                            errInfo: "图片不能超过20"
                        },
                    ],
                    'editMenuCatalogInfo.seq': [{
                            limit: "required",
                            param: "",
                            errInfo: "顺序不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "顺序不能超过11"
                        },
                    ],
                    'editMenuCatalogInfo.storeType': [{
                            limit: "required",
                            param: "",
                            errInfo: "商户类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "商户类型不能超过12"
                        },
                    ],
                    'editMenuCatalogInfo.url': [{
                            limit: "required",
                            param: "",
                            errInfo: "页面不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "点击后进入那个页面不能超过256"
                        },
                    ],
                    'editMenuCatalogInfo.isShow': [{
                            limit: "required",
                            param: "",
                            errInfo: "是否显示不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "是否显示不能超过12"
                        },
                    ],
                    'editMenuCatalogInfo.caId': [{
                        limit: "required",
                        param: "",
                        errInfo: "编号不能为空"
                    }]

                });
            },
            editMenuCatalog: function() {
                if (!vc.component.editMenuCatalogValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/menuCatalog.updateMenuCatalog',
                    JSON.stringify(vc.component.editMenuCatalogInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMenuCatalogModel').modal('hide');
                            vc.emit('menuCatalogManage', 'listMenuCatalog', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditMenuCatalogInfo: function() {
                vc.component.editMenuCatalogInfo = {
                    caId: '',
                    name: '',
                    icon: '',
                    seq: '',
                    storeType: '',
                    url: '',
                    isShow: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);