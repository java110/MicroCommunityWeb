(function (vc, vm) {
    vc.extends({
        data: {
            returnFeeDetailInfo: {
                detailId: '',
                cycles: '',
                receivableAmount: '',
                receivedAmount: '',
                primeRate: '',
                remark: '',
                payTime: '',
                reason: '',
                communityId: vc.getCurrentCommunity().communityId,
                feeId: '',
                feeTypeCd: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('returnPayFee', 'openReturnPayFeeModel', function (_params) {
                vc.component.refreshFeeDetailInfo();
                vc.component.pushReturnFeeDetailInfo(_params);
                $('#returnPayFeeModel').modal('show');
            });
        },
        methods: {
            refreshFeeDetailInfo: function () {
                vc.component.returnFeeDetailInfo = {
                    detailId: '',
                    cycles: '',
                    receivableAmount: '',
                    receivedAmount: '',
                    primeRate: '',
                    remark: '',
                    payTime: '',
                    reason: '',
                    communityId: '',
                    feeId: '',
                    feeTypeCd: '',
                    configId: ''
                }
            },
            pushReturnFeeDetailInfo: function (_params) {
                vc.component.returnFeeDetailInfo.communityId = _params.communityId;
                vc.component.returnFeeDetailInfo.payTime = _params.createTime;
                vc.component.returnFeeDetailInfo.detailId = _params.detailId;
                vc.component.returnFeeDetailInfo.cycles = _params.cycles;
                vc.component.returnFeeDetailInfo.receivableAmount = _params.receivableAmount;
                vc.component.returnFeeDetailInfo.receivedAmount = _params.receivedAmount;
                vc.component.returnFeeDetailInfo.primeRate = _params.primeRate;
                vc.component.returnFeeDetailInfo.feeId = _params.mainFeeInfo.feeId;
                vc.component.returnFeeDetailInfo.feeTypeCd = _params.mainFeeInfo.feeTypeCd;
                vc.component.returnFeeDetailInfo.remark = _params.remark;
                vc.component.returnFeeDetailInfo.configId = _params.mainFeeInfo.configId;
            },
            returnPayFeeValidate: function () {
                return vc.validate.validate({
                    returnFeeDetailInfo: vc.component.returnFeeDetailInfo
                }, {
                    'returnFeeDetailInfo.reason': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "退费原因不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,200",
                            errInfo: "退费原因不能超过200位"
                        },
                    ]
                });
            },
            submitReturnPayFee: function () {
                if (!vc.component.returnPayFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'returnPayFee.saveReturnPayFee',
                    JSON.stringify(vc.component.returnFeeDetailInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            $('#returnPayFeeModel').modal('hide');
                            vc.emit('propertyFee', 'listParkingSpaceData', vc.component.returnFeeDetailInfo);
                            vc.component.refreshFeeDetailInfo();
                            return;
                        }
                        vc.toast(json);

                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc, window.vc.component);
