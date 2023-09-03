(function (vc, vm) {
    vc.extends({
        data: {
            deleteMappingInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMapping', 'openDeleteMappingModal', function (_params) {
                vc.component.deleteMappingInfo = _params;
                $('#deleteMappingModel').modal('show');
            });
        },
        methods: {
            deleteMapping: function () {
                vc.component.deleteMappingInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/mapping.deleteMapping',
                    JSON.stringify(vc.component.deleteMappingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteMappingModel').modal('hide');
                            vc.emit('mappingManage', 'listMapping', {});
                            vc.toast("删除成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    }
                );
            },
            closeDeleteMappingModel: function () {
                $('#deleteMappingModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
