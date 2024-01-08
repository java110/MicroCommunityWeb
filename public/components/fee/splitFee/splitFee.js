(function (vc) {
    vc.extends({
        data: {
            splitFeeInfo: {
                feeId: '',
                splitTime: '',
                remark:'',
                endTime:'',
                deadlineTime:'',
            }
        },
        _initMethod: function () {
            vc.initDate('splitFeeTime', function (_value) {
                $that.splitFeeInfo.splitTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('splitFee', 'openSplitFeeModal',
                function (_fee) {
                    $that.splitFeeInfo.feeId = _fee.feeId;
                    $that.splitFeeInfo.endTime = vc.dateFormat(_fee.endTime);
                    $that.splitFeeInfo.deadlineTime = $that._computeSplitDeadLineTime(_fee);
                    $that.splitFeeInfo.splitTime = '';
                    $that.splitFeeInfo.remark = '';
                    $('#splitFeeModel').modal('show');
                });
        },
        methods: {
            _doSplitFee: function () {
                if (!$that.splitFeeInfo.splitTime) {
                    vc.toast("请选择拆分时间");
                    return;
                }
                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    preFeeId: $that.splitFeeInfo.feeId,
                    splitTime: $that.splitFeeInfo.splitTime,
                    remark:$that.splitFeeInfo.remark,
                }
                vc.http.apiPost('/feeSub.splitPayFee',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#splitFeeModel').modal('hide');
                            vc.emit('roomCreateFee', 'notify', {});
                            vc.emit('listParkingSpaceFee', 'notify', {});

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
            _computeSplitDeadLineTime: function (_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            }
        }
    });
})(window.vc);