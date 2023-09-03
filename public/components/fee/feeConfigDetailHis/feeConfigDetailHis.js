/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeConfigDetailHisInfo: {
                feeDetails: [],
                feeId: '',
                staffNameLike: '',
                feeNameLike: '',
                logStartTime:'',
                logEndTime:'',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('feeConfigDetailHis', 'switch', function(_data) {
                $that.feeConfigDetailHisInfo.configId = _data.configId;
                $that.feeConfigDetailHisInfo.staffNameLike = _data.staffNameLike;
                $that.feeConfigDetailHisInfo.feeNameLike = _data.feeNameLike;
                $that.feeConfigDetailHisInfo.logStartTime = _data.logStartTime;
                $that.feeConfigDetailHisInfo.logEndTime = _data.logEndTime;
                $that._loadFeeConfigDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeConfigDetailHis', 'notify',
                function(_data) {
                    $that._loadFeeConfigDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('feeConfigDetailHis', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._loadFeeConfigDetailHisData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadFeeConfigDetailHisData: function(_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        configId: $that.feeConfigDetailHisInfo.configId,
                        staffNameLike: $that.feeConfigDetailHisInfo.staffNameLike,
                        feeNameLike: $that.feeConfigDetailHisInfo.feeNameLike,
                        logStartTime:$that.feeConfigDetailHisInfo.logStartTime,
                        logEndTime:$that.feeConfigDetailHisInfo.logEndTime,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/fee.queryHisFeeConfig',
                    param,
                    function(json) {
                        let _roomInfo = JSON.parse(json);
                        $that.feeConfigDetailHisInfo.feeDetails = _roomInfo.data;
                        vc.emit('feeConfigDetailHis', 'paginationPlus', 'init', {
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
            _qureyFeeDetailHisFee: function() {
                $that._loadFeeDetailHisFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _getHisConfigOperate: function(_fee) {
                let _feeCount = 0;
                $that.feeConfigDetailHisInfo.feeDetails.forEach(item => {
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