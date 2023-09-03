/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailReceiptInfo: {
                feeReceipts: [],
                feeId: '',
                total: '',
                records: '',
                selectReceipts: [],
                quan: false,
                printUrl: '/print.html#/pages/property/printPayFee',
            }
        },
        watch: { // 监视双向绑定的数据数组
            feeDetailReceiptInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.feeDetailReceiptInfo.selectReceipts.length == $that.feeDetailReceiptInfo.feeReceipts.length) {
                        $that.feeDetailReceiptInfo.quan = true;
                    } else {
                        $that.feeDetailReceiptInfo.quan = false;
                    }
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            //切换 至费用页面
            vc.on('feeDetailReceipt', 'switch', function(_param) {
                if (_param.feeId == '') {
                    return;
                }
                $that._listFeePrintPages();
                vc.copyObject(_param, $that.feeDetailReceiptInfo);
                $that._listFeeDetailReceipt(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailReceipt', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._listFeeDetailReceipt(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listFeeDetailReceipt: function(_page, _rows) {
                $that.feeDetailReceiptInfo.selectReceipts = [];
                $that.feeDetailReceiptInfo.quan = false;
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        feeId: $that.feeDetailReceiptInfo.feeId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeReceipt/queryFeeReceipt',
                    param,
                    function(json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        vc.component.feeDetailReceiptInfo.total = _feeReceiptManageInfo.total;
                        vc.component.feeDetailReceiptInfo.records = _feeReceiptManageInfo.records;
                        vc.component.feeDetailReceiptInfo.feeReceipts = _feeReceiptManageInfo.data;
                        vc.emit('feeDetailReceipt', 'paginationPlus', 'init', {
                            total: vc.component.feeDetailReceiptInfo.records,
                            dataCount: vc.component.feeDetailReceiptInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryFeeReceiptMethod: function() {
                vc.component._listFeeDetailReceipt(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _printFeeReceipt: function(_receipt) {
                if ($that.feeDetailReceiptInfo.selectReceipts.length < 1) {
                    vc.toast('请选择打印收据');
                    return;
                }
                let receiptids = '';
                $that.feeDetailReceiptInfo.selectReceipts.forEach(item => {
                    receiptids += (item + ',');
                })
                if (receiptids.endsWith(',')) {
                    receiptids = receiptids.substring(0, receiptids.length - 1);
                }
                window.open($that.feeDetailReceiptInfo.printUrl + "?receiptIds=" + receiptids + "&apply=N");
            },

            _printApplyFeeReceipt: function(_receipt) {
                if ($that.feeDetailReceiptInfo.selectReceipts.length < 1) {
                    vc.toast('请选择');
                    return;
                }
                let receiptids = '';
                $that.feeDetailReceiptInfo.selectReceipts.forEach(item => {
                    receiptids += (item + ',');
                })
                if (receiptids.endsWith(',')) {
                    receiptids = receiptids.substring(0, receiptids.length - 1);
                }
                window.open("/print.html#/pages/property/printPayFee?receiptIds=" + receiptids + "&apply=Y");
            },

            _printFeeSmallReceipt: function() {
                if ($that.feeDetailReceiptInfo.selectReceipts.length < 1) {
                    vc.toast('请选择打印收据');
                    return;
                }
                let receiptids = '';
                $that.feeDetailReceiptInfo.selectReceipts.forEach(item => {
                    receiptids += (item + ',');
                })
                if (receiptids.endsWith(',')) {
                    receiptids = receiptids.substring(0, receiptids.length - 1);
                }
                window.open("/smallPrint.html#/pages/property/printSmallPayFee?receiptIds=" + receiptids);
            },
            checkAllReceipt: function(e) {
                let checkObj = document.querySelectorAll('.checReceiptItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.feeDetailReceiptInfo.selectReceipts.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.feeDetailReceiptInfo.selectReceipts = [];
                }
            },
            _listFeePrintPages: function(_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        state: 'T',
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feePrintPage.listFeePrintPage',
                    param,
                    function(json, res) {
                        var _feePrintPageManageInfo = JSON.parse(json);
                        let feePrintPages = _feePrintPageManageInfo.data;
                        if (feePrintPages && feePrintPages.length > 0) {
                            $that.feeDetailReceiptInfo.printUrl = feePrintPages[0].url;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);