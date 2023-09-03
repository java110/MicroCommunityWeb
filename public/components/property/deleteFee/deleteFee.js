(function (vc, vm) {
    vc.extends({
        data: {
            deleteFeeInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteFee', 'openDeleteFeeModal', function (_params) {
                vc.component.deleteFeeInfo = _params;
                $('#deleteFeeModel').modal('show');
            });
        },
        methods: {
            deleteFee: function () {
                vc.component.deleteFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/fee.deleteFee',
                    JSON.stringify(vc.component.deleteFeeInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeeModel').modal('hide');
                            vc.emit('roomCreateFee', 'notify', {});
                            vc.emit('listParkingSpaceFee', 'notify', {});
                            vc.emit('listContractFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});
                            vc.emit('simplifyCarFee', 'notify', {});
                            vc.emit('simplifyContractFee', 'notify', {});
                            vc.emit('carDetailFee', 'notify', {});
                            vc.emit('contractDetailRoomFee', 'notify', {});
                           
                            
                            vc.toast("删除费用成功");
                            vc.emit('listRoomFee', 'notify', {});
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
            closeDeleteFeeModel: function () {
                $('#deleteFeeModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);