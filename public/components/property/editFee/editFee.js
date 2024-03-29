(function (vc) {
    vc.extends({
        data: {
            editFeeInfo: {
                feeId: '',
                startTime: '',
                endTime: '',
                feeFlag: '',
                maxEndTime: '',
                computingFormula: '',
                rateCycle: '',
                rate: '',
                rateStartTime: ''
            }
        },
        _initMethod: function () {
            $that._initEditFeeDateInfo();
        },
        _initEvent: function () {
            vc.on('editFee', 'openEditFeeModal',
                function (_fee) {
                    $that.clearAddFeeConfigInfo();
                    vc.copyObject(_fee, $that.editFeeInfo);
                    if (_fee.startTime.indexOf(":") == -1) {
                        $that.editFeeInfo.startTime = $that.editFeeInfo.startTime + " 00:00:00";
                    }
                    /*if (_fee.endTime.indexOf(":") == -1) {
                        $that.editFeeInfo.endTime = $that.editFeeInfo.endTime;
                    }*/
                    $that.editFeeInfo.endTime = _fee.endTime.split(' ')[0];
                    $('#editFeeModel').modal('show');
                });
        },
        methods: {
            _initEditFeeDateInfo: function () {

                vc.initDate('editFeeStartTime',function(_value){
                    let start = Date.parse(new Date(_value));
                    let end = Date.parse(new Date($that.editFeeInfo.endTime));
                    if (start - end >= 0) {
                        vc.toast("建账时间必须小于计费起始时间");
                        $(".editFeeStartTime").val('');
                        $that.editFeeInfo.startTime = "";
                    } else {
                        $that.editFeeInfo.startTime = _value;
                    }
                });
                vc.initDate('editFeeEndTime',function(_value){
                    let start = Date.parse(new Date($that.editFeeInfo.startTime))
                    let end = Date.parse(new Date(_value))
                    if (start - end >= 0) {
                        vc.toast("计费起始时间必须大于建账时间");
                        $(".editFeeEndTime").val('');
                        $that.editFeeInfo.endTime = "";
                    } else {
                        $that.editFeeInfo.endTime = _value;
                    }
                })
                vc.initDate('editRoomRateStartTime', function (_endTime) {
                    $that.editFeeInfo.rateStartTime = _endTime;
                    let start = Date.parse(new Date($that.editFeeInfo.startTime))
                    let end = Date.parse(new Date($that.editFeeInfo.rateStartTime))
                    if (start - end >= 0) {
                        vc.toast("递增开始时间必须大于开始时间")
                        $that.editFeeInfo.rateStartTime = '';
                    }
                });
                vc.initDate('editFeeMaxEndTime', function (_maxEndTime) {
                    $that.editFeeInfo.maxEndTime = _maxEndTime;
                    let start = Date.parse(new Date($that.editFeeInfo.startTime))
                    let end = Date.parse(new Date($that.editFeeInfo.maxEndTime))
                    if (start - end >= 0) {
                        vc.toast("计费结束时间必须大于开始时间")
                        $that.editFeeInfo.maxEndTime = '';
                    }
                });
            },
            editFeeValidate() {
                return vc.validate.validate({
                    editFeeInfo: $that.editFeeInfo
                }, {
                    'editFeeInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "建账时间不能为空"
                    }],
                    'editFeeInfo.endTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "计费起始时间不能为空"
                    }]
                });
            },
            _doEidtFee: function () {
                if (!$that.editFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.editFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost('fee.updateFee', JSON.stringify($that.editFeeInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editFeeModel').modal('hide');
                            $that.clearAddFeeConfigInfo();
                            vc.emit('roomCreateFee', 'notify', {});
                            vc.emit('listParkingSpaceFee', 'notify', {});
                            vc.emit('listContractFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});
                            vc.emit('simplifyCarFee', 'notify', {});
                            vc.emit('simplifyContractFee', 'notify', {});
                            vc.emit('carDetailFee', 'notify', {});
                            vc.emit('contractDetailRoomFee', 'notify', {});
                            vc.emit('ownerDetailRoomFee', 'notify', {});
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
            clearAddFeeConfigInfo: function () {
                $that.editFeeInfo = {
                    feeId: '',
                    startTime: '',
                    endTime: '',
                    feeFlag: '',
                    maxEndTime: '',
                    computingFormula: '',
                    rateCycle: '',
                    rate: '',
                    rateStartTime: ''
                };
            }
        }
    });
})(window.vc);