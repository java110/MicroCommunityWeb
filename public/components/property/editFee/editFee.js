(function (vc) {

    vc.extends({
        data: {
            editFeeInfo: {
                feeId: '',
                startTime: '',
                endTime: ''
            }
        },
        _initMethod: function () {
            vc.component._initEditFeeDateInfo();

        },
        _initEvent: function () {
            vc.on('editFee', 'openEditFeeModal',
                function (_fee) {
                    vc.copyObject(_fee, $that.editFeeInfo);
                    if (_fee.startTime.indexOf(":") == -1) {
                        $that.editFeeInfo.startTime = $that.editFeeInfo.startTime + " 00:00:00";
                    }
                    if (_fee.endTime.indexOf(":") == -1) {
                        $that.editFeeInfo.endTime = $that.editFeeInfo.endTime + " 00:00:00";
                    }
                    $('#editFeeModel').modal('show');
                });
        },
        methods: {
            _initEditFeeDateInfo: function () {
                $('.editFeeStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true

                });
                $('.editFeeStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editFeeStartTime").val();
                        vc.component.editFeeInfo.startTime = value;
                    });
                $('.editFeeEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editFeeEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
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
            },
            editFeeValidate() {
                return vc.validate.validate({
                    editFeeInfo: vc.component.editFeeInfo
                },
                    {
                        'editFeeInfo.startTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "建账时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "建账时间不是有效的时间格式"
                        },
                        ],
                        'editFeeInfo.endTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "计费起始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "计费起始时间不是有效的时间格式"
                        },
                        ]

                    });
            },
            _doEidtFee: function () {

                if (!vc.component.editFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editFeeInfo.communityId = vc.getCurrentCommunity().communityId;


                vc.http.apiPost('fee.updateFee', JSON.stringify(vc.component.editFeeInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editFeeModel').modal('hide');
                            vc.component.clearAddFeeConfigInfo();
                            vc.emit('listRoomFee', 'notify', {});
                            vc.emit('listParkingSpaceFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});

                            return;
                        }
                        vc.toast(json);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddFeeConfigInfo: function () {
                vc.component.editFeeInfo = {
                    feeId: '',
                    startTime: '',
                    endTime: ''
                };
            }
        }
    });

})(window.vc);