(function (vc) {
    vc.extends({
        data: {
            deletePrivilegeGroupInfo: {}
        },
        _initEvent: function () {
            vc.component.$on('deletePrivilegeGroup_openDeletePrivilegeGroupModel', function (_pGroup) {
                vc.component.deletePrivilegeGroupInfo = _pGroup;
                $('#deletePrivilegeGroupModel').modal('show');
            });
        },
        methods: {
            closeDeletePrivilegeGroupModel: function () {
                $('#deletePrivilegeGroupModel').modal('hide');
            },
            deletePrivilegeGroup: function () {
                console.log("开始删除权限组：", vc.component.deletePrivilegeGroupInfo);
                vc.http.apiPost(
                    '/delete.privilegeGroup.info',
                    JSON.stringify(vc.component.deletePrivilegeGroupInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePrivilegeGroupModel').modal('hide');
                            vc.component.$emit('privilegeGroup_loadPrivilegeGroup', {});
                            vc.emit('roleDiv', '_loadRole', {})
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                        vc.component.deletePrivilegeGroupInfo.errorInfo = json;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.deletePrivilegeGroupInfo.errorInfo = errInfo;
                    }
                );
            }
        }
    });
})(window.vc);