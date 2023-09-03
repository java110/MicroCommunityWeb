(function (vc) {
    vc.extends({
        data: {
            roomsCreateFeeInfo: {
                feeTypeCds: [],
                feeConfigs: [],
                locationTypeCd: '3000',
                locationObjId: '',
                feeTypeCd: '',
                configId: '',
                startTime: '',
                feeFlag: '',
                endTime: '',
                computingFormula: '',
                amount: '',
                rateCycle: '',
                rate: '',
                rateStartTime: '',
                rooms:[],
                ownerId:''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('roomsCreateFee', 'openRoomsCreateFeeModal',
                function (_room) {
                    $that.clearRoomsCreateFeeData();
                    $that.roomsCreateFeeInfo.ownerId = _room.ownerId;
                    $('#roomsCreateFeeModel').modal('show');
                    $that._loadRoomsCreateFeeRooms();
                    $that._initRoomsCreateFeeInfo();
                });
        },
        methods: {
            _initRoomsCreateFeeInfo: function () {
                vc.initDate('addRoomRateStartTime', function (_value) {
                    $that.roomsCreateFeeInfo.rateStartTime = _value;
                })
                $('.roomCreateFeeStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.roomCreateFeeStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".roomCreateFeeStartTime").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date(vc.component.roomsCreateFeeInfo.endTime));
                        if (start - end >= 0) {
                            vc.toast("计费起始时间必须小于计费终止时间");
                            $(".roomCreateFeeStartTime").val('');
                            vc.component.roomsCreateFeeInfo.startTime = "";
                        } else {
                            vc.component.roomsCreateFeeInfo.startTime = value;
                        }
                    });
                $('.roomCreateFeeEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.roomCreateFeeEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".roomCreateFeeEndTime").val();
                        var start = Date.parse(new Date(vc.component.roomsCreateFeeInfo.startTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间");
                            $(".roomCreateFeeEndTime").val('');
                            vc.component.roomsCreateFeeInfo.endTime = "";
                        } else {
                            vc.component.roomsCreateFeeInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control roomCreateFeeStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control roomCreateFeeEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                    var _datanew = [];
                    _data.forEach((item, index) => {
                        if (item.statusCd != "888800010015" && item.statusCd != "888800010016") {
                            _datanew.push(item);
                        }
                    });
                    $that.roomsCreateFeeInfo.feeTypeCds = _datanew;
                });
            },
            roomsCreateFeeValidate() {
                return vc.validate.validate({
                    roomsCreateFeeInfo: $that.roomsCreateFeeInfo
                }, {
                    'roomsCreateFeeInfo.locationObjId': [{
                        limit: "required",
                        param: "",
                        errInfo: "收费对象不能为空"
                    }],
                    'roomsCreateFeeInfo.feeTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用类型不能为空"
                    }],
                    'roomsCreateFeeInfo.configId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用项目不能为空"
                    }],
                    'roomsCreateFeeInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "计费起始时间不能为空"
                    },
                    {
                        limit: "datetime",
                        param: "",
                        errInfo: "计费起始时间格式错误 YYYY-MM-DD hh:mm:ss"
                    }
                    ]
                });
            },
            saveRoomCreateFeeInfo: function () {
                $that.roomsCreateFeeInfo.communityId = vc.getCurrentCommunity().communityId;

                if (!$that.roomsCreateFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //1.不是押金 2.不是周期性费用
                if ($that.roomsCreateFeeInfo.feeTypeCd != '888800010006' && $that.roomsCreateFeeInfo.feeFlag != '1003006') {
                    if (!$that.roomsCreateFeeInfo.endTime) {
                        vc.toast("计费终止时间不能为空");
                        return;
                    }
                }

                vc.http.apiPost('/fee.saveRoomCreateFee',
                    JSON.stringify($that.roomsCreateFeeInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        if (res.status == 200) {
                            //关闭model
                            var _json = JSON.parse(json);
                            $('#roomsCreateFeeModel').modal('hide');
                            $that.clearRoomsCreateFeeData();
                            vc.emit('contractDetailRoomFee', 'notify', {});
                            if (_json.hasOwnProperty('code') && _json.code != 0) {
                                vc.toast(_json.msg);
                                return;
                            }
                            vc.toast("创建收费成功，总共[" + _json.totalRoom + "]房屋，成功[" + _json.successRoom + "],失败[" + _json.errorRoom + "]", 8000);
                            vc.emit('listRoomFee', 'notify', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearRoomsCreateFeeData: function () {
                $that.roomsCreateFeeInfo = {
                    feeTypeCds: [],
                    feeConfigs: [],
                    locationTypeCd: '3000',
                    locationObjId: '',
                    feeTypeCd: '',
                    configId: '',
                    startTime: '',
                    feeFlag: '',
                    endTime: '',
                    computingFormula: '',
                    amount: '',
                    rateCycle: '',
                    rate: '',
                    rateStartTime: '',
                    rooms:[],
                    ownerId:''
                };
            },
            _changeRoomsCreateFeeTypeCd: function (_feeTypeCd) {
                // 押金默认开始时间为当前时间，结束时间+1月
                if (_feeTypeCd == '888800010006' || _feeTypeCd == '888800010014') {
                    $that.roomsCreateFeeInfo.startTime = vc.dateFormat(new Date());
                    $that.roomsCreateFeeInfo.endTime = vc.addMonthDate(new Date(), 1);
                }
                $that.roomsCreateFeeInfo.configId = '';
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
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.roomsCreateFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _roomsCreateFeeIfOnceFee(_configId) {
                // 当费用类型不是押金/其他类型，并且是周期性费用时， 将结束时间清空
                if ($that.roomsCreateFeeInfo.feeTypeCd != '888800010006' && $that.roomsCreateFeeInfo.feeTypeCd != '888800010014' && $that.roomsCreateFeeInfo.feeFlag == '1003006') {
                    $that.roomsCreateFeeInfo.endTime = '';
                }
                $that.roomsCreateFeeInfo.feeConfigs.forEach(item => {
                    if (_configId == item.configId) {
                        $that.roomsCreateFeeInfo.feeFlag = item.feeFlag;
                        $that.roomsCreateFeeInfo.computingFormula = item.computingFormula;
                        return;
                    }
                });
            },
            _loadRoomsCreateFeeRooms:function(){
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId:$that.roomsCreateFeeInfo.ownerId,
                        page:1,
                        row:100
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        $that.roomsCreateFeeInfo.rooms = _roomInfo.rooms;
                 
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);