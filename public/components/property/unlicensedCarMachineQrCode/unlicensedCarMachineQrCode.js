(function (vc, vm) {

    vc.extends({
        data: {
            unlicensedCarMachineQrCodeInfo: {
                carNum: '',
                amount: '',
                remark: '',
                type: '1101',
                payCharge: '',
                machineId: ''
            }
        },
        _initMethod: function () {
            
        },
        _initEvent: function () {
            vc.on('unlicensedCarMachineQrCode', 'open', function (_params) {
                vc.component.refreshUnlicensedCarMachineQrCodeInfoInfo();
                $('#unlicensedCarMachineQrCodeModel').modal('show');
                // = _params;
                vc.copyObject(_params, vc.component.unlicensedCarMachineQrCodeInfo);
                vc.component.unlicensedCarMachineQrCodeInfo.communityId = vc.getCurrentCommunity().communityId;
                $that._loadUnlicensedCodeUrl();
            });
        },
        methods: {
            _loadUnlicensedCodeUrl:function(){
                //判断是否支付
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.unlicensedCarMachineQrCodeInfo.boxId,
                        machineId: $that.unlicensedCarMachineQrCodeInfo.machineId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/machine.unlicensedCarMachineQrCodeUrl',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        $that._viewQr(_info.data)
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _viewQr: function (_data) {
                document.getElementById("uncode").innerHTML = "";
                let qrcode = new QRCode(document.getElementById("uncode"), {
                    text: "无牌车入场二维码",  //你想要填写的文本
                    width: 200, //生成的二维码的宽度
                    height: 200, //生成的二维码的高度
                    colorDark: "#000000", // 生成的二维码的深色部分
                    colorLight: "#ffffff", //生成二维码的浅色部分
                    correctLevel: QRCode.CorrectLevel.H
                });
                qrcode.makeCode(_data.url);
            },
            refreshUnlicensedCarMachineQrCodeInfoInfo: function () {
                vc.component.unlicensedCarMachineQrCodeInfo = {
                    carNum: '',
                    amount: '',
                    remark: '',
                    type: '1101',
                    payCharge: '',
                    machineId: ''
                }
            }
        }
    });

})(window.vc, window.vc.component);