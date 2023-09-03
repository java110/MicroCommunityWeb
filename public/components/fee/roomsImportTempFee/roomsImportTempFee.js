(function(vc) {
    vc.extends({
        data: {
            roomsImportTempFeeInfo: {
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
                feeNameFlag: 'S',
                ownerId:'',
                rooms:[]
            }
        },
        _initMethod: function() {
           
        },
        _initEvent: function() {
            vc.on('roomsImportTempFee', 'openImportRoomFeeModal',
                function(_room) {
                    $that.clearRoomsImportTempFeeInfo();
                    $that.roomsImportTempFeeInfo.ownerId = _room.ownerId;
                    $('#roomsImportTempFeeModel').modal('show');

                    $that._initRoomsImportTempFee();
                    $that._loadRoomsImportTempFeeOwnerRooms();

                });
        },
        methods: {
            _initRoomsImportTempFee:function(){
                vc.getDict('pay_fee_config', "fee_type_cd", function(_data) {
                    vc.component.roomsImportTempFeeInfo.feeTypeCds = _data;
                });
                vc.initDate('tempImportFeeStartTime', function(_startTime) {
                    $that.roomsImportTempFeeInfo.startTime = _startTime;
                });
                vc.initDate('tempImportFeeEndTime', function(_endTime) {
                    $that.roomsImportTempFeeInfo.endTime = _endTime;
                    let start = Date.parse(new Date($that.roomsImportTempFeeInfo.startTime))
                    let end = Date.parse(new Date($that.roomsImportTempFeeInfo.endTime))
                    if (start - end >= 0) {
                        vc.toast("结束时间必须大于开始时间")
                        $that.roomsImportTempFeeInfo.endTime = '';
                    }
                });
            },
            roomsImportTempFeeValidate() {
                return vc.validate.validate({
                    roomsImportTempFeeInfo: vc.component.roomsImportTempFeeInfo
                }, {
                    'roomsImportTempFeeInfo.communityId': [{
                        limit: "required",
                        param: "",
                        errInfo: "数据异常还没有入驻小区"
                    }],
                    'roomsImportTempFeeInfo.feeTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用类型不能为空"
                    }],
                    'roomsImportTempFeeInfo.feeName': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用名称不能为空"
                    }],
                    'roomsImportTempFeeInfo.objId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用对象不能为空"
                    }],
                    'roomsImportTempFeeInfo.startTime': [{
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
                    'roomsImportTempFeeInfo.endTime': [{
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
                    'roomsImportTempFeeInfo.amount': [{
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
            clearRoomsImportTempFeeInfo: function() {
                var _feeTypeCds = vc.component.roomsImportTempFeeInfo.feeTypeCds;
                vc.component.roomsImportTempFeeInfo = {
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
                    feeConfigs: [],
                    ownerId:'',
                    rooms:[]
                };
            },
            _saveTempImportFeeInfo: function() {
                if (!vc.component.roomsImportTempFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.roomsImportTempFeeInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.post(
                    'importRoomFee', 'importTempData',
                    JSON.stringify(vc.component.roomsImportTempFeeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#roomsImportTempFeeModel').modal('hide');
                            vc.emit('contractDetailRoomFee', 'notify', {});
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
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
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function(json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.roomsImportTempFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _inputFeeName: function() {
                let _feeNameFlag = vc.component.roomsImportTempFeeInfo.feeNameFlag;
                if (_feeNameFlag != 'S') {
                    vc.component.roomsImportTempFeeInfo.feeNameFlag = 'S';
                } else {
                    vc.component.roomsImportTempFeeInfo.feeNameFlag = 'I';
                }
            },
            _loadRoomsImportTempFeeOwnerRooms:function(){
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId:$that.roomsImportTempFeeInfo.ownerId,
                        page:1,
                        row:100
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        $that.roomsImportTempFeeInfo.rooms = _roomInfo.rooms;
                 
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });

})(window.vc);