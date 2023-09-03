/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractDetailSubInfo: {
                contracts: [],
                contractId: '',
                roomNum: '',
                totalArea: '0',
                total: '',
                records: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('contractDetailSub', 'switch', function (_data) {
                $that.contractDetailSubInfo.contractId = _data.contractId;
                $that._loadContractDetailSubInfoData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('contractDetailSub', 'paginationPlus', 'page_event',
            function(_currentPage) {
                vc.component._loadContractDetailSubInfoData(_currentPage, DEFAULT_ROWS);
            });
           
        },
        methods: {
            _loadContractDetailSubInfoData: function (_page, _row) {
                let param = {
                    params: {
                        contractParentId: $that.contractDetailSubInfo.contractId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page:_page,
                        row:_row
                    }
                };
                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.contractDetailSubInfo.contracts = _json.data;
                        vc.component.contractDetailSubInfo.total = _json.total;
                        vc.component.contractDetailSubInfo.records = _json.records;
                        vc.emit('contractDetailSub', 'paginationPlus', 'init', {
                            total: vc.component.contractDetailSubInfo.records,
                            dataCount: vc.component.contractDetailSubInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _viewContract: function (_contract) {
                // vc.jumpToPage("/#/pages/common/contractApplyDetail?contractId=" + _contract.contractId);
                vc.jumpToPage("/#/pages/contract/contractDetail?contractId=" + _contract.contractId);
             },
        }
    });
})(window.vc);