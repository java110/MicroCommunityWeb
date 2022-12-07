/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reserveCatalogManageInfo: {
                reserveCatalogs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                catalogId: '',
                conditions: {
                    catalogId: '',
                    name: '',
                    type: '',
                    communityId:vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listReserveCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('reserveCatalogManage', 'listReserveCatalog', function (_param) {
                vc.component._listReserveCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReserveCatalogs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReserveCatalogs: function (_page, _rows) {

                vc.component.reserveCatalogManageInfo.conditions.page = _page;
                vc.component.reserveCatalogManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.reserveCatalogManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reserve.listReserveCatalog',
                    param,
                    function (json, res) {
                        var _reserveCatalogManageInfo = JSON.parse(json);
                        vc.component.reserveCatalogManageInfo.total = _reserveCatalogManageInfo.total;
                        vc.component.reserveCatalogManageInfo.records = _reserveCatalogManageInfo.records;
                        vc.component.reserveCatalogManageInfo.reserveCatalogs = _reserveCatalogManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reserveCatalogManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReserveCatalogModal: function () {
                vc.emit('addReserveCatalog', 'openAddReserveCatalogModal', {});
            },
            _openEditReserveCatalogModel: function (_reserveCatalog) {
                vc.emit('editReserveCatalog', 'openEditReserveCatalogModal', _reserveCatalog);
            },
            _openDeleteReserveCatalogModel: function (_reserveCatalog) {
                vc.emit('deleteReserveCatalog', 'openDeleteReserveCatalogModal', _reserveCatalog);
            },
            _queryReserveCatalogMethod: function () {
                vc.component._listReserveCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.reserveCatalogManageInfo.moreCondition) {
                    vc.component.reserveCatalogManageInfo.moreCondition = false;
                } else {
                    vc.component.reserveCatalogManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
