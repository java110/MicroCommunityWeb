(function (vc, vm) {
    var photoUrl = '/callComponent/download/getFile/file';
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
                refundAmount: '',
                state: '',
                roomId: '',
                discounts: [],
                fees: [],
                selectedFees: [],
                urls: [],
                images: [],
                url: '',
                // feeTypeCds: [],
                // feeTypeCd: '',
                // feeConfigDtos: [],
                // configId: '',
                returnWay: '1001',
                feeId: '',
            }
        },
        _initMethod: function () {
            vc.component._initReviewApplyRoomDiscountDateInfo();
        },
        _initEvent: function () {
            vc.on('reviewApplyRoomDiscount', 'openReviewApplyRoomDiscountModal', function (_params) {
                _params = JSON.parse(_params);
                delete _params.state;
                vc.component.refreshReviewApplyRoomDiscountInfo();
                $('#reviewApplyRoomDiscountModel').modal('show');
                vc.copyObject(_params, vc.component.reviewApplyRoomDiscountInfo);
                // 图片显示处理
                vc.component.reviewApplyRoomDiscountInfo.urls.forEach((item) => {
                    vc.urlToBase64(photoUrl + "?fileId=" + item + "&communityId=-1&time=" + new Date(), function (_base64Data) {
                        vc.component.reviewApplyRoomDiscountInfo.images.push(_base64Data);
                    })
                })
                vc.component.reviewApplyRoomDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
                //与字典表费用类型关联
                // vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                //     vc.component.reviewApplyRoomDiscountInfo.feeTypeCds = _data;
                // });
                $that._listFees();
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
                    'reviewApplyRoomDiscountInfo.returnWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "返还方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "折扣错误"
                        },
                    ],
                    'reviewApplyRoomDiscountInfo.refundAmount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "返还金额不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "返还金额不是有效的金额"
                        }
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
                        }
                    ],
                    'reviewApplyRoomDiscountInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "审批状态不能为空"
                        }
                    ]
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
                        }
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
                if (vc.component.reviewApplyRoomDiscountInfo.returnWay == '1002' && vc.component.reviewApplyRoomDiscountInfo.selectedFees.length <= 0) {
                    vc.toast('请选择缴费记录');
                    return;
                }
                vc.http.apiPost(
                    '/applyRoomDiscount/updateReviewApplyRoomDiscount',
                    JSON.stringify(vc.component.reviewApplyRoomDiscountInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#reviewApplyRoomDiscountModel').modal('hide');
                            vc.emit('applyRoomDiscountManage', 'listApplyRoomDiscount', {});
                            vc.toast("审批通过");
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
                    refundAmount: '',
                    state: '',
                    discounts: _discounts,
                    fees: [],
                    selectedFees: [],
                    roomId: '',
                    feeTypeCds: [],
                    feeTypeCd: '',
                    feeConfigDtos: [],
                    urls: [],
                    images: [],
                    url: '',
                    configId: '',
                    returnWay: '1001',
                    feeId: '',
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
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 查询缴费历史v2
            _listFees: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: vc.component.reviewApplyRoomDiscountInfo.feeId,
                        state: '1400'
                        // startTime: vc.component.reviewApplyRoomDiscountInfo.startTime,
                        // endTime: vc.component.reviewApplyRoomDiscountInfo.endTime
                    }
                }
                //发送get请求
                vc.http.apiGet('/fee.queryFeeDetail',
                    param,
                    function (json, res) {
                        let listFeeDetailData = JSON.parse(json);
                        vc.component.reviewApplyRoomDiscountInfo.fees = listFeeDetailData.feeDetails;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            showImg: function (e) {
                vc.emit('viewImage', 'showImage', {url: e});
            }
        }
    });
})(window.vc, window.vc.component);