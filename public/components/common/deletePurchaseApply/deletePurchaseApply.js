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
                        if (res.status == 200) {
                            //关闭model
                            $('#deletePurchaseApplyModel').modal('hide');
                            vc.emit('purchaseApplyManage', 'listPurchaseApply', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeDeletePurchaseApplyModel: function () {
                $('#deletePurchaseApplyModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
