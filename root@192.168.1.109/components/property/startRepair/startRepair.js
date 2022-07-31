(function (vc, vm) {
    vc.extends({
        data: {
            startRepairInfo: {}
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('startRepair', 'openStartRepairModal', function (_params) {
                vc.component.startRepairInfo = _params;
                $('#startRepairModel').modal('show');

            });
        },
        methods: {
            _startRepair: function () {
                vc.component.startRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'ownerRepair.repairStart',
                    JSON.stringify(vc.component.startRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            //关闭model
                            $('#startRepairModel').modal('hide');
                            vc.emit('repairDispatchManage', 'listOwnerRepair', {});
                            vc.toast("启动成功")
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeStartRepairModel: function () {
                $('#startRepairModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
