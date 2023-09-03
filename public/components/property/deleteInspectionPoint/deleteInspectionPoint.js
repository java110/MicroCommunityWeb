(function (vc, vm) {
    vc.extends({
        data: {
            deleteInspectionPointInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteInspectionPoint', 'openDeleteInspectionPointModal', function (_params) {
                vc.component.deleteInspectionPointInfo = _params;
                $('#deleteInspectionPointModel').modal('show');
            });
        },
        methods: {
            deleteInspectionPoint: function () {
                vc.component.deleteInspectionPointInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/inspectionPoint.deleteInspectionPoint',
                    JSON.stringify(vc.component.deleteInspectionPointInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteInspectionPointModel').modal('hide');
                            vc.emit('inspectionPointManage', 'listInspectionPoint', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            closeDeleteInspectionPointModel: function () {
                $('#deleteInspectionPointModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
