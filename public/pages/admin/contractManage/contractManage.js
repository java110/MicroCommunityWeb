/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractManageInfo: {
                contracts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                contractId: '',
                conditions: {
                    contractNameLike: '',
                    contractCode: '',
                    contractType: ''
                },
                contractTypes: [],
            }
        },
        _initMethod: function () {
            vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listContractTypes();
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
                vc.component.contractManageInfo.conditions.page = _page;
                vc.component.contractManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.contractManageInfo.conditions
                };
                param.params.contractNameLike = param.params.contractNameLike.trim();
                param.params.contractCode = param.params.contractCode.trim();
                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json, res) {
                        var _contractManageInfo = JSON.parse(json);
                        vc.component.contractManageInfo.total = _contractManageInfo.total;
                        vc.component.contractManageInfo.records = _contractManageInfo.records;
                        vc.component.contractManageInfo.contracts = _contractManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.contractManageInfo.records,
                            dataCount: vc.component.contractManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listContractTypes: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 50
                    }
                };
                //发送get请求
                vc.http.apiGet('/contract/queryContractType',
                    param,
                    function (json, res) {
                        let _contractTypeManageInfo = JSON.parse(json);
                        $that.contractManageInfo.contractTypes = _contractTypeManageInfo.data;
                    },
                    function (errInfo, error) {
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
            //查询
            _queryContractMethod: function () {
                vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetContractMethod: function () {
                vc.component.contractManageInfo.conditions.contractNameLike = "";
                vc.component.contractManageInfo.conditions.contractCode = "";
                vc.component.contractManageInfo.conditions.contractType = "";
                vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.contractManageInfo.moreCondition) {
                    vc.component.contractManageInfo.moreCondition = false;
                } else {
                    vc.component.contractManageInfo.moreCondition = true;
                }
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