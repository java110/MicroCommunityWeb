(function (vc) {

    vc.extends({
        data: {
            dispatchRepairInfo: {
                repairId: '',
                repairType: '',
                staffId: '',
                staffName: '',
                context: '',
                repairTypeUsers: []
            }
        },
        _initMethod: function () {
            //vc.component._initDispatchRepairInfo();
        },
        _initEvent: function () {
            vc.on('dispatchRepair', 'openDispatchRepairModal', function (_repair) {
                $that.dispatchRepairInfo.repairType = _repair.repairType;
                $that.dispatchRepairInfo.repairId = _repair.repairId;
                $that._listRepairTypeUsers()
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
            dispatchRepairInfo: function () {
                if (!vc.component.dispatchRepairValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                vc.component.dispatchRepairInfo.communityId = vc.getCurrentCommunity().communityId;

                $that.dispatchRepairInfo.repairTypeUsers.forEach(item => {
                    if(item.staffId == $that.dispatchRepairInfo.staffId){
                        $that.dispatchRepairInfo.staffName = item.staffName;
                    }
                });


                vc.http.apiPost(
                    'ownerRepair.repairDispatch',
                    JSON.stringify(vc.component.dispatchRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#dispatchRepairModel').modal('hide');
                            vc.component.clearDispatchRepairInfo();
                            vc.emit('repairPoolManage', 'listRepairPool', {});

                            return;
                        }
                        vc.toast(json);

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
                    repairTypeUsers: []
                };
            },
            _listRepairTypeUsers: function () {

                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        repairType: $that.dispatchRepairInfo.repairType
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
