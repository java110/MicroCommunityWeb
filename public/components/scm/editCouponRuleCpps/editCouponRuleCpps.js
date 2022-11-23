(function (vc, vm) {

    vc.extends({
        data: {
            editCouponRuleCppsInfo: {
                crcId: '',
                cppId: '',
                quantity: '',
                ruleId:'',
                couponPropertyPools:[]

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editCouponRuleCpps', 'openEditCouponRuleCppsModal', function (_params) {
                vc.component.refreshEditCouponRuleCppsInfo();
                $('#editCouponRuleCppsModel').modal('show');
                $that._listEditCouponPropertyPools();
                vc.copyObject(_params, vc.component.editCouponRuleCppsInfo);
                vc.component.editCouponRuleCppsInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editCouponRuleCppsValidate: function () {
                return vc.validate.validate({
                    editCouponRuleCppsInfo: vc.component.editCouponRuleCppsInfo
                }, {
                    'editCouponRuleCppsInfo.cppId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "优惠券不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "优惠券不能超过64"
                        },
                    ],
                    'editCouponRuleCppsInfo.quantity': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "赠送数量不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "赠送数量不能超过30"
                        },
                    ],
                    'editCouponRuleCppsInfo.crcId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editCouponRuleCpps: function () {
                if (!vc.component.editCouponRuleCppsValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/couponRule.updateCouponRuleCpps',
                    JSON.stringify(vc.component.editCouponRuleCppsInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCouponRuleCppsModel').modal('hide');
                            vc.emit('couponRuleCppsManage', 'listCouponRuleCpps', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditCouponRuleCppsInfo: function () {
                vc.component.editCouponRuleCppsInfo = {
                    crcId: '',
                    cppId: '',
                    quantity: '',
                    ruleId:'',
                    couponPropertyPools:[]
    
                }
            },
            _listEditCouponPropertyPools: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/couponProperty.listCouponPropertyPool',
                    param,
                    function (json, res) {
                        var _couponPropertyPoolManageInfo = JSON.parse(json);
                        vc.component.editCouponRuleCppsInfo.couponPropertyPools = _couponPropertyPoolManageInfo.data;
                       
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc, window.vc.component);
