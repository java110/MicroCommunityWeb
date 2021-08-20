(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            owePayFeeOrderInfo: {
                oweFees: [],
                selectPayFeeIds: [],
                feePrices: 0.00,
                communityId: vc.getCurrentCommunity().communityId,
                payObjId: '',
                payObjType: '',
                roomName: '',
                receiptIds: '',
                remark: '',
                primeRate: '',
                primeRates: []
            }
        },
        watch: {
            'owePayFeeOrderInfo.selectPayFeeIds': {
                deep: true,
                handler: function () {
                    $that._dealSelectFee();
                }
            }
        },
        _initMethod: function () {
            let _payObjId = vc.getParam('payObjId');
            let _payObjType = vc.getParam('payObjType');
            if (!vc.notNull(_payObjId)) {
                vc.toast('非法操作');
                vc.getBack();
                return;
            }
            $that.owePayFeeOrderInfo.payObjId = _payObjId;
            $that.owePayFeeOrderInfo.payObjType = _payObjType;
            $that.owePayFeeOrderInfo.roomName = vc.getParam('roomName');
            $that._loadOweFees();
            //与字典表支付方式关联
            vc.getDict('pay_fee_detail', "prime_rate", function (_data) {
                vc.component.owePayFeeOrderInfo.primeRates = _data;
            });
        },
        _initEvent: function () {
        },
        methods: {
            _loadOweFees: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        payObjId: $that.owePayFeeOrderInfo.payObjId,
                        payObjType: $that.owePayFeeOrderInfo.payObjType,
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeApi/listOweFees',
                    param,
                    function (json) {
                        var _json = JSON.parse(json);
                        let _fees = _json.data;
                        if (_fees.length < 1) {
                            $that.owePayFeeOrderInfo.oweFees = [];
                            vc.toast('当前没有欠费数据');
                            return;
                        }
                        $that.owePayFeeOrderInfo.oweFees = _fees;
                        $that.owePayFeeOrderInfo.selectPayFeeIds = [];
                        $that.owePayFeeOrderInfo.oweFees.forEach(item => {
                            $that.owePayFeeOrderInfo.selectPayFeeIds.push(item.feeId);
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _payFee: function () {
                if(vc.component.owePayFeeOrderInfo.selectPayFeeIds.length <= 0){
                    vc.toast('未选择费用');
                    return;
                }
                //打开model
                $("#doOwePayFeeModal").modal('show');
            },
            _closeDoOwePayFeeModal: function () {
                $("#doOwePayFeeModal").modal('hide');
            },
            _doPayFee: function () {
                let _fees = [];
                let _printFees = [];
                if ($that.owePayFeeOrderInfo.primeRate == '') {
                    vc.toast('请选择支付方式');
                    return;
                }
                $that.owePayFeeOrderInfo.selectPayFeeIds.forEach(function (_item) {
                    $that.owePayFeeOrderInfo.oweFees.forEach(function (_oweFeeItem) {
                        if (_item == _oweFeeItem.feeId) {
                            _fees.push({
                                feeId: _item,
                                startTime: _oweFeeItem.endTime,
                                endTime: _oweFeeItem.deadlineTime,
                                receivedAmount: _oweFeeItem.feePrice,
                                primeRate: $that.owePayFeeOrderInfo.primeRate
                            });
                            _printFees.push({
                                feeId: _item,
                                squarePrice: _oweFeeItem.squarePrice,
                                additionalAmount: _oweFeeItem.additionalAmount,
                                feeName: _oweFeeItem.feeName,
                                amount: _oweFeeItem.feePrice,
                                roomName: $that.owePayFeeOrderInfo.roomName,
                                primeRate: $that.owePayFeeOrderInfo.primeRate
                            });
                        }
                    })
                })
                if (_fees.length < 1) {
                    vc.toast('未选中要缴费的项目');
                    return;
                }
                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    fees: _fees,
                    remark: $that.owePayFeeOrderInfo.remark
                }
                vc.http.apiPost(
                    '/fee.payOweFee',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        $that._closeDoOwePayFeeModal();
                        if (_json.code == 0) {
                            let _data = JSON.parse(json).data;
                            let receiptIds = '';
                            _data.forEach(item => {
                                receiptIds += (item.receiptId + ',');
                            })
                            $that.owePayFeeOrderInfo.receiptIds = receiptIds;
                            //vc.saveData('_feeInfo', _feeInfo);
                            //关闭model
                            $("#payFeeResult").modal({
                                backdrop: "static",//点击空白处不关闭对话框
                                show: true
                            });
                            vc.component.owePayFeeOrderInfo.selectPayFeeIds = [];
                            $that._loadOweFees();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        $that._closeDoOwePayFeeModal();
                        vc.toast(errInfo);
                    });
            },
            _back: function () {
                $('#payFeeResult').modal("hide");
                vc.getBack();
            },
            _printAndBack: function () {
                $('#payFeeResult').modal("hide");
                window.open("/print.html#/pages/property/printPayFee?receiptIds=" + $that.owePayFeeOrderInfo.receiptIds)
            },
            _dealSelectFee: function () {
                let totalFee = 0.00;
                $that.owePayFeeOrderInfo.selectPayFeeIds.forEach(function (_item) {
                    console.log('_item', _item)
                    $that.owePayFeeOrderInfo.oweFees.forEach(function (_oweFeeItem) {
                        if (_item == _oweFeeItem.feeId) {
                            totalFee += _oweFeeItem.feePrice;
                        }
                    });
                })
                $that.owePayFeeOrderInfo.feePrices = Math.round(totalFee * 100, 2) / 100;
            },
            _goBack: function () {
                vc.goBack();
            },
            _printOwnOrder: function () {
                vc.saveData('java110_printFee', {
                    fees: $that.owePayFeeOrderInfo.oweFees,
                    roomName: $that.owePayFeeOrderInfo.roomName
                });
                //打印催交单
                window.open('/print.html#/pages/property/printOweFee?roomId=' + $that.owePayFeeOrderInfo.payObjId)
            },
            _getDeadlineTime: function (_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                //return vc.dateSub(_fee.deadlineTime, _fee.feeFlag);
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
            _getEndTime: function (_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
            },

            checkAll: function (e) {
                var checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.owePayFeeOrderInfo.selectPayFeeIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.owePayFeeOrderInfo.selectPayFeeIds = [];
                }
            }
        }
    });
})(window.vc);
