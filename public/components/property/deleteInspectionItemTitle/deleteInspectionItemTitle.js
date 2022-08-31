(function (vc, vm) {
    vc.extends({
        data: {
            deleteInspectionItemTitleInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteInspectionItemTitle', 'openDeleteInspectionItemTitleModal', function (_params) {
                vc.component.deleteInspectionItemTitleInfo = _params;
                $('#deleteInspectionItemTitleModel').modal('show');
            });
        },
        methods: {
            deleteInspectionItemTitle: function () {
                vc.component.deleteInspectionItemTitleInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/inspectionItemTitle.deleteInspectionItemTitle',
                    JSON.stringify(vc.component.deleteInspectionItemTitleInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteInspectionItemTitleModel').modal('hide');
                            vc.emit('inspectionItemTitleManage', 'listInspectionItemTitle', {});
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
            closeDeleteInspectionItemTitleModel: function () {
                $('#deleteInspectionItemTitleModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);