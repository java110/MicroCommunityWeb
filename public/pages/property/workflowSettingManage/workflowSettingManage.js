(function(vc) {

    vc.extends({
        data: {
            workflowSettingInfo: {
                flowId: '',
                flowName: '',
                flowType: '',
                describle: '',
                startNodeFinish: '',
                steps: []
            }
        },
        _initMethod: function() {
            $that._initWorkflowSettingInfo();
        },
        _initEvent: function() {

        },
        methods: {
            saveWorkflowSettingInfo: function() {

                vc.component.workflowSettingInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    'workflow.updateWorkflow',
                    JSON.stringify(vc.component.workflowSettingInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let data = JSON.parse(json);
                        if (data.code == 0) {
                            vc.toast(data.msg);
                            $that._goBack();
                            return;
                        }
                        vc.toast(data.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _initWorkflowSettingInfo: function() {
                let flowId = vc.getParam('flowId');

                if (!vc.notNull(flowId)) {
                    vc.toast('操作错误');
                    vc.getBack();
                    return;
                }
                $that.workflowSettingInfo.flowId = flowId;
                $that.workflowSettingInfo.flowName = vc.getParam('flowName');
                $that.workflowSettingInfo.flowType = vc.getParam('flowType');
                $that.workflowSettingInfo.startNodeFinish = vc.getParam('startNodeFinish');

                //查询步骤
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        flowId: flowId
                    }
                };

                //发送get请求
                vc.http.apiGet('workflow.listWorkflowSteps',
                    param,
                    function(json, res) {
                        var _workflowInfo = JSON.parse(json);
                        if (_workflowInfo.code != '0') {
                            vc.toast(_workflowInfo.msg);
                            return;
                        }
                        $that._freshResStep(_workflowInfo.data);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _freshResStep: function(_data) {
                $that.workflowSettingInfo.describle = _data.describle;
                let _steps = [];
                if (!_data.hasOwnProperty("workflowSteps")) {
                    return;
                }

                for (let stepIndex = 0; stepIndex < _data.workflowSteps.length; stepIndex++) {
                    let _workflowStep = _data.workflowSteps[stepIndex];
                    let _step = {
                        seq: stepIndex,
                        staffId: _workflowStep.workflowStepStaffs[0].staffId,
                        staffName: _workflowStep.workflowStepStaffs[0].staffName,
                        type: _workflowStep.type,
                        staffRole: _workflowStep.workflowStepStaffs[0].staffRole,
                        subStaff: []
                    };
                    if (_workflowStep.type == 2) {
                        _steps.push(_step);
                        continue;
                    }
                    let _subStaffs = [];

                    if (!_workflowStep.hasOwnProperty("workflowStepStaffs") || _workflowStep.workflowStepStaffs.length < 2) {
                        _steps.push(_step);
                        continue;
                    }

                    for (let _subIndex = 1; _subIndex < _workflowStep.workflowStepStaffs.length; _subIndex++) {
                        let _workflowStepStaff = _workflowStep.workflowStepStaffs[_subIndex];
                        let _subStaff = {
                            id: vc.uuid(),
                            staffId: _workflowStepStaff.staffId,
                            staffName: _workflowStepStaff.staffName,
                            staffRole: _workflowStepStaff.staffRole
                        }

                        _subStaffs.push(_subStaff);
                    }

                    _step.subStaff = _subStaffs;
                    _steps.push(_step);

                }
                $that.workflowSettingInfo.steps = _steps;
            },
            addWorkflowStep: function() {
                let _step = {
                    seq: $that.workflowSettingInfo.steps.length,
                    staffId: '',
                    staffName: '',
                    type: '2',
                    subStaff: []
                }
                $that.workflowSettingInfo.steps.push(_step);
            },
            chooseStaff: function(item) {
                if ($that.workflowSettingInfo.flowType == '80008') {
                    item.from = 'purchase';
                } else if ($that.workflowSettingInfo.flowType == '30003') {
                    item.from = 'purchase';
                } else if ($that.workflowSettingInfo.flowType == '40004') {
                    item.from = 'purchase';
                } else if ($that.workflowSettingInfo.flowType == '70007') {
                    item.from = 'purchase';
                } else if ($that.workflowSettingInfo.flowType == '80008') {
                    item.from = 'purchase';
                } else if ($that.workflowSettingInfo.flowType == '50005') {
                    item.from = 'contract';
                } else if ($that.workflowSettingInfo.flowType == '60006') {
                    item.from = 'contract';
                }
                vc.emit('selectStaff', 'openStaff', item);
            },
            _goBack: function() {
                vc.getBack();
            },
            deleteStep: function(_step) {
                for (var i = 0; i < $that.workflowSettingInfo.steps.length; i++) {
                    if ($that.workflowSettingInfo.steps[i].seq == _step.seq) {
                        $that.workflowSettingInfo.steps.splice(i, 1);
                    }
                }
            },
            addStaff: function(_step) {
                _step.subStaff.push({
                    id: vc.uuid(),
                    staffId: '',
                    staffName: '',
                    staffRole: '1001'
                });
            },
            deleteStaff: function(_step, _subStaff) {
                for (var i = 0; i < _step.subStaff.length; i++) {
                    if (_step.subStaff[i].id == _subStaff.id) {
                        _step.subStaff.splice(i, 1);
                    }
                }
            },
            chooseType: function(_item) {
                if (_item.type == '1') {
                    _item.subStaff = [];
                }
            },

            chooseStaffRole: function() {

            }
        }
    });

})(window.vc);