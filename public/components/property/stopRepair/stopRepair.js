(function (vc) {
    vc.extends({
        data: {
            stopRepairInfo: {
                repairId: '',
                repairType: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('stopRepair', 'openStopRepairModal', function (_repair) {
                $that.stopRepairInfo.repairType = _repair.repairType;
                $that.stopRepairInfo.repairId = _repair.repairId;
                $('#stopRepairModel').modal('show');
            });
        },
        methods: {
            stopRepairValidate() {
                return vc.validate.validate({
                    stopRepairInfo: vc.component.stopRepairInfo
                }, {
                    'stopRepairInfo.repairId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修单不能为空"
                        }
                    ],
                    'stopRepairInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "暂停原因不能为空"
                        }
                    ]
                });
            },
            _stopRepairInfo: function () {
                if (!vc.component.stopRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.stopRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'ownerRepair.repairStop',
                    JSON.stringify(vc.component.stopRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#stopRepairModel').modal('hide');
                            vc.component.clearStopRepairInfo();
                            vc.emit('repairDispatchManage', 'listOwnerRepair', {});
                            vc.toast("暂停成功");
                        } else if (_json.code == 5010) {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearStopRepairInfo: function () {
                vc.component.stopRepairInfo = {
                    repairId: '',
                    repairType: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);
