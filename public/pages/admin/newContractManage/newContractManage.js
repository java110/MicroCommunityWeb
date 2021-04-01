/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            newContractManageInfo: {
                contracts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                contractId: '',
                conditions: {
                    contractName: '',
                    contractCode: '',
                    contractType: '',
                    state:'11'
                }
            }
        },
        _initMethod: function () {
            vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('newContractManage', 'listContract', function (_param) {
                vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listContracts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listContracts: function (_page, _rows) {

                vc.component.newContractManageInfo.conditions.page = _page;
                vc.component.newContractManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.newContractManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json, res) {
                        var _newContractManageInfo = JSON.parse(json);
                        vc.component.newContractManageInfo.total = _newContractManageInfo.total;
                        vc.component.newContractManageInfo.records = _newContractManageInfo.records;
                        vc.component.newContractManageInfo.contracts = _newContractManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.newContractManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddContractModal: function () {
                vc.emit('addContract', 'openAddContractModal', {});
            },
            _openEditContractModel: function (_contract) {
                vc.emit('editContract', 'openEditContractModal', _contract);
            },
            _openDeleteContractModel: function (_contract) {
                vc.emit('deleteContract', 'openDeleteContractModal', _contract);
            },
            _queryContractMethod: function () {
                vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.newContractManageInfo.moreCondition) {
                    vc.component.newContractManageInfo.moreCondition = false;
                } else {
                    vc.component.newContractManageInfo.moreCondition = true;
                }
            },
            _printContract: function (_contract) {
                window.open("/print.html#/pages/admin/printContract?contractTypeId=" + _contract.contractType+"&contractId="+_contract.contractId);
            }
        }
    });
})(window.vc);
