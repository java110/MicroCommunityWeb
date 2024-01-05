/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailSubInfo: {
                subs: [],
                feeId: '',
                total: '',
                records: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            //切换 至费用页面
            vc.on('feeDetailSub', 'switch', function(_param) {
                if (_param.feeId == '') {
                    return;
                }
                vc.copyObject(_param, $that.feeDetailSubInfo);
                $that._listFeeDetailSub(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailSub', 'loadSub', function() {
                $that._listFeeDetailSub(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailSub', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._listFeeDetailSub(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listFeeDetailSub: function(_page, _rows) {
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        pcFeeId: $that.feeDetailSubInfo.feeId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeSub.listPayFeeSub',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.feeDetailSubInfo.total = _json.total;
                        $that.feeDetailSubInfo.records = _json.records;
                        $that.feeDetailSubInfo.subs = _json.data;
                        vc.emit('feeDetailSub', 'paginationPlus', 'init', {
                            total: $that.feeDetailSubInfo.records,
                            dataCount: $that.feeDetailSubInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _mergeFee:function(_fee){
                vc.emit('mergeFee', 'openMergeFeeModal',_fee);
            }
        }
    });
})(window.vc);