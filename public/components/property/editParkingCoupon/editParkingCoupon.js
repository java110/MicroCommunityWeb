(function(vc, vm) {

    vc.extends({
        data: {
            editParkingCouponInfo: {
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
            $that._listEditParkingAreas();
        },
        _initEvent: function() {
            vc.on('editParkingCoupon', 'openEditParkingCouponModal', function(_params) {
                vc.component.refreshEditParkingCouponInfo();
                $('#editParkingCouponModel').modal('show');
                vc.copyObject(_params, vc.component.editParkingCouponInfo);
                vc.component.editParkingCouponInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editParkingCouponValidate: function() {
                return vc.validate.validate({
                    editParkingCouponInfo: vc.component.editParkingCouponInfo
                }, {
                    'editParkingCouponInfo.name': [{
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
                    'editParkingCouponInfo.typeCd': [{
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
                    'editParkingCouponInfo.paId': [{
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
                    'editParkingCouponInfo.value': [{
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
                    'editParkingCouponInfo.valuePrice': [{
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
                    'editParkingCouponInfo.couponId': [{
                        limit: "required",
                        param: "",
                        errInfo: "编号不能为空"
                    }]

                });
            },
            editParkingCoupon: function() {
                if (!vc.component.editParkingCouponValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/parkingCoupon.updateParkingCoupon',
                    JSON.stringify(vc.component.editParkingCouponInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editParkingCouponModel').modal('hide');
                            vc.emit('parkingCouponManage', 'listParkingCoupon', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditParkingCouponInfo: function() {
                let _parkingAreas = $that.editParkingCouponInfo.parkingAreas;
                vc.component.editParkingCouponInfo = {
                    couponId: '',
                    name: '',
                    typeCd: '',
                    paId: '',
                    value: '',
                    valuePrice: '',
                    parkingAreas: _parkingAreas
                }
            },
            _listEditParkingAreas: function(_page, _rows) {
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
                        $that.editParkingCouponInfo.parkingAreas = _parkingAreaManageInfo.parkingAreas;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    });

})(window.vc, window.vc.component);