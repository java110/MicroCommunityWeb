(function(vc) {
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
        _initMethod: function() {
            vc.component._initEditFeeDateInfo();
        },
        _initEvent: function() {
            vc.on('editFee', 'openEditFeeModal',
                function(_fee) {
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
            _initEditFeeDateInfo: function() {
                $('.editFeeStartTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editFeeStartTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".editFeeStartTime").val();
                        vc.component.editFeeInfo.startTime = value;
                    });
                $('.editFeeEndTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editFeeEndTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".editFeeEndTime").val();
                        var start = Date.parse(new Date(vc.component.editFeeInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("计费起始时间必须大于建账时间")
                            $(".editFeeEndTime").val('')
                        } else {
                            vc.component.editFeeInfo.endTime = value;
                        }
                    });
                vc.initDate('editRoomRateStartTime', function(_endTime) {
                    $that.editFeeInfo.rateStartTime = _endTime;
                    let start = Date.parse(new Date($that.editFeeInfo.startTime))
                    let end = Date.parse(new Date($that.editFeeInfo.rateStartTime))
                    if (start - end >= 0) {
                        vc.toast("递增开始时间必须大于开始时间")
                        $that.editFeeInfo.rateStartTime = '';
                    }
                });

                vc.initDate('editFeeMaxEndTime', function(_endTime) {
                    $that.editFeeInfo.maxEndTime = _endTime;
                    let start = Date.parse(new Date($that.editFeeInfo.startTime))
                    let end = Date.parse(new Date($that.editFeeInfo.maxEndTime))
                    if (start - end >= 0) {
                        vc.toast("计费结束时间必须大于开始时间")
                        $that.editFeeInfo.maxEndTime = '';
                    }
                });

                //防止多次点击时间插件失去焦点
                document.getElementsByClassName("form-control editFeeStartTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editFeeEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editFeeValidate() {
                return vc.validate.validate({
                    editFeeInfo: vc.component.editFeeInfo
                }, {
                    'editFeeInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "建账时间不能为空"
                    }, ],
                    'editFeeInfo.endTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "计费起始时间不能为空"
                    }, ]
                });
            },
            _doEidtFee: function() {
                if (!vc.component.editFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost('fee.updateFee', JSON.stringify(vc.component.editFeeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editFeeModel').modal('hide');
                            vc.component.clearAddFeeConfigInfo();
                            vc.emit('roomCreateFee', 'notify', {});
                            vc.emit('listParkingSpaceFee', 'notify', {});
                            vc.emit('listContractFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});
                            vc.emit('simplifyCarFee', 'notify', {});
                            vc.emit('simplifyContractFee', 'notify', {});
                            vc.toast("操作成功");
                            return;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddFeeConfigInfo: function() {
                vc.component.editFeeInfo = {
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