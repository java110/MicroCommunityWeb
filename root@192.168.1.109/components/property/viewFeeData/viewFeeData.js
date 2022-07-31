(function(vc) {

    vc.extends({
        data: {
            viewFeeDataInfo: {
                feeId: '',
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('viewFeeData', 'showData', function(_param) {
                $that.viewFeeDataInfo.feeId = _param.feeId;
                $that._loadViewFeeData();
            });
        },
        methods: {
            _loadViewFeeData: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: $that.viewFeeDataInfo.feeId
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee', param,
                    function(json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        let _fee = _feeConfigManageInfo.fees[0];

                        let _data = {
                            "费用ID": _fee.feeId,
                            "费用标识": _fee.feeFlagName,
                            "费用类型": _fee.feeTypeCdName,
                            "付费对象": _fee.payerObjName,
                            "费用项": _fee.feeName,
                            "费用状态": _fee.stateName,
                            "建账时间": _fee.startTime,
                            "计费开始时间": $that._getViewFeeDataEndTime(_fee),
                            "计费结束时间": $that._getViewFeeDataDeadlineTime(_fee),
                            "批次": _fee.batchId,
                        };
                        if (_fee.feeAttrs) {
                            _fee.feeAttrs.forEach(attr => {
                                _data[attr.specCdName] = attr.value;
                            })
                        }

                        vc.emit('viewData', 'openViewDataModal', {
                            title: _fee.feeName + " 详情",
                            data: _data
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getViewFeeDataDeadlineTime: function(_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                //return vc.dateSub(_fee.deadlineTime, _fee.feeFlag);
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
            _getViewFeeDataEndTime: function(_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
            },
        }
    });

})(window.vc);