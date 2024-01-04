(function (vc) {
    vc.extends({

        data: {
            batchPayConfirmInfo: {
                payType: '',
                fees: [],
                primeRate: '',
                primeRates: [],
                payerObjName: '',
                orderId: '',
                paymentPoolId: '',
                authCode: '',
                feePrices: '',
                detailIds: '',
                printUrl: '/print.html#/pages/property/printPayFee',
                accountAmount:'',
                acctId:''
            }
        },
        _initMethod: function () {
            //与字典表支付方式关联
            vc.getDict('pay_fee_detail', "prime_rate", function (_data) {
                $that.batchPayConfirmInfo.primeRates = _data;
            });
            $that._listFeePrintPages();
        },
        _initEvent: function () {
            vc.on('batchPayConfirm', 'openBatchPayFee', function (_param) {
                $that._resetBatchPayConfirm();
                $that.batchPayConfirmInfo.payType = _param.payType;
                $that.batchPayConfirmInfo.fees = _param.fees;
                $that.batchPayConfirmInfo.feePrices = _param.feePrices;
                $that.batchPayConfirmInfo.payerObjName = _param.payerObjName;
                $that.batchPayConfirmInfo.accountAmount = _param.accountAmount;
                $that.batchPayConfirmInfo.acctId = _param.acctId;
                $("#doBatchPayFeeModal").modal('show');
                if (_param.payType == 'qrCode') {
                    setTimeout('document.getElementById("authCode").focus()', 500);
                }
            });
        },
        methods: {
            _closeDoBatchPayFeeModal: function () {
                $("#doBatchPayFeeModal").modal('hide');
            },
            _doPayFee: function () {
                if (!$that.batchPayConfirmInfo.primeRate) {
                    vc.toast('请选择支付方式');
                    return;
                }
                let _fees = $that.batchPayConfirmInfo.fees;
                _fees.forEach(_fee=>{
                    _fee.primeRate = $that.batchPayConfirmInfo.primeRate;
                });
               
                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    fees: _fees,
                    acctId:$that.batchPayConfirmInfo.acctId,
                    accountAmount:$that.batchPayConfirmInfo.accountAmount,
                }
                vc.http.apiPost(
                    '/fee.payBatchFee',
                    JSON.stringify(_data), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $that._doDealPayResult(_json);
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        $that._closeDoBatchPayFeeModal();
                        vc.toast(errInfo);
                    });
            },
            _qrCodePayFee: function () {
                if ($that.batchPayConfirmInfo.primeRate == '') {
                    vc.toast('请选择支付方式');
                    return;
                }
                let _fees = $that.batchPayConfirmInfo.fees;
                _fees.forEach(_fee=>{
                    _fee.primeRate = $that.batchPayConfirmInfo.primeRate;
                });

                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    fees: _fees,
                    acctId:$that.batchPayConfirmInfo.acctId,
                    accountAmount:$that.batchPayConfirmInfo.accountAmount,
                    authCode: $that.batchPayConfirmInfo.authCode,
                    receivedAmount: $that.batchPayConfirmInfo.feePrices,
                    payerObjName: $that.batchPayConfirmInfo.payerObjName,
                    subServiceCode: 'fee.payBatchFee'
                }
                vc.http.apiPost(
                    '/payment.qrCodePayment',
                    JSON.stringify(_data), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _data = JSON.parse(json);
                        if (_data.code == 404) {
                            vc.toast(_data.msg);
                            if (_data.data && _data.data.orderId) {
                                $that.batchPayConfirmInfo.orderId = _data.data.orderId;
                                $that.batchPayConfirmInfo.paymentPoolId = _data.data.paymentPoolId;
                                setTimeout('$that._qrCodeCheckPayFinish()', 5000);
                            }
                            return;
                        } else if (_data.code == 0) {
                            $that._doDealPayResult(_data);
                        } else {
                            vc.toast(_data.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _qrCodeCheckPayFinish: function () {
                let _fees = $that.batchPayConfirmInfo.fees;
                _fees.forEach(_fee=>{
                    _fee.primeRate = $that.batchPayConfirmInfo.primeRate;
                });

                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    fees: _fees,
                    acctId:$that.batchPayConfirmInfo.acctId,
                    accountAmount:$that.batchPayConfirmInfo.accountAmount,
                    authCode: $that.batchPayConfirmInfo.authCode,
                    receivedAmount: $that.batchPayConfirmInfo.feePrices,
                    subServiceCode: 'fee.payBatchFee',
                    orderId: $that.batchPayConfirmInfo.orderId,
                    paymentPoolId: $that.batchPayConfirmInfo.paymentPoolId

                }
                vc.http.apiPost(
                    '/payment.checkPayFinish',
                    JSON.stringify(_data), {
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
                        $that._doDealPayResult(_data);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _doDealPayResult: function (_json) {
                $that._closeDoBatchPayFeeModal();
                let _data = _json.data;
                let detailIds = '';
                _data.details.forEach(item => {
                    detailIds += (item + ',');
                })
                $that.batchPayConfirmInfo.detailIds = detailIds;
                //todo 这里等三秒，有可能收据队列还没有生成
                setTimeout(function () {
                    $("#payFeeResult").modal({
                        backdrop: "static", //点击空白处不关闭对话框
                        show: true
                    });
                }, 2000);

                vc.emit('batchPayFeeOrder', 'loadBatchFees',{});
            },
            _printAndBack: function () {
                $('#payFeeResult').modal("hide");
                window.open($that.batchPayConfirmInfo.printUrl + "?detailIds=" + $that.batchPayConfirmInfo.detailIds)
            },
            
            _back: function () {
                $('#payFeeResult').modal("hide");
                vc.getBack();
            },
            _listFeePrintPages: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        state: 'T',
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feePrintPage.listFeePrintPage',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        let feePrintPages = _json.data;
                        if (feePrintPages && feePrintPages.length > 0) {
                            $that.batchPayConfirmInfo.printUrl = feePrintPages[0].url;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _resetBatchPayConfirm: function () {
                let _primeRates = $that.batchPayConfirmInfo.primeRates;
                let _printUrl = $that.batchPayConfirmInfo.printUrl;
                $that.batchPayConfirmInfo = {
                    payType: '',
                    fees: [],
                    primeRate: '',
                    primeRates: _primeRates,
                    payerObjName: '',
                    orderId: '',
                    paymentPoolId: '',
                    authCode: '',
                    feePrices: '',
                    detailIds: '',
                    printUrl: _printUrl,
                    accountAmount:'',
                    acctId:''
                }
            }
        }
    });
})(window.vc);
