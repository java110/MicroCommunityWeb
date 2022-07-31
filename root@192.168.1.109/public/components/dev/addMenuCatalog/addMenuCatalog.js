(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMenuCatalogInfo: {
                caId: '',
                name: '',
                icon: '',
                seq: '',
                storeType: '',
                url: '#',
                isShow: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addMenuCatalog', 'openAddMenuCatalogModal', function() {
                $('#addMenuCatalogModel').modal('show');
            });
        },
        methods: {
            addMenuCatalogValidate() {
                return vc.validate.validate({
                    addMenuCatalogInfo: vc.component.addMenuCatalogInfo
                }, {
                    'addMenuCatalogInfo.name': [{
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
                    'addMenuCatalogInfo.icon': [{
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
                    'addMenuCatalogInfo.seq': [{
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
                    'addMenuCatalogInfo.storeType': [{
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
                    'addMenuCatalogInfo.url': [{
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
                    'addMenuCatalogInfo.isShow': [{
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




                });
            },
            saveMenuCatalogInfo: function() {
                if (!vc.component.addMenuCatalogValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addMenuCatalogInfo);
                    $('#addMenuCatalogModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/menuCatalog.saveMenuCatalog',
                    JSON.stringify(vc.component.addMenuCatalogInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMenuCatalogModel').modal('hide');
                            vc.component.clearAddMenuCatalogInfo();
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
            clearAddMenuCatalogInfo: function() {
                vc.component.addMenuCatalogInfo = {
                    name: '',
                    icon: '',
                    seq: '',
                    storeType: '',
                    url: '',
                    isShow: '',

                };
            }
        }
    });

})(window.vc);