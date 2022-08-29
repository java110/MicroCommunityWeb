(function(vc, vm) {

    vc.extends({
        data: {
            parkingAreaControlCustomCarInoutInfo: {
                carNum: '',
                amount: '',
                remark: '',
                type: '1101',
                payCharge: '',
                costMin: '0',
                machineId: '',
                boxId: '',
                payType: '',
                payTypes: [],
                inoutId: ''
            }
        },
        _initMethod: function() {
            vc.getDict('car_inout_payment', 'pay_type', function(_data) {
                $that.parkingAreaControlCustomCarInoutInfo.payTypes = _data;
            })
        },
        _initEvent: function() {
            vc.on('parkingAreaControlCustomCarInout', 'open', function(_params) {
                vc.component.refreshParkingAreaControlCustomCarInoutInfo();
                $('#parkingAreaControlCustomCarInoutModel').modal('show');
                // = _params;
                vc.copyObject(_params, vc.component.parkingAreaControlCustomCarInoutInfo);
                vc.component.parkingAreaControlCustomCarInoutInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            parkingAreaControlCustomCarInoutValidate: function() {
                return vc.validate.validate({
                    parkingAreaControlCustomCarInoutInfo: vc.component.parkingAreaControlCustomCarInoutInfo
                }, {
                    'parkingAreaControlCustomCarInoutInfo.carNum': [{
                        limit: "required",
                        param: "",
                        errInfo: "车牌号不能为空"
                    }]
                });
            },
            parkingAreaControlCustomCarInout: function() {
                if (!vc.component.parkingAreaControlCustomCarInoutValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/machine.customCarInOutCmd',
                    JSON.stringify(vc.component.parkingAreaControlCustomCarInoutInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _data = JSON.parse(json);
                        $('#parkingAreaControlCustomCarInoutModel').modal('hide');
                        if (_data.code != 0) {
                            vc.toast(_data.msg);
                        } else {
                            vc.toast(_data.msg);
                            vc.emit('parkingAreaControlFee', 'clear', {})
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshParkingAreaControlCustomCarInoutInfo: function() {
                let _payTypes = $that.parkingAreaControlCustomCarInoutInfo.payTypes;
                vc.component.parkingAreaControlCustomCarInoutInfo = {
                    carNum: '',
                    amount: '',
                    remark: '',
                    type: '1101',
                    payCharge: '',
                    machineId: '',
                    boxId: '',
                    costMin: '',
                    payType: '',
                    payTypes: _payTypes,
                    inoutId: ''
                }
            },
            _loadParkingAreaControlCustomCarInoutData: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.parkingAreaControlCustomCarInoutInfo.boxId,
                        carNum: $that.parkingAreaControlCustomCarInoutInfo.carNum,
                    }
                };
                //发送get请求
                vc.http.apiGet('/carInout.listCarInParkingAreaCmd',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        let _data = _feeConfigInfo.data;

                        if (!_data || _data.length < 1) {
                            vc.toast('未查询在场车辆,请检查！');
                            return;
                        }
                        $that.parkingAreaControlCustomCarInout.payCharge = _data[0].payCharge;
                        $that.parkingAreaControlCustomCarInout.inoutId = _data[0].inoutId;
                        $that.parkingAreaControlCustomCarInout.costMin = _data[0].hours + "时" + _data[0].min + "分";
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryCustomCarMoney: function() {
                if (!$that.parkingAreaControlCustomCarInoutInfo.carNum) {
                    return;
                }
                if ($that.parkingAreaControlCustomCarInoutInfo.type == '1101') {
                    return;
                }
                $that._loadParkingAreaControlCustomCarInoutData();
            }
        }
    });

})(window.vc, window.vc.component);