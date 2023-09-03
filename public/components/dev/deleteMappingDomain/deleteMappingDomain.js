(function (vc, vm) {
    vc.extends({
        data: {
            deleteMappingDomainInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMappingDomain', 'openDeleteMappingDomainModal', function (_params) {
                vc.component.deleteMappingDomainInfo = _params;
                $('#deleteMappingDomainModel').modal('show');
            });
        },
        methods: {
            deleteMappingDomain: function () {
                vc.http.apiPost(
                    '/mapping.deleteMappingDomain',
                    JSON.stringify(vc.component.deleteMappingDomainInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMappingDomainModel').modal('hide');
                            vc.emit('mappingDomainManage', 'listMappingDomain', {});
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
            closeDeleteMappingDomainModel: function () {
                $('#deleteMappingDomainModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);