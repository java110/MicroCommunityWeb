/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 20;
    vc.extends({
        data: {
            payFeeUserAccountInfo: {
                accountList: [],
                feeId: '',
                communityId: vc.getCurrentCommunity().communityId,
                quanAccount: false,
                selectAccountIds: [],
                integralAmount: '',
                cashAmount: '',
                couponAmount: ''
            }
        },
        watch: { // 监视双向绑定的数据数组
            payFeeUserAccountInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.payFeeUserAccountInfo.selectAccountIds.length == $that.payFeeUserAccountInfo.accountList.length) {
                        $that.payFeeUserAccountInfo.quanAccount = true;
                    } else {
                        $that.payFeeUserAccountInfo.quanAccount = false;
                    }
                    //计算优惠
                    $that._computeFeeUserAmount();
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('payFeeUserAccount', 'computeFeeUserAmount', function (_param) {
                $that.payFeeUserAccountInfo.selectAccountIds = [];
                vc.copyObject(_param, $that.payFeeUserAccountInfo);
                $that._listUserAccount(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('payFeeUserAccount', 'refresh', function () {
                $that._listUserAccount(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('payFeeUserAccount', 'clear', function () {
                $that.payFeeUserAccountInfo.accountList = [];
                $that.payFeeUserAccountInfo.selectAccountIds = [];
            });
        },
        methods: {
            _queryPayFeeUserAccount:function(){
                $that._listUserAccount(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listUserAccount: function (_page, _rows) {
                let param = {
                    params: {
                        page: DEFAULT_PAGE,
                        row: DEFAULT_ROWS,
                        feeId: $that.payFeeUserAccountInfo.feeId,
                        communityId: $that.payFeeUserAccountInfo.communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/account/queryOwnerAccount',
                    param,
                    function (json, res) {
                        let listAccountData = JSON.parse(json);
                        if (listAccountData.data.length < 1) {
                            vc.toast('当前没有可用账户');
                            return;
                        }
                        //账户余额
                        $that.payFeeUserAccountInfo.accountList = listAccountData.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 预存
            _openAddUserAmountModal: function (_userAccount) {
                //vc.emit('payFeeOrder', 'openAddModalWithParams', _userAccount);
                window.open('/#/pages/owner/ownerDetail?ownerId=' + _userAccount.objId + "&currentTab=ownerDetailAccount")
            },
            checkAllAccount: function (e) {
                var checkObj = document.querySelectorAll('.checkAccountItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            let _value = checkObj[i].value;
                            $that.payFeeUserAccountInfo.selectAccountIds.push(_value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.payFeeUserAccountInfo.selectAccountIds = [];
                }
            },
            _computeFeeUserAmount: function () {
                let _totalUserAmount = 0.0;
                let _selectAccount = [];
                $that.payFeeUserAccountInfo.selectAccountIds.forEach(item => {
                    $that.payFeeUserAccountInfo.accountList.forEach(disItem => {
                        if (item == disItem.acctId && disItem.amount != 0) {
                            if (disItem.acctType == '2004') { //积分账户
                                if (parseFloat(disItem.amount) >= parseFloat(disItem.maximumNumber)) { //如果积分账户余额大于最大使用积分，就抵扣最大使用积分
                                    _totalUserAmount += parseFloat(disItem.maximumNumber / disItem.deductionProportion);
                                    _selectAccount.push(disItem);
                                    $that.payFeeUserAccountInfo.integralAmount = disItem.maximumNumber / disItem.deductionProportion;
                                } else {
                                    _totalUserAmount += parseFloat(disItem.amount / disItem.deductionProportion);
                                    _selectAccount.push(disItem);
                                    $that.payFeeUserAccountInfo.integralAmount = disItem.amount / disItem.deductionProportion;
                                }
                            } else if (disItem.acctType == '2003') { //现金账户
                                _totalUserAmount += parseFloat(disItem.amount);
                                _selectAccount.push(disItem);
                                $that.payFeeUserAccountInfo.cashAmount = disItem.amount;
                            } else {
                                _totalUserAmount += parseFloat(disItem.amount);
                                _selectAccount.push(disItem);
                                $that.payFeeUserAccountInfo.couponAmount = disItem.amount;
                            }
                        }
                    })
                });
                vc.emit('payFeeOrder', 'changeUserAmountPrice', {
                    totalUserAmount: _totalUserAmount,
                    accountList: $that.payFeeUserAccountInfo.accountList,
                    integralAmount: $that.payFeeUserAccountInfo.integralAmount,
                    cashAmount: $that.payFeeUserAccountInfo.cashAmount,
                    couponAmount: $that.payFeeUserAccountInfo.couponAmount,
                    selectAccount: _selectAccount
                })
            }
        }
    });
})(window.vc);
