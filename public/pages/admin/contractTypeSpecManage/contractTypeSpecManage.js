/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractTypeSpecManageInfo: {
                contractTypeSpecs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                specCd: '',
                contractTypeId: '',
                typeName: '',
                conditions: {
                    specName: '',
                    specShow: '',
                    specCd: '',
                    contractTypeId: ''
                }
            }
        },
        _initMethod: function () {
            $that.contractTypeSpecManageInfo.contractTypeId = vc.getParam('contractTypeId');
            $that.contractTypeSpecManageInfo.conditions.contractTypeId = vc.getParam('contractTypeId');
            $that.contractTypeSpecManageInfo.typeName = vc.getParam('typeName');
            vc.component._listContractTypeSpecs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('contractTypeSpecManage', 'listContractTypeSpec', function (_param) {
                vc.component._listContractTypeSpecs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listContractTypeSpecs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listContractTypeSpecs: function (_page, _rows) {
                vc.component.contractTypeSpecManageInfo.conditions.page = _page;
                vc.component.contractTypeSpecManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.contractTypeSpecManageInfo.conditions
                };
                param.params.specName = param.params.specName.trim();
                param.params.specCd = param.params.specCd.trim();
                //发送get请求
                vc.http.apiGet('/contract/queryContractTypeSpec',
                    param,
                    function (json, res) {
                        var _contractTypeSpecManageInfo = JSON.parse(json);
                        vc.component.contractTypeSpecManageInfo.total = _contractTypeSpecManageInfo.total;
                        vc.component.contractTypeSpecManageInfo.records = _contractTypeSpecManageInfo.records;
                        vc.component.contractTypeSpecManageInfo.contractTypeSpecs = _contractTypeSpecManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.contractTypeSpecManageInfo.records,
                            dataCount: vc.component.contractTypeSpecManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddContractTypeSpecModal: function () {
                vc.emit('addContractTypeSpec', 'openAddContractTypeSpecModal', {
                    contractTypeId: $that.contractTypeSpecManageInfo.contractTypeId
                });
            },
            _openEditContractTypeSpecModel: function (_contractTypeSpec) {
                vc.emit('editContractTypeSpec', 'openEditContractTypeSpecModal', _contractTypeSpec);
            },
            _openDeleteContractTypeSpecModel: function (_contractTypeSpec) {
                vc.emit('deleteContractTypeSpec', 'openDeleteContractTypeSpecModal', _contractTypeSpec);
            },
            //查询
            _queryContractTypeSpecMethod: function () {
                vc.component._listContractTypeSpecs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetContractTypeSpecMethod: function () {
                vc.component.contractTypeSpecManageInfo.conditions.specName = "";
                vc.component.contractTypeSpecManageInfo.conditions.specShow = "";
                vc.component.contractTypeSpecManageInfo.conditions.specCd = "";
                vc.component._listContractTypeSpecs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _goBack: function () {
                vc.goBack();
            },
            _moreCondition: function () {
                if (vc.component.contractTypeSpecManageInfo.moreCondition) {
                    vc.component.contractTypeSpecManageInfo.moreCondition = false;
                } else {
                    vc.component.contractTypeSpecManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
