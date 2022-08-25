(function(vc) {

    vc.extends({
        data: {
            barrierGateMachineQrCodeInfo: {
                url: '',
                inspectionName: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('barrierGateMachineQrCode', 'openQrCodeModal', function(_param) {
                $('#barrierGateMachineQrCodeModel').modal('show');
                $that._loadOutMachineQrCodeUrl(_param);
            });
        },
        methods: {
            _loadOutMachineQrCodeUrl: function(_machine) {
                //判断是否支付
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: _machine.locationObjId,
                        machineId: _machine.machineId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/machine.getCarMachineQrCodeUrl',
                    param,
                    function(json, res) {
                        let _info = JSON.parse(json);
                        $that._viewOutMachineQr(_info.data.url)
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 两分钟后显示遮罩层
            _viewOutMachineQr: function(_url) {
                document.getElementById("outMachineQrcode").innerHTML = "";
                let qrcode = new QRCode(document.getElementById("outMachineQrcode"), {
                    text: "213", //你想要填写的文本
                    width: 200, //生成的二维码的宽度
                    height: 200, //生成的二维码的高度
                    colorDark: "#000000", // 生成的二维码的深色部分
                    colorLight: "#ffffff", //生成二维码的浅色部分
                    correctLevel: QRCode.CorrectLevel.L
                });
                qrcode.makeCode(_url);
            }
        }
    });

})(window.vc);