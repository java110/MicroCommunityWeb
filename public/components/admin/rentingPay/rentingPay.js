(function (vc) {

    vc.extends({
        data: {
            rentingPayInfo: {
                rentingId: '',
                userRole: '', // 角色
                userRoleName: '',
                payPrice: 0.0,
                state: ''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('rentingPay', 'openRentingPayModal', function (_param) {
                vc.copyObject(_param, $that.rentingPayInfo);
                if (_param.hasOwnProperty('userRole') && _param.userRole == 'rent') {
                    $that.rentingPayInfo.userRoleName = '租客';
                } else {
                    $that.rentingPayInfo.userRoleName = '业主';
                }
                $that._payOrder();
                $('#rentingPayModel').modal('show');
            });
        },
        methods: {
            _payOrder: function () {

                let _data = {
                    rentingId: $that.rentingPayInfo.rentingId
                };

                vc.http.apiPost(
                    '/payment/rentingToPay',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0 && _json.hasOwnProperty('codeUrl')) {
                            $that.rentingPayInfo.payPrice = _json.money;
                            $that._viewQr(_json.codeUrl);
                        }


                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            _judgePay: function () {
                //判断是否支付
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        rentingId: $that.rentingPayInfo.rentingId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/renting/queryRentingPool',
                    param,
                    function (json, res) {
                        var _rentingPoolManageInfo = JSON.parse(json);
                        let _rentingPool = _rentingPoolManageInfo.data[0];
                        if (_rentingPool.state == $that.rentingPayInfo.state) {
                            vc.toast('未支付完成');
                            return;
                        }
                        $that.clearRentingPayInfo();
                        $('#rentingPayModel').modal('hide');
                        vc.emit('rentingPoolManage', 'listRentingPool', {});

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearRentingPayInfo: function () {
                vc.component.rentingPayInfo = {
                    rentingId: '',
                    userRole: '', // 角色
                    userRoleName: '',
                    payPrice: 0.0,
                    state: ''

                };
            },
            _viewQr: function (_url) {
                let qrcode = new QRCode(document.getElementById("qrcode"), {
                    text: "租房",  //你想要填写的文本
                    width: 200, //生成的二维码的宽度
                    height: 200, //生成的二维码的高度
                    colorDark: "#000000", // 生成的二维码的深色部分
                    colorLight: "#ffffff", //生成二维码的浅色部分
                    correctLevel: QRCode.CorrectLevel.H
                });
                qrcode.makeCode(_url);
            }
        }
    });

})(window.vc);
