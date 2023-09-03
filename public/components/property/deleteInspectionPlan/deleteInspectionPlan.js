(function (vc, vm) {
    vc.extends({
        data: {
            deleteInspectionPlanInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteInspectionPlan', 'openDeleteInspectionPlanModal', function (_params) {
                vc.component.deleteInspectionPlanInfo = _params;
                $('#deleteInspectionPlanModel').modal('show');
            });
        },
        methods: {
            deleteInspectionPlan: function () {
                vc.component.deleteInspectionPlanInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/inspectionPlan.deleteInspectionPlan',
                    JSON.stringify(vc.component.deleteInspectionPlanInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteInspectionPlanModel').modal('hide');
                            vc.emit('inspectionPlanManage', 'listInspectionPlan', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteInspectionPlanModel: function () {
                $('#deleteInspectionPlanModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
