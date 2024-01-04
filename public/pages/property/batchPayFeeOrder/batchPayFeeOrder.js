(function (vc) {
    vc.extends({
        data: {
            batchPayFeeOrderInfo: {
                batchFees: [],
                allBatchFees: [],
                selectPayFeeIds: [],
                feePrices: 0.00,
                communityId: vc.getCurrentCommunity().communityId,
                ownerId: '',
                payerObjType: '',
                remark: '',
                payerObjNames: [],
                payObjs: [],
                accountAmount: 0.0,
                acctId: ''
            }
        },
        watch: {
            'batchPayFeeOrderInfo.selectPayFeeIds': {
                deep: true,
                handler: function () {
                    $that._doComputeTotalFee();
                    let checkObj = document.querySelectorAll('.all-check'); // 获取所有checkbox项
                    let _selectPayFeeIds = $that.batchPayFeeOrderInfo.selectPayFeeIds;
                    let _batchFees = $that.batchPayFeeOrderInfo.batchFees;
                    if (_selectPayFeeIds.length < _batchFees.length) {
                        checkObj[0].checked = false;
                    } else {
                        checkObj[0].checked = true;
                    }
                }
            }
        },
        _initMethod: function () {
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
            vc.emit('payFeeUserAccount', 'computeFeeUserAmount', {
                ownerId: _ownerId
            });

        },
        _initEvent: function () {
            vc.on('batchPayFeeOrder', 'changeMonth', function (_fee) {
                $that._changeMonth(_fee.cycle, _fee);
            });
            // 用户账户组件事件
            vc.on('batchPayFeeOrder', 'changeUserAmountPrice', function (_param) {
                $that.batchPayFeeOrderInfo.accountAmount = _param.totalUserAmount;
                if (_param.selectAccount && _param.selectAccount.length > 0) {
                    _param.selectAccount.forEach(_acct => {
                        if (_acct.acctType == '2003') {
                            $that.batchPayFeeOrderInfo.acctId = _acct.acctId;
                        }
                    })
                }
                $that._doComputeTotalFee();
            });
            vc.on('batchPayFeeOrder', 'loadBatchFees', function () {
                $that._loadBatchFees();
                vc.emit('payFeeUserAccount', 'computeFeeUserAmount', {
                    ownerId: $that.batchPayFeeOrderInfo.ownerId
                });
            });
        },
        methods: {
            _loadBatchFees: function () {
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
                let _batchFees = [];
                let _selectPayFeeIds = [];
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        let _fees = _json.fees;
                        if (!_fees || _fees.length < 1) {
                            return;
                        }
                        _fees = _fees.sort($that._batchRoomFeeCompare);
                        //todo 过滤 费用为0 的场景
                        _fees.forEach(_feeItem => {
                            if (parseFloat(_feeItem.amountOwed) == 0 && _feeItem.feeFlag == '2006012') {
                                return;
                            }
                            _batchFees.push(_feeItem);
                        });
                        _batchFees.forEach(item => {
                            item.cycles = item.paymentCycle;
                            item.receivableAmount = item.feeTotalPrice;
                            item.receivedAmount = item.receivableAmount;
                            item.tempCycle = '-100';
                            _selectPayFeeIds.push(item.feeId);
                        });
                        $that.batchPayFeeOrderInfo.allBatchFees = _batchFees;
                        $that.batchPayFeeOrderInfo.selectPayFeeIds = _selectPayFeeIds;
                        $that.batchPayFeeOrderInfo.batchFees = _batchFees;
                        $that._pushPayObjs();
                        $that._doComputeTotalFee();
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _batchRoomFeeCompare: function (a, b) {
                let val1 = a.payerObjName;
                let val2 = b.payerObjName;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            },
            _pushPayObjs: function () {
                let _allBatchFees = $that.batchPayFeeOrderInfo.allBatchFees;
                let _payObjs = $that.batchPayFeeOrderInfo.payObjs;
                let _payerObjNames = $that.batchPayFeeOrderInfo.payerObjNames;
                let _payerObjName = '';
                _allBatchFees.forEach(_fee => {
                    _payerObjName = '';
                    if (!_fee.feeAttrs) {
                        return;
                    }
                    _fee.feeAttrs.forEach(item => {
                        if (item.specCd == '390012') {
                            _payerObjName = item.value;
                        }
                    })
                    if (_payerObjName && !$that._hasPayObjsIn(_payerObjName)) {
                        _payObjs.push(_payerObjName);
                        _payerObjNames.push(_payerObjName);
                    }
                });
            },
            _chanagePayerObjName: function () {
                let _allBatchFees = $that.batchPayFeeOrderInfo.allBatchFees;
                $that.batchPayFeeOrderInfo.batchFees = [];
                _allBatchFees.forEach(_fee => {
                    _payerObjName = '';
                    _fee.feeAttrs.forEach(item => {
                        if (item.specCd == '390012') {
                            _payerObjName = item.value;
                        }
                    })
                    if (_payerObjName && $that._hasPayObjNamesIn(_payerObjName)) {
                        $that.batchPayFeeOrderInfo.batchFees.push(_fee)
                    }
                });
                $that._doComputeTotalFee();
            },
            _hasPayObjsIn: function (_payerObjName) {
                let _payObjs = $that.batchPayFeeOrderInfo.payObjs;
                let _hasIn = false;
                _payObjs.forEach(item => {
                    if (item == _payerObjName) {
                        _hasIn = true;
                    }
                });
                return _hasIn;
            },
            _hasPayObjNamesIn: function (_payerObjName) {
                let _payObjs = $that.batchPayFeeOrderInfo.payerObjNames;
                let _hasIn = false;
                _payObjs.forEach(item => {
                    if (item == _payerObjName) {
                        _hasIn = true;
                    }
                });
                return _hasIn;
            },
            _openPayFee: function (_payType) {
                if ($that.batchPayFeeOrderInfo.selectPayFeeIds.length <= 0) {
                    vc.toast('未选择费用');
                    return;
                }
                let _payerObjName = $that.batchPayFeeOrderInfo.payerObjNames.join(',')
                //打开model
                vc.emit('batchPayConfirm', 'openBatchPayFee', {
                    fees: $that._getPayFees(),
                    payType: _payType,
                    feePrices: $that.batchPayFeeOrderInfo.feePrices,
                    payerObjName: _payerObjName,
                    acctId: $that.batchPayFeeOrderInfo.acctId,
                    accountAmount: $that.batchPayFeeOrderInfo.accountAmount,
                });
            },
            _getPayFees: function () {
                let _fees = [];
                let _selectPayFeeIds = $that.batchPayFeeOrderInfo.selectPayFeeIds;
                let _batchFees = $that.batchPayFeeOrderInfo.batchFees;
                _selectPayFeeIds.forEach(function (_item) {
                    _batchFees.forEach(function (_batchFeeItem) {
                        if (_item == _batchFeeItem.feeId) {
                            _fees.push(_batchFeeItem);
                        }
                    })
                });
                return _fees;
            },

            _goBack: function () {
                vc.goBack();
            },
            _printOwnOrder: function () {
                vc.saveData('java110_printFee', {
                    fees: $that.batchPayFeeOrderInfo.batchFees,
                    roomName: $that.batchPayFeeOrderInfo.roomName
                });
                //打印催交单
                window.open('/print.html#/pages/property/printBatchFee?roomId=' + $that.batchPayFeeOrderInfo.payObjId)
            },
            _getDeadlineTime: function (_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
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
                            $that.batchPayFeeOrderInfo.selectPayFeeIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.batchPayFeeOrderInfo.selectPayFeeIds = [];
                }
            },
            _getBatchPayFeeRoomName: function (fee) {
                let _feeName = ''
                if (!fee.feeAttrs) {
                    return "";
                }
                fee.feeAttrs.forEach(item => {
                    if (item.specCd == '390012') {
                        _feeName = item.value;
                    }
                })
                return _feeName;
            },
            _getBatchPaymentCycles: function (fee) {
                let paymentCycles = [];
                for (let _index = 1; _index < 13; _index++) {
                    paymentCycles.push(_index * parseFloat(fee.paymentCycle))
                }
                return paymentCycles;
            },
            _doComputeTotalFee: function () {
                let _selectPayFeeIds = $that.batchPayFeeOrderInfo.selectPayFeeIds;
                let _batchFees = $that.batchPayFeeOrderInfo.batchFees;
                let _accountAmount = $that.batchPayFeeOrderInfo.accountAmount;
                let _totalFee = 0;
                _selectPayFeeIds.forEach(selectItem => {
                    _batchFees.forEach(feeItem => {
                        if (selectItem == feeItem.feeId && feeItem.receivedAmount) {
                            _totalFee += parseFloat(feeItem.receivedAmount)
                        }
                    })
                });
                if (_accountAmount) {
                    _totalFee = _totalFee - parseFloat(_accountAmount);
                }
                if (_totalFee < 0) {
                    _totalFee = 0;
                }
                $that.batchPayFeeOrderInfo.feePrices = _totalFee.toFixed(2);
            },
            _changeMonth: function (_cycles, _fee) {
                if (!_cycles) {
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

                if (_fee.tempCycle == '-103') {
                    let _custEndTime = vc.dateAdd(_fee.custEndTime);
                    //前端选择会默认 少一天 所以 加上一天
                    param.params.custEndTime = _custEndTime;
                }
                //todo 自定义金额时不计算
                if (_fee.tempCycle == '-101') {
                    $that._doComputeTotalFee();
                    $that.$forceUpdate();
                    return;
                }

                //发送get请求
                vc.http.apiGet('/feeApi/listFeeObj',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        _fee.receivableAmount = _json.data.feeTotalPrice;
                        _fee.receivedAmount = _fee.receivableAmount;
                        $that._doComputeTotalFee();
                        $that.$forceUpdate();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _settingsFeeCycle: function (_batchFee) {
                vc.emit('batchFeeCycle', 'openBatchCycle', _batchFee);
            }
        }
    });
})(window.vc);