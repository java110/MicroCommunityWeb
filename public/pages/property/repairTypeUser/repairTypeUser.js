/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            repairTypeUserManageInfo: {
                repairTypeUsers: [],
                total: 0,
                records: 1,
                settingId: '',
                repairType: '',
                conditions: {
                    repairTypeName: '',
                    repairWay: '',
                    repairType: '',

                }
            }
        },
        _initMethod: function () {
            let _repairType = vc.getParam('repairType');

            if (!vc.notNull(_repairType)) {
                vc.toast('未包含报修类型');
                vc.goBack();
                return;
            }
            $that.repairTypeUserManageInfo.repairType = _repairType;
            vc.component._listRepairTypeUsers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('repairTypeUserManage', 'listRepairTypeUser', function (_param) {
                vc.component._listRepairTypeUsers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRepairTypeUsers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listRepairTypeUsers: function (_page, _rows) {

                vc.component.repairTypeUserManageInfo.conditions.page = _page;
                vc.component.repairTypeUserManageInfo.conditions.row = _rows;
                vc.component.repairTypeUserManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.repairTypeUserManageInfo.conditions.repairType = $that.repairTypeUserManageInfo.repairType;
                var param = {
                    params: vc.component.repairTypeUserManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('repair.listRepairTypeUsers',
                    param,
                    function (json, res) {
                        var _repairTypeUserManageInfo = JSON.parse(json);
                        vc.component.repairTypeUserManageInfo.total = _repairTypeUserManageInfo.total;
                        vc.component.repairTypeUserManageInfo.records = _repairTypeUserManageInfo.records;
                        vc.component.repairTypeUserManageInfo.repairTypeUsers = _repairTypeUserManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.repairTypeUserManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddRepairTypeUserModal: function () {
                vc.emit('selectStaff', 'openStaff', {
                    call: function (_staff) {
                        $that.saveRepairTypeUserInfo(_staff);
                    }
                });
            },
            _openEditrepairTypeUserModel: function (_repairTypeUser) {
                vc.emit('editRepairTypeUser', 'openEditRepairTypeUserModal', _repairTypeUser);
            },
            _openDeleteTypeUserModel: function (_repairTypeUser) {
                vc.emit('deleteRepairTypeUser', 'openDeleteRepairTypeUserModal', _repairTypeUser);
            },
            saveRepairTypeUserInfo: function (_staff) {

                let param = {
                    communityId: vc.getCurrentCommunity().communityId,
                    staffId: _staff.staffId,
                    staffName: _staff.staffName,
                    repairType: $that.repairTypeUserManageInfo.repairType
                }

                vc.http.apiPost(
                    'repair.saveRepairTypeUser',
                    JSON.stringify(param),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.component._listRepairTypeUsers(DEFAULT_PAGE, DEFAULT_ROWS);
                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            }

        }
    });
})(window.vc);
