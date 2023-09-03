(function (vc, vm) {
    vc.extends({
        data: {
            inspectionPlanStateInfo: {
                inspectionPlanId: '',
                stateName: '',
                state: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('inspectionPlanState', 'openInspectionPlanStateModal', function (_params) {
                vc.copyObject(_params, vc.component.inspectionPlanStateInfo);
                console.log("收到参数：" + _params.state);
                console.log("收到参数：" + _params.inspectionPlanId);
                console.log("收到参数：" + _params.stateName);
                $('#inspectionPlanStateModel').modal('show');
            });
        },
        methods: {
            _changeInspectionPlanState: function () {
                vc.component.inspectionPlanStateInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/inspectionPlan.updateInspectionPlanState',
                    JSON.stringify(vc.component.inspectionPlanStateInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#inspectionPlanStateModel').modal('hide');
                            vc.emit('inspectionPlanManage', 'listInspectionPlan', {});
                            vc.toast("操作成功");
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
            _closeInspectionPlanStateModel: function () {
                $('#inspectionPlanStateModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
