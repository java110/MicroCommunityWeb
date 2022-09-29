/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var ALL_ROWS = 100;
    vc.extends({
        data: {
            dataPrivilegeUnitInfo: {
                dataPrivilegeUnits: [],
                total: 0,
                records: 1,
                moreCondition: false,
                dpId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('dataPrivilegeUnitInfo', 'openDataPrivilegeUnit', function (_param) {
                vc.copyObject(_param, vc.component.dataPrivilegeUnitInfo);
                vc.component._listDataPrivilegeUnits(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('dataPrivilegeUnitInfo', 'listDataPrivilegeUnit', function (_param) {
                //vc.copyObject(_param, vc.component.dataPrivilegeUnitInfo.conditions);
                vc.component._listDataPrivilegeUnits(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('dataPrivilegeUnitInfo', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._listDataPrivilegeUnits(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listDataPrivilegeUnits: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        roleId: vc.component.dataPrivilegeUnitInfo.pgId
                    }
                };
                //发送get请求
                vc.http.apiGet('/dataPrivilegeUnit.listDataPrivilegeUnit',
                    param,
                    function (json, res) {
                        var _dataPrivilegeUnitInfo = JSON.parse(json);
                        vc.component.dataPrivilegeUnitInfo.total = _dataPrivilegeUnitInfo.total;
                        vc.component.dataPrivilegeUnitInfo.records = _dataPrivilegeUnitInfo.records;
                        vc.component.dataPrivilegeUnitInfo.dataPrivilegeUnits = _dataPrivilegeUnitInfo.data;
                        vc.emit('dataPrivilegeUnitInfo', 'paginationPlus', 'init', {
                            total: vc.component.dataPrivilegeUnitInfo.records,
                            dataCount: vc.component.dataPrivilegeUnitInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddDataPrivilegeUnitModal: function () {
                vc.emit('addDataPrivilegeUnit', 'openAddDataPrivilegeUnitModal', {
                    dpId: vc.component.dataPrivilegeUnitInfo.dpId,
                });
            },
            _openDeleteDataPrivilegeUnitModel: function (_dataPrivilegeUnit) {
                vc.emit('deleteDataPrivilegeUnit', 'openDeleteDataPrivilegeUnitModal', _dataPrivilegeUnit);
            },
            _openBeyondDataPrivilegeUnit: function (_dataPrivilegeUnit) {
            },
            _queryDataPrivilegeUnitMethod: function () {
                vc.component._listDataPrivilegeUnits(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.dataPrivilegeUnitInfo.moreCondition) {
                    vc.component.dataPrivilegeUnitInfo.moreCondition = false;
                } else {
                    vc.component.dataPrivilegeUnitInfo.moreCondition = true;
                }
            },
            _goBack: function () {
                vc.emit('orgManage', 'onBack', {});
            }
        }
    });
})(window.vc);
