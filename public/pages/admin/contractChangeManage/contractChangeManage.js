/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractChangeManageInfo: {
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

                vc.component.contractChangeManageInfo.conditions.page = _page;
                vc.component.contractChangeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.contractChangeManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContractChangePlan',
                    param,
                    function (json, res) {
                        var _contractChangeManageInfo = JSON.parse(json);
                        vc.component.contractChangeManageInfo.total = _contractChangeManageInfo.total;
                        vc.component.contractChangeManageInfo.records = _contractChangeManageInfo.records;
                        vc.component.contractChangeManageInfo.contracts = _contractChangeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.contractChangeManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toChangeContractPage: function (_param) {
                vc.jumpToPage('/admin.html#/pages/admin/contractChangeDetail?param=' + _param)
            },
            _openDeleteContractModel: function (_contract) {
                vc.emit('deleteContract', 'openDeleteContractModal', _contract);
            },
            _queryContractMethod: function () {
                vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.contractChangeManageInfo.moreCondition) {
                    vc.component.contractChangeManageInfo.moreCondition = false;
                } else {
                    vc.component.contractChangeManageInfo.moreCondition = true;
                }
            },
            _printContract: function (_contract) {
                window.open("/print.html#/pages/admin/printContract?contractTypeId=" + _contract.contractType);
            }


        }
    });
})(window.vc);
