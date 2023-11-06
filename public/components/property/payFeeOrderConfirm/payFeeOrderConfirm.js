(function (vc) {
    vc.extends({
        data: {
            payFeeOrderConfirmInfo: {
                totalDiscountMoney: 0.0,
                accountAmount: 0.0,
                payType: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('payFeeOrderConfirm', 'openConfirm', function (_data) {
                $that.payFeeOrderConfirmInfo = _data;
                $("#doPayFeeModal").modal('show');
                $that.payFeeOrderConfirmInfo.payType = _data.payType;
                if ($that.payFeeOrderConfirmInfo.payType != 'common') {
                    setTimeout('document.getElementById("authCode").focus()', 1000);
                }
                $that.$forceUpdate();
            })
        },
        methods: {
            /**
             * 点击 “提交缴费”
             */
            _closeDoPayFeeModal: function () {
                //关闭model
                $("#doPayFeeModal").modal('hide');
            },
            _qrCodePayFee: function () {
                let _printFees = [];
                _printFees.push({
                    feeId: $that.payFeeOrderConfirmInfo.feeId,
                    squarePrice: $that.payFeeOrderConfirmInfo.squarePrice,
                    additionalAmount: $that.payFeeOrderConfirmInfo.additionalAmount,
                    feeName: $that.payFeeOrderConfirmInfo.feeName,
                    amount: $that.payFeeOrderConfirmInfo.receivedAmount,
                    authCode: $that.payFeeOrderConfirmInfo.authCode
                });
                $that.payFeeOrderConfirmInfo.subServiceCode = 'fee.payFee';
                vc.http.apiPost(
                    '/payment.qrCodePayment',
                    JSON.stringify(vc.component.payFeeOrderConfirmInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _data = JSON.parse(json);
                        if (_data.code == 404) {
                            vc.toast(_data.msg);
                            if (_data.data && _data.data.orderId) {
                                $that.payFeeOrderConfirmInfo.orderId = _data.data.orderId;
                                setTimeout('$that._qrCodeCheckPayFinish()', 5000);
                            }
                            return;
                        }
                        $that._closeDoPayFeeModal();
                        vc.emit('payFeeOrderResult', '_loadReceipt', _data)
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _qrCodeCheckPayFinish: function () {
                let _printFees = [];
                _printFees.push({
                    feeId: $that.payFeeOrderConfirmInfo.feeId,
                    squarePrice: $that.payFeeOrderConfirmInfo.squarePrice,
                    additionalAmount: $that.payFeeOrderConfirmInfo.additionalAmount,
                    feeName: $that.payFeeOrderConfirmInfo.feeName,
                    amount: $that.payFeeOrderConfirmInfo.receivedAmount,
                    authCode: $that.payFeeOrderConfirmInfo.authCode,
                    orderId: $that.payFeeOrderConfirmInfo.orderId
                });
                $that.payFeeOrderConfirmInfo.subServiceCode = 'fee.payFee';
                vc.http.apiPost(
                    '/payment.checkPayFinish',
                    JSON.stringify(vc.component.payFeeOrderConfirmInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _data = JSON.parse(json);
                        if (_data.code == 404) {
                            vc.toast(_data.msg);
                            return;
                        } else if (_data.code == 41) {
                            setTimeout('$that._qrCodeCheckPayFinish()', 5000);
                            return;
                        }
                        $that._closeDoPayFeeModal();
                        _data = _data.data;
                        vc.emit('payFeeOrderResult', '_loadReceipt', _data)
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            /**
             * 点击模态框 “确定收费”
             */
            _payFee: function (_page, _row) {
                let _printFees = [];
                _printFees.push({
                    feeId: $that.payFeeOrderConfirmInfo.feeId,
                    squarePrice: $that.payFeeOrderConfirmInfo.squarePrice,
                    additionalAmount: $that.payFeeOrderConfirmInfo.additionalAmount,
                    feeName: $that.payFeeOrderConfirmInfo.feeName,
                    amount: $that.payFeeOrderConfirmInfo.receivedAmount
                });
                vc.http.apiPost(
                    '/fee.payFee',
                    JSON.stringify(vc.component.payFeeOrderConfirmInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //查询收据
                            let _data = _json.data;
                            $that._closeDoPayFeeModal();
                            vc.emit('payFeeOrderResult', '_loadReceipt', _data)
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            //查询收据
        }
    });
})(window.vc);