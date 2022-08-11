/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            addComplaintStepInfo: {
                $step: {},
                index: 0,
                infos: []
            }
        },
        _initMethod: function() {
            vc.component._initStep();
        },
        _initEvent: function() {
            vc.on("addComplaintStep", "notify", function(_info) {
                vc.component.addComplaintStepInfo.infos[vc.component.addComplaintStepInfo.index] = _info;
                if (vc.component.addComplaintStepInfo.index == 0) {
                    vc.emit('searchRoom', 'listenerFloorInfo', _info);
                }
            });
        },
        methods: {
            _initStep: function() {
                vc.component.addComplaintStepInfo.$step = $("#step");
                vc.component.addComplaintStepInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["选择楼栋", "选择房屋", "投诉建议"]
                });
                vc.component.addComplaintStepInfo.index = vc.component.addComplaintStepInfo.$step.getIndex();
            },
            _prevStep: function() {
                vc.component.addComplaintStepInfo.$step.prevStep();
                vc.component.addComplaintStepInfo.index = vc.component.addComplaintStepInfo.$step.getIndex();
                vc.emit('viewFloorInfo', 'onIndex', vc.component.addComplaintStepInfo.index);
                vc.emit('sellRoomSelectRoom', 'onIndex', vc.component.addComplaintStepInfo.index);
                vc.emit('addComplainView', 'onIndex', vc.component.addComplaintStepInfo.index);
            },
            _nextStep: function() {
                var _currentData = vc.component.addComplaintStepInfo.infos[vc.component.addComplaintStepInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                vc.component.addComplaintStepInfo.$step.nextStep();
                vc.component.addComplaintStepInfo.index = vc.component.addComplaintStepInfo.$step.getIndex();
                vc.emit('viewFloorInfo', 'onIndex', vc.component.addComplaintStepInfo.index);
                vc.emit('sellRoomSelectRoom', 'onIndex', vc.component.addComplaintStepInfo.index);
                vc.emit('addComplainView', 'onIndex', vc.component.addComplaintStepInfo.index);
            },
            _finishStep: function() {
                var _currentData = vc.component.addComplaintStepInfo.infos[vc.component.addComplaintStepInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                /*var param = {
                    data: vc.component.addComplaintStepInfo.infos
                }*/
                vc.component.addComplaintStepInfo.infos[2].roomId = vc.component.addComplaintStepInfo.infos[1].roomId;
                vc.http.apiPost(
                    '/complaint.saveComplaint',
                    JSON.stringify(vc.component.addComplaintStepInfo.infos[2]), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        if (res.status == 200) {
                            vc.toast('提交成功');
                            //关闭model
                            //vc.jumpToPage("/#/pages/common/complaintManage?" + vc.objToGetParam(JSON.parse(json)));
                            vc.goBack();
                            return;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _goBack: function (_param) {
                vc.goBack();
            }
        }
    });
})(window.vc);