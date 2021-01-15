(function (vc) {

    vc.extends({
        data: {
            tempImportRoomFeeInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                feeTypeCd: '',
                feeTypeCds: [],
                feeName: '',
                objName: '',
                objId: '',
                amount: '',
                startTime: '',
                endTime: ''
            }
        },
        _initMethod: function () {
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.tempImportRoomFeeInfo.feeTypeCds = _data;
            });
            vc.initDate('tempImportFeeStartTime', function (_startTime) {
                $that.tempImportRoomFeeInfo.startTime = _startTime;
            });
            vc.initDate('tempImportFeeEndTime', function (_endTime) {
                $that.tempImportRoomFeeInfo.endTime = _endTime;
                let start = Date.parse(new Date($that.tempImportRoomFeeInfo.startTime))
                let end = Date.parse(new Date($that.tempImportRoomFeeInfo.endTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.tempImportRoomFeeInfo.endTime = '';
                }
            });
        },
        _initEvent: function () {
            vc.on('tempImportRoomFee', 'openImportRoomFeeModal',
                function (_room) {
                    $that.clearTempImportRoomFeeInfo();
                    $that.tempImportRoomFeeInfo.objId = _room.roomId;
                    $that.tempImportRoomFeeInfo.objName = _room.roomName;
                    $('#tempImportRoomFeeModel').modal('show');

                });
        },
        methods: {

            tempImportRoomFeeValidate() {
                return vc.validate.validate({
                    tempImportRoomFeeInfo: vc.component.tempImportRoomFeeInfo
                },
                    {
                        'tempImportRoomFeeInfo.communityId': [{
                            limit: "required",
                            param: "",
                            errInfo: "数据异常还没有入驻小区"
                        }
                        ],
                        'tempImportRoomFeeInfo.feeTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用类型不能为空"
                        }
                        ],
                        'tempImportRoomFeeInfo.feeName': [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "费用名称不能为空"
                            }
                        ],
                        'tempImportRoomFeeInfo.objId': [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "费用对象不能为空"
                            }
                        ],
                        'tempImportRoomFeeInfo.startTime': [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "开始时间不能为空"
                            },
                            {
                                limit: "date",
                                param: "",
                                errInfo: "开始时间格式错误"
                            },
                        ],
                        'tempImportRoomFeeInfo.endTime': [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "结束时间不能为空"
                            },
                            {
                                limit: "date",
                                param: "",
                                errInfo: "结束时间格式错误"
                            },
                        ],

                        'tempImportRoomFeeInfo.amount': [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "金额不能为空"
                            },
                            {
                                limit: "money",
                                param: "",
                                errInfo: "金额格式错误"
                            },
                        ],
                    });
            },
            clearTempImportRoomFeeInfo: function () {
                var _feeTypeCds = vc.component.tempImportRoomFeeInfo.feeTypeCds;
                vc.component.tempImportRoomFeeInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeTypeCd: '',
                    feeTypeCds: _feeTypeCds,
                    feeName: '',
                    objName: '',
                    objId: '',
                    amount: '',
                    startTime: '',
                    endTime: ''
                };
            },
            _saveTempImportFeeInfo: function () {
                if (!vc.component.tempImportRoomFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.tempImportRoomFeeInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.post(
                    'importRoomFee','importTempData',
                    JSON.stringify(vc.component.tempImportRoomFeeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#tempImportRoomFeeModel').modal('hide');
                            vc.emit('listRoomFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
        }
    });

})(window.vc);