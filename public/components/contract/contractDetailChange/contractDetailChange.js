/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractDetailChangeInfo: {
                contracts: [],
                contractId: '',
                roomNum: '',
                totalArea: '0',
                logStartTime: '',
                logEndTime: '',
                contractCode: '',
                staffNameLike: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('contractDetailChange', 'switch', function (_data) {
                $that.contractDetailChangeInfo.contractId = _data.contractId;
                $that.contractDetailChangeInfo.logStartTime = _data.logStartTime;
                $that.contractDetailChangeInfo.logEndTime = _data.logEndTime;
                $that.contractDetailChangeInfo.contractCode = _data.contractCode;
                $that._loadContractDetailChangeData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('contractDetailChange', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadContractDetailChangeData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('contractDetailChange', 'notify', function (_data) {
                $that._loadContractDetailChangeData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadContractDetailChangeData: function (_page, _row) {
                let param = {
                    params: {
                        contractId: $that.contractDetailChangeInfo.contractId,
                        logStartTime: $that.contractDetailChangeInfo.logStartTime,
                        logEndTime: $that.contractDetailChangeInfo.logEndTime,
                        contractCode: $that.contractDetailChangeInfo.contractCode,
                        staffNameLike: $that.contractDetailChangeInfo.staffNameLike,
                        page: _page,
                        row: _row
                    }
                }
                //发送get请求
                vc.http.apiGet('/contract/queryContractChangePlan',
                    param,
                    function (json, res) {
                        var _contractTFile = JSON.parse(json);
                        $that.contractDetailChangeInfo.contracts = _contractTFile.data;
                        vc.emit('contractDetailChange', 'paginationPlus', 'init', {
                            total: _contractTFile.records,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyContractDetailChange: function () {
                $that._loadContractDetailChangeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toContractDetails: function (_contract) {
                vc.jumpToPage('/#/pages/admin/contractChangeDetails?planId=' + _contract.planId)
            },
        }
    });
})(window.vc);