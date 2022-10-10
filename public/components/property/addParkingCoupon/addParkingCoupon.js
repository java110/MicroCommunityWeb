(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addParkingCouponInfo: {
                couponId: '',
                name: '',
                typeCd: '',
                paId: '',
                value: '',
                valuePrice: '',
                parkingAreas: []
            }
        },
        _initMethod: function() {
            $that._listAddParkingAreas();
        },
        _initEvent: function() {
            vc.on('addParkingCoupon', 'openAddParkingCouponModal', function() {
                $('#addParkingCouponModel').modal('show');
            });
        },
        methods: {
            addParkingCouponValidate() {
                return vc.validate.validate({
                    addParkingCouponInfo: vc.component.addParkingCouponInfo
                }, {
                    'addParkingCouponInfo.name': [{
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "名称不能超过64"
                        },
                    ],
                    'addParkingCouponInfo.typeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "类型不能超过12"
                        },
                    ],
                    'addParkingCouponInfo.paId': [{
                            limit: "required",
                            param: "",
                            errInfo: "停车场ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "停车场ID不能超过30"
                        },
                    ],
                    'addParkingCouponInfo.value': [{
                            limit: "required",
                            param: "",
                            errInfo: "面值不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "面值不能超过30"
                        },
                    ],
                    'addParkingCouponInfo.valuePrice': [{
                            limit: "required",
                            param: "",
                            errInfo: "售价不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "售价不能超过10"
                        },
                    ],
                });
            },
            saveParkingCouponInfo: function() {
                if (!vc.component.addParkingCouponValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addParkingCouponInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addParkingCouponInfo);
                    $('#addParkingCouponModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/parkingCoupon.saveParkingCoupon',
                    JSON.stringify(vc.component.addParkingCouponInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addParkingCouponModel').modal('hide');
                            vc.component.clearAddParkingCouponInfo();
                            vc.emit('parkingCouponManage', 'listParkingCoupon', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddParkingCouponInfo: function() {
                let _parkingAreas = $that.addParkingCouponInfo.parkingAreas;
                vc.component.addParkingCouponInfo = {
                    name: '',
                    typeCd: '',
                    paId: '',
                    value: '',
                    valuePrice: '',
                    parkingAreas: _parkingAreas
                };
            },
            _listAddParkingAreas: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas', param,
                    function(json, res) {
                        var _parkingAreaManageInfo = JSON.parse(json);
                        $that.addParkingCouponInfo.parkingAreas = _parkingAreaManageInfo.parkingAreas;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    });

})(window.vc);