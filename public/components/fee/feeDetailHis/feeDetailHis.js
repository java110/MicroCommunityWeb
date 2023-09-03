/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailHisInfo: {
                fees: [],
                feeId: '',
                staffNameLike: '',
                feeNameLike: '',
                payerObjName: '',
                logStartTime:'',
                logEndTime:'',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('feeDetailHis', 'switch', function(_data) {
                $that.feeDetailHisInfo.feeId = _data.feeId;
                $that.feeDetailHisInfo.staffNameLike = _data.staffNameLike;
                $that.feeDetailHisInfo.feeNameLike = _data.feeNameLike;
                $that.feeDetailHisInfo.payerObjName = _data.payerObjName;
                $that.feeDetailHisInfo.logStartTime = _data.logStartTime;
                $that.feeDetailHisInfo.logEndTime = _data.logEndTime;
                $that._loadFeeDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailHis', 'notify',
                function(_data) {
                    $that._loadFeeDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('feeDetailHis', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._loadFeeDetailHisData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadFeeDetailHisData: function(_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: $that.feeDetailHisInfo.feeId,
                        staffNameLike: $that.feeDetailHisInfo.staffNameLike,
                        feeNameLike: $that.feeDetailHisInfo.feeNameLike,
                        payerObjName: $that.feeDetailHisInfo.payerObjName,
                        logStartTime:$that.feeDetailHisInfo.logStartTime,
                        logEndTime:$that.feeDetailHisInfo.logEndTime,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/fee.queryHisFee',
                    param,
                    function(json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.feeDetailHisInfo.fees = _roomInfo.data;
                        vc.emit('feeDetailHis', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyFeeDetailHis: function() {
                $that._loadFeeDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
            },

            _getFeeHisOperate: function(_fee) {
                let _feeCount = 0;
                $that.feeDetailHisInfo.fees.forEach(item => {
                    if (_fee.bId == item.bId) {
                        _feeCount += 1;
                    }
                });

                if (_feeCount <= 1) {
                    if (_fee.operate == 'ADD') {
                        return '添加';
                    }
                    if (_fee.operate == 'DEL') {
                        return '删除';
                    }
                    return "-"
                }

                if (_fee.operate == 'ADD') {
                    return '修改(新)';
                }
                if (_fee.operate == 'DEL') {
                    return '修改(旧)';
                }

                return "-"
            }
        }
    });
})(window.vc);