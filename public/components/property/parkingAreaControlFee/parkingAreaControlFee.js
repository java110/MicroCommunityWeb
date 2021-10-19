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
                machineId: '-1',
                showRefresh:'',
                boxId:''
            }
        },
        _initMethod: function () {
            $that.parkingAreaControlFeeInfo.boxId = vc.getParam('boxId');
            $that._loadQrCodeUrl();
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
            _loadQrCodeUrl:function(){
                //判断是否支付
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.parkingAreaControlFeeInfo.boxId,
                        machineId: $that.parkingAreaControlFeeInfo.machineId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/machine.getCarMachineQrCodeUrl',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        $that._viewQr(_info.data)
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
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
            },
            _viewQr: function (_data) {
                document.getElementById("qrcode").innerHTML = "";
                let qrcode = new QRCode(document.getElementById("qrcode"), {
                    text: "临时车收费二维码",  //你想要填写的文本
                    width: 200, //生成的二维码的宽度
                    height: 200, //生成的二维码的高度
                    colorDark: "#000000", // 生成的二维码的深色部分
                    colorLight: "#ffffff", //生成二维码的浅色部分
                    correctLevel: QRCode.CorrectLevel.H
                });
                qrcode.makeCode(_data.url);
            },
        }
    });
})(window.vc);