(function (vc) {
    vc.extends({
        data: {
            dispatchRepairInfo: {
                repairId: '',
                repairType: '',
                staffId: '',
                staffName: '',
                context: '',
                action: '',
                repairTypeUsers: [],
                currentUserId: vc.getData('/nav/getUserInfo').userId,
            }
        },
        _initMethod: function () {
            //vc.component._initDispatchRepairInfo();
        },
        _initEvent: function () {
            vc.on('dispatchRepair', 'openDispatchRepairModal', function (_repair) {
                $that.dispatchRepairInfo.repairType = _repair.repairType;
                $that.dispatchRepairInfo.repairId = _repair.repairId;
                $that.dispatchRepairInfo.action = _repair.action;
                $that._listRepairTypeUsers();
                if (_repair.hasOwnProperty('action') && _repair.action == 'BACK') {
                    $that.dispatchRepairInfo.staffId = _repair.preStaffId;
                    $that.dispatchRepairInfo.staffName = _repair.preStaffName;
                }
                $('#dispatchRepairModel').modal('show');
            });
        },
        methods: {
            dispatchRepairValidate() {
                return vc.validate.validate({
                    dispatchRepairInfo: vc.component.dispatchRepairInfo
                }, {
                    'dispatchRepairInfo.repairId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修单不能为空"
                        }
                    ],
                    'dispatchRepairInfo.staffId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修师傅不能为空"
                        }
                    ],
                    'dispatchRepairInfo.staffName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修师傅不能为空"
                        }
                    ],
                    'dispatchRepairInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "处理意见不能为空"
                        }
                    ]
                });
            },
            _dispatchRepairInfo: function () {
                $that.dispatchRepairInfo.repairTypeUsers.forEach(item => {
                    if (item.staffId == $that.dispatchRepairInfo.staffId) {
                        $that.dispatchRepairInfo.staffName = item.staffName;
                    }
                });
                if (!vc.component.dispatchRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.dispatchRepairInfo.action == "TRANSFER" && vc.component.dispatchRepairInfo.currentUserId == vc.component.dispatchRepairInfo.staffId){
                    vc.toast("不能转单给自己");
                    return;
                }
                vc.component.dispatchRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'ownerRepair.repairDispatch',
                    JSON.stringify(vc.component.dispatchRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#dispatchRepairModel').modal('hide');
                            vc.component.clearDispatchRepairInfo();
                            vc.emit('repairPoolManage', 'listRepairPool', {});
                            vc.emit('repairDispatchManage', 'listOwnerRepair', {});
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
                vc.component.dispatchRepairInfo = {
                    repairId: '',
                    repairType: '',
                    staffId: '',
                    staffName: '',
                    context: '',
                    action: '',
                    repairTypeUsers: [],
                    currentUserId: vc.getData('/nav/getUserInfo').userId,
                };
            },
            _listRepairTypeUsers: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        repairType: $that.dispatchRepairInfo.repairType,
                        state: '9999'
                    }
                };
                //发送get请求
                vc.http.apiGet('repair.listRepairTypeUsers',
                    param,
                    function (json, res) {
                        var _repairTypeUserManageInfo = JSON.parse(json);
                        vc.component.dispatchRepairInfo.repairTypeUsers = _repairTypeUserManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);
