(function (vc) {
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
                squarePrice: '',
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
                toFixedSign: 1, // 编码映射-应收款取值标识
                receivedAmountSwitch: '',
                createTime: vc.dateTimeFormat(new Date().getTime()),
                accountAmount: 0.0, // 账户金额
                viewAccountAmount: 0.0, // 账户金额
                deductionAmount: 0.0, //抵扣金额
                redepositAmount: 0.0, //转存金额
                selectUserAccount: [], // 选中的账户
                printUrl: '/print.html#/pages/property/printPayFee',
                payType: 'common',
                authCode: '',
                orderId: '',
                offlinePayFeeSwitch: '1',
                flag: '',
                custEndTime: ''
            }
        },
        watch: {
            'payFeeOrderInfo.receivedAmount': {
                deep: true,
                handler: function () {
                    //计算折扣金额和转存金额
                    $that._doComputeAccountRedepositDeduction();
                }
            }
        },
        _initMethod: function () {
            vc.component._initCustEndDate();
            if (vc.notNull(vc.getParam("feeId"))) {
                vc.component.payFeeOrderInfo.feeId = vc.getParam('feeId');
                vc.component.payFeeOrderInfo.feeName = vc.getParam('feeName');
                vc.component.payFeeOrderInfo.feeTypeCdName = vc.getParam('feeTypeCdName');
                vc.component.payFeeOrderInfo.feeTypeCd = vc.getParam('feeTypeCd');
                vc.component.payFeeOrderInfo.endTime = vc.getParam('endTime').replace(/%3A/g, ':');
                vc.component.payFeeOrderInfo.feePrice = vc.getParam('feePrice');
                $that.payFeeOrderInfo.feeFlag = vc.getParam('feeFlag');
                $that.payFeeOrderInfo.payerObjName = vc.getParam('payerObjName');
                $that.payFeeOrderInfo.builtUpArea = vc.getParam('builtUpArea');
                if ($that.payFeeOrderInfo.builtUpArea) {
                    $that.payFeeOrderInfo.builtUpArea = $that._mathToFixed2($that.payFeeOrderInfo.builtUpArea)
                }
                $that.payFeeOrderInfo.squarePrice = vc.getParam('squarePrice');
                $that.payFeeOrderInfo.additionalAmount = vc.getParam('additionalAmount');
                $that.payFeeOrderInfo.accountList = vc.getParam('accountList');
                $that.payFeeOrderInfo.integralAmount = vc.getParam('integralAmount');
                $that.payFeeOrderInfo.cashAmount = vc.getParam('cashAmount');
                $that.payFeeOrderInfo.couponAmount = vc.getParam('couponAmount');
                $that.payFeeOrderInfo.paymentCycles = [];
                for (let _index = 1; _index < 7; _index++) {
                    $that.payFeeOrderInfo.paymentCycles.push(_index * vc.getParam('paymentCycle'))
                }
                $that.listPayFeeOrderRoom();
                // $that._listAccount();
            }
            // 修改为按照单价面积等，重新计算，此时可能未获取到映射数值，所以默认保留两位小数
            vc.component.payFeeOrderInfo.totalFeePrice = $that._mathToFixed2(vc.getParam('feePrice'));
            vc.component.payFeeOrderInfo.receivedAmount = vc.component.payFeeOrderInfo.totalFeePrice;
            //与字典表支付方式关联
            vc.getDict('pay_fee_detail', "prime_rate", function (_data) {
                vc.component.payFeeOrderInfo.primeRates = _data;
            });
            $that._listFeePrintPages();
            // 查询用户账户
            vc.emit('payFeeUserAccount', 'computeFeeUserAmount', {
                feeId: $that.payFeeOrderInfo.feeId,
            });
            vc.initDateTime('payFeeOrderCreateTime', function (_value) {
                $that.payFeeOrderInfo.createTime = _value;
            });
        },
        _initEvent: function () {
            // 子组件折扣change事件
            vc.on('payFeeOrder', 'changeDiscountPrice', function (_param) {
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
            vc.on('payFeeOrder', 'changeUserAmountPrice', function (_param) {
                console.log('user Amount :', _param);
                $that.payFeeOrderInfo.selectUserAccount = _param.selectAccount;
                $that.payFeeOrderInfo.accountAmount = _param.totalUserAmount;
                $that.payFeeOrderInfo.accountList = _param.accountList;
                $that.payFeeOrderInfo.integralAmount = _param.integralAmount;
                $that.payFeeOrderInfo.cashAmount = _param.cashAmount;
                $that.payFeeOrderInfo.couponAmount = _param.couponAmount;
                $that._doComputeAccountRedepositDeduction();
            });
            // 账户预缴弹窗
            vc.on('payFeeOrder', 'openAddModalWithParams', function (_param) {
                _param.redepositAmount = vc.component.payFeeOrderInfo.redepositAmount;
                _param.receivedAmount = vc.component.payFeeOrderInfo.receivedAmount;
                vc.emit('prestoreAccount2', 'openAddModalWithParams', _param)
            });
            vc.on('payFeeOrder', 'initData', function (_param) {
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
            _initCustEndDate: function () {
                $(".cust-endTime").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.cust-endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".cust-endTime").val();
                        vc.component.payFeeOrderInfo.custEndTime = value;
                        let start = Date.parse(new Date($that.payFeeOrderInfo.endTime))
                        let end = Date.parse(new Date($that.payFeeOrderInfo.custEndTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于起始时间")
                            $that.payFeeOrderInfo.custEndTime = '';
                            return;
                        }
                        $that.getComputedAmount(0);
                    });

                document.getElementsByClassName(" form-control cust-endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _useUserAccountChange: function (e) {
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
            payFeeValidate: function () {
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
            _openPayFee: function (_type) {
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
                if (!vc.component.payFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 缴费周期为正整数时，显示缴费结束时间
                if (!(/(^[1-9]\d*$)/.test($that.payFeeOrderInfo.cycles))) {
                    $that.payFeeOrderInfo.showEndTime = '';
                } else {
                    $that.payFeeOrderInfo.showEndTime = vc.addMonth(new Date($that.payFeeOrderInfo.endTime), parseInt($that.payFeeOrderInfo.cycles));
                }
                if ($that.payFeeOrderInfo.selectUserAccount.length > 0 && $that.payFeeOrderInfo.selectUserAccount[0].acctType != "2004"
                    && $that.payFeeOrderInfo.accountAmount >= $that.payFeeOrderInfo.receivedAmount) {
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
                        if (item.amount > item.maximumNumber) {
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
                    if ($that.payFeeOrderInfo.flag == 'true' && $that.payFeeOrderInfo.integralAmount != null && $that.payFeeOrderInfo.integralAmount != ''
                        && $that.payFeeOrderInfo.selectUserAccount[0].acctType == '2003') {
                        $that.payFeeOrderInfo.cashAmount = parseFloat($that.payFeeOrderInfo.cashAmount) - parseFloat($that.payFeeOrderInfo.integralAmount);
                    }
                });
                //关闭model
                $("#doPayFeeModal").modal('show');
                if (_type) {
                    $that.payFeeOrderInfo.payType = _type;
                    setTimeout('document.getElementById("authCode").focus()', 1000);
                }
            },
            _closeDoPayFeeModal: function () {
                //关闭model
                $("#doPayFeeModal").modal('hide')
                $that.payFeeOrderInfo.showEndTime = '';
                $that.payFeeOrderInfo.authCode = '';
                $that.payFeeOrderInfo.flag = '';
                $that.payFeeOrderInfo.receivedAmountNumber = '';
                $that.payFeeOrderInfo.integralAmount = '';
                $that.payFeeOrderInfo.cashAmount = '';
            },
            _qrCodePayFee: function () {
                let _printFees = [];
                _printFees.push({
                    feeId: $that.payFeeOrderInfo.feeId,
                    squarePrice: $that.payFeeOrderInfo.squarePrice,
                    additionalAmount: $that.payFeeOrderInfo.additionalAmount,
                    feeName: $that.payFeeOrderInfo.feeName,
                    amount: $that.payFeeOrderInfo.receivedAmount,
                    authCode: $that.payFeeOrderInfo.authCode
                });
                vc.http.apiPost(
                    '/payment.qrCodePayment',
                    JSON.stringify(vc.component.payFeeOrderInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _data = JSON.parse(json);
                        if (_data.code == 404) {
                            vc.toast(_data.msg);
                            if (_data.data && _data.data.orderId) {
                                $that.payFeeOrderInfo.orderId = _data.data.orderId;
                                setTimeout('$that._qrCodeCheckPayFinish()', 5000);
                            }
                            return;
                        }
                        $that._closeDoPayFeeModal();
                        $that.payFeeOrderInfo.receiptId = _data.data.receiptId;
                        //关闭model
                        $("#payFeeResult").modal({
                            backdrop: "static", //点击空白处不关闭对话框
                            show: true
                        });
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
                    feeId: $that.payFeeOrderInfo.feeId,
                    squarePrice: $that.payFeeOrderInfo.squarePrice,
                    additionalAmount: $that.payFeeOrderInfo.additionalAmount,
                    feeName: $that.payFeeOrderInfo.feeName,
                    amount: $that.payFeeOrderInfo.receivedAmount,
                    authCode: $that.payFeeOrderInfo.authCode,
                    orderId: $that.payFeeOrderInfo.orderId
                });
                vc.http.apiPost(
                    '/payment.checkPayFinish',
                    JSON.stringify(vc.component.payFeeOrderInfo), {
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
                        $that.payFeeOrderInfo.receiptId = _data.receiptId;
                        //关闭model
                        $("#payFeeResult").modal({
                            backdrop: "static", //点击空白处不关闭对话框
                            show: true
                        });
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
                $that._closeDoPayFeeModal();
                let _printFees = [];
                _printFees.push({
                    feeId: $that.payFeeOrderInfo.feeId,
                    squarePrice: $that.payFeeOrderInfo.squarePrice,
                    additionalAmount: $that.payFeeOrderInfo.additionalAmount,
                    feeName: $that.payFeeOrderInfo.feeName,
                    amount: $that.payFeeOrderInfo.receivedAmount
                });
                vc.http.apiPost(
                    '/fee.payFee',
                    JSON.stringify(vc.component.payFeeOrderInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json)
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            // let _feeInfo = {
                            //     totalAmount: $that.payFeeOrderInfo.receivedAmount,
                            //     fees: _printFees
                            // }
                            // $that.payFeeOrderInfo.receiptId = _data.receiptId;
                            //vc.saveData('_feeInfo', _feeInfo);
                            //查询收据
                            let _data = _json.data;
                            setTimeout(function() {
                                $that._queryPayFeeReceiptId(_data);
                            }, 1000);
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            //查询收据
            _queryPayFeeReceiptId: function(_data) {
                let _param = {
                    params: {
                        detailIds: _data.detailId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 1
                    }
                }
                vc.http.apiGet(
                    '/feeReceipt/queryFeeReceipt',
                    _param,
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0 && _json.data && _json.data.length > 0) {
                            $that.payFeeOrderInfo.receiptId = _json.data[0].receiptId;
                        }
                        $("#payFeeResult").modal({
                            backdrop: "static", //点击空白处不关闭对话框
                            show: true
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );

            },

            /**
             * 下拉 change 事件
             * @param {*} _cycles
             */
            _changeMonth: function (_cycles) {
                vc.component.payFeeOrderInfo.custEndTime = '';
                if ('-102' == _cycles) {
                    vc.component.payFeeOrderInfo.totalFeePrice = 0.00;
                    vc.component.payFeeOrderInfo.receivedAmount = 0.00;
                    if (vc.component.payFeeOrderInfo.cycles) {
                        $that.getComputedAmount(vc.component.payFeeOrderInfo.cycles);
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
                $that.getComputedAmount(_newCycles);
            },
            /**
             * 输入 自定义 缴费周期
             * @param {*} _cycles
             */
            changeCycle: function (_cycles) {
                if (_cycles == '') {
                    return;
                }
                $that.getComputedAmount(_cycles);
            },

            /**
             * 格式化数字
             */
            _getFixedNum: function (num) {
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
            _back: function () {
                $('#payFeeResult').modal("hide");
                vc.getBack();
            },
            _goBack: function () {
                vc.goBack();
            },
            _printAndBack: function () {
                //$('#payFeeResult').modal("hide");
                window.open($that.payFeeOrderInfo.printUrl + "?receiptId=" + $that.payFeeOrderInfo.receiptId)
            },
            _printSmallAndBack: function () {
                //$('#payFeeResult').modal("hide");
                window.open("/smallPrint.html#/pages/property/printSmallPayFee?receiptId=" + $that.payFeeOrderInfo.receiptId)
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
             * 四首五入取整
             */
            _mathRound: function (_price) {
                return Math.round(_price);
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
                        vc.copyObject(listRoomData.data, $that.payFeeOrderInfo);
                        // 由于返回的键与档期那页面自定义的键不一致，单独赋值toFiexedSign
                        let toFixedSign = listRoomData.data.val;
                        // 防止后台设置有误
                        if (toFixedSign == 1 || toFixedSign == 2 || toFixedSign == 3 || toFixedSign == 4 || toFixedSign == 5) {
                            $that.payFeeOrderInfo.toFixedSign = toFixedSign;
                        }
                        vc.emit('payFeeOrder', 'initData', listRoomData.data);
                        //如果 是一次性费用，计算优惠
                        if ($that.payFeeOrderInfo.feeFlag == '2006012') {
                            vc.emit('payFeeDiscount', 'computeFeeDiscount', {
                                feeId: $that.payFeeOrderInfo.feeId,
                                cycles: '1',
                                payerObjId: $that.payFeeOrderInfo.payerObjId,
                                payerObjType: $that.payFeeOrderInfo.payerObjType,
                                endTime: $that.payFeeOrderInfo.endTime
                            });
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            getComputedAmount: function (_cycles) {
                if (!vc.notNull($that.payFeeOrderInfo.feeId)) {
                    return;
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
                if(_cycles == 0){
                    param.params.custEndTime = $that.payFeeOrderInfo.custEndTime
                }
                //发送get请求
                vc.http.apiGet('/feeApi/listFeeObj',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        vc.component.payFeeOrderInfo.totalFeePrice = $that._getFixedNum(listRoomData.data.feeTotalPrice);
                        vc.component.payFeeOrderInfo.receivedAmount = vc.component.payFeeOrderInfo.totalFeePrice;
                        vc.emit('payFeeDiscount', 'computeFeeDiscount', {
                            feeId: $that.payFeeOrderInfo.feeId,
                            cycles: _cycles,
                            payerObjId: $that.payFeeOrderInfo.payerObjId,
                            payerObjType: $that.payFeeOrderInfo.payerObjType,
                            endTime: $that.payFeeOrderInfo.endTime
                        });
                    },
                    function (errInfo, error) {
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
            computeAccountRedepositDeduction: function () {
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
            _doComputeAccountRedepositDeduction: function () {
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
            _listFeePrintPages: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        state: 'T',
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('feePrintPage.listFeePrintPage',
                    param,
                    function (json, res) {
                        var _feePrintPageManageInfo = JSON.parse(json);
                        let feePrintPages = _feePrintPageManageInfo.data;
                        if (feePrintPages && feePrintPages.length > 0) {
                            $that.payFeeOrderInfo.printUrl = feePrintPages[0].url;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);