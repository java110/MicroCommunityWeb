(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeOrderInfo: {
                feeId: '',
                feeName: '',
                feeTypeCdName: '',
                feeTypeCd: '',
                primeRates: '',
                primeRate: '',
                endTime: '',
                feeFlag: '',
                feePrice: 0.00,
                tempCycles: '',
                cycles: '',
                paymentCycles: [],
                totalFeePrice: 0.00,
                receivedAmount: '',
                receivedAmountNumber: '',
                communityId: vc.getCurrentCommunity().communityId,
                payerObjName: '',
                payerObjId: '',
                payerObjType: '',
                remark: '',
                builtUpArea: 0.0,
                squarePrice: 0.0,
                additionalAmount: 0.0,
                receiptId: '',
                showEndTime: '',
                accountList: [],
                integralAmount: '',
                cashAmount: '',
                couponAmount: '',
                selectDiscount: [],
                totalDiscountMoney: 0.0,
                scale: 1, // 编码映射-应收款取值标识
                decimalPlace: 2,
                receivedAmountSwitch: '',
                createTime: vc.dateTimeFormat(new Date().getTime()),
                accountAmount: 0.0, // 账户金额
                viewAccountAmount: 0.0, // 账户金额
                deductionAmount: 0.0, //抵扣金额
                redepositAmount: 0.0, //转存金额
                selectUserAccount: [], // 选中的账户
                authCode: '',
                orderId: '',
                offlinePayFeeSwitch: '1',
                flag: '',
                custEndTime: '',
                configId: '',
                roomName: '',
                sign: 1,
                integralQuantity: 0,
            }
        },
        watch: {
            'payFeeOrderInfo.receivedAmount': {
                deep: true,
                handler: function() {
                    //计算折扣金额和转存金额
                    $that._doComputeAccountRedepositDeduction();
                }
            }
        },
        _initMethod: function() {
            $that.payFeeOrderInfo.feeId = vc.getParam('feeId');
            $that._initCustEndDate();
            $that.listAndComputeFeeInfo();
        },
        _initEvent: function() {

            // 子组件折扣change事件
            vc.on('payFeeOrder', 'changeDiscountPrice', function(_param) {
                // 用未格式化的总金额减优惠金额
                let _totalFeePrice = $that.payFeeOrderInfo.totalFeePrice;
                if (_totalFeePrice < 0) {
                    return;
                }
                let _totalDiscountMoney = _param.totalDiscountMoney;
                //如果应收小区 优惠金额 则不优惠
                if (_totalFeePrice < _totalDiscountMoney) {
                    vc.toast("实收款不能为负数！")
                }
                $that.payFeeOrderInfo.selectDiscount = _param.selectDiscount;
                $that.payFeeOrderInfo.totalDiscountMoney = _totalDiscountMoney;
                // 该处js做减法后，会出现小数点后取不尽的bug，再次处理
                let receivedAmount = _totalFeePrice - _totalDiscountMoney;
                $that.payFeeOrderInfo.receivedAmount = $that._getFixedNum(receivedAmount);
            });
            // 用户账户组件事件
            vc.on('payFeeOrder', 'changeUserAmountPrice', function(_param) {
                $that.payFeeOrderInfo.selectUserAccount = _param.selectAccount;
                $that.payFeeOrderInfo.accountAmount = _param.totalUserAmount;
                $that.payFeeOrderInfo.accountList = _param.accountList;
                $that.payFeeOrderInfo.integralAmount = _param.integralAmount;
                $that.payFeeOrderInfo.cashAmount = _param.cashAmount;
                $that.payFeeOrderInfo.couponAmount = _param.couponAmount;
                $that._doComputeAccountRedepositDeduction();
            });
            // 账户预缴弹窗
            vc.on('payFeeOrder', 'openAddModalWithParams', function(_param) {
                _param.redepositAmount = $that.payFeeOrderInfo.redepositAmount;
                _param.receivedAmount = $that.payFeeOrderInfo.receivedAmount;
                vc.emit('prestoreAccount2', 'openAddModalWithParams', _param)
            });
            vc.on('payFeeOrder', 'initData', function(_param) {
                // 重新赋值下拉列表
                $that.payFeeOrderInfo.paymentCycles = [];
                for (let _index = 1; _index < 7; _index++) {
                    $that.payFeeOrderInfo.paymentCycles.push(_index * _param.paymentCycle);
                }
            })
        },
        methods: {
            popOverShowMsg1: function() {
                $('.popover-show1').popover('show');
            },
            popOverHideMsg1: function() {
                $('.popover-show1').popover('hide');
            },
            _initCustEndDate: function() {
                vc.initDate('cust-endTime', function(_value) {
                    $that.payFeeOrderInfo.custEndTime = _value;
                    let start = Date.parse(new Date($that.payFeeOrderInfo.endTime))
                    let end = Date.parse(new Date($that.payFeeOrderInfo.custEndTime))
                    if (start - end >= 0) {
                        vc.toast("结束时间必须大于起始时间")
                        $that.payFeeOrderInfo.custEndTime = '';
                        return;
                    }
                });
                // 查询用户账户
                vc.initDateTime('payFeeOrderCreateTime', function(_value) {
                    $that.payFeeOrderInfo.createTime = _value;
                });
                //与字典表支付方式关联
                vc.getDict('pay_fee_detail', "prime_rate", function(_data) {
                    $that.payFeeOrderInfo.primeRates = _data;
                });
                vc.emit('payFeeUserAccount', 'computeFeeUserAmount', {
                    feeId: $that.payFeeOrderInfo.feeId,
                });
            },
            _useUserAccountChange: function(e) {
                if (e.target.checked) {
                    // 查询用户账户
                    vc.emit('payFeeUserAccount', 'computeFeeUserAmount', {
                        feeId: $that.payFeeOrderInfo.feeId,
                    });
                } else {
                    // 隐藏用户账户
                    vc.emit('payFeeUserAccount', 'clear', {});
                }
            },
            payFeeValidate: function() {
                return vc.validate.validate({
                    payFeeOrderInfo: vc.component.payFeeOrderInfo
                }, {
                    'payFeeOrderInfo.feeId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用ID不能为空"
                    }],
                    'payFeeOrderInfo.cycles': [{
                        limit: "required",
                        param: "",
                        errInfo: "缴费周期不能为空"
                    }],
                    'payFeeOrderInfo.primeRate': [{
                        limit: "required",
                        param: "",
                        errInfo: "支付方式不能为空"
                    }],
                    'payFeeOrderInfo.receivedAmount': [{
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
            /**
             * 点击 “提交缴费”
             */
            _openPayFee: function(_type) {
                // 周期不为空且不是自定义周期
                if ($that.payFeeOrderInfo.tempCycles != "" && $that.payFeeOrderInfo.tempCycles != '-102') {
                    $that.payFeeOrderInfo.cycles = $that.payFeeOrderInfo.tempCycles;
                }
                // 一次性费用
                if ($that.payFeeOrderInfo.feeFlag == '2006012') {
                    $that.payFeeOrderInfo.cycles = '1';
                    $that.payFeeOrderInfo.tempCycles = '1';
                }
                // 新增缴费周期必选项
                if ($that.payFeeOrderInfo.tempCycles == "") {
                    vc.toast("请选择缴费周期");
                    return;
                }
                if (!$that.payFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 缴费周期为正整数时，显示缴费结束时间
                if (!(/(^[1-9]\d*$)/.test($that.payFeeOrderInfo.cycles))) {
                    $that.payFeeOrderInfo.showEndTime = '';
                } else {
                    $that.payFeeOrderInfo.showEndTime = vc.addMonth(new Date($that.payFeeOrderInfo.endTime), parseInt($that.payFeeOrderInfo.cycles));
                }
                if ($that.payFeeOrderInfo.selectUserAccount.length > 0 && $that.payFeeOrderInfo.selectUserAccount[0].acctType != "2004" &&
                    $that.payFeeOrderInfo.accountAmount >= $that.payFeeOrderInfo.receivedAmount) {
                    $that.payFeeOrderInfo.flag = "";
                }
                if ($that.payFeeOrderInfo.selectUserAccount.length < 1) {
                    $that.payFeeOrderInfo.integralAmount = "";
                    $that.payFeeOrderInfo.cashAmount = "";
                }
                if ($that.payFeeOrderInfo.selectUserAccount.length == 1 && $that.payFeeOrderInfo.selectUserAccount[0].acctType == '2003') { //现金账户
                    $that.payFeeOrderInfo.integralAmount = "";
                } else if ($that.payFeeOrderInfo.selectUserAccount.length == 1 && $that.payFeeOrderInfo.selectUserAccount[0].acctType == '2004') { //积分账户
                    $that.payFeeOrderInfo.cashAmount = "";
                } else {
                    $that.payFeeOrderInfo.integralAmount = "";
                    $that.payFeeOrderInfo.cashAmount = "";
                }
                $that.payFeeOrderInfo.selectUserAccount.forEach(item => {
                    let number = 0.0;
                    let number2 = 0.0;
                    if (item.acctType == "2004") { //积分账户
                        if (parseFloat(item.amount) > parseFloat(item.maximumNumber)) {
                            number2 = parseFloat($that.payFeeOrderInfo.receivedAmount * item.deductionProportion);
                            if (item.maximumNumber > number2) {
                                number = parseFloat(number2 / item.deductionProportion);
                            } else {
                                number = parseFloat(item.maximumNumber / item.deductionProportion);
                            }
                        } else {
                            number2 = parseFloat($that.payFeeOrderInfo.receivedAmount * item.deductionProportion);
                            if (item.amount > number2) {
                                number = parseFloat(number2 / item.deductionProportion);
                            } else {
                                number = parseFloat(item.amount / item.deductionProportion);
                            }
                        }
                        $that.payFeeOrderInfo.integralAmount = number; //积分抵扣
                        $that.payFeeOrderInfo.receivedAmountNumber = parseFloat($that.payFeeOrderInfo.receivedAmount - number);
                        $that.payFeeOrderInfo.flag = "true";
                    } else if (item.acctType == "2003") { //现金账户
                        if ($that.payFeeOrderInfo.receivedAmount != null && $that.payFeeOrderInfo.receivedAmount != '' && $that.payFeeOrderInfo.flag != 'true' && parseFloat(item.amount) > parseFloat($that.payFeeOrderInfo.receivedAmount)) {
                            $that.payFeeOrderInfo.cashAmount = $that.payFeeOrderInfo.receivedAmount;
                        } else if ($that.payFeeOrderInfo.receivedAmountNumber != null && $that.payFeeOrderInfo.receivedAmountNumber != '' && parseFloat(item.amount) > parseFloat($that.payFeeOrderInfo.receivedAmountNumber)) {
                            $that.payFeeOrderInfo.cashAmount = $that.payFeeOrderInfo.receivedAmountNumber;
                        } else {
                            $that.payFeeOrderInfo.cashAmount = item.amount;
                        }
                    }
                    if ($that.payFeeOrderInfo.flag == 'true' && $that.payFeeOrderInfo.integralAmount != null && $that.payFeeOrderInfo.integralAmount != '' &&
                        $that.payFeeOrderInfo.selectUserAccount[0].acctType == '2003') {
                        $that.payFeeOrderInfo.cashAmount = parseFloat($that.payFeeOrderInfo.cashAmount) - parseFloat($that.payFeeOrderInfo.integralAmount);
                    }
                });
                $that.payFeeOrderInfo.payType = _type;
                vc.emit('payFeeOrderConfirm', 'openConfirm', $that.payFeeOrderInfo);
            },
            /**
             * 下拉 change 事件
             * @param {*} _cycles
             */
            _changeMonth: function(_cycles) {
                $that.payFeeOrderInfo.custEndTime = '';
                if ('-102' == _cycles) {
                    $that.payFeeOrderInfo.totalFeePrice = 0.00;
                    $that.payFeeOrderInfo.receivedAmount = 0.00;
                    if ($that.payFeeOrderInfo.cycles) {
                        $that.listAndComputeFeeInfo($that.payFeeOrderInfo.cycles);
                    }
                    return;
                } else if ('-101' == _cycles) {
                    $that.payFeeOrderInfo.cycles = "101";
                    return;
                } else if ('-103' == _cycles) {
                    $that.payFeeOrderInfo.cycles = "103";
                    return;
                }
                let _newCycles = _cycles;
                if (_cycles == '') {
                    _newCycles = $that.payFeeOrderInfo.paymentCycles[0];
                }
                $that.listAndComputeFeeInfo(_newCycles);
            },
            /**
             * 输入 自定义 缴费周期
             * @param {*} _cycles
             */
            changeCycle: function(_cycles) {
                if (_cycles == '') {
                    return;
                }
                $that.listAndComputeFeeInfo(_cycles);
            },

            /**
             * 格式化数字
             */
            _getFixedNum: function(num) {
                if ($that.payFeeOrderInfo.toFixedSign == 2) {
                    return $that._mathToFixed1(num);
                } else if ($that.payFeeOrderInfo.toFixedSign == 3) {
                    return $that._mathCeil(num);
                } else if ($that.payFeeOrderInfo.toFixedSign == 4) {
                    return $that._mathFloor(num);
                } else if ($that.payFeeOrderInfo.toFixedSign == 5) {
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
            listAndComputeFeeInfo: function(_cycles) {
                if (!vc.notNull($that.payFeeOrderInfo.feeId)) {
                    return;
                }
                if (!_cycles) {
                    _cycles = 1;
                }
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: $that.payFeeOrderInfo.feeId,
                        page: 1,
                        row: 1,
                        cycle: _cycles
                    }
                };
                if (_cycles && _cycles == 0) {
                    let _custEndTime = vc.dateAdd($that.payFeeOrderInfo.custEndTime);
                    //前端选择会默认 少一天 所以 加上一天
                    param.params.custEndTime = _custEndTime;
                }
                //发送get请求
                vc.http.apiGet('/feeApi/listFeeObj',
                    param,
                    function(json, res) {
                        let listRoomData = JSON.parse(json);
                        vc.copyObject(listRoomData.data, $that.payFeeOrderInfo);
                        // 由于返回的键与档期那页面自定义的键不一致，单独赋值toFiexedSign
                        vc.emit('payFeeOrder', 'initData', listRoomData.data);

                        $that.payFeeOrderInfo.totalFeePrice = listRoomData.data.feeTotalPrice;
                        $that.payFeeOrderInfo.receivedAmount = listRoomData.data.feeTotalPrice;
                        let _deadlineTime = new Date(listRoomData.data.deadlineTime);
                        let _maxEndTime = new Date(listRoomData.data.maxEndTime);
                        if (_deadlineTime.getTime() > _maxEndTime.getTime()) {
                            vc.toast('超过最大计费结束时间，' + vc.dateSub(listRoomData.data.maxEndTime, listRoomData.data.feeFlag) + ",请用更小缴费周期或者自定义结束时间缴费");
                            return;
                        }
                        vc.emit('payFeeDiscount', 'computeFeeDiscount', {
                            feeId: $that.payFeeOrderInfo.feeId,
                            cycles: _cycles,
                            payerObjId: $that.payFeeOrderInfo.payerObjId,
                            payerObjType: $that.payFeeOrderInfo.payerObjType,
                            endTime: $that.payFeeOrderInfo.endTime
                        });

                        vc.emit('payFeeCoupon', 'computeFeeCoupon', {
                            feeId: $that.payFeeOrderInfo.feeId,
                            cycles: _cycles,
                            payerObjId: $that.payFeeOrderInfo.payerObjId,
                            payerObjType: $that.payFeeOrderInfo.payerObjType,
                            endTime: $that.payFeeOrderInfo.endTime
                        });
                        $that._listFeeIntegral(_cycles);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            /**
             *
             * accountAmount: 0.0, // 账户金额
             deductionAmount: 0.0, //抵扣金额
             redepositAmount: 0.0, //转存金额
             * 使用用户钱包余额
             */
            computeAccountRedepositDeduction: function() {
                //计算折扣金额和转存金额
                $that._doComputeAccountRedepositDeduction();
            },
            /**
             * 如果选择使用用户余额，则更新应缴金额
             *
             *  accountAmount: 0.0, // 账户金额
             viewAccountAmount: 0.0, // 账户金额
             deductionAmount: 0.0, //抵扣金额
             needDeductionAmount: false,
             redepositAmount: 0.0, //转存金额
             */
            _doComputeAccountRedepositDeduction: function() {
                let receivedAmount = $that.payFeeOrderInfo.receivedAmount; //实缴
                //计算
                let accountAmount = $that.payFeeOrderInfo.accountAmount;
                let deductionAmount = 0.0; // 抵消金额
                $that.payFeeOrderInfo.deductionAmount = deductionAmount;
                let redepositAmount = 0.0; //转存金额
                $that.payFeeOrderInfo.redepositAmount = redepositAmount;
                let totalDiscountMoney = $that.payFeeOrderInfo.totalDiscountMoney; // 优惠金额
                let totalFeePrice = $that.payFeeOrderInfo.totalFeePrice; //应缴
                //将显示账户金额实际刷成 账户金额
                $that.payFeeOrderInfo.viewAccountAmount = accountAmount;
                //计算转存 ，转存 = 实缴 + 折扣优惠 - 应缴  
                redepositAmount = parseFloat(receivedAmount) + parseFloat(totalDiscountMoney) - parseFloat(totalFeePrice);
                //转存
                if (parseFloat(redepositAmount) > 0) {
                    $that.payFeeOrderInfo.redepositAmount = redepositAmount.toFixed(2); // 计算转存
                    $that.payFeeOrderInfo.viewAccountAmount = parseFloat($that.payFeeOrderInfo.viewAccountAmount) + parseFloat($that.payFeeOrderInfo.redepositAmount);
                    return;
                }
                // 计算抵消金额 应缴 - 折扣  - 实缴 = 抵消金额  
                deductionAmount = parseFloat(totalFeePrice) - parseFloat(totalDiscountMoney) - parseFloat(receivedAmount);
                if (parseFloat(deductionAmount) > 0 && parseFloat(accountAmount) >= parseFloat(deductionAmount)) {
                    $that.payFeeOrderInfo.deductionAmount = deductionAmount.toFixed(2);
                    let viewAccountAmount = $that.payFeeOrderInfo.viewAccountAmount;
                    $that.payFeeOrderInfo.viewAccountAmount = parseFloat($that.payFeeOrderInfo.viewAccountAmount) - parseFloat($that.payFeeOrderInfo.deductionAmount);
                    if (parseFloat($that.payFeeOrderInfo.viewAccountAmount) < 0) { //账户小于0
                        $that.payFeeOrderInfo.viewAccountAmount = 0;
                        $that.payFeeOrderInfo.deductionAmount = viewAccountAmount;
                    }
                }
            },
            _viewFeeConfig: function() {
                vc.emit('viewFeeConfigData', 'showData', {
                    configId: $that.payFeeOrderInfo.configId
                })
            },
            _viewFee: function() {
                vc.emit('viewFeeData', 'showData', {
                    feeId: $that.payFeeOrderInfo.feeId
                })
            },
            _viewRoomData: function() {
                vc.emit('viewRoomData', 'showData', {
                    roomId: $that.payFeeOrderInfo.payerObjId
                })
            },
            _listFeeIntegral: function(_cycles) {
                let param = {
                    params: {
                        page: DEFAULT_PAGE,
                        row: DEFAULT_ROWS,
                        feeId: $that.payFeeOrderInfo.feeId,
                        communityId: $that.payFeeOrderInfo.communityId,
                        cycles: _cycles,
                        endTime: $that.payFeeOrderInfo.endTime,
                        amount: $that.payFeeOrderInfo.receivedAmount,
                        area: $that.payFeeOrderInfo.builtUpArea
                    }
                };
                //发送get请求
                vc.http.apiGet('/integral.computePayFeeIntegral',
                    param,
                    function(json, res) {
                        let _payFeeCouponInfo = JSON.parse(json);
                        $that.payFeeOrderInfo.integralQuantity = _payFeeCouponInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);