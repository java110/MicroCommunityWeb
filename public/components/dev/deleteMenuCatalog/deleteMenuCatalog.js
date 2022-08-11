(function (vc, vm) {
    vc.extends({
        data: {
            deleteMenuCatalogInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMenuCatalog', 'openDeleteMenuCatalogModal', function (_params) {
                vc.component.deleteMenuCatalogInfo = _params;
                $('#deleteMenuCatalogModel').modal('show');
            });
        },
        methods: {
            deleteMenuCatalog: function () {
                vc.http.apiPost(
                    '/menuCatalog.deleteMenuCatalog',
                    JSON.stringify(vc.component.deleteMenuCatalogInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMenuCatalogModel').modal('hide');
                            vc.emit('menuCatalogManage', 'listMenuCatalog', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteMenuCatalogModel: function () {
                $('#deleteMenuCatalogModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);