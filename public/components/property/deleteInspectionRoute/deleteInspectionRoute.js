(function(vc, vm) {
    vc.extends({
        data: {
            deleteInspectionRouteInfo: {}
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('deleteInspectionRoute', 'openDeleteInspectionRouteModal', function(_params) {
                vc.component.deleteInspectionRouteInfo = _params;
                $('#deleteInspectionRouteModel').modal('show');
            });
        },
        methods: {
            deleteInspectionRoute: function() {
                vc.component.deleteInspectionRouteInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/inspectionRoute.deleteInspectionRoute',
                    JSON.stringify(vc.component.deleteInspectionRouteInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $('#deleteInspectionRouteModel').modal('hide');
                            vc.emit('inspectionRouteManage', 'listInspectionRoute', {});
                            return;
                        }

                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteInspectionRouteModel: function() {
                $('#deleteInspectionRouteModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);