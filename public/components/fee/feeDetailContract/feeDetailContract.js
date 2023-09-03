/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailContractInfo: {
                contracts: [],
                contractId:'',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('feeDetailContract', 'switch', function (_data) {
                $that.feeDetailContractInfo.contractId = _data.payerObjId;
                $that._loadFeeDetailContractData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailContract', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadFeeDetailContractData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('feeDetailContract', 'notify', function (_data) {
                $that._loadFeeDetailContractData(DEFAULT_PAGE,DEFAULT_ROWS);
            })
        },
        methods: {
            _loadFeeDetailContractData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        contractId:$that.feeDetailContractInfo.contractId,
                        page:_page,
                        row:_row
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.feeDetailContractInfo.contracts = _roomInfo.data;
                        vc.emit('feeDetailContract', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyFeeDetailContract: function () {
                $that._loadFeeDetailContractData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);