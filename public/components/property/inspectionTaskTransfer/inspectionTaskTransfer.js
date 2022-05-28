(function (vc) {
    vc.extends({
        propTypes: {
        },
        data: {
            inspectionTaskTransferInfo: {
                flowComponent: 'inspectionTaskManage',
                transferDesc: '',
                staffId: '',
                staffName: '',
                communityId: '',
                actInsTime: '',
                actUserId: '',
                actUserName: '',
                inspectionPlanId: '',
                inspectionPlanName: '',
                planEndTime: '',
                planInsTime: '',
                planUserId: '',
                planUserName: '',
                signType: '',
                signTypeName: '',
                state: '',
                stateName: '',
                statusCd: '',
                taskId: '',
                taskType: 2000,
                currentUserId: vc.getData('/nav/getUserInfo').userId
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('inspectionTaskTransfer', 'openInspectionTaskTransferModal', function (_inspectionTask) {
                delete _inspectionTask.taskType;
                delete _inspectionTask.transferDesc;
                vc.component.clearInspectionTaskTransferInfo();
                vc.copyObject(_inspectionTask, vc.component.inspectionTaskTransferInfo);
                $('#inspectionTaskTransferModel').modal('show');
            });

            vc.on("inspectionTaskTransfer", "notify", function (_param) {
                if (_param.hasOwnProperty("staffId")) {
                    vc.component.inspectionTaskTransferInfo.staffId = _param.staffId;
                    vc.component.inspectionTaskTransferInfo.staffName = _param.staffName;
                }
            });
        },
        methods: {
            inspectionTaskTransferValidate() {
                return vc.validate.validate({
                    inspectionTaskTransferInfo: vc.component.inspectionTaskTransferInfo
                }, {
                    'inspectionTaskTransferInfo.staffId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择员工"
                        }
                    ],
                    'inspectionTaskTransferInfo.transferDesc': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "流转说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "流转说明太长"
                        },
                    ],
                });
            },
            saveInspectionTaskTransferInfo: function () {
                if (!vc.component.inspectionTaskTransferValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.inspectionTaskTransferInfo.staffId == vc.component.inspectionTaskTransferInfo.planUserId){
                    vc.toast("不能流转给当前巡检人");
                    return;
                }
                vc.component.inspectionTaskTransferInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'inspectionTask.updateInspectionTask',
                    JSON.stringify(vc.component.inspectionTaskTransferInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#inspectionTaskTransferModel').modal('hide');
                            vc.component.clearInspectionTaskTransferInfo();
                            vc.emit('inspectionTaskManage', 'pageReload', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearInspectionTaskTransferInfo: function () {
                vc.component.inspectionTaskTransferInfo = {
                    flowComponent: 'inspectionTaskManage',
                    transferDesc: '',
                    staffId: '',
                    staffName: '',
                    communityId: '',
                    actInsTime: '',
                    actUserId: '',
                    actUserName: '',
                    inspectionPlanId: '',
                    inspectionPlanName: '',
                    planEndTime: '',
                    planInsTime: '',
                    planUserId: '',
                    planUserName: '',
                    signType: '',
                    signTypeName: '',
                    state: '',
                    stateName: '',
                    statusCd: '',
                    taskId: '',
                    taskType: 2000,
                    currentUserId: vc.getData('/nav/getUserInfo').userId
                };
            }
        }
    });
})(window.vc);
