(function (vc) {
    vc.extends({
        data: {
            roomOweFeeCallableInfo: {
                callableWay: '',
                remark: '',
                communityId: vc.getCurrentCommunity().communityId,
                feeIds: [],
                roomId: '',
                roomIds: [],
                fees: []
            }
        },
        _initMethod: function () {
            $that.roomOweFeeCallableInfo.roomId = vc.getParam('roomId');
            $that.roomOweFeeCallableInfo.roomIds.push(vc.getParam('roomId'));
            $that._loadRoomOweFees();
        },
        _initEvent: function () {

        },
        methods: {
            roomOweFeeCallableValidate() {
                return vc.validate.validate({
                    roomOweFeeCallableInfo: $that.roomOweFeeCallableInfo
                }, {
                    'roomOweFeeCallableInfo.callableWay': [{
                        limit: "required",
                        param: "",
                        errInfo: "催缴类型不能为空"
                    }
                    ],
                });
            },
            _saveOweFeeCallable: function () {
                if (!$that.roomOweFeeCallableValidate()) {
                    //侦听回传
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('/oweFeeCallable.saveOweFeeCallable',
                    JSON.stringify($that.roomOweFeeCallableInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
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
            _loadRoomOweFees: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: $that.roomOweFeeCallableInfo.roomId,
                        state: '2008001',
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.roomOweFeeCallableInfo.fees = _json.fees;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);