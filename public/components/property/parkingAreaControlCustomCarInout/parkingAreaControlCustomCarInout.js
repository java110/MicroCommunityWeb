(function (vc, vm) {

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
                paId: '',
                payType: '',
                payTypes: [],
                inoutId: '',
                machines: [],
                coupons: [],
                pccIds: [],
            }
        },
        _initMethod: function () {
            vc.getDict('car_inout_payment', 'pay_type', function (_data) {
                $that.parkingAreaControlCustomCarInoutInfo.payTypes = _data;
            })
        },
        _initEvent: function () {
            vc.on('parkingAreaControlCustomCarInout', 'open', function (_params) {
                vc.component.refreshParkingAreaControlCustomCarInoutInfo();
                $('#parkingAreaControlCustomCarInoutModel').modal('show');
                // = _params;
                vc.copyObject(_params, vc.component.parkingAreaControlCustomCarInoutInfo);
                vc.component.parkingAreaControlCustomCarInoutInfo.communityId = vc.getCurrentCommunity().communityId;
                $that._queryCustomCarMoney();
            });
        },
        methods: {
            parkingAreaControlCustomCarInoutValidate: function () {
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
            parkingAreaControlCustomCarInout: function () {
                if (!vc.component.parkingAreaControlCustomCarInoutValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/machine.customCarInOutCmd',
                    JSON.stringify(vc.component.parkingAreaControlCustomCarInoutInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _data = JSON.parse(json);
                        if (_data.code != 0) {
                            vc.toast(_data.msg);
                        } else {
                            $('#parkingAreaControlCustomCarInoutModel').modal('hide');
                            vc.toast(_data.msg);
                            vc.emit('parkingAreaControlFee', 'clear', {})
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshParkingAreaControlCustomCarInoutInfo: function () {
                let _payTypes = $that.parkingAreaControlCustomCarInoutInfo.payTypes;
                vc.component.parkingAreaControlCustomCarInoutInfo = {
                    carNum: '',
                    amount: '',
                    remark: '',
                    type: '1101',
                    payCharge: '',
                    machineId: '',
                    boxId: '',
                    paId: '',
                    costMin: '',
                    payType: '',
                    payTypes: _payTypes,
                    inoutId: '',
                    machines: [],
                    coupons: [],
                    pccIds: [],
                }
            },
            _loadParkingAreaControlCustomCarInoutData: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.parkingAreaControlCustomCarInoutInfo.boxId,
                        paId: $that.parkingAreaControlCustomCarInoutInfo.paId,
                        carNum: $that.parkingAreaControlCustomCarInoutInfo.carNum,
                    }
                };
                //发送get请求
                vc.http.apiGet('/carInout.listCarInParkingAreaCmd',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        let _data = _feeConfigInfo.data;

                        if (!_data || _data.length < 1) {
                            vc.toast('未查询在场车辆,请检查！');
                            return;
                        }
                        $that.parkingAreaControlCustomCarInoutInfo.payCharge = _data[0].payCharge;
                        $that.parkingAreaControlCustomCarInoutInfo.amount = _data[0].payCharge;
                        $that.parkingAreaControlCustomCarInoutInfo.inoutId = _data[0].inoutId;
                        $that.parkingAreaControlCustomCarInoutInfo.costMin = _data[0].hours + "时" + _data[0].min + "分";
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryCustomCarMoney: function () {
                if (!$that.parkingAreaControlCustomCarInoutInfo.carNum) {
                    return;
                }
                if ($that.parkingAreaControlCustomCarInoutInfo.type == '1101') {
                    return;
                }
                if ($that.parkingAreaControlCustomCarInoutInfo.paId && !$that.parkingAreaControlCustomCarInoutInfo.machineId) {
                    $that._loadOutMachinesByPaId();
                }
                $that._loadParkingAreaControlCustomCarInoutData();
                $that._loadOutCoupons();
            },
            _loadOutMachinesByPaId: function () {
                let param = {
                    params: {
                        paId: $that.parkingAreaControlCustomCarInoutInfo.paId,
                        page: 1,
                        row: 100,
                        direction: '3307',
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                //发送get请求
                vc.http.apiGet('/machine.listParkingAreaMachines',
                    param,
                    function (json, res) {
                        let _machineManageInfo = JSON.parse(json);
                        let _machines = _machineManageInfo.data;
                        $that.parkingAreaControlCustomCarInoutInfo.machines = _machines;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadOutCoupons: function () {
                let param = {
                    params: {
                        paId: $that.parkingAreaControlCustomCarInoutInfo.paId,
                        page: 1,
                        row: 30,
                        state: '1001',
                        carNum: $that.parkingAreaControlCustomCarInoutInfo.carNum
                    }
                }
                //发送get请求
                vc.http.apiGet('/parkingCoupon.listParkingCouponCar',
                    param,
                    function (json, res) {
                        let _machineManageInfo = JSON.parse(json);
                        let _coupons = _machineManageInfo.data;
                        $that.parkingAreaControlCustomCarInoutInfo.coupons = _coupons;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _computeCouponMoney: function () {
                let _pccIds = $that.parkingAreaControlCustomCarInoutInfo.pccIds;

                if(!_pccIds || _pccIds.length<1){
                    $that._queryCustomCarMoney();
                    return;
                }
                let param = {
                    params: {
                        paId: $that.parkingAreaControlCustomCarInoutInfo.paId,
                        boxId: $that.parkingAreaControlCustomCarInoutInfo.boxId,
                        pccIds: $that.parkingAreaControlCustomCarInoutInfo.pccIds.join(","),
                        carNum: $that.parkingAreaControlCustomCarInoutInfo.carNum
                    }
                }
                //发送get请求
                vc.http.apiGet('/tempCarFee.getTempCarFeeOrder',
                    param,
                    function (json, res) {
                        let _machineManageInfo = JSON.parse(json);
                        let data = _machineManageInfo.data;
                        $that.parkingAreaControlCustomCarInoutInfo.payCharge = data.amount;
                        $that.parkingAreaControlCustomCarInoutInfo.amount = data.amount;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc, window.vc.component);