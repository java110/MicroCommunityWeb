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
                    $that._listOwnerDetailAccountReceipt(_currentPage, DEFAULT_ROWS);
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
                        let _json = JSON.parse(json);
                        $that.ownerDetailAccountReceiptInfo.total = _json.total;
                        $that.ownerDetailAccountReceiptInfo.records = _json.records;
                        $that.ownerDetailAccountReceiptInfo.feeReceipts = _json.data;
                        vc.emit('ownerDetailAccountReceipt', 'paginationPlus', 'init', {
                            total: $that.ownerDetailAccountReceiptInfo.records,
                            dataCount: $that.ownerDetailAccountReceiptInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryFeeAccountReceiptMethod: function() {
                $that._listOwnerDetailAccountReceipt(DEFAULT_PAGE, DEFAULT_ROWS);
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
                            $that.ownerDetailAccountReceiptInfo.selectReceipts.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.ownerDetailAccountReceiptInfo.selectReceipts = [];
                }
            }
        }
    });
})(window.vc);