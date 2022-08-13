(function (vc, vm) {
    vc.extends({
        data: {
            deleteAppInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteApp', 'openDeleteAppModel', function (_params) {
                console.log("12321")
                console.log(_params)
                vc.component.deleteAppInfo = _params;
                $('#deleteAppModel').modal('show');
            });
        },
        methods: {
            deleteApp: function () {
                vc.component.deleteAppInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/app.deleteApp',
                    JSON.stringify(vc.component.deleteAppInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteAppModel').modal('hide');
                            vc.emit('appManage', 'listApp', {});
                            vc.toast("删除成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteAppModel: function () {
                $('#deleteAppModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
