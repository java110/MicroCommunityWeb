/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            expirationContractInfo: {
                contracts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                contractId: '',
                conditions: {
                    contractName: '',
                    contractCode: '',
                    contractType: '',
                    expiration: '1'
                }
            }
        },
        _initMethod: function () {
            vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('contractManage', 'listContract', function (_param) {
                vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listContracts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listContracts: function (_page, _rows) {

                vc.component.expirationContractInfo.conditions.page = _page;
                vc.component.expirationContractInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.expirationContractInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json, res) {
                        var _expirationContractInfo = JSON.parse(json);
                        vc.component.expirationContractInfo.total = _expirationContractInfo.total;
                        vc.component.expirationContractInfo.records = _expirationContractInfo.records;
                        vc.component.expirationContractInfo.contracts = _expirationContractInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.expirationContractInfo.records,
                            dataCount: vc.component.expirationContractInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddContractModel: function (_contract) {
                //vc.emit('addContract', 'openAddContractModal', _contract);
                vc.jumpToPage('/admin.html#/pages/admin/addContract?contractId='+_contract.contractId)
            },

            _stopContractModel: function (_contract) {
                vc.emit('stopContract', 'openStopContractModal', _contract);
            },
            _queryContractMethod: function () {
                vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.expirationContractInfo.moreCondition) {
                    vc.component.expirationContractInfo.moreCondition = false;
                } else {
                    vc.component.expirationContractInfo.moreCondition = true;
                }
            },
            _printContract: function (_contract) {
                window.open("/print.html#/pages/admin/printContract?contractTypeId=" + _contract.contractType+"&contractId="+_contract.contractId);
            }

        }
    });
})(window.vc);
