(function (vc) {

    vc.extends({
        data: {
            addReserveDiningPersonInfo: {
                goodsId: '',
                paramsId: '',
                personName: '',
                personTel: '',
                appointmentTime: '',
                receivableAmount: '',
                receivedAmount: '',
                payWay: '',
                state: 'S',
                remark: '',
                openTime: '',
                price: 0.0,
                hoursMaxQuantity:1,
                quantity:1,
                type:'1001',
                openTimes: [],
            }
        },
        _initMethod: function () {
            vc.initDate('appointmentTime', function (_value) {
                $that.addReserveDiningPersonInfo.appointmentTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('addReserveDiningPerson', 'openAddReserveDiningPersonModal', function (_param) {
                $that.clearAddReserveDiningPersonInfo();
                vc.copyObject(_param, $that.addReserveDiningPersonInfo);
                $that._computeMoney();
                $that._listReserveParamss();
                $('#addReserveDiningPersonModel').modal('show');
            });
        },
        methods: {
            addReserveDiningPersonValidate() {
                return vc.validate.validate({
                    addReserveDiningPersonInfo: vc.component.addReserveDiningPersonInfo
                }, {
                    'addReserveDiningPersonInfo.goodsId': [{
                        limit: "required",
                        param: "",
                        errInfo: "商品不能为空"
                    },
                    ],
                    'addReserveDiningPersonInfo.personName': [{
                        limit: "required",
                        param: "",
                        errInfo: "预约人不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "64",
                        errInfo: "预约人不能超过64"
                    },
                    ],
                    'addReserveDiningPersonInfo.personTel': [{
                        limit: "required",
                        param: "",
                        errInfo: "预约电话不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "11",
                        errInfo: "预约电话不能超过11"
                    },
                    ],
                    'addReserveDiningPersonInfo.appointmentTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "预约时间不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "64",
                        errInfo: "预约时间不能超过64"
                    },
                    ],
                    'addReserveDiningPersonInfo.receivableAmount': [{
                        limit: "required",
                        param: "",
                        errInfo: "应收金额不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "10",
                        errInfo: "应收金额不能超过10"
                    },
                    ],
                    'addReserveDiningPersonInfo.receivedAmount': [{
                        limit: "required",
                        param: "",
                        errInfo: "实收金额不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "10",
                        errInfo: "实收金额不能超过10"
                    },
                    ],
                    'addReserveDiningPersonInfo.payWay': [{
                        limit: "required",
                        param: "",
                        errInfo: "支付方式不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "12",
                        errInfo: "支付方式不能超过12"
                    },
                    ],
                    'addReserveDiningPersonInfo.state': [{
                        limit: "required",
                        param: "",
                        errInfo: "state不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "12",
                        errInfo: "state不能超过12"
                    },
                    ],
                    'addReserveDiningPersonInfo.remark': [{
                        limit: "required",
                        param: "",
                        errInfo: "remark不能为空"
                    }
                    ],
                });
            },
            saveCommunitySpacePersonInfo: function () {
                if (!vc.component.addReserveDiningPersonValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.component.addReserveDiningPersonInfo.communityId = vc.getCurrentCommunity().communityId;

                let _times = [{
                    hours:$that.addReserveDiningPersonInfo.openTime,
                    quantity:$that.addReserveDiningPersonInfo.quantity,
                }]
                vc.component.addReserveDiningPersonInfo.times = _times;

                vc.http.apiPost(
                    '/reserveOrder.saveReserveGoodsOrder',
                    JSON.stringify(vc.component.addReserveDiningPersonInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addReserveDiningPersonModel').modal('hide');
                            vc.component.clearAddReserveDiningPersonInfo();
                            vc.emit('communitySpacePersonManage', 'listCommunitySpacePerson', {});
                            vc.emit('communitySpaceManage', 'listCommunitySpacePerson', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddReserveDiningPersonInfo: function () {
                vc.component.addReserveDiningPersonInfo = {
                    goodsId: '',
                    paramsId: '',
                    personName: '',
                    personTel: '',
                    appointmentTime: '',
                    receivableAmount: '',
                    receivedAmount: '',
                    payWay: '',
                    state: 'S',
                    remark: '',
                    openTime: '',
                    price: 0.0,
                    hoursMaxQuantity:1,
                    quantity:1,
                    type:'1001',
                    openTimes: [],
                };
            },
            _listReserveParamss: function () {

                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        paramsId: $that.addReserveDiningPersonInfo.paramsId
                    }
                };

                //发送get请求
                vc.http.apiGet('/reserve.listReserveParams',
                    param,
                    function (json, res) {
                        let _reserveParamsManageInfo = JSON.parse(json);
                        vc.component.addReserveDiningPersonInfo.openTimes = _reserveParamsManageInfo.data[0].openTimes;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _computeMoney:function(){
                let _money = parseFloat($that.addReserveDiningPersonInfo.price) * parseFloat($that.addReserveDiningPersonInfo.quantity);
                $that.addReserveDiningPersonInfo.receivableAmount = _money.toFixed(2);
                $that.addReserveDiningPersonInfo.receivedAmount = _money.toFixed(2);

            }

        }
    });

})(window.vc);