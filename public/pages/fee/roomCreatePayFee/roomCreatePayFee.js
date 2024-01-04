(function (vc) {
    vc.extends({
        data: {
            roomCreatePayFeeInfo: {
                feeTypeCds: [],
                feeConfigs: [],
                remark: '',
                floorId: '',
                communityId: vc.getCurrentCommunity().communityId,
                feeTypeCd: '',
                configId: '',
                roomIds: [],
                rooms: [],
                hasTime: 'OFF',
                startTime: '',
                endTime: '',
                feeFlag: '',
                computingFormula: '',
                amount: '',
                rateCycle: '',
                rate: '',
                rateStartTime: '',
                roomState:['2001', '2003', '2005', '2004', '2006', '2007'],
                floors: []
            }
        },
        watch: {
            'roomCreatePayFeeInfo.roomIds': {
                deep: true,
                handler: function () {
                    let checkObj = document.querySelectorAll('.all-check'); // 获取所有checkbox项
                    if ($that.roomCreatePayFeeInfo.roomIds.length < $that.roomCreatePayFeeInfo.rooms.length) {
                        checkObj[0].checked = false;
                    } else {
                        checkObj[0].checked = true;
                    }
                }
            }
        },
        _initMethod: function () {
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                let _datanew = [];
                _data.forEach((item, index) => {
                    if (item.statusCd != "888800010015" && item.statusCd != "888800010016") {
                        _datanew.push(item);
                    }
                });
                $that.roomCreatePayFeeInfo.feeTypeCds = _datanew;
            });
            vc.initDate('roomCreateFeeStartTime', function (_value) {
                $that.roomCreatePayFeeInfo.startTime = _value;
            });
            vc.initDate('roomCreateFeeEndTime', function (_value) {
                $that.roomCreatePayFeeInfo.endTime = _value;
            });
            vc.initDate('addRoomRateStartTime', function (_value) {
                $that.roomCreatePayFeeInfo.rateStartTime = _value;
            });
            $that._loadFloors();
        },
        _initEvent: function () {
            vc.on('roomCreatePayFee', 'notifySelectRooms', function (_selectRooms) {
                let _roomIds = [];
                _selectRooms.forEach(item => {
                    _roomIds.push(item.roomId);
                })
                $that.roomCreatePayFeeInfo.roomIds = _roomIds;
            });
        },
        methods: {
            roomCreatePayFeeValidate() {
                return vc.validate.validate({
                    roomCreatePayFeeInfo: $that.roomCreatePayFeeInfo
                }, {
                    'roomCreatePayFeeInfo.configId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用项不存在"
                    },],
                });
            },
            _saveRoomCreatePayFee: function () {
                if (!$that.roomCreatePayFeeValidate()) {
                    //侦听回传
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                let _roomIds = $that.roomCreatePayFeeInfo.roomIds;
                if (!_roomIds || _roomIds.length < 1) {
                    vc.toast('未包含房屋');
                    return;
                }
                vc.http.apiPost('/fee.roomCreatePayFee',
                    JSON.stringify($that.roomCreatePayFeeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
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
            _changeFeeTypeCdX: function (_feeTypeCd) {
                // 押金默认开始时间为当前时间，结束时间+1月
                if (_feeTypeCd == '888800010006' || _feeTypeCd == '888800010014') {
                    $that.roomCreatePayFeeInfo.startTime = vc.dateFormat(new Date());
                    $that.roomCreatePayFeeInfo.endTime = vc.addMonthDate(new Date(), 1);
                }
                $that.roomCreatePayFeeInfo.configId = '';
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
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.roomCreatePayFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _loadFloors: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                }
                vc.http.apiGet(
                    '/floor.queryFloors',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.roomCreatePayFeeInfo.floors = _json.apiFloorDataVoList;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _loadFloorRooms: function () {
                $that.roomCreatePayFeeInfo.rooms = [];
                $that.roomCreatePayFeeInfo.roomIds = [];
                if (!$that.roomCreatePayFeeInfo.floorId) {
                    return;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        floorId: $that.roomCreatePayFeeInfo.floorId,
                        roomState:$that.roomCreatePayFeeInfo.roomState.join(',')
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        $that.roomCreatePayFeeInfo.rooms = _feeConfigInfo.rooms;
                        if (_feeConfigInfo.rooms && _feeConfigInfo.rooms.length > 0) {
                            _feeConfigInfo.rooms.forEach(_room => {
                                $that.roomCreatePayFeeInfo.roomIds.push(_room.roomId);
                            })
                        }
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _roomCreatePayFeeIfOnceFee(_configId) {
                // 当费用类型不是押金/其他类型，并且是周期性费用时， 将结束时间清空
                if ($that.roomCreatePayFeeInfo.feeTypeCd != '888800010006'
                    && $that.roomCreatePayFeeInfo.feeTypeCd != '888800010014'
                    && $that.roomCreatePayFeeInfo.feeFlag == '1003006') {
                    $that.roomCreatePayFeeInfo.endTime = '';
                }
                $that.roomCreatePayFeeInfo.feeConfigs.forEach(item => {
                    if (_configId == item.configId) {
                        $that.roomCreatePayFeeInfo.feeFlag = item.feeFlag;
                        $that.roomCreatePayFeeInfo.computingFormula = item.computingFormula;
                        return;
                    }
                });
            },
            checkAll: function (e) {
                let checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                $that.roomCreatePayFeeInfo.roomIds = [];
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        $that.roomCreatePayFeeInfo.roomIds.push(checkObj[i].value);
                    }
                }
            }
        }
    });
})(window.vc);