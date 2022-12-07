(function (vc, vm) {
    vc.extends({
        data: {
            deleteFeeConfigInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteFeeConfig', 'openDeleteFeeConfigModal', function (_params) {
                vc.component.deleteFeeConfigInfo = _params;
                $('#deleteFeeConfigModel').modal('show');
            });
        },
        methods: {
            deleteFeeConfig: function () {
                vc.component.deleteFeeConfigInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/feeConfig.deleteFeeConfig',
                    JSON.stringify(vc.component.deleteFeeConfigInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeeConfigModel').modal('hide');
                            vc.emit('feeConfigManage', 'listFeeConfig', {});
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
            closeDeleteFeeConfigModel: function () {
                $('#deleteFeeConfigModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);