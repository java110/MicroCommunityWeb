(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            batchPayFeeOrderInfo: {
                batchFees: [],
                selectPayFeeIds: [],
                feePrices: 0.00,
                communityId: vc.getCurrentCommunity().communityId,
                ownerId: '',
                payerObjType: '',
                detailIds: '',
                remark: '',
                primeRate: '',
                primeRates: [],
                toFixedSign: 1, // 编码映射-应收款取值标识
                receivedAmountSwitch: '',
                offlinePayFeeSwitch: '1'
            }
        },
        watch: {
            'batchPayFeeOrderInfo.selectPayFeeIds': {
                deep: true,
                handler: function() {
                    $that._doComputeTotalFee();
                }
            }
        },
        _initMethod: function() {
            let _ownerId = vc.getParam('ownerId');
            let _payerObjType = vc.getParam('payerObjType');
            if (!vc.notNull(_ownerId)) {
                vc.toast('非法操作');
                vc.getBack();
                return;
            }
            $that.batchPayFeeOrderInfo.ownerId = _ownerId;
            $that.batchPayFeeOrderInfo.payerObjType = _payerObjType;
            $that._loadBatchFees();
            //与字典表支付方式关联
            vc.getDict('pay_fee_detail', "prime_rate", function(_data) {
                vc.component.batchPayFeeOrderInfo.primeRates = _data;
            });
        },
        _initEvent: function() {},
        methods: {
            _loadBatchFees: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.batchPayFeeOrderInfo.ownerId,
                        payerObjType: $that.batchPayFeeOrderInfo.payerObjType,
                        state: '2008001'
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function(json) {
                        let _json = JSON.parse(json);
                        let _fees = _json.fees;
                        if (!_fees || _fees.length < 1) {
                            return;
                        }
                        $that.batchPayFeeOrderInfo.batchFees = _fees;
                        $that.batchPayFeeOrderInfo.selectPayFeeIds = [];
                        $that.batchPayFeeOrderInfo.batchFees.forEach(item => {
                            $that.batchPayFeeOrderInfo.selectPayFeeIds.push(item.feeId);
                            item.cycles = item.paymentCycle;
                            item.receivableAmount = $that._getFixedNum(item.feeTotalPrice);
                            item.receivedAmount = item.receivableAmount;
                        });
                        let toFixedSign = _fees[0].val;
                        // 防止后台设置有误
                        if (toFixedSign == 1 || toFixedSign == 2 || toFixedSign == 3 || toFixedSign == 4 || toFixedSign == 5) {
                            $that.batchPayFeeOrderInfo.toFixedSign = toFixedSign;
                        }
                        $that._doComputeTotalFee();
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _payFee: function() {
                if (vc.component.batchPayFeeOrderInfo.selectPayFeeIds.length <= 0) {
                    vc.toast('未选择费用');
                    return;
                }
                //打开model
                $("#doBatchPayFeeModal").modal('show');
            },
            _closeDoBatchPayFeeModal: function() {
                $("#doBatchPayFeeModal").modal('hide');
            },
            _doPayFee: function() {
                let _fees = [];
                let _printFees = [];
                if ($that.batchPayFeeOrderInfo.primeRate == '') {
                    vc.toast('请选择支付方式');
                    return;
                }
                $that.batchPayFeeOrderInfo.selectPayFeeIds.forEach(function(_item) {
                    $that.batchPayFeeOrderInfo.batchFees.forEach(function(_batchFeeItem) {
                        if (_item == _batchFeeItem.feeId) {
                            _batchFeeItem.primeRate = $that.batchPayFeeOrderInfo.primeRate;
                            _fees.push(_batchFeeItem);
                            _printFees.push({
                                feeId: _item,
                                squarePrice: _batchFeeItem.squarePrice,
                                additionalAmount: _batchFeeItem.additionalAmount,
                                feeName: _batchFeeItem.feeName,
                                amount: _batchFeeItem.feePrice,
                                roomName: $that.batchPayFeeOrderInfo.roomName,
                                primeRate: $that.batchPayFeeOrderInfo.primeRate
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
                    fees: _fees
                }
                vc.http.apiPost(
                    '/fee.payBatchFee',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        $that._closeDoBatchPayFeeModal();
                        if (_json.code == 0) {
                            let _data = JSON.parse(json).data;
                            let detailIds = '';
                            _data.forEach(item => {
                                detailIds += (item + ',');
                            })
                            $that.batchPayFeeOrderInfo.detailIds = detailIds;
                            //vc.saveData('_feeInfo', _feeInfo);
                            //关闭model
                            $("#payFeeResult").modal({
                                backdrop: "static", //点击空白处不关闭对话框
                                show: true
                            });
                            vc.component.batchPayFeeOrderInfo.selectPayFeeIds = [];
                            $that._loadBatchFees();
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
            _back: function() {
                $('#payFeeResult').modal("hide");
                vc.getBack();
            },
            _printAndBack: function() {
                $('#payFeeResult').modal("hide");
                window.open("/print.html#/pages/property/printPayFee?detailIds=" + $that.batchPayFeeOrderInfo.detailIds)
            },
            _goBack: function() {
                vc.goBack();
            },
            _printOwnOrder: function() {
                vc.saveData('java110_printFee', {
                    fees: $that.batchPayFeeOrderInfo.batchFees,
                    roomName: $that.batchPayFeeOrderInfo.roomName
                });
                //打印催交单
                window.open('/print.html#/pages/property/printBatchFee?roomId=' + $that.batchPayFeeOrderInfo.payObjId)
            },
            _getDeadlineTime: function(_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                //return vc.dateSub(_fee.deadlineTime, _fee.feeFlag);
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
            _getEndTime: function(_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
            },

            checkAll: function(e) {
                var checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.batchPayFeeOrderInfo.selectPayFeeIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.batchPayFeeOrderInfo.selectPayFeeIds = [];
                }
            },
            _getBatchPayFeeRoomName: function(fee) {
                let _feeName = ''
                fee.feeAttrs.forEach(item => {
                    if (item.specCd == '390012') {
                        _feeName = item.value;
                    }
                })

                return _feeName;
            },
            _getBatchPaymentCycles: function(fee) {
                let paymentCycles = [];
                for (let _index = 1; _index < 7; _index++) {
                    paymentCycles.push(_index * parseFloat(fee.paymentCycle))
                }

                return paymentCycles;
            },
            _doComputeTotalFee: function() {
                let _selectPayFeeIds = $that.batchPayFeeOrderInfo.selectPayFeeIds;
                let _batchFees = $that.batchPayFeeOrderInfo.batchFees;
                let _totalFee = 0;
                _selectPayFeeIds.forEach(selectItem => {
                    _batchFees.forEach(feeItem => {
                        if (selectItem == feeItem.feeId && feeItem.receivedAmount) {
                            _totalFee += parseFloat(feeItem.receivedAmount)
                        }
                    })
                })

                $that.batchPayFeeOrderInfo.feePrices = _totalFee.toFixed(2);

            },
            _changeMonth: function(_cycles, _fee) {
                if (_cycles == '') {
                    _cycles = _fee.cycles;
                }
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: _fee.feeId,
                        page: 1,
                        row: 1,
                        cycle: _cycles
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeApi/listFeeObj',
                    param,
                    function(json, res) {
                        let listRoomData = JSON.parse(json);
                        _fee.receivableAmount = $that._getFixedNum(listRoomData.data.feeTotalPrice);
                        _fee.receivedAmount = _fee.receivableAmount;
                        $that._doComputeTotalFee();
                        $that.$forceUpdate();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            /**
             * 格式化数字
             */
            _getFixedNum: function(num) {
                if ($that.batchPayFeeOrderInfo.toFixedSign == 2) {
                    return $that._mathToFixed1(num);
                } else if ($that.batchPayFeeOrderInfo.toFixedSign == 3) {
                    return $that._mathCeil(num);
                } else if ($that.batchPayFeeOrderInfo.toFixedSign == 4) {
                    return $that._mathFloor(num);
                } else if ($that.batchPayFeeOrderInfo.toFixedSign == 5) {
                    return $that._mathRound(num);
                } else {
                    return $that._mathToFixed2(num);
                }
            },
            /**
             * 向上取整
             */
            _mathCeil: function(_price) {
                return Math.ceil(_price);
            },
            /**
             * 向下取整
             */
            _mathFloor: function(_price) {
                return Math.floor(_price);
            },
            /**
             * 四首五入取整
             */
            _mathRound: function(_price) {
                return Math.round(_price);
            },
            /**
             * 保留小数点后一位
             */
            _mathToFixed1: function(_price) {
                return parseFloat(_price).toFixed(1);
            },
            /**
             * 保留小数点后两位
             */
            _mathToFixed2: function(_price) {
                return parseFloat(_price).toFixed(2);
            },
        }
    });
})(window.vc);