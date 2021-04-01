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
                repairWays: [],
                conditions: {
                    repairTypeName: '',
                    repairWay: '',
                    repairType: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listRepairSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            //与字典表关联
            vc.getDict('r_repair_setting', "repair_way", function (_data) {
                vc.component.repairSettingManageInfo.repairWays = _data;
            });
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
            //查询方法
            _listRepairSettings: function (_page, _rows) {
                vc.component.repairSettingManageInfo.conditions.page = _page;
                vc.component.repairSettingManageInfo.conditions.row = _rows;
                vc.component.repairSettingManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.repairSettingManageInfo.conditions
                };
                //类型名称去空
                param.params.repairTypeName = param.params.repairTypeName.trim();
                //派单类型去空
                param.params.repairType = param.params.repairType.trim();
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
            //重置方法
            _resetListRepairSettings: function (_page, _rows) {
                vc.component.repairSettingManageInfo.conditions.repairTypeName = '';
                vc.component.repairSettingManageInfo.conditions.repairWay = '';
                vc.component.repairSettingManageInfo.conditions.repairType = '';
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
            //查询
            _queryRepairSettingMethod: function () {
                vc.component._listRepairSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _queryResetRepairSettingMethod: function () {
                vc.component._resetListRepairSettings(DEFAULT_PAGE, DEFAULT_ROWS);
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
