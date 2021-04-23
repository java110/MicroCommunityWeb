(function (vc) {

    vc.extends({
        data: {
            finishRepairInfo: {
                repairId: '',
                repairType: '',
                context: '',
                feeFlag: '200',
                amount: 0.0,
                repairObjType:''
            }
        },
        _initMethod: function () {
            //vc.component._initFinishRepairInfo();
        },
        _initEvent: function () {
            vc.on('finishRepair', 'openFinishRepairModal', function (_repair) {
                $that.finishRepairInfo.repairType = _repair.repairType;
                $that.finishRepairInfo.repairId = _repair.repairId;
                $that.finishRepairInfo.repairObjType = _repair.repairObjType;
                $('#finishRepairModel').modal('show');
            });
        },
        methods: {
            finishRepairValidate() {
                return vc.validate.validate({
                    finishRepairInfo: vc.component.finishRepairInfo
                }, {
                    'finishRepairInfo.repairId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修单不能为空"
                        }
                    ],
                    'finishRepairInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "处理意见不能为空"
                        }
                    ]
                });
            },
            _finishRepairInfo: function () {


                if (!vc.component.finishRepairValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                vc.component.finishRepairInfo.communityId = vc.getCurrentCommunity().communityId;



                vc.http.apiPost(
                    'ownerRepair.repairFinish',
                    JSON.stringify(vc.component.finishRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#finishRepairModel').modal('hide');
                            vc.component.clearFinishRepairInfo();
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
            clearFinishRepairInfo: function () {
                vc.component.finishRepairInfo = {
                    repairId: '',
                    repairType: '',
                    context: '',
                    feeFlag: '200',
                    amount: 0.0
                };
            }
            
        }
    });

})(window.vc);
