/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            parkingAreaControlFeeInfo: {
                carNum: "",
                time: "",
                payCharge: 0.0,
                pay: 0.0,
                remark: "",
                open: "",
                openMsg: "",
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {

        },
        methods: {
            saveTempFeeInfo: function () {
                vc.emit('parkingAreaControlCustomCarInout', 'open', {
                    type: "1102", //1101 手动入场 1102 手动出场
                    carNum: $that.parkingAreaControlFeeInfo.carNum,
                    amount: $that.parkingAreaControlFeeInfo.pay,
                    payCharge: $that.parkingAreaControlFeeInfo.payCharge,
                })
            }
        }
    });
})(window.vc);