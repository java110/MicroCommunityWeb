(function (vc, vm) {
    vc.extends({
        data: {
            deleteResourceAuditFlowInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteResourceAuditFlow', 'openDeleteResourceAuditFlowModal', function (_params) {
                $that.deleteResourceAuditFlowInfo = _params;
                $('#deleteResourceAuditFlowModel').modal('show');
            });
        },
        methods: {
            deleteResourceAuditFlow: function () {
                $that.deleteResourceAuditFlowInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/resourceStore.deleteResourceAuditFlow',
                    JSON.stringify($that.deleteResourceAuditFlowInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteResourceAuditFlowModel').modal('hide');
                            vc.emit('resourceAuditFlow', 'listResourceAuditFlow', {});
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
            closeDeleteResourceAuditFlowModel: function () {
                $('#deleteResourceAuditFlowModel').modal('hide');
            }
        }
    });
})(window.vc, window.$that);