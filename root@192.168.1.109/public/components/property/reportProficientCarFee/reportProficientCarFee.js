/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportProficientCarFeeInfo: {
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
            vc.on('reportProficientCarFee', 'switch', function(_param) {
                $that.clearReportProficientCarFeeInfo();
                $that.reportProficientCarFeeInfo.conditions = _param;
                $that._listReportProficientCarFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportProficientCarFee', 'notify', function() {
                $that._listReportProficientCarFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportProficientCarFee', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._listReportProficientCarFee(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listReportProficientCarFee: function(_page, _row) {
                $that.reportProficientCarFeeInfo.conditions.page = _page;
                $that.reportProficientCarFeeInfo.conditions.row = _row;
                $that.reportProficientCarFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that.reportProficientCarFeeInfo.conditions.objType = '6666'
                let param = {
                    params: $that.reportProficientCarFeeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeYearCollection/queryReportFeeYear',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.reportProficientCarFeeInfo.total = _feeConfigInfo.total;
                        vc.component.reportProficientCarFeeInfo.records = _feeConfigInfo.records;
                        vc.component.reportProficientCarFeeInfo.fees = _feeConfigInfo.data;
                        vc.emit('reportProficientCarFee', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                        //取 属性列
                        if (_feeConfigInfo.total < 1) {
                            return;
                        }
                        $that.reportProficientCarFeeInfo.listColumns = [];
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
                            $that.reportProficientCarFeeInfo.listColumns.push(item.collectionYear)
                        })
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _getProficientCarFeeValue: function(_reportFeeYearCollectionDetailDtos, _year) {
                let _value = 0.00;
                _reportFeeYearCollectionDetailDtos.forEach(item => {
                    if (item.collectionYear == _year) {
                        _value = item.receivedAmount;
                    }
                })
                return _value;
            },
            clearReportProficientCarFeeInfo: function() {
                $that.reportProficientCarFeeInfo = {
                    fees: [],
                    roomId: '',
                    roomName: '',
                    name: ''
                }
            },
            _showCarFeeDetail: function(fee, item) {
                console.log(fee, item)
                vc.emit('viewFeeDetail', 'listFeeDetail', {
                    roomName: fee.objName,
                    feeId: fee.feeId,
                    configId: fee.configId,
                    payerObjId: fee.objId,
                    curYear: item
                })
            }
        }
    });
})(window.vc);