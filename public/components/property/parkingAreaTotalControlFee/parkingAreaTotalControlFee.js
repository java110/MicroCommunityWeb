/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            parkingAreaTotalControlFeeInfo: {
                carNum: "",
                inOutTime: "",
                payCharge: 0.0,
                pay: 0.0,
                showRefresh: '',
                paId: '',
                feeCarNum: '',
                costMin: '',
                carInoutInfos: [],
                machineId: '',
            }
        },
        _initMethod: function() {
            $that.parkingAreaTotalControlFeeInfo.paId = vc.getParam('paId');

        },
        _initEvent: function() {
            vc.on('parkingAreaTotalControlFee', 'notify', function(_param) {
                let _data = _param.data;
                if (_data.action != 'FEE_INFO') {
                    return;
                }
                let _machine = _param.machine;
                //进场覆盖问题
                let _oldPayCharge = $that.parkingAreaTotalControlFeeInfo.payCharge;
                //vc.copyObject(_data, $that.parkingAreaTotalControlFeeInfo);

                //出场摄像头
                let _inoutType = "2002";
                if (_machine.direction == '3307') { // 出首相头
                    $that.parkingAreaTotalControlFeeInfo.feeCarNum = _data.carNum;
                    $that.parkingAreaTotalControlFeeInfo.costMin = _data.hours + "小时" + _data.min + "分钟"
                    $that.parkingAreaTotalControlFeeInfo.pay = _data.payCharge;
                    $that.parkingAreaTotalControlFeeInfo.payCharge = _data.payCharge;
                    $that.parkingAreaTotalControlFeeInfo.remark = '';
                    $that.parkingAreaTotalControlFeeInfo.machineId = _data.extMachineId;
                } else {
                    $that.parkingAreaTotalControlFeeInfo.payCharge = _oldPayCharge;
                    _inoutType = "1001";
                }

                let _carInoutInfos = $that.parkingAreaTotalControlFeeInfo.carInoutInfos.reverse();

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
                $that.parkingAreaTotalControlFeeInfo.carInoutInfos = _carInoutInfos;

            });
            vc.on('parkingAreaTotalControlFee', 'clear', function() {
                $that.clearParkingAreaTotalControlFeeInfo();
            });

        },
        methods: {

            saveTempFeeInfo: function() {
                vc.emit('parkingAreaControlCustomCarInout', 'open', {
                    type: "1102", //1101 手动入场 1102 手动出场
                    carNum: $that.parkingAreaTotalControlFeeInfo.feeCarNum,
                    amount: $that.parkingAreaTotalControlFeeInfo.payCharge,
                    payCharge: $that.parkingAreaTotalControlFeeInfo.payCharge,
                    machineId: $that.parkingAreaTotalControlFeeInfo.machineId,
                    paId: $that.parkingAreaTotalControlFeeInfo.paId,
                })
            },

            _parkingAreaTotalControlFeeArrayCarOut: function(item) {
                vc.emit('parkingAreaControlCustomCarInout', 'open', {
                    type: "1102", //1101 手动入场 1102 手动出场
                    carNum: item.carNum,
                    machineId: $that.parkingAreaTotalControlFeeInfo.machineId,
                    boxId: $that.parkingAreaTotalControlFeeInfo.boxId,
                    paId: $that.parkingAreaTotalControlFeeInfo.paId,
                })
            },

            clearParkingAreaTotalControlFeeInfo: function() {
                let _paId = $that.parkingAreaTotalControlFeeInfo.paId;
                let _carInoutInfos = $that.parkingAreaTotalControlFeeInfo.carInoutInfos;

                $that.parkingAreaTotalControlFeeInfo = {
                    carNum: "",
                    inOutTime: "",
                    payCharge: 0.0,
                    pay: 0.0,
                    showRefresh: '',
                    paId: _paId,
                    feeCarNum: '',
                    costMin: '',
                    carInoutInfos: _carInoutInfos,
                    machineId: '',
                }
            },
            _showInParkingAreaQrCode: function() {
                vc.emit('barrierGateQrCode', 'openQrCodeModal', {
                    boxId: $that.parkingAreaTotalControlFeeInfo.boxId
                })
            },

        }
    });
})(window.vc);