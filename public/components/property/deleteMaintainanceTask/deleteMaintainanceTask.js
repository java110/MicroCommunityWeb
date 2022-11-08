(function(vc, vm) {
    vc.extends({
        data: {
            deleteMaintainanceTaskInfo: {}
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('deleteMaintainanceTask', 'openDeleteMaintainanceTaskModal', function(_params) {
                vc.component.deleteMaintainanceTaskInfo = _params;
                $('#deleteMaintainanceTaskModel').modal('show');
            });
        },
        methods: {
            deleteMaintainanceTask: function() {
                vc.component.deleteMaintainanceTaskInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/maintainanceTask.deleteMaintainanceTask',
                    JSON.stringify(vc.component.deleteMaintainanceTaskInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $('#deleteMaintainanceTaskModel').modal('hide');
                            vc.emit('maintainanceTaskManage', 'listMaintainanceTask', {});
                            return;
                        }

                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteMaintainanceTaskModel: function() {
                $('#deleteMaintainanceTaskModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);