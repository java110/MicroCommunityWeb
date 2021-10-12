/**
 入驻小区
 **/
(function (vc) {
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
                machineId: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('parkingAreaControlFee', 'notify', function (_data) {
                if (_data.action != 'FEE_INFO') {
                    return;
                }
                let _machineId = $that.parkingAreaControlFeeInfo.machineId;
                vc.copyObject(_data, $that.parkingAreaControlFeeInfo);
                $that.parkingAreaControlFeeInfo.openMsg = _data.remark;
                $that.parkingAreaControlFeeInfo.pay = _data.payCharge;
                $that.parkingAreaControlFeeInfo.remark = '';
                $that.parkingAreaControlFeeInfo.machineId = _machineId;
            });
            vc.on('parkingAreaControlFee', 'changeMachine', function (_data) {
                $that.parkingAreaControlFeeInfo.machineId = _data.machineId;
            })

            vc.on('parkingAreaControlFee', 'clear', function () {
                $that.clearParkingAreaControlFeeInfo();
            });

        },
        methods: {
            saveTempFeeInfo: function () {
                vc.emit('parkingAreaControlCustomCarInout', 'open', {
                    type: "1102", //1101 手动入场 1102 手动出场
                    carNum: $that.parkingAreaControlFeeInfo.carNum,
                    amount: $that.parkingAreaControlFeeInfo.pay,
                    payCharge: $that.parkingAreaControlFeeInfo.payCharge,
                    machineId: $that.parkingAreaControlFeeInfo.machineId
                })
            },
            clearParkingAreaControlFeeInfo: function () {
                let _machineId = $that.parkingAreaControlFeeInfo.machineId;

                $that.parkingAreaControlFeeInfo = {
                    carNum: "",
                    inOutTime: "",
                    payCharge: 0.0,
                    pay: 0.0,
                    remark: "",
                    open: "",
                    openMsg: "",
                    machineId: _machineId
                }
            }
        }
    });
})(window.vc);