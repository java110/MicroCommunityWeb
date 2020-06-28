/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            repairSettingManageInfo: {
                repairSettings: [],
                total: 0,
                records: 1,
                moreCondition: false,
                settingId: '',
                conditions: {
                    repairTypeName: '',
                    repairWay: '',
                    repairType: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listRepairSettings(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('repairSettingManage', 'listRepairSetting', function (_param) {
                vc.component._listRepairSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRepairSettings(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listRepairSettings: function (_page, _rows) {

                vc.component.repairSettingManageInfo.conditions.page = _page;
                vc.component.repairSettingManageInfo.conditions.row = _rows;
                vc.component.repairSettingManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.repairSettingManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('repair.listRepairSettings',
                    param,
                    function (json, res) {
                        var _repairSettingManageInfo = JSON.parse(json);
                        vc.component.repairSettingManageInfo.total = _repairSettingManageInfo.total;
                        vc.component.repairSettingManageInfo.records = _repairSettingManageInfo.records;
                        vc.component.repairSettingManageInfo.repairSettings = _repairSettingManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.repairSettingManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddRepairSettingModal: function () {
                vc.emit('addRepairSetting', 'openAddRepairSettingModal', {});
            },
            _openEditRepairSettingModel: function (_repairSetting) {
                vc.emit('editRepairSetting', 'openEditRepairSettingModal', _repairSetting);
            },
            _openDeleteRepairSettingModel: function (_repairSetting) {
                vc.emit('deleteRepairSetting', 'openDeleteRepairSettingModal', _repairSetting);
            },
            _queryRepairSettingMethod: function () {
                vc.component._listRepairSettings(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.repairSettingManageInfo.moreCondition) {
                    vc.component.repairSettingManageInfo.moreCondition = false;
                } else {
                    vc.component.repairSettingManageInfo.moreCondition = true;
                }
            },
            _viewRepairTypeUser: function (_repairSetting) {
                vc.jumpToPage('/admin.html#/pages/property/repairTypeUser?' + vc.objToGetParam(_repairSetting));
            }


        }
    });
})(window.vc);
