(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addStaffAppAuthInfo: {
                auId: '',
                appType: 'WECHAT',
                showRefresh: false,
            }
        },
        _initMethod: function () {
           $that._timer4Refresh();
        },
        _initEvent: function () {
            vc.on('addStaffAppAuth', 'openAddStaffAppAuthModal', function () {
                $('#addStaffAppAuthModel').modal('show');
                $that._changeAppType()
            });
        },
        methods: {
            // 两分钟后显示遮罩层
            _timer4Refresh: function () {
              setTimeout(() => {
                  $that.addStaffAppAuthInfo.showRefresh = true;
              }, 120000);
            },
            _changeAppType: function () {
                // 隐藏遮罩层
                $that.addStaffAppAuthInfo.showRefresh = false;
                $that._timer4Refresh();
                //判断是否支付
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        appType: $that.addStaffAppAuthInfo.appType
                    }
                };
                //发送get请求
                vc.http.apiGet('/staff/generatorQrCode',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        $that._viewQr(_info.data)
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _viewQr: function (_url) {
                document.getElementById("qrcode").innerHTML = "";
                let qrcode = new QRCode(document.getElementById("qrcode"), {
                    text: "员工认证",  //你想要填写的文本
                    width: 200, //生成的二维码的宽度
                    height: 200, //生成的二维码的高度
                    colorDark: "#000000", // 生成的二维码的深色部分
                    colorLight: "#ffffff", //生成二维码的浅色部分
                    correctLevel: QRCode.CorrectLevel.H
                });
                qrcode.makeCode(_url);
            },
            _finishScanQrCode: function () {
                vc.emit('staffAppAuthManage', 'listStaffAppAuth', {});
                $('#addStaffAppAuthModel').modal('hide');
            }
        }
    });

})(window.vc);
