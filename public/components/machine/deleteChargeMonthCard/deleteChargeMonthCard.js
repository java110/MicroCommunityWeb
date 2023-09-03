(function(vc, vm) {

    vc.extends({
        data: {
            deleteChargeMonthCardInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteChargeMonthCard', 'openDeleteChargeMonthCardModal', function(_params) {
                vc.component.deleteChargeMonthCardInfo = _params;
                $('#deleteChargeMonthCardModel').modal('show');
            });
        },
        methods: {
            deleteChargeMonthCard: function() {
                vc.component.deleteChargeMonthCardInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/chargeCard.deleteChargeMonthCard',
                    JSON.stringify(vc.component.deleteChargeMonthCardInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteChargeMonthCardModel').modal('hide');
                            vc.emit('chargeMonthCardManage', 'listChargeMonthCard', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            closeDeleteChargeMonthCardModel: function() {
                $('#deleteChargeMonthCardModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);