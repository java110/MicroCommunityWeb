(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMenuGroupCatalogInfo: {
                gcId: '',
                gId: '',
                caId: '',
                storeType: '',
                menuGroups: [],
            }
        },
        _initMethod: function() {
            $that.addMenuGroupCatalogInfo.storeType = vc.getParam('storeType');


            $that._listMenuGroups();
        },
        _initEvent: function() {
            vc.on('addMenuGroupCatalog', 'openAddMenuGroupCatalogModal', function() {
                $that.addMenuGroupCatalogInfo.caId = vc.getParam('caId');
                $('#addMenuGroupCatalogModel').modal('show');
            });
        },
        methods: {
            addMenuGroupCatalogValidate() {
                return vc.validate.validate({
                    addMenuGroupCatalogInfo: vc.component.addMenuGroupCatalogInfo
                }, {
                    'addMenuGroupCatalogInfo.gId': [{
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

                });
            },
            saveMenuGroupCatalogInfo: function() {
                if (!vc.component.addMenuGroupCatalogValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addMenuGroupCatalogInfo);
                    $('#addMenuGroupCatalogModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/menuGroupCatalog.saveMenuGroupCatalog',
                    JSON.stringify(vc.component.addMenuGroupCatalogInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMenuGroupCatalogModel').modal('hide');
                            vc.component.clearAddMenuGroupCatalogInfo();
                            vc.emit('menuGroupCatalogManage', 'listMenuGroupCatalog', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddMenuGroupCatalogInfo: function() {
                let _menuGroups = $that.addMenuGroupCatalogInfo.menuGroups;
                vc.component.addMenuGroupCatalogInfo = {
                    gcId: '',
                    gId: '',
                    storeType: '',
                    menuGroups: _menuGroups
                };
            },
            _listMenuGroups: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 200,
                        storeType: $that.addMenuGroupCatalogInfo.storeType
                    }
                };
                //发送get请求
                vc.http.get('menuGroupManage',
                    'list',
                    param,
                    function(json, res) {
                        let _menuGroupManageInfo = JSON.parse(json);
                        vc.component.addMenuGroupCatalogInfo.menuGroups = _menuGroupManageInfo.menuGroups;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);