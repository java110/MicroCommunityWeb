(function (vc, vm) {
    vc.extends({
        data: {
            reviewApplyRoomDiscountInfo: {
                ardId: '',
                discountId: '',
                discountType: '',
                startTime: '',
                endTime: '',
                createRemark: '',
                checkRemark: '',
                reviewRemark: '',
                state: '',
                discounts: []
            }
        },
        _initMethod: function () {
            vc.component._initReviewApplyRoomDiscountDateInfo();
        },
        _initEvent: function () {
            vc.on('reviewApplyRoomDiscount', 'openReviewApplyRoomDiscountModal', function (_params) {
                console.log("here is params")
                console.log(_params)
                vc.component.refreshReviewApplyRoomDiscountInfo();
                $('#reviewApplyRoomDiscountModel').modal('show');
                vc.copyObject(_params, vc.component.reviewApplyRoomDiscountInfo);
                vc.component.reviewApplyRoomDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            _initReviewApplyRoomDiscountDateInfo: function () {
                $('.reviewStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.reviewStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".reviewStartTime").val();
                        vc.component.reviewApplyRoomDiscountInfo.startTime = value;
                    });
                $('.reviewEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.reviewEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".reviewEndTime").val();
                        var start = Date.parse(new Date(vc.component.reviewApplyRoomDiscountInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间")
                            $(".reviewEndTime").val('')
                        } else {
                            vc.component.reviewApplyRoomDiscountInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control reviewStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control reviewEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            reviewApplyRoomDiscountValidate: function () {
                return vc.validate.validate({
                    reviewApplyRoomDiscountInfo: vc.component.reviewApplyRoomDiscountInfo
                }, {
                    'reviewApplyRoomDiscountInfo.discountId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "折扣名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "折扣错误"
                        },
                    ],
                    'reviewApplyRoomDiscountInfo.discountType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "折扣类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "折扣错误"
                        },
                    ],
                    'reviewApplyRoomDiscountInfo.startTime': [
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
                    'reviewApplyRoomDiscountInfo.endTime': [
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
                    'reviewApplyRoomDiscountInfo.reviewRemark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "审批说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "申请申请说明"
                        },
                    ],
                    'reviewApplyRoomDiscountInfo.ardId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请ID不能为空"
                        }],
                    'reviewApplyRoomDiscountInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "审批状态不能为空"
                        }]
                });
            },
            reviewApplyRoomDiscountStateValidate: function () {
                return vc.validate.validate({
                    reviewApplyRoomDiscountInfo: vc.component.reviewApplyRoomDiscountInfo
                }, {
                    'reviewApplyRoomDiscountInfo.reviewRemark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "审批说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "申请申请说明"
                        },
                    ]
                });
            },
            reviewApplyRoomDiscount: function () {
                if (!vc.component.reviewApplyRoomDiscountValidate() && vc.component.reviewApplyRoomDiscountInfo.state != '5') {
                    vc.toast(vc.validate.errInfo);
                    return;
                } else if (!vc.component.reviewApplyRoomDiscountStateValidate() && vc.component.reviewApplyRoomDiscountInfo.state == '5') {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/applyRoomDiscount/updateReviewApplyRoomDiscount',
                    JSON.stringify(vc.component.reviewApplyRoomDiscountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#reviewApplyRoomDiscountModel').modal('hide');
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
            refreshReviewApplyRoomDiscountInfo: function () {
                let _discounts = $that.reviewApplyRoomDiscountInfo.discounts;
                vc.component.reviewApplyRoomDiscountInfo = {
                    ardId: '',
                    discountId: '',
                    discountType: '',
                    startTime: '',
                    endTime: '',
                    checkRemark: '',
                    createRemark: '',
                    state: '',
                    discounts: _discounts
                }
            },
            _changeApplyRoomDiscountType: function () {
                if ($that.reviewApplyRoomDiscountInfo.discountType == '') {
                    return;
                }
                $that.reviewApplyRoomDiscountInfo.discounts = [];
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        discountType: $that.reviewApplyRoomDiscountInfo.discountType
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeDiscount/queryFeeDiscount',
                    param,
                    function (json, res) {
                        let _feeDiscountManageInfo = JSON.parse(json);
                        $that.reviewApplyRoomDiscountInfo.discounts = _feeDiscountManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc, window.vc.component);
