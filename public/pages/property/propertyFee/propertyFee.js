/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    vc.extends({
        data: {
            feeDetailInfo: {
                feeDetails: [],
                total: 0,
                records: 1,
                feeId: '',
                startTime: '',
                endTime: ''
            }
        },
        _initMethod: function () {
            vc.component.initDate();
        },
        _initEvent: function () {
            vc.on('propertyFee', 'listFeeDetail', function (_param) {
                vc.component.feeDetailInfo.feeId = _param.feeId;
                vc.component.listFeeDetail(DEFAULT_PAGE, DEFAULT_ROW);
            });
            vc.on('propertyFee', 'listParkingSpaceData', function (_param) {
                vc.component.feeDetailInfo.feeId = _param.feeId;
                vc.component.listFeeDetail(DEFAULT_PAGE, DEFAULT_ROW);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component.listFeeDetail(_currentPage, DEFAULT_ROW);
            });
        },
        methods: {
            initDate: function () {
                $(".start_time").datetimepicker({
                    format: 'yyyy-mm-dd',
                    fontAwesome: 'fa',
                    language: 'zh-CN',
                    initTime: true,
                    initialDate: new Date(),
                    startView: 'year',
                    maxView: 'decade',
                    minView: 'month',
                    autoClose: 1,
                    todayBtn: true
                });
                $('.start_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".start_time").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date(vc.component.feeDetailInfo.endTime));
                        if (start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间");
                            $(".start_time").val('');
                            vc.component.feeDetailInfo.startTime = "";
                        } else {
                            vc.component.feeDetailInfo.startTime = value;
                        }
                    });
                $(".end_time").datetimepicker({
                    format: 'yyyy-mm-dd',
                    fontAwesome: 'fa',
                    language: 'zh-CN',
                    initTime: true,
                    initialDate: new Date(),
                    startView: 'year',
                    maxView: 'decade',
                    minView: 'month',
                    autoClose: 1,
                    todayBtn: true
                });
                $('.end_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".end_time").val();
                        var start = Date.parse(new Date(vc.component.feeDetailInfo.startTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间");
                            $(".end_time").val('');
                            vc.component.feeDetailInfo.endTime = "";
                        } else {
                            vc.component.feeDetailInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName("form-control form-control-sm start_time")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control form-control-sm end_time")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            listFeeDetail: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: vc.component.feeDetailInfo.feeId,
                        startTime: vc.component.feeDetailInfo.startTime,
                        endTime: vc.component.feeDetailInfo.endTime
                    }
                }
                //发送get请求
                vc.http.apiGet('/fee.queryFeeDetail',
                    param,
                    function (json, res) {
                        var listFeeDetailData = JSON.parse(json);
                        vc.component.feeDetailInfo.total = listFeeDetailData.total;
                        vc.component.feeDetailInfo.records = listFeeDetailData.records;
                        if (listFeeDetailData.feeDetails != null && listFeeDetailData.feeDetails.length > 0) {
                            listFeeDetailData.feeDetails.forEach(item1 => {
                                if (item1.feeAccountDetailDtoList != null && item1.feeAccountDetailDtoList.length > 0) {
                                    item1.feeAccountDetailDtoList.forEach(item => {
                                        if (item.state == '1001' || item.state == '1003') { //无抵扣或积分抵扣
                                            return;
                                        } else {
                                            item1.receivedAmount = (parseFloat(item1.receivedAmount) - parseFloat(item.amount)).toFixed(2);
                                        }
                                    })
                                }
                            });
                        }
                        vc.component.feeDetailInfo.feeDetails = listFeeDetailData.feeDetails;
                        vc.emit('pagination', 'init', {
                            total: vc.component.feeDetailInfo.records,
                            dataCount: vc.component.feeDetailInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            queryFeeDetailMethod: function () {
                vc.component.listFeeDetail(DEFAULT_PAGE, DEFAULT_ROW);
            },
            //重置
            resetFeeDetailMethod: function () {
                vc.component.feeDetailInfo.startTime = "";
                vc.component.feeDetailInfo.endTime = "";
                vc.component.listFeeDetail(DEFAULT_PAGE, DEFAULT_ROW);
            },
            _openRefundModel: function (_feeDetail) {
                _feeDetail.mainFeeInfo = vc.component.mainFeeInfo;
                vc.emit('returnPayFee', 'openReturnPayFeeModel', _feeDetail);
            },
            _openFeeDetailDiscountModal: function (_detail) {
                vc.emit('viewFeeDetailDiscount', 'openModel', _detail);
            }
        }
    });
})(window.vc);