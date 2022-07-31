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
                    contractName: '',
                    contractCode: '',
                    contractType: '',
                    state: '11'
                },
                contractId: ''
            }
        },
        _initMethod: function () {
            vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('contractAudit', 'nitify', function (_param) {
                $that._audit(_param);
            });

            vc.on('contractManage', 'listContract', function (_param) {
                vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listContracts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _audit: function (_param) {
                let _state = "33";

                if (_param.state == '1100') {
                    _state = "22";
                }
                let _data = {
                    contractId: $that.contractManageInfo.contractId,
                    state: _state,
                    stateDesc: _param.remark
                }
                vc.http.apiPost(
                    '/contract/auditContract',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.emit('contractManage', 'listContract', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        vc.message(errInfo);
                    });
            },
            _listContracts: function (_page, _rows) {

                vc.component.contractManageInfo.conditions.page = _page;
                vc.component.contractManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.contractManageInfo.conditions
                };

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
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditContractModal: function (_contract) {
                $that.contractManageInfo.contractId = _contract.contractId;
                vc.emit('audit', 'openAuditModal', _contract);
            },
            _openDeleteContractModel: function (_contract) {
                vc.emit('deleteContract', 'openDeleteContractModal', _contract);
            },
            _queryContractMethod: function () {
                vc.component._listContracts(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.contractManageInfo.moreCondition) {
                    vc.component.contractManageInfo.moreCondition = false;
                } else {
                    vc.component.contractManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
