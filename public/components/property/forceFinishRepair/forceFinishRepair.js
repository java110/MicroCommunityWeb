(function (vc) {
    vc.extends({
        data: {
            forceFinishRepairInfo: {
                repairId: '',
                repairType: '',
                staffId: '',
                staffName: '',
                context: '',
                action: '',
                repairTypeUsers: []
            }
        },
        _initMethod: function () {
            //vc.component._initDispatchRepairInfo();
        },
        _initEvent: function () {
            vc.on('forceFinishRepair', 'openDispatchRepairModal', function (_repair) {
                $that.forceFinishRepairInfo.repairId = _repair.repairId;
                $('#forceFinishRepairModel').modal('show');
            });
        },
        methods: {
            forceFinishRepairValidate() {
                return vc.validate.validate({
                    forceFinishRepairInfo: vc.component.forceFinishRepairInfo
                }, {
                    'forceFinishRepairInfo.repairId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修单不能为空"
                        }
                    ],
                    'forceFinishRepairInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "说明不能为空"
                        }
                    ]
                });
            },
            _forceFinishRepairInfo: function () {
                if (!vc.component.forceFinishRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.forceFinishRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'ownerRepair.repairForceFinish',
                    JSON.stringify(vc.component.forceFinishRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#forceFinishRepairModel').modal('hide');
                            vc.component.clearDispatchRepairInfo();
                            vc.emit('repairPoolManage', 'listRepairPool', {});
                            vc.emit('repairForceFinishManage', 'listRepairPool', {});
                            vc.toast("操作成功");
                        } else if(_json.code == 404){
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearDispatchRepairInfo: function () {
                vc.component.forceFinishRepairInfo = {
                    repairId: '',
                    repairType: '',
                    staffId: '',
                    staffName: '',
                    context: '',
                    action: '',
                    repairTypeUsers: []
                };
            },
            _listRepairTypeUsers: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        repairType: $that.forceFinishRepairInfo.repairType,
                        state: '9999'
                    }
                };
                //发送get请求
                vc.http.apiGet('repair.listRepairTypeUsers',
                    param,
                    function (json, res) {
                        var _repairTypeUserManageInfo = JSON.parse(json);
                        vc.component.forceFinishRepairInfo.repairTypeUsers = _repairTypeUserManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);
