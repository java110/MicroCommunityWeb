/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            housekeepingTypeManageInfo: {
                housekeepingTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                hktId: '',
                conditions: {
                    hktName: '',
                    isShow: '',
                    shopId: '9999',
                    typeCd: '1001'
                }
            }
        },
        _initMethod: function () {
            vc.component._listHousekeepingTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('housekeepingTypeManage', 'listHousekeepingType', function (_param) {
                vc.component._listHousekeepingTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listHousekeepingTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listHousekeepingTypes: function (_page, _rows) {

                vc.component.housekeepingTypeManageInfo.conditions.page = _page;
                vc.component.housekeepingTypeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.housekeepingTypeManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/housekeepingType/queryHousekeepingType',
                    param,
                    function (json, res) {
                        var _housekeepingTypeManageInfo = JSON.parse(json);
                        vc.component.housekeepingTypeManageInfo.total = _housekeepingTypeManageInfo.total;
                        vc.component.housekeepingTypeManageInfo.records = _housekeepingTypeManageInfo.records;
                        vc.component.housekeepingTypeManageInfo.housekeepingTypes = _housekeepingTypeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.housekeepingTypeManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddHousekeepingTypeModal: function () {
                vc.emit('addHousekeepingType', 'openAddHousekeepingTypeModal', {
                    typeCd:'1001'
                });
            },
            _openEditHousekeepingTypeModel: function (_housekeepingType) {
                vc.emit('editHousekeepingType', 'openEditHousekeepingTypeModal', _housekeepingType);
            },
            _openDeleteHousekeepingTypeModel: function (_housekeepingType) {
                vc.emit('deleteHousekeepingType', 'openDeleteHousekeepingTypeModal', _housekeepingType);
            },
            _queryHousekeepingTypeMethod: function () {
                vc.component._listHousekeepingTypes(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.housekeepingTypeManageInfo.moreCondition) {
                    vc.component.housekeepingTypeManageInfo.moreCondition = false;
                } else {
                    vc.component.housekeepingTypeManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
