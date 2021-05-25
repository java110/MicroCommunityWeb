/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractTypeManageInfo: {
                contractTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                contractTypeId: '',
                componentShow: 'contractTypeList',
                conditions: {
                    typeName: '',
                    audit: '',
                    contractTypeId: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listContractTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('contractTypeManage', 'componentShow', function (_param) {
                vc.component.contractTypeManageInfo.componentShow = 'contractTypeList';
            });

            vc.on('contractTypeManage', 'listContractType', function (_param) {
                vc.component._listContractTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listContractTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listContractTypes: function (_page, _rows) {

                vc.component.contractTypeManageInfo.conditions.page = _page;
                vc.component.contractTypeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.contractTypeManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContractType',
                    param,
                    function (json, res) {
                        var _contractTypeManageInfo = JSON.parse(json);
                        vc.component.contractTypeManageInfo.total = _contractTypeManageInfo.total;
                        vc.component.contractTypeManageInfo.records = _contractTypeManageInfo.records;
                        vc.component.contractTypeManageInfo.contractTypes = _contractTypeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.contractTypeManageInfo.records,
                            dataCount: vc.component.contractTypeManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddContractTypeModal: function () {
                vc.emit('addContractType', 'openAddContractTypeModal', {});
            },
            _openEditContractTypeModel: function (_contractType) {
                vc.emit('editContractType', 'openEditContractTypeModal', _contractType);
            },
            _openDeleteContractTypeModel: function (_contractType) {
                vc.emit('deleteContractType', 'openDeleteContractTypeModal', _contractType);
            },
            _queryContractTypeMethod: function () {
                vc.component._listContractTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openContractTypeSpecModel: function (_contractType) {
                vc.jumpToPage('/admin.html#/pages/admin/contractTypeSpecManage?contractTypeId=' + _contractType.contractTypeId);
            },
            _openContractTemplate: function (_contractType) {
                $that.contractTypeManageInfo.componentShow = '';
                vc.emit('addTemplateView', 'openTemplate', _contractType);
            },
            _moreCondition: function () {
                if (vc.component.contractTypeManageInfo.moreCondition) {
                    vc.component.contractTypeManageInfo.moreCondition = false;
                } else {
                    vc.component.contractTypeManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
