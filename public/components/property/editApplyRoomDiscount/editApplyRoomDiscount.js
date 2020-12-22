(function (vc, vm) {

    vc.extends({
        data: {
            editApplyRoomDiscountInfo: {
                ardId: '',
                discountId: '',
                startTime: '',
                endTime: '',
                checkRemark: '',
                state: '',
                discounts: []
            }
        },
        _initMethod: function () {
            vc.initDateTime('editStartTime', function (_value) {
                $that.editApplyRoomDiscountInfo.startTime = _value;
            });
            vc.initDateTime('editEndTime', function (_value) {
                $that.editApplyRoomDiscountInfo.endTime = _value;
            });
            $that._loadEditApplyRoomDiscount();
        },
        _initEvent: function () {
            vc.on('editApplyRoomDiscount', 'openEditApplyRoomDiscountModal', function (_params) {
                vc.component.refreshEditApplyRoomDiscountInfo();
                $('#editApplyRoomDiscountModel').modal('show');
                vc.copyObject(_params, vc.component.editApplyRoomDiscountInfo);
                vc.component.editApplyRoomDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editApplyRoomDiscountValidate: function () {
                return vc.validate.validate({
                    editApplyRoomDiscountInfo: vc.component.editApplyRoomDiscountInfo
                }, {
                    'editApplyRoomDiscountInfo.discountId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "折扣不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "折扣错误"
                        },
                    ],

                    'editApplyRoomDiscountInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "开始时间错误"
                        },
                    ],
                    'editApplyRoomDiscountInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "结束时间错误"
                        },
                    ],
                    'editApplyRoomDiscountInfo.checkRemark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "验房说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "申请申请说明"
                        },
                    ],
                    'editApplyRoomDiscountInfo.ardId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请ID不能为空"
                        }],
                    'editApplyRoomDiscountInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "验房状态不能为空"
                        }]

                });
            },
            editApplyRoomDiscount: function () {
                if (!vc.component.editApplyRoomDiscountValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/applyRoomDiscount/updateApplyRoomDiscount',
                    JSON.stringify(vc.component.editApplyRoomDiscountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editApplyRoomDiscountModel').modal('hide');
                            vc.emit('applyRoomDiscountManage', 'listApplyRoomDiscount', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditApplyRoomDiscountInfo: function () {
                let _discounts = $that.editApplyRoomDiscountInfo.discounts;
                vc.component.editApplyRoomDiscountInfo = {
                    ardId: '',
                    discountId: '',
                    startTime: '',
                    endTime: '',
                    checkRemark: '',
                    state: '',
                    discounts: _discounts
                }
            },
            _loadEditApplyRoomDiscount: function () {

                if ($that.addPayFeeConfigDiscountInfo.discountType == '') {
                    return;
                }
                $that.addPayFeeConfigDiscountInfo.discounts = [];
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        discountType: '3003'
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeDiscount/queryFeeDiscount',
                    param,
                    function (json, res) {
                        let _feeDiscountManageInfo = JSON.parse(json);

                        $that.editApplyRoomDiscountInfo.discounts = _feeDiscountManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });

})(window.vc, window.vc.component);
