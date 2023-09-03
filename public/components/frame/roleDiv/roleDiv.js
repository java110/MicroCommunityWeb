/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            roleDivInfo: {
                roles: [],
                roleId: '',
                curRole: {}
            }
        },
        _initMethod: function () {
            $that._loadRoles();
        },
        _initEvent: function () {
            vc.on('roleDiv', '_loadRole', function (_param) {
                $that._loadRoles();
            });
        },
        methods: {
            _loadRoles: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/query.store.privilegeGroup',
                    param,
                    function (json) {
                        let _roles = JSON.parse(json);
                        $that.roleDivInfo.roles = _roles;
                        if (_roles && _roles.length > 0) {
                            $that._switchRole(_roles[0])
                        }
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _switchRole: function (_role) {
                $that.roleDivInfo.curRole = _role;
                vc.emit('role', 'switchRole', _role);
            },
            openPrivilegeGroupModel: function () {
                vc.component.$emit('addPrivilegeGroup_openPrivilegeGroupModel', {});
            },
            openEditPrivilegeGroupModel: function () {
                vc.emit('editPrivilegeGroup', 'openPrivilegeGroupModel', $that.roleDivInfo.curRole);
            },
            openDeletePrivilegeGroupModel: function () {
                vc.component.$emit('deletePrivilegeGroup_openDeletePrivilegeGroupModel', $that.roleDivInfo.curRole);
            },
        }
    });
})(window.vc);