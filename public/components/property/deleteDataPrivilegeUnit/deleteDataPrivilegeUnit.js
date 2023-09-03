(function (vc, vm) {
    vc.extends({
        data: {
            deleteDataPrivilegeUnitInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteDataPrivilegeUnit', 'openDeleteDataPrivilegeUnitModal', function (_params) {
                vc.component.deleteDataPrivilegeUnitInfo = _params;
                $('#deleteDataPrivilegeUnitModel').modal('show');
            });
        },
        methods: {
            deleteDataPrivilegeUnit: function () {
                vc.http.apiPost(
                    '/dataPrivilegeUnit.deleteDataPrivilegeUnit',
                    JSON.stringify(vc.component.deleteDataPrivilegeUnitInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteDataPrivilegeUnitModel').modal('hide');
                            vc.emit('dataPrivilegeUnitInfo', 'listDataPrivilegeUnit', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeDeleteDataPrivilegeUnitModel: function () {
                $('#deleteDataPrivilegeUnitModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);