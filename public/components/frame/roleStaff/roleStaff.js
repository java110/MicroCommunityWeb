/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var ALL_ROWS = 100;
    vc.extends({
        data: {
            roleStaffInfo: {
                staffs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                pgId: '',
                staffName: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('roleStaffInfo', 'openRoleStaff', function(_param) {
                vc.copyObject(_param, vc.component.roleStaffInfo);
                vc.component._listRoleStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('roleStaffInfo', 'listRoleStaff', function(_param) {
                //vc.copyObject(_param, vc.component.roleStaffInfo.conditions);
                vc.component._listRoleStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listRoleStaffs(_currentPage, DEFAULT_ROWS);
            });

        },
        methods: {
            _listRoleStaffs: function(_page, _rows) {

                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        roleId: vc.component.roleStaffInfo.pgId,
                        userName: $that.roleStaffInfo.staffName
                    }
                };

                //发送get请求
                vc.http.apiGet('/role.listRoleStaff',
                    param,
                    function(json, res) {
                        var _roleStaffInfo = JSON.parse(json);
                        vc.component.roleStaffInfo.total = _roleStaffInfo.total;
                        vc.component.roleStaffInfo.records = _roleStaffInfo.records;
                        vc.component.roleStaffInfo.staffs = _roleStaffInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.roleStaffInfo.records,
                            dataCount: vc.component.roleStaffInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddRoleStaffModal: function() {
                vc.emit('addRoleStaff', 'openAddRoleStaffModal', {
                    roleId: vc.component.roleStaffInfo.pgId,
                    orgName: vc.component.roleStaffInfo.orgName
                });
            },
            _openDeleteRoleStaffModel: function(_roleStaff) {
                _roleStaff.roleId = $that.roleStaffInfo.pgId;
                vc.emit('deleteRoleStaff', 'openDeleteRoleStaffModal', _roleStaff);
            },
            _queryRoleStaffMethod: function() {
                vc.component._listRoleStaffs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
        }
    });
})(window.vc);