(function (vc, vm) {
    vc.extends({
        data: {
            deletePurchaseApplyInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deletePurchaseApply', 'openDeletePurchaseApplyModal', function (_params) {
                vc.component.deletePurchaseApplyInfo = _params;
                $('#deletePurchaseApplyModel').modal('show');
            });
        },
        methods: {
            deletePurchaseApply: function () {
                vc.component.deletePurchaseApplyInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.post(
                    'deletePurchaseApply',
                    'delete',
                    JSON.stringify(vc.component.deletePurchaseApplyInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePurchaseApplyModel').modal('hide');
                            vc.emit('purchaseApplyManage', 'listPurchaseApply', {});
                            vc.toast(_json.msg);
                            return;
                        }else{
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeletePurchaseApplyModel: function () {
                $('#deletePurchaseApplyModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
