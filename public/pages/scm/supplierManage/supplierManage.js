/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            supplierManageInfo: {
                suppliers: [],
                supplierTypes:[],
                total: 0,
                records: 1,
                moreCondition: false,
                supplierId: '',
                conditions: {
                    stId: '',
                    supplierName: '',
                    personName: '',
                    personTel: '',
                    startTime: '',
                    endTime: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listLoadSupplierTypes();
        },
        _initEvent: function () {

            vc.on('supplierManage', 'listSupplier', function (_param) {
                vc.component._listSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listSuppliers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listSuppliers: function (_page, _rows) {

                vc.component.supplierManageInfo.conditions.page = _page;
                vc.component.supplierManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.supplierManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/supplier.listSupplier',
                    param,
                    function (json, res) {
                        var _supplierManageInfo = JSON.parse(json);
                        vc.component.supplierManageInfo.total = _supplierManageInfo.total;
                        vc.component.supplierManageInfo.records = _supplierManageInfo.records;
                        vc.component.supplierManageInfo.suppliers = _supplierManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.supplierManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddSupplierModal: function () {
                vc.emit('addSupplier', 'openAddSupplierModal', {});
            },
            _openEditSupplierModel: function (_supplier) {
                vc.emit('editSupplier', 'openEditSupplierModal', _supplier);
            },
            _openDeleteSupplierModel: function (_supplier) {
                vc.emit('deleteSupplier', 'openDeleteSupplierModal', _supplier);
            },
            _querySupplierMethod: function () {
                vc.component._listSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.supplierManageInfo.moreCondition) {
                    vc.component.supplierManageInfo.moreCondition = false;
                } else {
                    vc.component.supplierManageInfo.moreCondition = true;
                }
            },
            _listLoadSupplierTypes: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100
                    }
                };
                //发送get请求
                vc.http.apiGet('/supplierType.listSupplierType',
                    param,
                    function (json, res) {
                        let _supplierTypeManageInfo = JSON.parse(json);
                        $that.supplierManageInfo.supplierTypes = _supplierTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },


        }
    });
})(window.vc);
