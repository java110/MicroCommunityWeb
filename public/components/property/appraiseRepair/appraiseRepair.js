(function (vc) {

    vc.extends({
        data: {
            appraiseRepairInfo: {
                repairId: '',
                repairType: '',
                context: ''
            }
        },
        _initMethod: function () {
            //vc.component._initAppraiseRepairInfo();
        },
        _initEvent: function () {
            vc.on('appraiseRepair', 'openAppraiseRepairModal', function (_repair) {
                $that.appraiseRepairInfo.repairType = _repair.repairType;
                $that.appraiseRepairInfo.repairId = _repair.repairId;
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
                            errInfo: "处理意见不能为空"
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

                            return;
                        }
                        vc.toast(_json.msg);

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
                        repairType: $that.appraiseRepairInfo.repairType
                    }
                };

                //发送get请求
                vc.http.apiGet('repair.listRepairTypeUsers',
                    param,
                    function (json, res) {
                        var _repairTypeUserManageInfo = JSON.parse(json);
                        vc.component.appraiseRepairInfo.repairTypeUsers = _repairTypeUserManageInfo.data;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
