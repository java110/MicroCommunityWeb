(function (vc) {

    vc.extends({
        data: {
            workflowSettingInfo: {
                flowId: '',
                flowName: '',
                describle: '',
                steps: []
            }
        },
        _initMethod: function () {
            $that._initWorkflowSettingInfo();
        },
        _initEvent: function () {

        },
        methods: {
            saveWorkflowSettingInfo: function () {
                if (!vc.component.addWorkflowSettingValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.workflowSettingInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    'workflow.updateWorkflow',
                    JSON.stringify(vc.component.workflowSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let data = JSON.parse(json);
                        if (data.code == 0) {
                            vc.toast(data.msg);
                            $that.getBack();
                            return;
                        }
                        vc.toast(data.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            _initWorkflowSettingInfo: function () {
                let flowId = vc.getParam('flowId');

                if (!vc.notNull(flowId)) {
                    vc.toast('操作错误');
                    vc.getBack();
                    return;
                }
                $that.workflowSettingInfo.flowId = flowId;
                $that.workflowSettingInfo.flowName = vc.getParam('flowName');
            },
            addWorkflowStep: function () {
                let _step = {
                    seq: $that.workflowSettingInfo.steps.length,
                    staffId: '',
                    staffName: '',
                    type: '2',
                    subStaff: []
                }
                $that.workflowSettingInfo.steps.push(_step);
            },
            chooseStaff: function (item) {
                console.log(item);
                vc.emit('selectStaff','openStaff',item);
            },
            _goBack: function () {
                vc.getBack();
            },
            deleteStep: function (_step) {
                for (var i = 0; i < $that.workflowSettingInfo.steps.length; i++) {
                    if ($that.workflowSettingInfo.steps[i].seq == _step.seq) {
                        $that.workflowSettingInfo.steps.splice(i, 1);
                    }
                }
            },
            addStaff: function (_step) {
                _step.subStaff.push({
                    id: vc.uuid(),
                    staffId: '',
                    staffName: ''
                });
            },
            deleteStaff: function (_step, _subStaff) {
                for (var i = 0; i < _step.subStaff.length; i++) {
                    if (_step.subStaff[i].id == _subStaff.id) {
                        _step.subStaff.splice(i, 1);
                    }
                }
            },
            chooseType:function(_item){
                if(_item.type == '1'){
                    _item.subStaff = [];
                }
            }
        }
    });

})(window.vc);