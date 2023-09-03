/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            dataPrivilegeManageInfo: {
                curDataPrivilege: {},
                tabName: 'privilege'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('dataPrivilege', 'switchDataPrivilege', function (_param) {
                $that.dataPrivilegeManageInfo.curDataPrivilege = _param;
                $that._changeDataPrivilegeTab('unit');
            })
        },
        methods: {
            _changeDataPrivilegeTab: function (_tabName) {
                $that.dataPrivilegeManageInfo.tabName = _tabName;
                if (_tabName == 'unit') {
                    vc.emit('dataPrivilegeUnitInfo', 'openDataPrivilegeUnit', {dpId: $that.dataPrivilegeManageInfo.curDataPrivilege.dpId});
                }
                if (_tabName == 'staff') {
                    vc.emit('dataPrivilegeStaffInfo', 'openDataPrivilegeStaff', {dpId: $that.dataPrivilegeManageInfo.curDataPrivilege.dpId});
                }
            }
        }
    });
})(window.vc);