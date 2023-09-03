/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailContractInfo: {
                contracts: [],
                staffId: '',
                tel:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('staffDetailContract', 'switch', function (_data) {
                $that.staffDetailContractInfo.staffId = _data.staffId;
                $that.staffDetailContractInfo.tel = _data.tel;

                $that._loadStaffDetailContractData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('staffDetailContract', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadStaffDetailContractData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadStaffDetailContractData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        operatorLink: $that.staffDetailContractInfo.tel,
                    }
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.staffDetailContractInfo.contracts = _roomInfo.data;
                        vc.emit('staffDetailContract', 'paginationPlus', 'init', {
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
            _qureyStaffDetailContract: function () {
                $that._loadStaffDetailContractData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _printContract: function (_contract) {
                window.open("/print.html#/pages/admin/printContract?contractTypeId=" + _contract.contractType + "&contractId=" + _contract.contractId);
            },
            _viewContract: function (_contract) {
                vc.jumpToPage("/#/pages/common/contractApplyDetail?contractId=" + _contract.contractId);
            },
            _openContractFee: function (_contract) {
                vc.jumpToPage("/#/pages/property/listContractFee?contractId=" + _contract.contractId + "&contractCode=" + _contract.contractCode);
            },
        }
    });
})(window.vc);