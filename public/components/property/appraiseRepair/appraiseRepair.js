(function (vc) {
    vc.extends({
        data: {
            appraiseRepairInfo: {
                repairId: '',
                repairType: '',
                context: '',
                publicArea: '',
                repairChannel: '',
                maintenanceType: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('appraiseRepair', 'openAppraiseRepairModal', function (_repair) {
                $that.appraiseRepairInfo.repairType = _repair.repairType;
                $that.appraiseRepairInfo.repairId = _repair.repairId;
                $that.appraiseRepairInfo.publicArea = _repair.publicArea;
                $that.appraiseRepairInfo.repairChannel = _repair.repairChannel;
                $that.appraiseRepairInfo.maintenanceType = _repair.maintenanceType;
                $('#appraiseRepairModel').modal('show');
            });
        },
        methods: {
            appraiseRepairValidate() {
                return vc.validate.validate({
                    appraiseRepairInfo: vc.component.appraiseRepairInfo
                }, {
                    'appraiseRepairInfo.repairId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修单不能为空"
                        }
                    ],
                    'appraiseRepairInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "回访建议不能为空"
                        }
                    ]
                });
            },
            _appraiseRepairInfo: function () {
                if (!vc.component.appraiseRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.appraiseRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'ownerRepair.appraiseRepair',
                    JSON.stringify(vc.component.appraiseRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#appraiseRepairModel').modal('hide');
                            vc.component.clearAppraiseRepairInfo();
                            vc.emit('repairDispatchManage', 'listOwnerRepair', {});
                            vc.toast("操作成功");
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
            clearAppraiseRepairInfo: function () {
                vc.component.appraiseRepairInfo = {
                    repairId: '',
                    repairType: '',
                    context: ''
                };
            },
        }
    });
})(window.vc);
