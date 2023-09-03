(function (vc, vm) {
    vc.extends({
        data: {
            deleteMenuInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMenu', 'openDeleteMenuModal', function (_params) {
                vc.component.deleteMenuInfo = _params;
                $('#deleteMenuModel').modal('show');
            });
        },
        methods: {
            deleteMenu: function () {
                //vc.component.deleteMenuInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/menu.deleteMenu',
                    JSON.stringify(vc.component.deleteMenuInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMenuModel').modal('hide');
                            vc.emit('menuManage', 'listMenu', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeDeleteMenuModel: function () {
                $('#deleteMenuModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
