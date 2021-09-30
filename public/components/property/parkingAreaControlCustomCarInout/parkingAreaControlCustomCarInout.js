(function (vc, vm) {

    vc.extends({
        data: {
            parkingAreaControlCustomCarInoutInfo: {
                carNum: '',
                amount: '',
                remark: '',
                type: '1101',
                payCharge: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('parkingAreaControlCustomCarInout', 'open', function (_params) {
                vc.component.refreshParkingAreaControlCustomCarInoutInfo();
                $('#parkingAreaControlCustomCarInoutModel').modal('show');
                // = _params;
                vc.copyObject(_params, vc.component.parkingAreaControlCustomCarInoutInfo);
                vc.component.parkingAreaControlCustomCarInoutInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            parkingAreaControlCustomCarInoutValidate: function () {
                return vc.validate.validate({
                    parkingAreaControlCustomCarInoutInfo: vc.component.parkingAreaControlCustomCarInoutInfo
                }, {
                    'parkingAreaControlCustomCarInoutInfo.carNum': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车牌号不能为空"
                        }
                    ]
                });
            },
            parkingAreaControlCustomCarInout: function () {
                if (!vc.component.parkingAreaControlCustomCarInoutValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/machine.customCarInOutCmd',
                    JSON.stringify(vc.component.parkingAreaControlCustomCarInoutInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _data = JSON.parse(json);
                        if (_data.code != 0) {
                            vc.toast(_data.msg);
                        } else {
                            vc.toast(_data.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshParkingAreaControlCustomCarInoutInfo: function () {
                vc.component.parkingAreaControlCustomCarInoutInfo = {
                    carNum: '',
                    amount: '',
                    remark: '',
                    type: '1101',
                    payCharge: ''
                }
            }
        }
    });

})(window.vc, window.vc.component);