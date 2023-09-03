/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailAccountReceiptInfo: {
                feeReceipts: [],
                ownerId: '',
                total: '',
                records: '',
                selectReceipts: [],
                quan: false,
            }
        },
        watch: { // 监视双向绑定的数据数组
            ownerDetailAccountReceiptInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.ownerDetailAccountReceiptInfo.selectReceipts.length == $that.ownerDetailAccountReceiptInfo.feeReceipts.length) {
                        $that.ownerDetailAccountReceiptInfo.quan = true;
                    } else {
                        $that.ownerDetailAccountReceiptInfo.quan = false;
                    }
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            //切换 至费用页面
            vc.on('ownerDetailAccountReceipt', 'switch', function(_param) {
                if (_param.ownerId == '') {
                    return;
                }
                 $that.ownerDetailAccountReceiptInfo.ownerId = _param.ownerId;
                $that._listOwnerDetailAccountReceipt(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailAccountReceipt', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._listOwnerDetailAccountReceipt(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listOwnerDetailAccountReceipt: function(_page, _rows) {
                $that.ownerDetailAccountReceiptInfo.selectReceipts = [];
                $that.ownerDetailAccountReceiptInfo.quan = false;
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        ownerId: $that.ownerDetailAccountReceiptInfo.ownerId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/receipt.listAccountReceipt',
                    param,
                    function(json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        vc.component.ownerDetailAccountReceiptInfo.total = _feeReceiptManageInfo.total;
                        vc.component.ownerDetailAccountReceiptInfo.records = _feeReceiptManageInfo.records;
                        vc.component.ownerDetailAccountReceiptInfo.feeReceipts = _feeReceiptManageInfo.data;
                        vc.emit('ownerDetailAccountReceipt', 'paginationPlus', 'init', {
                            total: vc.component.ownerDetailAccountReceiptInfo.records,
                            dataCount: vc.component.ownerDetailAccountReceiptInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryFeeAccountReceiptMethod: function() {
                vc.component._listOwnerDetailAccountReceipt(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _printFeeAccountReceipt: function(_receipt) {
                if ($that.ownerDetailAccountReceiptInfo.selectReceipts.length < 1) {
                    vc.toast('请选择打印收据');
                    return;
                }
                let arIds = '';
                $that.ownerDetailAccountReceiptInfo.selectReceipts.forEach(item => {
                    arIds += (item + ',');
                })
                if (arIds.endsWith(',')) {
                    arIds = arIds.substring(0, arIds.length - 1);
                }
                window.open("/print.html#/pages/property/printAccountReceipt?arIds=" + arIds + "&apply=N");
            },
            _printFeeSmallAccountReceipt: function() {
                if ($that.ownerDetailAccountReceiptInfo.selectReceipts.length < 1) {
                    vc.toast('请选择打印收据');
                    return;
                }
                let arIds = '';
                $that.ownerDetailAccountReceiptInfo.selectReceipts.forEach(item => {
                    arIds += (item + ',');
                })
                if (arIds.endsWith(',')) {
                    arIds = arIds.substring(0, arIds.length - 1);
                }
                window.open("/smallPrint.html#/pages/property/printSmallAccountReceipt?arIds=" + arIds);
            },
            checkAllAccountReceipt: function(e) {
                let checkObj = document.querySelectorAll('.checAccountReceiptItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.ownerDetailAccountReceiptInfo.selectReceipts.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.ownerDetailAccountReceiptInfo.selectReceipts = [];
                }
            }
        }
    });
})(window.vc);