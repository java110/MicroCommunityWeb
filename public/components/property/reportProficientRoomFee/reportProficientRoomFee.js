/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportProficientRoomFeeInfo: {
                fees: [],
                listColumns: [],
                roomId: '',
                roomName: '',
                conditions: {}
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            //切换 至费用页面
            vc.on('reportProficientRoomFee', 'switch', function(_param) {
                $that.clearReportProficientRoomFeeInfo();
                $that.reportProficientRoomFeeInfo.conditions = _param;
                console.log($that.reportProficientRoomFeeInfo.conditions)
                $that._listReportProficientRoomFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportProficientRoomFee', 'notify', function() {
                $that._listReportProficientRoomFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportProficientRoomFee', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._listReportProficientRoomFee(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listReportProficientRoomFee: function(_page, _row) {
                $that.reportProficientRoomFeeInfo.conditions.page = _page;
                $that.reportProficientRoomFeeInfo.conditions.row = _row;
                $that.reportProficientRoomFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that.reportProficientRoomFeeInfo.conditions.objType = '3333'
                let param = {
                    params: $that.reportProficientRoomFeeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeYearCollection/queryReportFeeYear',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.reportProficientRoomFeeInfo.total = _feeConfigInfo.total;
                        vc.component.reportProficientRoomFeeInfo.records = _feeConfigInfo.records;
                        vc.component.reportProficientRoomFeeInfo.fees = _feeConfigInfo.data;
                        vc.emit('reportProficientRoomFee', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                        //取 属性列
                        if (_feeConfigInfo.total < 1) {
                            return;
                        }
                        $that.reportProficientRoomFeeInfo.listColumns = [];
                        if (_feeConfigInfo.data.length < 1) {
                            return;
                        }
                        let _reportFeeYearCollectionDetailDtos = _feeConfigInfo.data[0].reportFeeYearCollectionDetailDtos;
                        _feeConfigInfo.data.forEach(item => {
                            if (item.reportFeeYearCollectionDetailDtos.length > _reportFeeYearCollectionDetailDtos.length) {
                                _reportFeeYearCollectionDetailDtos = item.reportFeeYearCollectionDetailDtos;
                            }
                        })
                        _reportFeeYearCollectionDetailDtos.forEach(item => {
                            $that.reportProficientRoomFeeInfo.listColumns.push(item.collectionYear)
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _getProficientRoomFeeValue: function(_reportFeeYearCollectionDetailDtos, _year) {
                let _value = 0.00;
                _reportFeeYearCollectionDetailDtos.forEach(item => {
                    if (item.collectionYear == _year) {
                        _value = item.receivedAmount;
                    }
                })
                return _value;
            },
            _getAttrValue: function(_attrs, _specCd) {
                let _value = "";
                _attrs.forEach(item => {
                    if (item.specCd == _specCd) {
                        _value = item.value;
                        return;
                    }
                });
                return _value;
            },
            clearReportProficientRoomFeeInfo: function() {
                $that.reportProficientRoomFeeInfo = {
                    fees: [],
                    roomId: '',
                    roomName: '',
                    name: ''
                }
            },
            dealReportProficientRoomFeeAttr: function(owners) {},
            _showFeeDetail: function(fee, item) {
                console.log(fee, item)
                vc.emit('viewFeeDetail', 'listFeeDetail', {
                    roomName: fee.objName,
                    feeId: fee.feeId,
                    configId: fee.configId,
                    payerObjId: fee.objId,
                    curYear: item
                })
            },

        }
    });
})(window.vc);