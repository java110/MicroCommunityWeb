(function(vc) {

    vc.extends({
        data: {
            integralUseInfo: {
                tel: '',
                ownerId: '',
                acctId: '',
                acctName: '',
                quantity: 0,
                useMoney: '',
                useQuantity: '',
                remark: '',
                owners: [],
                money: 0,
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('integralUse', 'openIntegralUseModal', function() {
                $that._listIntegralSettings()
                $('#integralUseModel').modal('show');
            });
        },
        methods: {
            integralUseValidate() {
                return vc.validate.validate({
                    integralUseInfo: vc.component.integralUseInfo
                }, {
                    'integralUseInfo.acctId': [{
                        limit: "required",
                        param: "",
                        errInfo: "账户不能为空"
                    }],
                    'integralUseInfo.remark': [{
                            limit: "required",
                            param: "",
                            errInfo: "说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "说明不能超过512"
                        },
                    ],
                    'integralUseInfo.useMoney': [{
                        limit: "required",
                        param: "",
                        errInfo: "核销金额不能为空"
                    }],
                });
            },
            _doUseIntegral: function() {
                if (!vc.component.integralUseValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.integralUseInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/integral.useIntegral',
                    JSON.stringify(vc.component.integralUseInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#integralUseModel').modal('hide');
                            vc.component.clearIntegralUseInfo();
                            vc.emit('integralUserDetailManage', 'listIntegralUserDetail', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearIntegralUseInfo: function() {
                vc.component.integralUseInfo = {
                    tel: '',
                    acctId: '',
                    acctName: '',
                    quantity: 0,
                    useMoney: '',
                    useQuantity: '',
                    remark: '',
                    ownerId: '',
                    owners: [],
                    money: 0,
                };
            },
            _changeTel: function() {
                let param = {
                        params: {
                            communityId: vc.getCurrentCommunity().communityId,
                            row: 50,
                            page: 1,
                            link: $that.integralUseInfo.tel,
                            ownerTypeCd: '1001'
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/owner.queryOwners',
                    param,
                    function(json, res) {
                        var listOwnerData = JSON.parse(json);
                        vc.component.integralUseInfo.owners = listOwnerData.owners;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.integralUseInfo.owners = [];
                    }
                );
            },
            _changeOwner: function() {
                let param = {
                        params: {
                            communityId: vc.getCurrentCommunity().communityId,
                            row: 1,
                            page: 1,
                            objId: $that.integralUseInfo.ownerId,
                            acctType: '2004'
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/account/queryOwnerAccount',
                    param,
                    function(json, res) {
                        let listOwnerData = JSON.parse(json);
                        vc.component.integralUseInfo.acctId = listOwnerData.data[0].acctId;
                        vc.component.integralUseInfo.acctName = listOwnerData.data[0].acctName;
                        vc.component.integralUseInfo.quantity = listOwnerData.data[0].amount;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.integralUseInfo.owners = [];
                    }
                );
            },
            _listIntegralSettings: function(_page, _rows) {

                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/integral.listIntegralSetting',
                    param,
                    function(json, res) {
                        let _settings = JSON.parse(json).data;
                        if (!_settings || _settings.length < 1) {
                            vc.toast('请先配置积分设置');
                            return;
                        }
                        $that.integralUseInfo.money = _settings[0].money;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _computeUseQuantity: function() {
                let _quantity = parseFloat($that.integralUseInfo.useMoney) / parseFloat($that.integralUseInfo.money);
                $that.integralUseInfo.useQuantity = Math.ceil(_quantity);
            }
        }
    });

})(window.vc);