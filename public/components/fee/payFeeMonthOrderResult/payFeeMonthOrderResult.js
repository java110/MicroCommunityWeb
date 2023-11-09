(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeMonthOrderResultInfo: {
                printUrl: '/print.html#/pages/property/printPayFee',
                remark: '',
                primeRate: '',
                payType:'common',
                authCode:'',
                primeRates: [],
                selectMonthIds:[],
                totalAmount:0.0,
                remark:''
            }
        },
        
        _initMethod: function () {
             //与字典表支付方式关联
             vc.getDict('pay_fee_detail', "prime_rate", function(_data) {
                $that.payFeeMonthOrderResultInfo.primeRates = _data;
            });

        },
        _initEvent: function () {
            vc.on('payFeeMonthOrderResult','openResultModal',function(_data){
                vc.copyObject(_data,$that.payFeeMonthOrderResultInfo);
                $("#doPayFeeMonthOrderResultModal").modal('show');
            })

        },
        methods: {

            _doPayFee: function() {

                if ($that.payFeeMonthOrderResultInfo.primeRate == '') {
                    vc.toast('请选择支付方式');
                    return;
                }
                let _selectMonthIds = $that.payFeeMonthOrderResultInfo.selectMonthIds;;
                if (_selectMonthIds.length < 1) {
                    vc.toast('未选中要缴费的项目');
                    return;
                }
                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    primeRate:$that.payFeeMonthOrderResultInfo.primeRate,
                    selectMonthIds: _selectMonthIds,
                    remark:$that.payFeeMonthOrderResultInfo.remark
                }
                vc.http.apiPost(
                    '/fee.payMonthFee',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);

                        if (_json.code == 0) {
                            $that._doDealPayResult(_json);
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        $that._closeDoBatchPayFeeModal();
                        vc.toast(errInfo);
                    });
            },
            _qrCodePayFee: function() {
                if ($that.payFeeMonthOrderResultInfo.primeRate == '') {
                    vc.toast('请选择支付方式');
                    return;
                }
                let _fees = $that._getPayFees();
                if (_fees.length < 1) {
                    vc.toast('未选中要缴费的项目');
                    return;
                }
                let _payerObjName = $that.payFeeMonthOrderResultInfo.payerObjNames.join(',')

                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    fees: _fees,
                    authCode: $that.payFeeMonthOrderResultInfo.authCode,
                    receivedAmount: $that.payFeeMonthOrderResultInfo.feePrices,
                    payerObjName: _payerObjName,
                    subServiceCode: 'fee.payBatchFee'
                }
                vc.http.apiPost(
                    '/payment.qrCodePayment',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _data = JSON.parse(json);
                        if (_data.code == 404) {
                            vc.toast(_data.msg);
                            if (_data.data && _data.data.orderId) {
                                $that.payFeeMonthOrderResultInfo.orderId = _data.data.orderId;
                                $that.payFeeMonthOrderResultInfo.paymentPoolId = _data.data.paymentPoolId;

                                setTimeout('$that._qrCodeCheckPayFinish()', 5000);
                            }
                            return;
                        } else if (_data.code == 0) {
                            $that._doDealPayResult(_data);
                        } else {
                            vc.toast(_data.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _qrCodeCheckPayFinish: function() {
                let _fees = $that._getPayFees();
                if (_fees.length < 1) {
                    vc.toast('未选中要缴费的项目');
                    return;
                }

                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    fees: _fees,
                    authCode: $that.payFeeMonthOrderResultInfo.authCode,
                    receivedAmount: $that.payFeeMonthOrderResultInfo.feePrices,
                    subServiceCode: 'fee.payBatchFee',
                    orderId: $that.payFeeMonthOrderResultInfo.orderId
                }
                vc.http.apiPost(
                    '/payment.checkPayFinish',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
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
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _doDealPayResult: function(_json) {
                $that._closeDoBatchPayFeeModal();
                let _data = _json.data;
                let detailIds = '';
                _data.details.forEach(item => {
                    detailIds += (item + ',');
                })
                $that.payFeeMonthOrderResultInfo.detailIds = detailIds;
                //vc.saveData('_feeInfo', _feeInfo);
                //关闭model
                $("#payFeeResult").modal({
                    backdrop: "static", //点击空白处不关闭对话框
                    show: true
                });
                vc.emit('payFeeMonthOrder','load',{})
            },
            _closeDoBatchPayFeeModal:function(){
                $("#doPayFeeMonthOrderResultModal").modal('hide');
            },
            _printAndBack: function() {
                $('#payFeeResult').modal("hide");
                window.open($that.payFeeMonthOrderResultInfo.printUrl + "?detailIds=" + $that.payFeeMonthOrderResultInfo.detailIds)
            },
        }
    });
})(window.vc);