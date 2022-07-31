(function(vc, vm) {
    vc.extends({
        data: {
            deleteInspectionTaskInfo: {}
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('deleteInspectionTask', 'openDeleteInspectionTaskModal', function(_params) {
                vc.component.deleteInspectionTaskInfo = _params;
                $('#deleteInspectionTaskModel').modal('show');
            });
        },
        methods: {
            deleteInspectionTask: function() {
                vc.component.deleteInspectionTaskInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/inspectionTask.deleteInspectionTask',
                    JSON.stringify(vc.component.deleteInspectionTaskInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $('#deleteInspectionTaskModel').modal('hide');
                            vc.emit('inspectionTaskManage', 'listInspectionTask', {});
                            return;
                        }

                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteInspectionTaskModel: function() {
                $('#deleteInspectionTaskModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);