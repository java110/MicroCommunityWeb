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
                repairSettingTypes: [],
                publicAreas: [],
                returnVisitFlags: [],
                conditions: {
                    repairSettingType: '',
                    repairTypeName: '',
                    repairWay: '',
                    repairType: '',
                    publicArea: '',
                    returnVisitFlag: ''
                }
            }
        },
        _initMethod: function () {
            $that._listRepairSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            //与字典表关联
            vc.getDict('r_repair_setting', "repair_way", function (_data) {
                $that.repairSettingManageInfo.repairWays = _data;
            });
            //与字典表关联
            vc.getDict('r_repair_setting', "repair_setting_type", function (_data) {
                $that.repairSettingManageInfo.repairSettingTypes = _data;
            });
            //与字典表关联
            vc.getDict('r_repair_setting', "public_area", function (_data) {
                $that.repairSettingManageInfo.publicAreas = _data;
            });
            //与字典表关联
            vc.getDict('r_repair_setting', "return_visit_flag", function (_data) {
                $that.repairSettingManageInfo.returnVisitFlags = _data;
            });
        },
        _initEvent: function () {
            vc.on('repairSettingManage', 'listRepairSetting', function (_param) {
                $that._listRepairSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listRepairSettings(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listRepairSettings: function (_page, _rows) {
                $that.repairSettingManageInfo.conditions.page = _page;
                $that.repairSettingManageInfo.conditions.row = _rows;
                $that.repairSettingManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: $that.repairSettingManageInfo.conditions
                };
                //类型名称去空
                param.params.repairTypeName = param.params.repairTypeName.trim();
                //派单类型去空
                param.params.repairType = param.params.repairType.trim();
                //发送get请求
                vc.http.apiGet('/repair.listRepairSettings',
                    param,
                    function (json, res) {
                        var _repairSettingManageInfo = JSON.parse(json);
                        $that.repairSettingManageInfo.total = _repairSettingManageInfo.total;
                        $that.repairSettingManageInfo.records = _repairSettingManageInfo.records;
                        $that.repairSettingManageInfo.repairSettings = _repairSettingManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.repairSettingManageInfo.records,
                            dataCount: $that.repairSettingManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetListRepairSettings: function (_page, _rows) {
                $that.repairSettingManageInfo.conditions.repairTypeName = '';
                $that.repairSettingManageInfo.conditions.repairWay = '';
                $that.repairSettingManageInfo.conditions.repairType = '';
                $that.repairSettingManageInfo.conditions.repairSettingType = '';
                $that.repairSettingManageInfo.conditions.publicArea = '';
                $that.repairSettingManageInfo.conditions.returnVisitFlag = '';
                $that._listRepairSettings(DEFAULT_PAGE, DEFAULT_ROWS);
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
                $that._listRepairSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _queryResetRepairSettingMethod: function () {
                $that._resetListRepairSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.repairSettingManageInfo.moreCondition) {
                    $that.repairSettingManageInfo.moreCondition = false;
                } else {
                    $that.repairSettingManageInfo.moreCondition = true;
                }
            },
            _viewRepairTypeUser: function (_repairSetting) {
                vc.jumpToPage('/#/pages/property/repairTypeUser?' + vc.objToGetParam(_repairSetting));
            }
        }
    });
})(window.vc);