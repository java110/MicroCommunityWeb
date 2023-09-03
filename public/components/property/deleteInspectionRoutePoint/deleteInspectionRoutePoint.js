(function (vc, vm) {
    vc.extends({
        data: {
            deleteInspectionRoutePointInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteInspectionRoutePoint', 'openDeleteInspectionRoutePointModal', function (_params) {
                vc.component.deleteInspectionRoutePointInfo = _params;
                $('#deleteInspectionRoutePointModel').modal('show');
            });
        },
        methods: {
            deleteInspectionRoutePoint: function () {
                vc.component.deleteInspectionRoutePointInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'inspectionRoute.deleteInspectionRoutePoint',
                    JSON.stringify(vc.component.deleteInspectionRoutePointInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteInspectionRoutePointModel').modal('hide');
                            vc.emit('inspectionRoutePointManage', 'listInspectionPoint', $that.deleteInspectionRoutePointInfo);
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
            closedeleteInspectionRoutePointModel: function () {
                $('#deleteInspectionRoutePointModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
