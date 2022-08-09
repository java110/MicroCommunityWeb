(function(vc) {
    vc.extends({
        data: {
            carCreateFeeAddInfo: {
                feeTypeCds: [],
                feeConfigs: [],
                parkingAreas: [],
                locationTypeCd: '',
                locationObjId: '',
                carId: '',
                feeTypeCd: '',
                configId: '',
                carState: ['H', 'S'],
                isMore: false,
                locationTypeCdName: '',
                startTime: '',
                paId: '',
                feeFlag: '',
                endTime: ''
            }
        },
        _initMethod: function() {
            vc.component._initCarCreateFeeAddDateInfo();
            vc.getDict('pay_fee_config', "fee_type_cd", function(_data) {
                vc.component.carCreateFeeAddInfo.feeTypeCds = _data;
            });
            vc.component._loadParkingAreas();
        },
        _initEvent: function() {
            vc.on('carCreateFeeAdd', 'openCarCreateFeeAddModal',
                function(_param) {
                    vc.component.carCreateFeeAddInfo.isMore = _param.isMore;
                    if (!_param.isMore) {
                        vc.component.carCreateFeeAddInfo.locationTypeCd = '2000';
                        vc.component.carCreateFeeAddInfo.locationObjId = _param.car.carId;
                        vc.component.carCreateFeeAddInfo.carId = _param.car.carId;
                        vc.component.carCreateFeeAddInfo.locationTypeCdName = _param.car.carNum;
                    }
                    $('#carCreateFeeAddModel').modal('show');
                });
            vc.on("carCreateFeeAdd", "notify", function(param) {
                $that.carCreateFeeAddInfo.paId = param.paId;
            })
        },
        methods: {
            _initCarCreateFeeAddDateInfo: function() {

                vc.initDate('carCreateFeeStartTime', function(_startTime) {
                    console.log(_startTime)
                    $that.carCreateFeeAddInfo.startTime = _startTime;
                });
                vc.initDate('carCreateFeeEndTime', function(_endTime) {
                    $that.carCreateFeeAddInfo.endTime = _endTime;
                    let start = Date.parse(new Date($that.carCreateFeeAddInfo.startTime))
                    let end = Date.parse(new Date($that.carCreateFeeAddInfo.endTime))
                    if (start - end >= 0) {
                        vc.toast("结束时间必须大于开始时间")
                        $that.carCreateFeeAddInfo.endTime = '';
                    }
                });
                //防止多次点击时间插件失去焦点,这里报错先取消 
                //document.getElementsByClassName('form-control carCreateFeeStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            carCreateFeeAddValidate() {
                return vc.validate.validate({
                    carCreateFeeAddInfo: vc.component.carCreateFeeAddInfo
                }, {
                    'carCreateFeeAddInfo.locationTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "收费范围不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "收费范围格式错误"
                        },
                    ],
                    'carCreateFeeAddInfo.locationObjId': [{
                        limit: "required",
                        param: "",
                        errInfo: "收费对象不能为空"
                    }],
                    'carCreateFeeAddInfo.feeTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用类型不能为空"
                    }],
                    'carCreateFeeAddInfo.configId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用项目不能为空"
                    }],
                    'carCreateFeeAddInfo.carState': [{
                        limit: "required",
                        param: "",
                        errInfo: "出账类型不能为空"
                    }],
                    'carCreateFeeAddInfo.startTime': [{
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
            saveCarCreateFeeInfo: function() {
                vc.component.carCreateFeeAddInfo.communityId = vc.getCurrentCommunity().communityId;
                if (vc.component.carCreateFeeAddInfo.locationTypeCd == '1000') { // 小区ID
                    vc.component.carCreateFeeAddInfo.locationObjId = vc.component.carCreateFeeAddInfo.communityId;
                } else if (vc.component.carCreateFeeAddInfo.locationTypeCd == '2000') {
                    vc.component.carCreateFeeAddInfo.locationObjId = vc.component.carCreateFeeAddInfo.carId;
                } else if (vc.component.carCreateFeeAddInfo.locationTypeCd == '3000') {
                    vc.component.carCreateFeeAddInfo.locationObjId = vc.component.carCreateFeeAddInfo.paId;
                } else {
                    vc.toast("收费范围错误");
                    return;
                }
                if (!vc.component.carCreateFeeAddValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.carCreateFeeAddInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost('fee.saveParkingSpaceCreateFee',
                    JSON.stringify(vc.component.carCreateFeeAddInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        if (res.status == 200) {
                            //关闭model
                            var _json = JSON.parse(json);
                            $('#carCreateFeeAddModel').modal('hide');
                            vc.component.clearAddFeeConfigInfo();
                            vc.emit('listParkingSpaceFee', 'notify', {});
                            vc.emit('simplifyCarFee', 'notify', {});
                            if (_json.hasOwnProperty('code') && _json.code != 0) {
                                vc.toast(_json.msg);
                                return;
                            }
                            vc.toast("创建收费成功，总共[" + _json.totalCar + "]车位，成功[" + _json.successCar + "],失败[" + _json.errorCar + "]", 8000);
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddFeeConfigInfo: function() {
                var _feeTypeCds = vc.component.carCreateFeeAddInfo.feeTypeCds;
                var _parkingAreas = vc.component.carCreateFeeAddInfo.parkingAreas;
                vc.component.carCreateFeeAddInfo = {
                    feeTypeCds: [],
                    feeConfigs: [],
                    parkingAreas: [],
                    locationTypeCd: '',
                    locationObjId: '',
                    psId: '',
                    feeTypeCd: '',
                    configId: '',
                    billType: '',
                    carState: ['H', 'S'],
                    isMore: false,
                    locationTypeCdName: '',
                    startTime: vc.dateTimeFormat(new Date().getTime()),
                    paId: '',
                    feeFlag: '',
                    endTime: ''
                };
                vc.component.carCreateFeeAddInfo.feeTypeCds = _feeTypeCds;
                vc.component.carCreateFeeAddInfo.parkingAreas = _parkingAreas;
            },
            _changeCarFeeTypeCd: function(_feeTypeCd) {
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
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function(json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.carCreateFeeAddInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _loadParkingAreas: function(_feeTypeCd) {
                var param = {
                    params: {
                        page: 1,
                        row: 20,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas', param,
                    function(json, res) {
                        if (res.status == 200) {
                            var _parkingAreaInfo = JSON.parse(json);
                            vc.component.carCreateFeeAddInfo.parkingAreas = _parkingAreaInfo.parkingAreas;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _carCreateFeeAddIfOnceFee(_configId) {
                $that.carCreateFeeAddInfo.endTime = '';
                $that.carCreateFeeAddInfo.feeConfigs.forEach(item => {
                    if (_configId == item.configId) {
                        $that.carCreateFeeAddInfo.feeFlag = item.feeFlag;
                        return;
                    }
                });
            }
        }
    });
})(window.vc);