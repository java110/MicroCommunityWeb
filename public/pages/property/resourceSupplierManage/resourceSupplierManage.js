/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceSupplierManageInfo: {
                resourceSuppliers: [],
                total: 0,
                records: 1,
                moreCondition: false,
                rsId: '',
                conditions: {
                    supplierName: '',
                    tel: '',
                    rsId: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listResourceSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('resourceSupplierManage', 'listResourceSupplier', function (_param) {
                vc.component._listResourceSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listResourceSuppliers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listResourceSuppliers: function (_page, _rows) {
                vc.component.resourceSupplierManageInfo.conditions.page = _page;
                vc.component.resourceSupplierManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.resourceSupplierManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('resourceSupplier.listResourceSuppliers',
                    param,
                    function (json, res) {
                        var _resourceSupplierManageInfo = JSON.parse(json);
                        vc.component.resourceSupplierManageInfo.total = _resourceSupplierManageInfo.total;
                        vc.component.resourceSupplierManageInfo.records = _resourceSupplierManageInfo.records;
                        vc.component.resourceSupplierManageInfo.resourceSuppliers = _resourceSupplierManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.resourceSupplierManageInfo.records,
                            dataCount: vc.component.resourceSupplierManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddResourceSupplierModal: function () {
                vc.emit('addResourceSupplier', 'openAddResourceSupplierModal', {});
            },
            _openEditResourceSupplierModel: function (_resourceSupplier) {
                vc.emit('editResourceSupplier', 'openEditResourceSupplierModal', _resourceSupplier);
            },
            _openDeleteResourceSupplierModel: function (_resourceSupplier) {
                vc.emit('deleteResourceSupplier', 'openDeleteResourceSupplierModal', _resourceSupplier);
            },
            _queryResourceSupplierMethod: function () {
                vc.component._listResourceSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.resourceSupplierManageInfo.moreCondition) {
                    vc.component.resourceSupplierManageInfo.moreCondition = false;
                } else {
                    vc.component.resourceSupplierManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
