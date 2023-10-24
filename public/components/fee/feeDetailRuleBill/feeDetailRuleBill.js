/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 30;
    vc.extends({
        data: {
            feeDetailRuleBillInfo: {
                bills: [],
                feeId: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('feeDetailRuleBill', 'switch', function(_data) {
                $that.feeDetailRuleBillInfo.feeId = _data.feeId;
                $that._loadFeeDetailRuleBillData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailRuleBill', 'notify',
                function(_data) {
                    $that._loadFeeDetailRuleBillData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('feeDetailRuleBill', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._loadFeeDetailRuleBillData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadFeeDetailRuleBillData: function(_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: $that.feeDetailRuleBillInfo.feeId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/payFeeRule.listPayFeeRuleBill',
                    param,
                    function(json) {
                        let _roomInfo = JSON.parse(json);
                        $that.feeDetailRuleBillInfo.bills = _roomInfo.data;
                        vc.emit('feeDetailRuleBill', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyFeeDetailRuleBill: function() {
                $that._loadFeeDetailRuleBillData(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);