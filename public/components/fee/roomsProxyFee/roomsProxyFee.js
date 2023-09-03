(function (vc) {
    vc.extends({
        data: {
            roomsProxyFeeInfo: {
                remark: '',
                roomId: '',
                objId: '',
                objName: '',
                feeTypeCd: '',
                feeConfigs: [],
                amount: '',
                consumption: '',
                configId: '',
                ownerName: '',
                objType: '3333',
                startTime: (new Date()),
                endTime: vc.addMonthDate(new Date(), 1),
                ownerId: '',
                rooms: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('roomsProxyFee', 'openRoomsProxyFeeModal', function (_param) {
                $that.clearRoomsProxyFeeInfo();
                $that.roomsProxyFeeInfo.ownerId = _param.ownerId;
                $('#roomsProxyFeeModel').modal('show');

                $that._loadRoomsProxyFeeRooms();
                $that._initRoomsProxyFeeDateInfo();
            });
        },
        methods: {
            _initRoomsProxyFeeDateInfo: function () {
                $('.proxyFeeStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.proxyFeeStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".proxyFeeStartTime").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date($that.roomsProxyFeeInfo.endTime));
                        if (start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间");
                            $(".proxyFeeStartTime").val('');
                            $that.roomsProxyFeeInfo.startTime = "";
                        } else {
                            $that.roomsProxyFeeInfo.startTime = value;
                        }
                    });
                $('.proxyFeeEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.proxyFeeEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".proxyFeeEndTime").val();
                        var start = Date.parse(new Date($that.roomsProxyFeeInfo.startTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间");
                            $(".proxyFeeEndTime").val('');
                            $that.roomsProxyFeeInfo.endTime = "";
                        } else {
                            $that.roomsProxyFeeInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control proxyFeeStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control proxyFeeEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            roomsProxyFeeValidate() {
                return vc.validate.validate({
                    roomsProxyFeeInfo: $that.roomsProxyFeeInfo
                }, {
                    'roomsProxyFeeInfo.amount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "金额不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "金额格式错误，如3.00"
                        }
                    ],
                    'roomsProxyFeeInfo.consumption': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "用量不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "用量格式错误，如3.00"
                        }
                    ],
                    'roomsProxyFeeInfo.objId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋必填"
                        }
                    ],
                    'roomsProxyFeeInfo.configId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用必填"
                        }
                    ],
                    'roomsProxyFeeInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "开始时间格式错误"
                        }
                    ],
                    'roomsProxyFeeInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "结束时间格式错误"
                        }
                    ]
                });
            },
            saveProxyInfo: function () {
                if (!$that.roomsProxyFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.roomsProxyFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/meterWater.saveProxyFee',
                    JSON.stringify($that.roomsProxyFeeInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#roomsProxyFeeModel').modal('hide');
                            $that.clearRoomsProxyFeeInfo();
                            vc.emit('contractDetailRoomFee', 'notify', {});
                            vc.toast("保存成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            _changeProxyFeeConfig: function () {
                $that.roomsProxyFeeInfo.amount = '';
                $that.roomsProxyFeeInfo.consumption = '';
            },
            _changeProxyFeeTypeCd: function (_feeTypeCd) {
                $that.roomsProxyFeeInfo.amount = '';
                $that.roomsProxyFeeInfo.consumption = '';
                let param = {
                    params: {
                        page: 1,
                        row: 20,
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
                        $that.roomsProxyFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            clearRoomsProxyFeeInfo: function () {
                $that.roomsProxyFeeInfo = {
                    amount: '',
                    consumption: '',
                    remark: '',
                    roomId: '',
                    objId: '',
                    objName: '',
                    feeTypeCd: '',
                    feeConfigs: [],
                    configId: '',
                    ownerName: '',
                    objType: '3333',
                    startTime: vc.dateFormat(new Date()),
                    endTime: vc.addMonthDate(new Date(), 1),
                    ownerId: '',
                    rooms: []
                };
            },
            _getConfig: function () {
                let _feeConfigs = $that.roomsProxyFeeInfo.feeConfigs;
                let _config = null;
                _feeConfigs.forEach(item => {
                    if ($that.roomsProxyFeeInfo.configId == item.configId && item.computingFormula == '6006') {
                        _config = item;
                    }
                });
                return _config;
            },
            _changeAmount: function () {
                let _config = $that._getConfig();
                let _amount = $that.roomsProxyFeeInfo.amount;
                if (_config == null) {
                    vc.toast('未选择收费项目或者收费项目公式错误(用量*单价+附加费)');
                    $that.roomsProxyFeeInfo.amount = '';
                    $that.roomsProxyFeeInfo.consumption = '';
                    return;
                }
                if (_amount < _config.additionalAmount) {
                    vc.toast('输入金额太小');
                    $that.roomsProxyFeeInfo.amount = '';
                    $that.roomsProxyFeeInfo.consumption = '';
                    return;
                }
                let _consumption = (_amount - _config.additionalAmount) / _config.squarePrice;
                $that.roomsProxyFeeInfo.consumption = _consumption.toFixed(2);
            },
            _changeConsumption: function () {
                let _config = $that._getConfig();
                let _consumption = $that.roomsProxyFeeInfo.consumption;
                if (_config == null) {
                    vc.toast('未选择收费项目或者收费项目公式错误(用量*单价+附加费)');
                    $that.roomsProxyFeeInfo.amount = '';
                    $that.roomsProxyFeeInfo.consumption = '';
                    return;
                }
                let _amount = _config.squarePrice * _consumption + parseFloat(_config.additionalAmount);
                $that.roomsProxyFeeInfo.amount = _amount.toFixed(2);
            },
            _loadRoomsProxyFeeRooms: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.roomsProxyFeeInfo.ownerId,
                        page: 1,
                        row: 100
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        $that.roomsProxyFeeInfo.rooms = _roomInfo.rooms;

                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);