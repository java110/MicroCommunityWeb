(function (vc) {
    vc.extends({
        data: {
            ownerApplyInvoiceInfo: {
                ownerId: '',
                ownerName: '',
                invoiceType: '',
                invoiceName: '',
                invoiceAddress: '',
                invoiceNum: '',
                detailIds: [],
                feeDetails: []
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
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerApplyInvoice', 'chooseOwnerInvoice', function (_owner) {
                vc.copyObject(_owner, $that.ownerApplyInvoiceInfo);
                $that._loadFeeDetails();
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
        }
    });
})(window.vc);