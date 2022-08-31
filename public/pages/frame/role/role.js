(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roleInfo: {
                curRole: {},
                tabName: 'privilege'
            },
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('role', 'switchRole', function (_param) {
                $that.roleInfo.curRole = _param;
                if (vc.hasPrivilege('502022082955280007')) {
                    $that._changeRoleTab('privilege')
                } else if (vc.hasPrivilege('502022082965160008')) {
                    $that._changeRoleTab('community')
                } else if (vc.hasPrivilege('502022082961190009')) {
                    $that._changeRoleTab('staff')
                }
            })
        },
        methods: {
            _changeRoleTab: function (_tabName) {
                $that.roleInfo.tabName = _tabName;
                if (_tabName == 'privilege') {
                    vc.emit('privilegeTree', 'loadPrivilege', $that.roleInfo.curRole.pgId);
                }
                if (_tabName == 'community') {
                    vc.emit('roleCommunityInfo', 'openRoleCommunity', {pgId: $that.roleInfo.curRole.pgId});
                }
                if (_tabName == 'staff') {
                    vc.emit('roleStaffInfo', 'openRoleStaff', {pgId: $that.roleInfo.curRole.pgId});
                }
            }
        },
    });
})(window.vc);