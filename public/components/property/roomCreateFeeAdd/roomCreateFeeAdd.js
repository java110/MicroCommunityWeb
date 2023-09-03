(function (vc) {
    vc.extends({
        data: {
            roomCreateFeeAddInfo: {
                feeTypeCds: [],
                feeConfigs: [],
                locationTypeCd: '',
                locationObjId: '',
                floorId: '',
                floorNum: '',
                floorName: '',
                unitId: '',
                unitName: '',
                roomId: '',
                feeTypeCd: '',
                configId: '',
                roomState: ['2001'],
                isMore: false,
                locationTypeCdName: '',
                startTime: '',
                roomType: '1010301',
                feeLayer: '全部',
                feeFlag: '',
                endTime: '',
                computingFormula: '',
                amount: '',
                rateCycle: '',
                rate: '',
                rateStartTime: ''
            }
        },
        _initMethod: function () {
            $that._initRoomCreateFeeAddInfo();
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                var _datanew = [];
                _data.forEach((item, index) => {
                    if (item.statusCd != "888800010015" && item.statusCd != "888800010016") {
                        _datanew.push(item);
                    }
                });
                $that.roomCreateFeeAddInfo.feeTypeCds = _datanew;
            });
        },
        _initEvent: function () {
            vc.on('roomCreateFeeAdd', 'openRoomCreateFeeAddModal',
                function (_room) {
                    $that.clearRoomCreateFeeAddData();
                    $that.roomCreateFeeAddInfo.isMore = _room.isMore;
                    let room = _room.room;
                    if (!_room.isMore) {
                        $that.roomCreateFeeAddInfo.locationTypeCd = '5008';
                        $that.roomCreateFeeAddInfo.locationObjId = room.roomId;
                        $that.roomCreateFeeAddInfo.roomState.push('2003');
                        $that.roomCreateFeeAddInfo.roomState.push('2004');
                        $that.roomCreateFeeAddInfo.roomState.push('2005');
                        $that.roomCreateFeeAddInfo.roomState.push('2009');
                        $that.roomCreateFeeAddInfo.locationTypeCdName = room.floorNum + '-' + room.unitNum + '-' + room.roomNum + '(' + room.ownerName + ')';
                        if (room.hasOwnProperty('roomName') && room.roomName) {
                            $that.roomCreateFeeAddInfo.locationTypeCdName = room.roomName;
                        }
                    }
                    if (!_room.isMore && room.roomType == '2020602') {
                        $that.roomCreateFeeAddInfo.roomState.push('2006');
                        $that.roomCreateFeeAddInfo.roomState.push('2007');
                        $that.roomCreateFeeAddInfo.roomState.push('2009');
                        $that.roomCreateFeeAddInfo.locationTypeCdName = room.floorNum + '-' + room.roomNum + '(' + room.ownerName + ')';
                        $that.roomCreateFeeAddInfo.roomType = room.roomType;
                    }
                    $('#roomCreateFeeAddModel').modal('show');
                });
            vc.on("roomCreateFeeAdd", "notify", function (_param) {
                if (_param.hasOwnProperty("floorId")) {
                    $that.roomCreateFeeAddInfo.floorId = _param.floorId;
                }
                if (_param.hasOwnProperty("unitId")) {
                    $that.roomCreateFeeAddInfo.unitId = _param.unitId;
                }
                if (_param.hasOwnProperty("roomId")) {
                    $that.roomCreateFeeAddInfo.roomId = _param.roomId;
                }
            });
        },
        methods: {
            _initRoomCreateFeeAddInfo: function () {
                vc.initDate('addRoomRateStartTime', function (_value) {
                    $that.roomCreateFeeAddInfo.rateStartTime = _value;
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
                        var end = Date.parse(new Date(vc.component.roomCreateFeeAddInfo.endTime));
                        if (!vc.component.roomCreateFeeAddInfo.feeFlag && !vc.component.roomCreateFeeAddInfo.feeTypeCd && start - end >= 0) {
                            vc.toast("计费起始时间必须小于计费终止时间");
                            $(".roomCreateFeeStartTime").val('');
                            vc.component.roomCreateFeeAddInfo.startTime = "";
                        } else {
                            vc.component.roomCreateFeeAddInfo.startTime = value;
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
                        var start = Date.parse(new Date(vc.component.roomCreateFeeAddInfo.startTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间");
                            $(".roomCreateFeeEndTime").val('');
                            vc.component.roomCreateFeeAddInfo.endTime = "";
                        } else {
                            vc.component.roomCreateFeeAddInfo.endTime = value;
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
            },
            roomCreateFeeAddValidate() {
                return vc.validate.validate({
                    roomCreateFeeAddInfo: $that.roomCreateFeeAddInfo
                }, {
                    'roomCreateFeeAddInfo.locationTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "收费范围不能为空"
                    },
                    {
                        limit: "num",
                        param: "",
                        errInfo: "收费范围格式错误"
                    }
                    ],
                    'roomCreateFeeAddInfo.locationObjId': [{
                        limit: "required",
                        param: "",
                        errInfo: "收费对象不能为空"
                    }],
                    'roomCreateFeeAddInfo.feeTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用类型不能为空"
                    }],
                    'roomCreateFeeAddInfo.configId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用项目不能为空"
                    }],
                    'roomCreateFeeAddInfo.roomState': [{
                        limit: "required",
                        param: "",
                        errInfo: "房屋状态不能为空"
                    }],
                    'roomCreateFeeAddInfo.startTime': [{
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
                $that.roomCreateFeeAddInfo.communityId = vc.getCurrentCommunity().communityId;
                if ($that.roomCreateFeeAddInfo.locationTypeCd == '1000') { //大门时直接写 小区ID
                    $that.roomCreateFeeAddInfo.locationObjId = $that.roomCreateFeeAddInfo.communityId;
                } else if ($that.roomCreateFeeAddInfo.locationTypeCd == '2000') {
                    $that.roomCreateFeeAddInfo.locationObjId = $that.roomCreateFeeAddInfo.unitId;
                } else if ($that.roomCreateFeeAddInfo.locationTypeCd == '3000') {
                    $that.roomCreateFeeAddInfo.locationObjId = $that.roomCreateFeeAddInfo.roomId;
                } else if ($that.roomCreateFeeAddInfo.locationTypeCd == '4000') {
                    $that.roomCreateFeeAddInfo.locationObjId = $that.roomCreateFeeAddInfo.floorId;
                } else if ($that.roomCreateFeeAddInfo.locationTypeCd == '5008') {
                } else {
                    vc.toast("收费范围错误");
                    return;
                }
                if (!$that.roomCreateFeeAddValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //1.不是押金 2.不是周期性费用
                if ($that.roomCreateFeeAddInfo.feeTypeCd != '888800010006' && $that.roomCreateFeeAddInfo.feeFlag != '1003006') {
                    if ($that.roomCreateFeeAddInfo.endTime == null || $that.roomCreateFeeAddInfo.endTime == "" || $that.roomCreateFeeAddInfo.endTime == undefined) {
                        vc.toast("计费终止时间不能为空");
                        return;
                    }
                }
                $that.roomCreateFeeAddInfo.communityId = vc.getCurrentCommunity().communityId;
                let _roomCreateFeeAddInfo = JSON.parse(JSON.stringify($that.roomCreateFeeAddInfo));
                if (_roomCreateFeeAddInfo.locationTypeCd == '5008') {
                    _roomCreateFeeAddInfo.locationTypeCd = '3000';
                }
                _roomCreateFeeAddInfo.roomState = _roomCreateFeeAddInfo.roomState.join(',');
                vc.http.apiPost('/fee.saveRoomCreateFee',
                    JSON.stringify(_roomCreateFeeAddInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            var _json = JSON.parse(json);
                            $('#roomCreateFeeAddModel').modal('hide');
                            $that.clearRoomCreateFeeAddData();
                            vc.emit('roomCreateFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});
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
            clearRoomCreateFeeAddData: function () {
                var _feeTypeCds = $that.roomCreateFeeAddInfo.feeTypeCds;

                vc.emit('roomCreateFeeAdd', 'floorSelect2', 'clearFloor', {});
                vc.emit('roomCreateFeeAdd', 'unitSelect2', 'clearUnit', {});
                vc.emit('roomCreateFeeAdd', 'roomSelect2', 'clearRoom', {});

                $that.roomCreateFeeAddInfo = {
                    feeConfigs: [],
                    locationTypeCd: '',
                    locationObjId: '',
                    floorId: '',
                    floorNum: '',
                    floorName: '',
                    unitId: '',
                    unitName: '',
                    roomId: '',
                    feeTypeCd: '',
                    configId: '',
                    billType: '',
                    roomState: ['2001'],
                    roomType: '1010301',
                    isMore: false,
                    locationTypeCdName: '',
                    startTime: '',
                    feeLayer: '全部',
                    feeFlag: '',
                    endTime: '',
                    computingFormula: '',
                    amount: '',
                    rateCycle: '',
                    rate: '',
                    rateStartTime: ''
                };
                $that.roomCreateFeeAddInfo.feeTypeCds = _feeTypeCds;
            },
            _changeFeeTypeCdX: function (_feeTypeCd) {
                // 押金默认开始时间为当前时间，结束时间+1月
                if (_feeTypeCd == '888800010006' || _feeTypeCd == '888800010014') {
                    $that.roomCreateFeeAddInfo.startTime = vc.dateFormat(new Date());
                    $that.roomCreateFeeAddInfo.endTime = vc.addMonthDate(new Date(), 1);
                }
                $that.roomCreateFeeAddInfo.configId = '';
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
                        $that.roomCreateFeeAddInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _createFeeAddChangeRoomType: function () {
                if ($that.roomCreateFeeAddInfo.roomType == '1010301') {
                    $that.roomCreateFeeAddInfo.roomState = ['2001'];
                } else {
                    $that.roomCreateFeeAddInfo.roomState = ['2006'];
                }
            },
            _changeFeeLayer: function () {
                let _feeLayer = $that.roomCreateFeeAddInfo.feeLayer;
                if (_feeLayer == '全部') {
                    $that.roomCreateFeeAddInfo.feeLayer = ''
                } else {
                    $that.roomCreateFeeAddInfo.feeLayer = '全部'
                }
            },
            _roomCreateFeeAddIfOnceFee(_configId) {
                // 当费用类型不是押金/其他类型，并且是周期性费用时， 将结束时间清空
                if ($that.roomCreateFeeAddInfo.feeTypeCd != '888800010006' && $that.roomCreateFeeAddInfo.feeTypeCd != '888800010014' && $that.roomCreateFeeAddInfo.feeFlag == '1003006') {
                    $that.roomCreateFeeAddInfo.endTime = '';
                }
                $that.roomCreateFeeAddInfo.feeConfigs.forEach(item => {
                    if (_configId == item.configId) {
                        $that.roomCreateFeeAddInfo.feeFlag = item.feeFlag;
                        $that.roomCreateFeeAddInfo.computingFormula = item.computingFormula;
                        return;
                    }
                });
            }
        }
    });
})(window.vc);