(function (vc) {
    vc.extends({
        data: {
            inspectionPointQrCodeInfo: {
                url: '',
                inspectionName: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('inspectionPointQrCode', 'openInspectionPointQrCodeModal', function (_param) {
                vc.copyObject(_param, $that.inspectionPointQrCodeInfo);
                $('#inspectionPointQrCodeModel').modal('show');
                $that._viewQr($that.inspectionPointQrCodeInfo.url);
            });
        },
        methods: {
            // 两分钟后显示遮罩层
            _viewQr: function (_url) {
                document.getElementById("qrcode").innerHTML = "";
                let qrcode = new QRCode(document.getElementById("qrcode"), {
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