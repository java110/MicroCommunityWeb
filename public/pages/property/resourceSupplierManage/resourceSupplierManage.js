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
            $that._listResourceSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('resourceSupplierManage', 'listResourceSupplier', function (_param) {
                $that._listResourceSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listResourceSuppliers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listResourceSuppliers: function (_page, _rows) {
                $that.resourceSupplierManageInfo.conditions.page = _page;
                $that.resourceSupplierManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.resourceSupplierManageInfo.conditions
                };
                param.params.supplierName = param.params.supplierName.trim();
                param.params.tel = param.params.tel.trim();
                param.params.rsId = param.params.rsId.trim();
                //发送get请求
                vc.http.apiGet('resourceSupplier.listResourceSuppliers',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.resourceSupplierManageInfo.total = _json.total;
                        $that.resourceSupplierManageInfo.records = _json.records;
                        $that.resourceSupplierManageInfo.resourceSuppliers = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.resourceSupplierManageInfo.records,
                            dataCount: $that.resourceSupplierManageInfo.total,
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
            //查询
            _queryResourceSupplierMethod: function () {
                $that._listResourceSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetResourceSupplierMethod: function () {
                $that.resourceSupplierManageInfo.conditions.supplierName = "";
                $that.resourceSupplierManageInfo.conditions.tel = "";
                $that.resourceSupplierManageInfo.conditions.rsId = "";
                $that._listResourceSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.resourceSupplierManageInfo.moreCondition) {
                    $that.resourceSupplierManageInfo.moreCondition = false;
                } else {
                    $that.resourceSupplierManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
