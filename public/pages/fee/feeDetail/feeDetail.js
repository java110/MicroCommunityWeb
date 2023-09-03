/**
业主详情页面
 **/
(function (vc) {
    vc.extends({
        data: {
            feeDetailInfo: {
                feeId: '',
                configId: '',
                feeFlagName: '',
                feeTypeCdName: '',
                payerObjName: '',
                payerObjId: '',
                payerObjType:'',
                feeName: '',
                stateName: '',
                state: '',
                startTime: '',
                batchId: '',
                endTime: '',
                deadlineTime: '',
                amountOwed: '',
                attrs: [],
                _currentTab: 'feeDetailHisFee',
                needBack: false,
            }
        },
        _initMethod: function () {
            $that.feeDetailInfo.feeId = vc.getParam('feeId');
            if (!vc.notNull($that.feeDetailInfo.feeId)) {
                return;
            }
            vc.component._loadFeeDetailInfo();

        },
        _initEvent: function () {
            vc.on('feeDetail', 'listCarData', function (_info) {
                //vc.component._loadFeeDetailInfo();
                $that.changeTab($that.feeDetailInfo._currentTab);
            });
        },
        methods: {
            _loadFeeDetailInfo: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        feeId: $that.feeDetailInfo.feeId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function (json) {
                        let _feeInfo = JSON.parse(json);
                        // 员工列表 和 岗位列表匹配
                        vc.copyObject(_feeInfo.fees[0], $that.feeDetailInfo);
                        $that.feeDetailInfo.attrs = _feeInfo.fees[0].feeAttrs;
                        $that.changeTab($that.feeDetailInfo._currentTab);
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function (_tab) {
                $that.feeDetailInfo._currentTab = _tab;
                let _ownerId = "";
                $that.feeDetailInfo.attrs.forEach(item => {
                    if(item.specCd=='390007'){
                        _ownerId = item.value;
                    }
                });
                vc.emit(_tab, 'switch', {
                    feeId: $that.feeDetailInfo.feeId,
                    payerObjId: $that.feeDetailInfo.payerObjId,
                    configId:$that.feeDetailInfo.configId,
                    ownerId:_ownerId
                });
            },
            _openEditOwnerCar: function () {
                vc.emit('editCar', 'openEditCar', $that.feeDetailInfo);
            },
            _getDeadlineTime: function (_fee) {

                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
            _getEndTime: function (_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
            },
        }
    });
})(window.vc);