/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            supplierTypeManageInfo: {
                supplierTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                stId: '',
                conditions: {
                    typeCd: '',
                    typeName: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listSupplierTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('supplierTypeManage', 'listSupplierType', function (_param) {
                vc.component._listSupplierTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listSupplierTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listSupplierTypes: function (_page, _rows) {

                vc.component.supplierTypeManageInfo.conditions.page = _page;
                vc.component.supplierTypeManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.supplierTypeManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/supplierType.listSupplierType',
                    param,
                    function (json, res) {
                        let _supplierTypeManageInfo = JSON.parse(json);
                        vc.component.supplierTypeManageInfo.total = _supplierTypeManageInfo.total;
                        vc.component.supplierTypeManageInfo.records = _supplierTypeManageInfo.records;
                        vc.component.supplierTypeManageInfo.supplierTypes = _supplierTypeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.supplierTypeManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddSupplierTypeModal: function () {
                vc.emit('addSupplierType', 'openAddSupplierTypeModal', {});
            },
            _openEditSupplierTypeModel: function (_supplierType) {
                vc.emit('editSupplierType', 'openEditSupplierTypeModal', _supplierType);
            },
            _openDeleteSupplierTypeModel: function (_supplierType) {
                vc.emit('deleteSupplierType', 'openDeleteSupplierTypeModal', _supplierType);
            },
            _querySupplierTypeMethod: function () {
                vc.component._listSupplierTypes(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.supplierTypeManageInfo.moreCondition) {
                    vc.component.supplierTypeManageInfo.moreCondition = false;
                } else {
                    vc.component.supplierTypeManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
