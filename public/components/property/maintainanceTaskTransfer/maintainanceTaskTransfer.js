(function (vc) {
    vc.extends({
        propTypes: {},
        data: {
            maintainanceTaskTransferInfo: {
                flowComponent: 'maintainanceTaskManage',
                transferDesc: '',
                staffId: '',
                staffName: '',
                communityId: '',
                actInsTime: '',
                actUserId: '',
                actUserName: '',
                maintainancePlanId: '',
                maintainancePlanName: '',
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
            vc.on("maintainanceTaskTransfer", "notify", function(_param) {
                if (_param.hasOwnProperty("staffId")) {
                    vc.component.maintainanceTaskTransferInfo.staffId = _param.staffId;
                    vc.component.maintainanceTaskTransferInfo.staffName = _param.staffName;
                }
            });

            vc.on('maintainanceTaskTransfer', 'switchOrg', function(_org) {
                vc.emit('maintainanceTaskTransfer', 'staffSelect2', 'setStaff', _org)
            });
            vc.on('maintainanceTaskTransfer', 'openMaintainanceTaskTransferModal', function (_maintainanceTask) {
                delete _maintainanceTask.taskType;
                delete _maintainanceTask.transferDesc;
                vc.component.clearMaintainanceTaskTransferInfo();
                vc.copyObject(_maintainanceTask, vc.component.maintainanceTaskTransferInfo);
                $('#maintainanceTaskTransferModel').modal('show');
            });
        },
        methods: {
            maintainanceTaskTransferValidate() {
                return vc.validate.validate({
                    maintainanceTaskTransferInfo: vc.component.maintainanceTaskTransferInfo
                }, {
                    'maintainanceTaskTransferInfo.staffId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择员工"
                        }
                    ],
                    'maintainanceTaskTransferInfo.transferDesc': [
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
            saveMaintainanceTaskTransferInfo: function () {
                if (!vc.component.maintainanceTaskTransferValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.maintainanceTaskTransferInfo.staffId == vc.component.maintainanceTaskTransferInfo.planUserId) {
                    vc.toast("不能流转给当前保养人");
                    return;
                }
                vc.component.maintainanceTaskTransferInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'maintainanceTask.updateMaintainanceTask',
                    JSON.stringify(vc.component.maintainanceTaskTransferInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#maintainanceTaskTransferModel').modal('hide');
                            vc.component.clearMaintainanceTaskTransferInfo();
                            vc.emit('maintainanceTaskManage', 'pageReload', {});
                            vc.toast("操作成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearMaintainanceTaskTransferInfo: function () {
                vc.component.maintainanceTaskTransferInfo = {
                    flowComponent: 'maintainanceTaskManage',
                    transferDesc: '',
                    staffId: '',
                    staffName: '',
                    communityId: '',
                    actInsTime: '',
                    actUserId: '',
                    actUserName: '',
                    maintainancePlanId: '',
                    maintainancePlanName: '',
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
