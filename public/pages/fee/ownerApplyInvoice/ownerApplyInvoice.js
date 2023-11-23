(function (vc) {
    vc.extends({
        data: {
            ownerApplyInvoiceInfo: {
                oiId:'',
                ownerId: '',
                ownerName: '',
                invoiceType: '',
                invoiceName: '',
                invoiceAddress: '',
                invoiceNum: '',
                detailIds: [],
                feeDetails: [],
                invoiceFlag: 'FEE',
                arIds: [],
                acctDetails: []
            }
        },
        watch: {
            'ownerApplyInvoiceInfo.detailIds': {
                deep: true,
                handler: function () {
                    let checkObj = document.querySelectorAll('.all-check'); // 获取所有checkbox项
                    if ($that.ownerApplyInvoiceInfo.detailIds.length < $that.ownerApplyInvoiceInfo.feeDetails.length) {
                        checkObj[0].checked = false;
                    } else {
                        checkObj[0].checked = true;
                    }
                }
            },
            'ownerApplyInvoiceInfo.arIds': {
                deep: true,
                handler: function () {
                    let checkObj = document.querySelectorAll('.all-check-acct'); // 获取所有checkbox项
                    if ($that.ownerApplyInvoiceInfo.arIds.length < $that.ownerApplyInvoiceInfo.acctDetails.length) {
                        checkObj[0].checked = false;
                    } else {
                        checkObj[0].checked = true;
                    }
                }
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerApplyInvoice', 'chooseOwnerInvoice', function (_owner) {
                vc.copyObject(_owner, $that.ownerApplyInvoiceInfo);
                $that.ownerApplyInvoiceInfo.arIds = [];
                $that.ownerApplyInvoiceInfo.detailIds = [];
                if ($that.ownerApplyInvoiceInfo.invoiceFlag == 'FEE') {
                    $that._loadFeeDetails();
                } else {
                    $that._loadAcctDetails();
                }

            });
        },
        methods: {

            _openChooseOwner: function () {
                vc.emit('searchOwnerInvoice', 'openSearchOwnerInvoiceModel', {});
            },

            _loadFeeDetails: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.ownerApplyInvoiceInfo.ownerId,
                        openInvoice:'N'
                    }
                };
                $that.ownerApplyInvoiceInfo.detailIds = [];

                //发送get请求
                vc.http.apiGet('/fee.queryFeeDetail',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        $that.ownerApplyInvoiceInfo.feeDetails = _feeConfigInfo.feeDetails;

                        if (_feeConfigInfo.feeDetails && _feeConfigInfo.feeDetails.length > 0) {
                            setTimeout(function () {
                                _feeConfigInfo.feeDetails.forEach(_detail => {
                                    $that.ownerApplyInvoiceInfo.detailIds.push(_detail.detailId);
                                });
                            }, 1000)
                        }

                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            checkAll: function (e) {
                let checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (let i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            $that.ownerApplyInvoiceInfo.detailIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.ownerApplyInvoiceInfo.detailIds = [];
                }
            },
            _loadAcctDetails: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.ownerApplyInvoiceInfo.ownerId,
                    }
                };
                $that.ownerApplyInvoiceInfo.arIds = [];
                //发送get请求
                vc.http.apiGet('/receipt.listAccountReceipt',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.ownerApplyInvoiceInfo.acctDetails = _json.data;
                        if (_json.data && _json.data.length > 0) {
                            setTimeout(function () {
                                _json.data.forEach(_acct => {
                                    $that.ownerApplyInvoiceInfo.arIds.push(_acct.arId);
                                });
                            }, 1000)
                        }

                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            checkAllAcct: function (e) {
                let checkObj = document.querySelectorAll('.checkItemAcct'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (let i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            $that.ownerApplyInvoiceInfo.arIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.ownerApplyInvoiceInfo.arIds = [];
                }
            },

            _changeInvoiceFlag: function () {
                let _ownerId = $that.ownerApplyInvoiceInfo.ownerId;
                $that.ownerApplyInvoiceInfo.arIds = [];
                $that.ownerApplyInvoiceInfo.detailIds = [];
                if (!_ownerId) {
                    return;
                }
                if ($that.ownerApplyInvoiceInfo.invoiceFlag == 'FEE') {
                    $that._loadFeeDetails();
                } else {
                    $that._loadAcctDetails();
                }
            },
            _ownerApplySubmit: function () {
                let _arIds = $that.ownerApplyInvoiceInfo.arIds;
                let _detailIds = $that.ownerApplyInvoiceInfo.detailIds;
                if ($that.ownerApplyInvoiceInfo.invoiceFlag == 'FEE' && !_detailIds) {
                    vc.toast('未选择已缴费费用');
                    return;
                }

                if ($that.ownerApplyInvoiceInfo.invoiceFlag == 'ACCT' && !_arIds) {
                    vc.toast('未选择账户预存');
                    return;
                }

                let _that = $that.ownerApplyInvoiceInfo;

                let _data = {
                    invoiceAddress:_that.invoiceAddress,
                    invoiceFlag:_that.invoiceFlag,
                    invoiceName: _that.invoiceName,
                    invoiceNum:_that.invoiceNum,
                    invoiceType:_that.invoiceType,
                    ownerId:_that.ownerId,
                    ownerName:_that.ownerName,
                    oiId:_that.oiId,
                    detailIds:_detailIds,
                    arIds:_arIds,
                    communityId:vc.getCurrentCommunity().communityId,
                }

                vc.http.apiPost(
                    '/invoice.saveInvoiceApply',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            }

        }
    });
})(window.vc);