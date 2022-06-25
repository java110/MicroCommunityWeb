(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addProxyFeeInfo: {
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
                startTime: vc.dateFormat(new Date()),
                endTime: vc.addMonthDate(new Date(), 1)
            }
        },
        _initMethod: function () {
            vc.initDate('proxyFeeStartTime', function (_startTime) {
                $that.addProxyFeeInfo.startTime = _startTime;
            });
            vc.initDate('proxyFeeEndTime', function (_endTime) {
                $that.addProxyFeeInfo.endTime = _endTime;
                let start = Date.parse(new Date($that.addProxyFeeInfo.startTime))
                let end = Date.parse(new Date($that.addProxyFeeInfo.endTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.addProxyFeeInfo.endTime = '';
                }
            });
        },
        _initEvent: function () {
            vc.on('addProxyFee', 'openAddProxyFeeModal', function (_param) {
                if (_param.hasOwnProperty("objType")) {
                    $that.addProxyFeeInfo.objType = _param.objType;
                }
                $that.addProxyFeeInfo.roomId = _param.roomId;
                $that.addProxyFeeInfo.objId = _param.roomId;
                $that.addProxyFeeInfo.objName = _param.roomName;
                $that.addProxyFeeInfo.ownerName = _param.roomName + '(' + _param.ownerName + ')';
                $('#addProxyFeeModel').modal('show');
            });
        },
        methods: {
            addProxyFeeValidate() {
                return vc.validate.validate({
                    addProxyFeeInfo: vc.component.addProxyFeeInfo
                }, {
                    'addProxyFeeInfo.amount': [{
                        limit: "required",
                        param: "",
                        errInfo: "金额不能为空"
                    },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "金额格式错误，如3.00"
                        },
                    ],
                    'addProxyFeeInfo.consumption': [{
                        limit: "required",
                        param: "",
                        errInfo: "用量不能为空"
                    },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "用量格式错误，如3.00"
                        },
                    ],
                    'addProxyFeeInfo.objId': [{
                        limit: "required",
                        param: "",
                        errInfo: "房屋必填"
                    }],
                    'addProxyFeeInfo.configId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用必填"
                    }],
                    'addProxyFeeInfo.startTime': [{
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
                    'addProxyFeeInfo.endTime': [{
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
                });
            },
            saveProxyInfo: function () {
                if (!vc.component.addProxyFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addProxyFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addProxyFeeInfo);
                    $('#addProxyFeeModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    'meterWater.saveProxyFee',
                    JSON.stringify(vc.component.addProxyFeeInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addProxyFeeModel').modal('hide');
                            vc.component.clearAddProxyFeeInfo();
                            vc.emit('listRoomFee', 'notify', {});
                            vc.emit('listParkingSpaceFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});
                            vc.toast(_json.msg);
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            _changeProxyFeeConfig: function () {
                $that.addProxyFeeInfo.amount = '';
                $that.addProxyFeeInfo.consumption = '';
            },
            _changeProxyFeeTypeCd: function (_feeTypeCd) {
                $that.addProxyFeeInfo.amount = '';
                $that.addProxyFeeInfo.consumption = '';
                var param = {
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
                vc.http.get('roomCreateFeeAdd', 'list', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.addProxyFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            clearAddProxyFeeInfo: function () {
                vc.component.addProxyFeeInfo = {
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
                    endTime: vc.addMonthDate(new Date(), 1)
                };
            },
            _getConfig: function () {
                let _feeConfigs = $that.addProxyFeeInfo.feeConfigs;
                let _config = null;
                _feeConfigs.forEach(item => {
                    if ($that.addProxyFeeInfo.configId == item.configId && item.computingFormula == '6006') {
                        _config = item;
                    }
                });
                return _config;
            },
            _changeAmount: function () {
                let _config = $that._getConfig();
                let _amount = $that.addProxyFeeInfo.amount;
                if (_config == null) {
                    vc.toast('未选择收费项目或者收费项目公式错误(用量*单价+附加费)');
                    $that.addProxyFeeInfo.amount = '';
                    $that.addProxyFeeInfo.consumption = '';
                    return;
                }
                if (_amount < _config.additionalAmount) {
                    vc.toast('输入金额太小');
                    $that.addProxyFeeInfo.amount = '';
                    $that.addProxyFeeInfo.consumption = '';
                    return;
                }
                let _consumption = (_amount - _config.additionalAmount) / _config.squarePrice;
                $that.addProxyFeeInfo.consumption = _consumption.toFixed(2);
            },
            _changeConsumption: function () {
                let _config = $that._getConfig();
                let _consumption = $that.addProxyFeeInfo.consumption;
                if (_config == null) {
                    vc.toast('未选择收费项目或者收费项目公式错误(用量*单价+附加费)');
                    $that.addProxyFeeInfo.amount = '';
                    $that.addProxyFeeInfo.consumption = '';
                    return;
                }
                let _amount = _config.squarePrice * _consumption + parseFloat(_config.additionalAmount);
                console.log('_consumption', _consumption, _amount);
                $that.addProxyFeeInfo.amount = _amount.toFixed(2);
            }
        }
    });
})(window.vc);