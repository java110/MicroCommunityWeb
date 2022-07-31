/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractInfo: {
                ownerId: '',
                ownerName: '',
                contracts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                contractId: '',
                conditions: {
                    objId: '',
                    contractCode: '',
                    contractType: '',

                }
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            //切换 至费用页面
            vc.on('simplifyContract', 'switch', function(_param) {
                if (_param.ownerId == '') {
                    return;
                }
                $that.clearContractInfoInfo();
                vc.copyObject(_param, $that.contractInfo);
                $that.contractInfo.conditions.objId = _param.ownerId;
                $that._listContractInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            });

            vc.on('simplifyContract', 'notify', function() {
                $that._listContractInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            });


            vc.on('simplifyContract', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._listContractInfo(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listContractInfo: function(_page, _row) {
                vc.component.contractInfo.conditions.page = _page;
                vc.component.contractInfo.conditions.row = _row;
                var param = {
                    params: vc.component.contractInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function(json, res) {
                        var _contractManageInfo = JSON.parse(json);
                        vc.component.contractInfo.total = _contractManageInfo.total;
                        vc.component.contractInfo.records = _contractManageInfo.records;
                        vc.component.contractInfo.contracts = _contractManageInfo.data;
                        vc.emit('simplifyContract', 'paginationPlus', 'init', {
                            total: vc.component.contractInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddContractModal: function() {
                vc.jumpToPage('/#/pages/admin/newContractManage');
            },
            _printContract: function(_contract) {
                window.open("/print.html#/pages/admin/printContract?contractTypeId=" + _contract.contractType + "&contractId=" + _contract.contractId);
            },
            _viewContract: function(_contract) {
                vc.jumpToPage("/#/pages/common/contractApplyDetail?contractId=" + _contract.contractId);
            },
            clearContractInfoInfo: function() {
                $that.contractInfo = {
                    ownerId: '',
                    ownerName: '',
                    contracts: [],
                    total: 0,
                    records: 1,
                    moreCondition: false,
                    contractId: '',
                    conditions: {
                        contractName: '',
                        contractCode: '',
                        contractType: '',

                    }
                }
            },
            _openContractFee: function(_contract) {
                vc.jumpToPage("/#/pages/property/listContractFee?contractId=" + _contract.contractId + "&contractCode=" + _contract.contractCode);
            },


        }
    });
})(window.vc);