/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            chainSupplierCatalogManageInfo: {
                chainSupplierCatalogs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                catalogId: '',
                conditions: {
                    catalogName: '',
                    seq: '',
                    csId: '',
                }
            }
        },
        _initMethod: function () {
            $that.chainSupplierCatalogManageInfo.conditions.csId = vc.getParam('csId');
            console.log("success",vc.getParam('csId'));
            vc.component._listChainSupplierCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('chainSupplierCatalogManage', 'listChainSupplierCatalog', function (_param) {
                vc.component._listChainSupplierCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listChainSupplierCatalogs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listChainSupplierCatalogs: function (_page, _rows) {

                vc.component.chainSupplierCatalogManageInfo.conditions.page = _page;
                vc.component.chainSupplierCatalogManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.chainSupplierCatalogManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('chainSupplierCatalog.listChainSupplierCatalog',
                    param,
                    function (json, res) {
                        var _chainSupplierCatalogManageInfo = JSON.parse(json);
                        vc.component.chainSupplierCatalogManageInfo.total = _chainSupplierCatalogManageInfo.total;
                        vc.component.chainSupplierCatalogManageInfo.records = _chainSupplierCatalogManageInfo.records;
                        vc.component.chainSupplierCatalogManageInfo.chainSupplierCatalogs = _chainSupplierCatalogManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.chainSupplierCatalogManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddChainSupplierCatalogModal: function () {
                vc.emit('addChainSupplierCatalog', 'openAddChainSupplierCatalogModal', {});
            },
            _openEditChainSupplierCatalogModel: function (_chainSupplierCatalog) {
                vc.emit('editChainSupplierCatalog', 'openEditChainSupplierCatalogModal', _chainSupplierCatalog);
            },
            _openDeleteChainSupplierCatalogModel: function (_chainSupplierCatalog) {
                vc.emit('deleteChainSupplierCatalog', 'openDeleteChainSupplierCatalogModal', _chainSupplierCatalog);
            },
            _queryChainSupplierCatalogMethod: function () {
                vc.component._listChainSupplierCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.chainSupplierCatalogManageInfo.moreCondition) {
                    vc.component.chainSupplierCatalogManageInfo.moreCondition = false;
                } else {
                    vc.component.chainSupplierCatalogManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
