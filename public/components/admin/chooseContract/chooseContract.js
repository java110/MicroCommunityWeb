(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseContract: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseContractInfo: {
                contracts: [],
                _currentContractName: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseContract', 'openChooseContractModel', function (_param) {
                $('#chooseContractModel').modal('show');
                vc.component._refreshChooseContractInfo();
                vc.component._loadAllContractInfo(1, 10, '');
            });
            vc.on('chooseContract', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadAllContractInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadAllContractInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        contractNameLike: _name
                    }
                };
                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json) {
                        var _contractInfo = JSON.parse(json);
                        vc.component.chooseContractInfo.contracts = _contractInfo.data;
                        vc.component.chooseContractInfo.total = _contractInfo.total;
                        vc.component.chooseContractInfo.records = _contractInfo.records;
                        vc.emit('chooseContract', 'paginationPlus', 'init', {
                            total: vc.component.chooseContractInfo.records,
                            dataCount: vc.component.chooseContractInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseContract: function (_contract) {
                if (_contract.hasOwnProperty('name')) {
                    _contract.contractName = _contract.name;
                }
                vc.emit($props.emitChooseContract, 'chooseContract', _contract);
                vc.emit($props.emitLoadData, 'listContractData', {
                    contractId: _contract.contractId
                });
                $('#chooseContractModel').modal('hide');
            },
            queryContracts: function () {
                vc.component._loadAllContractInfo(1, 10, vc.component.chooseContractInfo._currentContractName);
            },
            _refreshChooseContractInfo: function () {
                vc.component.chooseContractInfo._currentContractName = "";
            }
        }
    });
})(window.vc);