(function(vc) {

    vc.extends({
        data: {
            tempImportRoomFeeInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                feeTypeCd: '',
                objType: '',
                feeTypeCds: [],
                feeName: '',
                objName: '',
                objId: '',
                amount: '',
                startTime: vc.dateFormat(new Date()),
                endTime: vc.addMonthDate(new Date(), 1),
                feeConfigs: [],
                feeNameFlag: 'S'
            }
        },
        _initMethod: function() {
            vc.getDict('pay_fee_config', "fee_type_cd", function(_data) {
                vc.component.tempImportRoomFeeInfo.feeTypeCds = _data;
            });
            vc.initDate('tempImportFeeStartTime', function(_startTime) {
                $that.tempImportRoomFeeInfo.startTime = _startTime;
            });
            vc.initDate('tempImportFeeEndTime', function(_endTime) {
                $that.tempImportRoomFeeInfo.endTime = _endTime;
                let start = Date.parse(new Date($that.tempImportRoomFeeInfo.startTime))
                let end = Date.parse(new Date($that.tempImportRoomFeeInfo.endTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.tempImportRoomFeeInfo.endTime = '';
                }
            });
        },
        _initEvent: function() {
            vc.on('tempImportRoomFee', 'openImportRoomFeeModal',
                function(_room) {
                    $that.clearTempImportRoomFeeInfo();
                    $that.tempImportRoomFeeInfo.objId = _room.roomId;
                    $that.tempImportRoomFeeInfo.objName = _room.roomName;
                    $that.tempImportRoomFeeInfo.objType = _room.objType;
                    $('#tempImportRoomFeeModel').modal('show');

                });
        },
        methods: {

            tempImportRoomFeeValidate() {
                return vc.validate.validate({
                    tempImportRoomFeeInfo: vc.component.tempImportRoomFeeInfo
                }, {
                    'tempImportRoomFeeInfo.communityId': [{
                        limit: "required",
                        param: "",
                        errInfo: "数据异常还没有入驻小区"
                    }],
                    'tempImportRoomFeeInfo.feeTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用类型不能为空"
                    }],
                    'tempImportRoomFeeInfo.feeName': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用名称不能为空"
                    }],
                    'tempImportRoomFeeInfo.objId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用对象不能为空"
                    }],
                    'tempImportRoomFeeInfo.startTime': [{
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
                    'tempImportRoomFeeInfo.endTime': [{
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

                    'tempImportRoomFeeInfo.amount': [{
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
            clearTempImportRoomFeeInfo: function() {
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
                    endTime: '',
                    startTime: vc.dateFormat(new Date()),
                    endTime: vc.addMonthDate(new Date(), 1),
                    feeNameFlag: 'S',
                    feeConfigs: []
                };
            },
            _saveTempImportFeeInfo: function() {
                if (!vc.component.tempImportRoomFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.tempImportRoomFeeInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.post(
                    'importRoomFee', 'importTempData',
                    JSON.stringify(vc.component.tempImportRoomFeeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#tempImportRoomFeeModel').modal('hide');
                            vc.emit('roomCreateFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});
                            vc.emit('listContractFee', 'notify', {});
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            _changeFeeTypeCd: function(_feeTypeCd) {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: _feeTypeCd,
                        isDefault: 'F',
                        valid: '1'
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFeeAdd', 'list', param,
                    function(json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.tempImportRoomFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _inputFeeName: function() {
                let _feeNameFlag = vc.component.tempImportRoomFeeInfo.feeNameFlag;

                if (_feeNameFlag != 'S') {
                    vc.component.tempImportRoomFeeInfo.feeNameFlag = 'S';
                } else {
                    vc.component.tempImportRoomFeeInfo.feeNameFlag = 'I';
                }
            }
        }
    });

})(window.vc);