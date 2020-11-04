(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeOrderInfo: {
                feeId: '',
                feeName: '',
                feeTypeCdName: '',
                endTime: '',
                feeFlag: '',
                feePrice: 0.00,
                tempCycles: '',
                cycles: '',
                paymentCycles: [],
                totalFeePrice: 0.00,
                receivedAmount: '',
                communityId: vc.getCurrentCommunity().communityId,
                roomName: '',
                squarePrice: '',
                remark: '',
                builtUpArea: 0.0,
                squarePrice: 0.0,
                additionalAmount: 0.0,
                receiptId: '',
                showEndTime:''
            }
        },
        _initMethod: function () {
            if (vc.notNull(vc.getParam("feeId"))) {
                vc.component.payFeeOrderInfo.feeId = vc.getParam('feeId');
                vc.component.payFeeOrderInfo.feeName = vc.getParam('feeName');
                vc.component.payFeeOrderInfo.feeTypeCdName = vc.getParam('feeTypeCdName');
                vc.component.payFeeOrderInfo.endTime = vc.getParam('endTime').replace(/%3A/g, ':');
                vc.component.payFeeOrderInfo.feePrice = vc.getParam('feePrice');
                $that.payFeeOrderInfo.feeFlag = vc.getParam('feeFlag');
                $that.payFeeOrderInfo.roomName = vc.getParam('roomName');
                $that.payFeeOrderInfo.squarePrice = vc.getParam('squarePrice');
                $that.payFeeOrderInfo.additionalAmount = vc.getParam('additionalAmount');
                $that.payFeeOrderInfo.builtUpArea = vc.getParam('builtUpArea');
                $that.payFeeOrderInfo.squarePrice = vc.getParam('squarePrice');
                $that.payFeeOrderInfo.additionalAmount = vc.getParam('additionalAmount');
                


                $that.payFeeOrderInfo.paymentCycles = [];
                for (let _index = 1; _index < 7; _index++) {
                    $that.payFeeOrderInfo.paymentCycles.push(_index * vc.getParam('paymentCycle'))
                }
            };

            vc.component.payFeeOrderInfo.totalFeePrice = vc.component.payFeeOrderInfo.feePrice;
            vc.component.payFeeOrderInfo.receivedAmount = $that._mathCeil(vc.component.payFeeOrderInfo.totalFeePrice);



        },
        _initEvent: function () {

        },
        methods: {
            payFeeValidate: function () {
                return vc.validate.validate({
                    payFeeOrderInfo: vc.component.payFeeOrderInfo
                }, {
                    'payFeeOrderInfo.feeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用ID不能为空"
                        }
                    ],
                    'payFeeOrderInfo.cycles': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "缴费周期不能为空"
                        }
                    ],
                    'payFeeOrderInfo.receivedAmount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "实收金额不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "实收金额不是有效的金额"
                        }
                    ]
                });
            },
            _openPayFee: function () {
                if ($that.payFeeOrderInfo.tempCycles != "" && $that.payFeeOrderInfo.tempCycles != '-102') {
                    $that.payFeeOrderInfo.cycles = $that.payFeeOrderInfo.tempCycles;
                }
                if ($that.payFeeOrderInfo.feeFlag == '2006012') {
                    $that.payFeeOrderInfo.cycles = '1';
                }
                if ($that.payFeeOrderInfo.cycles == "") {
                    $that.payFeeOrderInfo.cycles = '-101';
                }
                if (!vc.component.payFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                if (!(/(^[1-9]\d*$)/.test($that.payFeeOrderInfo.cycles))) { 
                    $that.payFeeOrderInfo.showEndTime = '';
                }else{
                    console.log('cycle',$that.payFeeOrderInfo.cycles)
                    $that.payFeeOrderInfo.showEndTime = vc.addMonth(new Date($that.payFeeOrderInfo.endTime),parseInt($that.payFeeOrderInfo.cycles));
                }
                //关闭model
                $("#doPayFeeModal").modal('show');
            },
            _closeDoPayFeeModal: function () {
                //关闭model
                $("#doPayFeeModal").modal('hide')
                $that.payFeeOrderInfo.showEndTime = '';
            },
            _payFee: function (_page, _row) {
                $that._closeDoPayFeeModal();
                let _printFees = [];
                _printFees.push({
                    feeId: $that.payFeeOrderInfo.feeId,
                    squarePrice: $that.payFeeOrderInfo.squarePrice,
                    additionalAmount: $that.payFeeOrderInfo.additionalAmount,
                    feeName: $that.payFeeOrderInfo.feeName,
                    amount: $that.payFeeOrderInfo.receivedAmount
                });

                vc.http.post(
                    'propertyPay',
                    'payFee',
                    JSON.stringify(vc.component.payFeeOrderInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            let _feeInfo = {
                                totalAmount: $that.payFeeOrderInfo.receivedAmount,
                                fees: _printFees
                            }

                            let _data = JSON.parse(json).data;

                            $that.payFeeOrderInfo.receiptId = _data.receiptId;

                            //vc.saveData('_feeInfo', _feeInfo);
                            //关闭model
                            $("#payFeeResult").modal({
                                backdrop: "static",//点击空白处不关闭对话框
                                show: true
                            });
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _changeMonth: function (_cycles) {
                if ('-102' == _cycles) {
                    vc.component.payFeeOrderInfo.totalFeePrice = 0.00;
                    vc.component.payFeeOrderInfo.receivedAmount = '';
                    return;
                }
                let _newCycles = _cycles;

                if (_cycles == '') {
                    _newCycles = $that.payFeeOrderInfo.paymentCycles[0];
                }
                vc.component.payFeeOrderInfo.totalFeePrice = Math.floor(parseFloat(_newCycles) * parseFloat(vc.component.payFeeOrderInfo.feePrice) * 100) / 100;
                vc.component.payFeeOrderInfo.receivedAmount = $that._mathCeil(vc.component.payFeeOrderInfo.totalFeePrice);
            },
            changeCycle: function (_cycles) {
                if (_cycles == '') {
                    return;
                }
                vc.component.payFeeOrderInfo.totalFeePrice = Math.floor(parseFloat(_cycles) * parseFloat(vc.component.payFeeOrderInfo.feePrice) * 100) / 100;
                vc.component.payFeeOrderInfo.receivedAmount = $that._mathCeil(vc.component.payFeeOrderInfo.totalFeePrice);
            },
            _back: function () {
                $('#payFeeResult').modal("hide");
                vc.getBack();
            },
            _goBack: function () {
                vc.goBack();
            },
            _printAndBack: function () {
                //$('#payFeeResult').modal("hide");
                window.open("/print.html#/pages/property/printPayFee?receiptId=" + $that.payFeeOrderInfo.receiptId)
            },
            _mathCeil: function (_price) {
                return Math.ceil(_price);
            }
        }

    });
})(window.vc);
