/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailFeeRuleInfo: {
                rules: [],
                feeId: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('feeDetailFeeRule', 'switch', function(_data) {
                $that.feeDetailFeeRuleInfo.feeId = _data.feeId;
                $that._loadFeeDetailFeeRuleData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailFeeRule', 'notify',
                function(_data) {
                    $that._loadFeeDetailFeeRuleData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('feeDetailFeeRule', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._loadFeeDetailFeeRuleData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadFeeDetailFeeRuleData: function(_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: $that.feeDetailFeeRuleInfo.feeId,
                        detailId: '-1',
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/payFeeRule.listPayFeeRule',
                    param,
                    function(json) {
                        let _roomInfo = JSON.parse(json);
                        $that.feeDetailFeeRuleInfo.rules = _roomInfo.data;
                        vc.emit('feeDetailFeeRule', 'paginationPlus', 'init', {
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
            _qureyFeeDetailFeeRule: function() {
                $that._loadFeeDetailFeeRuleData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _deleteFeeRule:function(_fee){
                vc.emit('deleteFeeRule', 'openDeleteFeeRuleModal',_fee);
            },
            _updateFeeRule:function(_fee){
                vc.emit('editFeeRule', 'openEditFeeRuleModal',_fee);
            },
            _finishFeeRule:function(_fee){
                vc.emit('finishFeeRule', 'openFinishFeeRuleModal',_fee);
            }
        }
    });
})(window.vc);