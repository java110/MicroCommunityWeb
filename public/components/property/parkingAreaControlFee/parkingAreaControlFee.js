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
                costMin: ''
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
                vc.copyObject(_data, $that.parkingAreaControlFeeInfo);
                $that.parkingAreaControlFeeInfo.openMsg = _data.remark;

                //出场摄像头
                if (_machineId == _data.extMachineId) {
                    $that.parkingAreaControlFeeInfo.feeCarNum = _data.carNum;
                    $that.parkingAreaControlFeeInfo.costMin = _data.hours + "小时" + _data.hours + "分钟"
                    $that.parkingAreaControlFeeInfo.pay = _data.payCharge;
                    $that.parkingAreaControlFeeInfo.remark = '';

                }


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
            clearParkingAreaControlFeeInfo: function() {
                let _machineId = $that.parkingAreaControlFeeInfo.outMachineId;
                let _boxId = $that.parkingAreaControlFeeInfo.boxId;

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
                    costMin: ''
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