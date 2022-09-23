/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            meterTypeManageInfo: {
                meterTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                typeId: '',
                conditions: {
                    typeId: '',
                    typeName: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listMeterTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('meterTypeManage', 'listMeterType', function (_param) {
                vc.component._listMeterTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMeterTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMeterTypes: function (_page, _rows) {

                vc.component.meterTypeManageInfo.conditions.page = _page;
                vc.component.meterTypeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.meterTypeManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('meterType.listMeterType',
                    param,
                    function (json, res) {
                        var _meterTypeManageInfo = JSON.parse(json);
                        vc.component.meterTypeManageInfo.total = _meterTypeManageInfo.total;
                        vc.component.meterTypeManageInfo.records = _meterTypeManageInfo.records;
                        vc.component.meterTypeManageInfo.meterTypes = _meterTypeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.meterTypeManageInfo.records,
                            dataCount: vc.component.meterTypeManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMeterTypeModal: function () {
                vc.emit('addMeterType', 'openAddMeterTypeModal', {});
            },
            _openEditMeterTypeModel: function (_meterType) {
                vc.emit('editMeterType', 'openEditMeterTypeModal', _meterType);
            },
            _openDeleteMeterTypeModel: function (_meterType) {
                vc.emit('deleteMeterType', 'openDeleteMeterTypeModal', _meterType);
            },
            _queryMeterTypeMethod: function () {
                vc.component._listMeterTypes(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.meterTypeManageInfo.moreCondition) {
                    vc.component.meterTypeManageInfo.moreCondition = false;
                } else {
                    vc.component.meterTypeManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
