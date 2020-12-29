(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeOrderInfo: {
                feeId: '',
                feeName: '',
                feeTypeCdName: '',
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
                communityId: vc.getCurrentCommunity().communityId,
                payerObjName: '',
                squarePrice: '',
                remark: '',
                builtUpArea: 0.0,
                squarePrice: 0.0,
                additionalAmount: 0.0,
                receiptId: '',
                showEndTime: '',
                selectDiscount: [],
                totalDiscountMoney: 0.0,
                toFixedSign: 1, // 编码映射-应收款取值标识
                receivedAmountSwitch: ''
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
                $that.payFeeOrderInfo.payerObjName = vc.getParam('payerObjName');
                $that.payFeeOrderInfo.squarePrice = vc.getParam('squarePrice');
                $that.payFeeOrderInfo.additionalAmount = vc.getParam('additionalAmount');
                $that.payFeeOrderInfo.paymentCycles = [];
                for (let _index = 1; _index < 7; _index++) {
                    $that.payFeeOrderInfo.paymentCycles.push(_index * vc.getParam('paymentCycle'))
                }
                $that.listPayFeeOrderRoom();
            }
            // 修改为按照单价面积等，重新计算，此时可能未获取到映射数值，所以默认保留两位小数
            vc.component.payFeeOrderInfo.totalFeePrice = $that._mathToFixed2(vc.getParam('squarePrice') * vc.getParam('builtUpArea') + vc.getParam('additionalAmount'));
            vc.component.payFeeOrderInfo.receivedAmount = vc.component.payFeeOrderInfo.totalFeePrice;
            //与字典表支付方式关联
            vc.getDict('pay_fee_detail', "prime_rate", function (_data) {
                vc.component.payFeeOrderInfo.primeRates = _data;
            });
        },
        _initEvent: function () {
            // 子组件折扣change事件
            vc.on('payFeeOrder', 'changeDiscountPrice', function (_param) {
                let _totalFeePrice = $that.payFeeOrderInfo.totalFeePrice;
                if (_totalFeePrice < 0) {
                    return;
                }
                let _totalDiscountMoney = _param.totalDiscountMoney;
                //如果应收小区 优惠金额 则不优惠
                if (_totalFeePrice < _totalDiscountMoney) {
                    return;
                }
                $that.payFeeOrderInfo.selectDiscount = _param.selectDiscount;
                $that.payFeeOrderInfo.totalDiscountMoney = _totalDiscountMoney;
                // 该处js做减法后，会出现小数点后取不尽的bug，再次处理
                let receivedAmount = _totalFeePrice - _totalDiscountMoney;
                $that.payFeeOrderInfo.receivedAmount = $that._getFixedNum(receivedAmount);
            });
            vc.on('payFeeOrder', 'initData', function (_param) {
                console.log('payFeeOrders initData');
                // 重新赋值下拉列表
                $that.payFeeOrderInfo.paymentCycles = [];
                for (let _index = 1; _index < 7; _index++) {
                    $that.payFeeOrderInfo.paymentCycles.push(_index * _param.paymentCycle);
                }
                // 更新金额（按照映射规则）
                $that.payFeeOrderInfo.feePrice = parseFloat(vc.component.payFeeOrderInfo.feePrice).toFixed(2);
                $that.payFeeOrderInfo.receivedAmount = $that.payFeeOrderInfo.totalFeePrice = $that._getFixedNum(vc.component.payFeeOrderInfo.feePrice);
            })
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
                    'payFeeOrderInfo.primeRate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "支付方式不能为空"
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
            /**
             * 点击 “提交缴费”
             */
            _openPayFee: function () {
                console.log('tempCycles : ', $that.payFeeOrderInfo.tempCycles);
                console.log('cycles : ', $that.payFeeOrderInfo.cycles);
                if ($that.payFeeOrderInfo.tempCycles != "" && $that.payFeeOrderInfo.tempCycles != '-102') {
                    $that.payFeeOrderInfo.cycles = $that.payFeeOrderInfo.tempCycles;
                }
                if ($that.payFeeOrderInfo.feeFlag == '2006012') {
                    $that.payFeeOrderInfo.cycles = '1';
                    $that.payFeeOrderInfo.tempCycles = '1';
                }
                // 新增缴费周期必选项
                if($that.payFeeOrderInfo.tempCycles == "" ){
                    vc.toast("请选择缴费周期");
                    return;
                }
                
                if (!vc.component.payFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (!(/(^[1-9]\d*$)/.test($that.payFeeOrderInfo.cycles))) {
                    $that.payFeeOrderInfo.showEndTime = '';
                } else {
                    $that.payFeeOrderInfo.showEndTime = vc.addMonth(new Date($that.payFeeOrderInfo.endTime), parseInt($that.payFeeOrderInfo.cycles));
                }
                //关闭model
                $("#doPayFeeModal").modal('show');
            },
            _closeDoPayFeeModal: function () {
                //关闭model
                $("#doPayFeeModal").modal('hide')
                $that.payFeeOrderInfo.showEndTime = '';
            },
            /**
             * 点击模态框 “确定收费”
             */
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

            /**
             * 下拉 change 事件
             * @param {*} _cycles
             */
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
                // 调整为根据映射 取整
                let unFixedNum = Math.floor(parseFloat(_newCycles) * parseFloat(vc.component.payFeeOrderInfo.feePrice) * 100) / 100;
                vc.component.payFeeOrderInfo.totalFeePrice = $that._getFixedNum(unFixedNum);
                vc.component.payFeeOrderInfo.receivedAmount = vc.component.payFeeOrderInfo.totalFeePrice;
                // 触发折扣组件，计算折扣
                vc.emit('payFeeDiscount', 'computeFeeDiscount', {
                    feeId: $that.payFeeOrderInfo.feeId,
                    cycles: _cycles
                });
            },
            /**
             * 输入 自定义 缴费周期
             * @param {*} _cycles
             */
            changeCycle: function (_cycles) {
                if (_cycles == '') {
                    return;
                }
                let unFixedNum = Math.floor(parseFloat(_cycles) * parseFloat(vc.component.payFeeOrderInfo.feePrice) * 100) / 100;
                vc.component.payFeeOrderInfo.totalFeePrice = $that._getFixedNum(unFixedNum);
                vc.component.payFeeOrderInfo.receivedAmount = vc.component.payFeeOrderInfo.totalFeePrice;
                vc.emit('payFeeDiscount', 'computeFeeDiscount', {
                    feeId: $that.payFeeOrderInfo.feeId,
                    cycles: _cycles
                });
            },

            /**
             * 格式化数字
             */
            _getFixedNum: function (num) {
                if ($that.payFeeOrderInfo.toFixedSign == 2) {
                    return $that._mathToFixed1(num);
                } else if ($that.payFeeOrderInfo.toFixedSign == 3) {
                    return $that._mathCeil(num);
                } else {
                    return $that._mathToFixed2(num);
                }
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
            /**
             * 向上取整
             */
            _mathCeil: function (_price) {
                return Math.ceil(_price);
            },
            /**
             * 向下取整
             */
            _mathFloor: function (_price) {
                return Math.floor(_price);
            },
            /**
             * 保留小数点后一位
             */
            _mathToFixed1: function (_price) {
                return parseFloat(_price).toFixed(1);
            },
            /**
             * 保留小数点后两位
             */
            _mathToFixed2: function (_price) {
                return parseFloat(_price).toFixed(2);
            },
            listPayFeeOrderRoom: function () {
                if (!vc.notNull($that.payFeeOrderInfo.feeId)) {
                    return;
                }
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: $that.payFeeOrderInfo.feeId,
                        page: 1,
                        row: 1
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeApi/listFeeObj',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        console.log('here is listRoomData : ', listRoomData);
                        vc.copyObject(listRoomData.data, $that.payFeeOrderInfo);
                        // 由于返回的键与档期那页面自定义的键不一致，单独赋值toFiexedSign
                        let toFixedSign = listRoomData.data.val;
                        // 防止后台设置有误
                        if (toFixedSign == 1 || toFixedSign == 2 || toFixedSign == 3) {
                            $that.payFeeOrderInfo.toFixedSign = toFixedSign;
                        }
                        vc.emit('payFeeOrder', 'initData', listRoomData.data);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);
