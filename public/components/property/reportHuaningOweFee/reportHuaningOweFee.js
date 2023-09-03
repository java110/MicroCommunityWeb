/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportHuaningOweFeeInfo: {
                total: 0,
                records: 1,
                fees: [],
                listColumns: [],
                roomId: '',
                roomName: '',
                conditions: {},
                dateStr: vc.dateFormat(new Date().getTime())
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            //切换 至费用页面
            vc.on('reportHuaningOweFee', 'switch', function(_param) {
                $that.clearReportHuaningOweFeeInfo();
                $that.reportHuaningOweFeeInfo.conditions = _param;
                $that._listReportHuaningOweFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportHuaningOweFee', 'notify', function() {
                $that._listReportHuaningOweFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportHuaningOweFee', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._listReportHuaningOweFee(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listReportHuaningOweFee: function(_page, _row) {
                $that.reportHuaningOweFeeInfo.conditions.page = _page;
                $that.reportHuaningOweFeeInfo.conditions.row = _row;
                $that.reportHuaningOweFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that.reportHuaningOweFeeInfo.conditions.objType = '3333'
                let param = {
                    params: $that.reportHuaningOweFeeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryHuaningOweFee',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.reportHuaningOweFeeInfo.total = _feeConfigInfo.total;
                        vc.component.reportHuaningOweFeeInfo.records = _feeConfigInfo.records;
                        vc.component.reportHuaningOweFeeInfo.fees = _feeConfigInfo.data;
                        //取 属性列
                        if (_feeConfigInfo.total < 1) {
                            return;
                        }
                        $that.reportHuaningOweFeeInfo.listColumns = [];
                        if (_feeConfigInfo.data.length > 0) {
                            let _reportFeeYearCollectionDetailDtos = _feeConfigInfo.data[0].reportFeeYearCollectionDetailDtos;
                            _reportFeeYearCollectionDetailDtos.forEach(item => {
                                $that.reportHuaningOweFeeInfo.listColumns.push(item.collectionYear + "年")
                            })
                        }
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
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
            clearReportHuaningOweFeeInfo: function() {
                $that.reportHuaningOweFeeInfo = {
                    fees: [],
                    roomId: '',
                    roomName: '',
                    name: '',
                    dateStr: vc.dateFormat(new Date().getTime())
                }
            },
            dealReportProficientRoomFeeAttr: function(owners) {},
            _showFeeDetail: function(fee, item) {
                vc.emit('viewFeeDetail', 'listFeeDetail', {
                    roomName: fee.objName,
                    feeId: fee.feeId,
                    configId: fee.configId,
                    payerObjId: fee.objId,
                    curYear: item.collectionYear
                })
            },
            _getCurYear: function() {
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                return year + "年1-" + month + "月";
            },
            _getPreCurYear: function() {
                let date = new Date();
                let year = date.getFullYear();
                return year + "年前未收金额";
            },
        }
    });
})(window.vc);