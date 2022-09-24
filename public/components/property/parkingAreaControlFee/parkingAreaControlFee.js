/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            parkingAreaControlFeeInfo: {
                carNum: "",
                inOutTime: "",
                payCharge: 0.0,
                pay: 0.0,
                remark: "",
                open: "",
                openMsg: "",
                outMachineId: '-1',
                showRefresh: '',
                boxId: '',
                feeCarNum: '',
                costMin: '',
                carInoutInfos: []
            }
        },
        _initMethod: function() {
            $that.parkingAreaControlFeeInfo.boxId = vc.getParam('boxId');

        },
        _initEvent: function() {
            vc.on('parkingAreaControlFee', 'notify', function(_data) {
                if (_data.action != 'FEE_INFO') {
                    return;
                }
                let _machineId = $that.parkingAreaControlFeeInfo.outMachineId;
                //进场覆盖问题
                let _oldPayCharge = $that.parkingAreaControlFeeInfo.payCharge;
                //vc.copyObject(_data, $that.parkingAreaControlFeeInfo);
                $that.parkingAreaControlFeeInfo.openMsg = _data.remark;

                //出场摄像头
                let _inoutType = "2002";
                if (_machineId == _data.extMachineId) {
                    vc.emit('parkingAreaControlVideo', 'carOut', _data);
                    $that.parkingAreaControlFeeInfo.feeCarNum = _data.carNum;
                    $that.parkingAreaControlFeeInfo.costMin = _data.hours + "小时" + _data.min + "分钟"
                    $that.parkingAreaControlFeeInfo.pay = _data.payCharge;
                    $that.parkingAreaControlFeeInfo.payCharge = _data.payCharge;
                    $that.parkingAreaControlFeeInfo.remark = '';
                } else {
                    vc.emit('parkingAreaControlVideo', 'carIn', _data);
                    $that.parkingAreaControlFeeInfo.payCharge = _oldPayCharge;
                    _inoutType = "1001";
                }

                let _carInoutInfos = $that.parkingAreaControlFeeInfo.carInoutInfos.reverse();

                _carInoutInfos.push({
                    carNum: _data.carNum,
                    inOutTime: _data.inOutTime,
                    open: _data.open,
                    openMsg: _data.remark,
                    inoutType: _inoutType,
                    payCharge: _data.payCharge
                });
                _carInoutInfos = _carInoutInfos.reverse();
                if (_carInoutInfos.length > 10) {
                    _carInoutInfos.pop();
                }
                $that.parkingAreaControlFeeInfo.carInoutInfos = _carInoutInfos;

            });
            vc.on('parkingAreaControlFee', 'changeMachine', function(_data) {
                $that.parkingAreaControlFeeInfo.outMachineId = _data.machineId;
            })
            vc.on('parkingAreaControlFee', 'clear', function() {
                $that.clearParkingAreaControlFeeInfo();
            });

        },
        methods: {

            saveTempFeeInfo: function() {
                vc.emit('parkingAreaControlCustomCarInout', 'open', {
                    type: "1102", //1101 手动入场 1102 手动出场
                    carNum: $that.parkingAreaControlFeeInfo.feeCarNum,
                    amount: $that.parkingAreaControlFeeInfo.payCharge,
                    payCharge: $that.parkingAreaControlFeeInfo.payCharge,
                    machineId: $that.parkingAreaControlFeeInfo.outMachineId,
                    boxId: $that.parkingAreaControlFeeInfo.boxId,
                })
            },

            _parkingAreaControlFeeArrayCarOut: function(item) {
                vc.emit('parkingAreaControlCustomCarInout', 'open', {
                    type: "1102", //1101 手动入场 1102 手动出场
                    carNum: item.carNum,
                    machineId: $that.parkingAreaControlFeeInfo.outMachineId,
                    boxId: $that.parkingAreaControlFeeInfo.boxId,
                })
            },

            clearParkingAreaControlFeeInfo: function() {
                let _machineId = $that.parkingAreaControlFeeInfo.outMachineId;
                let _boxId = $that.parkingAreaControlFeeInfo.boxId;
                let _carInoutInfos = $that.parkingAreaControlFeeInfo.carInoutInfos;

                $that.parkingAreaControlFeeInfo = {
                    carNum: "",
                    inOutTime: "",
                    payCharge: 0.0,
                    pay: 0.0,
                    remark: "",
                    open: "",
                    openMsg: "",
                    outMachineId: _machineId,
                    boxId: _boxId,
                    feeCarNum: '',
                    costMin: '',
                    carInoutInfos: _carInoutInfos
                }
            },
            _showInParkingAreaQrCode: function() {
                vc.emit('barrierGateQrCode', 'openQrCodeModal', {
                    boxId: $that.parkingAreaControlFeeInfo.boxId
                })
            },

        }
    });
})(window.vc);