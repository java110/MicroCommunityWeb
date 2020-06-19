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
            addWorkflowSettingValidate() {
                return vc.validate.validate({
                    workflowSettingInfo: vc.component.workflowSettingInfo
                }, {
                    'workflowSettingInfo.title': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动标题不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,200",
                            errInfo: "活动标题不能超过200位"
                        },
                    ],
                    'workflowSettingInfo.typeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "活动类型格式错误"
                        },
                    ],
                    'workflowSettingInfo.headerImg': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "头部照片不能为空"
                        }
                    ],
                    'workflowSettingInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动内容不能为空"
                        }
                    ],
                    'workflowSettingInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "开始时间格式错误"
                        },
                    ],
                    'workflowSettingInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "结束时间格式错误"
                        },
                    ],


                });
            },
            saveWorkflowSettingInfo: function () {
                if (!vc.component.addWorkflowSettingValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.workflowSettingInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.post(
                    'workflowSetting',
                    'save',
                    JSON.stringify(vc.component.workflowSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model

                            vc.component.clearworkflowSettingInfo();
                            vc.emit('activitiesManage', 'listWorkflowSetting', {});

                            return;
                        }
                        vc.toast(json);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearworkflowSettingInfo: function () {
                vc.component.workflowSettingInfo = {
                    activitiesId: '',
                    title: '',
                    typeCd: '',
                    headerImg: '',
                    context: '',
                    startTime: '',
                    endTime: ''

                };
            },
            _initWorkflowSettingInfo: function () {
                let flowId = vc.getParam('flowId');

                if (!vc.notNull(flowId)) {
                    vc.toast('操作错误');
                    vc.getBack();
                    return;
                }

                let _that = $that.workflowSettingInfo;
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
            chooseStaff: function () {
                vc.emit('selectStaff','openStaff',{})
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