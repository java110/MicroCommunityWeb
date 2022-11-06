(function (vc, vm) {
    vc.extends({
        data: {
            deleteMaintainanceItemInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMaintainanceItem', 'openDeleteMaintainanceItemModal', function (_params) {
                vc.component.deleteMaintainanceItemInfo = _params;
                $('#deleteMaintainanceItemModel').modal('show');
            });
        },
        methods: { 
            deleteMaintainanceItem: function () {
                vc.component.deleteMaintainanceItemInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/maintainance.deleteMaintainanceItem',
                    JSON.stringify(vc.component.deleteMaintainanceItemInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMaintainanceItemModel').modal('hide');
                            vc.emit('maintainanceItem', 'listMaintainanceItem', {});
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
            closeDeleteMaintainanceItemModel: function () {
                $('#deleteMaintainanceItemModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);