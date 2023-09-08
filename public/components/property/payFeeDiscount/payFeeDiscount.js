/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 20;
    vc.extends({
        data: {
            payFeeDiscountInfo: {
                feeDiscounts: [],
                feeId: '',
                payerObjId: '',
                payerObjType: '',
                endTime: '',
                communityId: vc.getCurrentCommunity().communityId,
                cycles: 1,
                quanDiscount: false,
                totalDiscountMoney: 0.0,
                selectDiscountIds: [],
            }
        },
        watch: { // 监视双向绑定的数据数组
            payFeeDiscountInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.payFeeDiscountInfo.selectDiscountIds.length == $that.payFeeDiscountInfo.feeDiscounts.length) {
                        $that.payFeeDiscountInfo.quanDiscount = true;
                    } else {
                        $that.payFeeDiscountInfo.quanDiscount = false;
                    }
                    //计算优惠
                    $that._computeFeeDiscount();
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('payFeeDiscount', 'computeFeeDiscount', function (_param) {
                $that.payFeeDiscountInfo.selectDiscountIds = [];
                vc.copyObject(_param, $that.payFeeDiscountInfo);
                if ($that.payFeeDiscountInfo.cycles < 0) {
                    return;
                }
                $that._listFeeDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            popOverShowMsg: function () {
                $('.popover-show').popover('show');
            },
            popOverHideMsg: function () {
                $('.popover-show').popover('hide');
            },
            _listFeeDiscounts: function (_page, _rows) {
                let param = {
                    params: {
                        page: DEFAULT_PAGE,
                        row: DEFAULT_ROWS,
                        feeId: $that.payFeeDiscountInfo.feeId,
                        communityId: $that.payFeeDiscountInfo.communityId,
                        cycles: $that.payFeeDiscountInfo.cycles,
                        payerObjId: $that.payFeeDiscountInfo.payerObjId,
                        payerObjType: $that.payFeeDiscountInfo.payerObjType,
                        endTime: $that.payFeeDiscountInfo.endTime
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeDiscount/computeFeeDiscount',
                    param,
                    function (json, res) {
                        let _payFeeDiscountInfo = JSON.parse(json);
                        $that.payFeeDiscountInfo.feeDiscounts = _payFeeDiscountInfo.data;
                        $that.payFeeDiscountInfo.feeDiscounts.forEach(item => {
                            $that.payFeeDiscountInfo.selectDiscountIds.push(item.discountId);
                            //这里注释 后端根据费用项设置情况 算费
                            // if (item.value === "1") {
                            //     // 当映射开关值为1时向下取整
                            //     item.discountPrice = $that._mathFloor(item.discountPrice);
                            // } else if (item.value === "2") {
                            //     // 2正常显示
                            //     return item.discountPrice;
                            // } else if (item.value === "3") {
                            //     // 3向上取整
                            //     item.discountPrice = $that._mathCeil(item.discountPrice);
                            // } else if (item.value === "5") {
                            //     // 5保留一位
                            //     item.discountPrice = $that._mathToFixed1(item.discountPrice);
                            // } else {
                            //     // 其他保留两位
                            //     item.discountPrice = $that._mathToFixed2(item.discountPrice);
                            // }
                        })
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
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
            _openAddFeeDiscountModal: function () {
                vc.emit('addFeeDiscount', 'openAddFeeDiscountModal', {});
            },
            checkAllDiscount: function (e) {
                var checkObj = document.querySelectorAll('.checkDiscountItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            let _value = checkObj[i].value;
                            $that.payFeeDiscountInfo.selectDiscountIds.push(_value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.payFeeDiscountInfo.selectDiscountIds = [];
                }
            },
            _computeFeeDiscount: function () {
                let _totalDiscountMoney = 0.0;
                let _selectDiscount = [];
                $that.payFeeDiscountInfo.selectDiscountIds.forEach(item => {
                    $that.payFeeDiscountInfo.feeDiscounts.forEach(disItem => {
                        if (disItem.feeDiscountSpecs && disItem.feeDiscountSpecs.length > 0) {
                            let specValue = "";
                            disItem.feeDiscountSpecs.forEach(feeItem => {
                                if (feeItem.specName == "月份") {
                                    specValue = feeItem.specValue;
                                }
                            })
                            if ((disItem.discountType == '1001' || disItem.discountType == '3003') && parseFloat($that.payFeeDiscountInfo.cycles) < parseFloat(specValue)) {
                                return;
                            }
                        }
                        if (item == disItem.discountId && disItem.discountPrice != 0 && disItem.ruleId != "102020008") {
                            if (disItem.feeDiscountSpecs && disItem.feeDiscountSpecs.length > 0) {
                                let specValue = "";
                                disItem.feeDiscountSpecs.forEach(feeItem => {
                                    if (feeItem.specName == "月份") {
                                        specValue = feeItem.specValue;
                                    }
                                })
                                if (specValue&& parseFloat($that.payFeeDiscountInfo.cycles) >= parseFloat(specValue)) {
                                    _totalDiscountMoney += parseFloat(disItem.discountPrice);
                                    _selectDiscount.push(disItem);
                                }

                                //todo 考虑滞纳金
                                specValue = "";
                                disItem.feeDiscountSpecs.forEach(feeItem => {
                                    if (feeItem.specName == "滞纳金") {
                                        specValue = feeItem.specValue;
                                    }
                                })
                                if (specValue) {
                                    _totalDiscountMoney += parseFloat(disItem.discountPrice);
                                    _selectDiscount.push(disItem);
                                }
                            }
                        } else if (item == disItem.discountId && disItem.ruleId == "102020008") {
                            if (disItem.feeDiscountSpecs != null && disItem.feeDiscountSpecs != undefined && disItem.feeDiscountSpecs.length > 0) {
                                var specValue = "";
                                disItem.feeDiscountSpecs.forEach(feeItem => {
                                    if (feeItem.specName == "月份") {
                                        specValue = feeItem.specValue;
                                    }
                                })
                                if (specValue != "" && parseFloat($that.payFeeDiscountInfo.cycles) >= parseFloat(specValue)) {
                                    _selectDiscount.push(disItem);
                                }
                            }
                        }
                    })
                });
                $that.payFeeDiscountInfo.totalDiscountMoney = _totalDiscountMoney;
                // if (_totalDiscountMoney !== 0) {
                vc.emit('payFeeOrder', 'changeDiscountPrice', {
                    totalDiscountMoney: _totalDiscountMoney,
                    selectDiscount: _selectDiscount
                })
                // }
            }
        }
    });
})(window.vc);
