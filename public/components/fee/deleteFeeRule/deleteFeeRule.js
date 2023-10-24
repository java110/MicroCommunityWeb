(function (vc, vm) {
    vc.extends({
        data: {
            deleteFeeRuleInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteFeeRule', 'openDeleteFeeRuleModal', function (_params) {
                $that.deleteFeeRuleInfo = _params;
                $('#deleteFeeRuleModel').modal('show');
            });
        },
        methods: {
            deleteFeeRule: function () {
                $that.deleteFeeRuleInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/payFeeRule.deletePayFeeRule',
                    JSON.stringify($that.deleteFeeRuleInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeeRuleModel').modal('hide');
                            vc.emit('feeDetailFeeRule', 'notify', {});
                           
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteFeeRuleModel: function () {
                $('#deleteFeeRuleModel').modal('hide');
            }
        }
    });
})(window.vc, window.$that);