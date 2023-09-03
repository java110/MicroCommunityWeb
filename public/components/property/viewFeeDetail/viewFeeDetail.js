/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    vc.extends({
        data: {
            viewFeeDetailInfo: {
                feeDetails: [],
                total: 0,
                records: 1,
                feeId: '',
                configId: '',
                payerObjId: '',
                curYear: '',
                roomName: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewFeeDetail', 'listFeeDetail', function (_param) {
                vc.component.viewFeeDetailInfo.feeId = _param.feeId;
                vc.component.viewFeeDetailInfo.curYear = _param.curYear;
                vc.component.viewFeeDetailInfo.roomName = _param.roomName;
                vc.component.viewFeeDetailInfo.configId = _param.configId;
                vc.component.viewFeeDetailInfo.payerObjId = _param.payerObjId;
                vc.component.listFeeDetail(DEFAULT_PAGE, DEFAULT_ROW);
                $('#viewFeeDetailModel').modal('show');
            });
            vc.on('viewFeeDetail', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component.listRoom(_currentPage, DEFAULT_ROW);
            });
        },
        methods: {
            listFeeDetail: function (_page, _row) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        //feeId: vc.component.viewFeeDetailInfo.feeId,
                        curYear: vc.component.viewFeeDetailInfo.curYear,
                        configId: vc.component.viewFeeDetailInfo.configId,
                        payerObjId: vc.component.viewFeeDetailInfo.payerObjId,
                    }
                }
                //发送get请求
                vc.http.apiGet('/fee.queryFeeDetail',
                    param,
                    function (json, res) {
                        var listFeeDetailData = JSON.parse(json);
                        vc.component.viewFeeDetailInfo.total = listFeeDetailData.total;
                        vc.component.viewFeeDetailInfo.records = listFeeDetailData.records;
                        vc.component.viewFeeDetailInfo.feeDetails = listFeeDetailData.feeDetails;
                        vc.emit('viewFeeDetail', 'paginationPlus', 'init', {
                            total: vc.component.viewFeeDetailInfo.records,
                            dataCount: vc.component.viewFeeDetailInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);