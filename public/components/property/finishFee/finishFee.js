(function(vc, vm) {

    vc.extends({
        data: {
            finishFeeInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('finishFee', 'openFinishFeeModal', function(_params) {

                $that.finishFeeInfo = _params;
                $('#finishFeeModel').modal('show');

            });
        },
        methods: {
            finishFee: function() {
                $that.finishFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'fee.finishFee',
                    JSON.stringify($that.finishFeeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#finishFeeModel').modal('hide');
                            vc.emit('roomCreateFee', 'notify', {});
                            vc.emit('listParkingSpaceFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});
                            vc.emit('simplifyCarFee', 'notify', {});
                            vc.emit('listContractFee', 'notify', {});
                            vc.emit('contractDetailRoomFee', 'notify', {});
                            vc.emit('ownerDetailRoomFee', 'notify', {});
                            vc.toast("结束费用成功");
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeFinishFeeModel: function() {
                $('#finishFeeModel').modal('hide');
            }
        }
    });

})(window.vc, window.$that);