/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailPurchaseApplyInfo: {
                purchaseApplys: [],
                staffId: '',
                tel: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('staffDetailPurchaseApply', 'switch', function (_data) {
                $that.staffDetailPurchaseApplyInfo.staffId = _data.staffId;
                $that.staffDetailPurchaseApplyInfo.tel = _data.tel;
                $that._loadStaffDetailPurchaseApplyData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('staffDetailPurchaseApply', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadStaffDetailPurchaseApplyData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadStaffDetailPurchaseApplyData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        resOrderType: '10000',
                        endUserTel: $that.staffDetailPurchaseApplyInfo.tel,
                    }
                };
                //发送get请求
                vc.http.apiGet('/purchaseApply.listPurchaseApplys',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.staffDetailPurchaseApplyInfo.purchaseApplys = _roomInfo.purchaseApplys;
                        vc.emit('staffDetailPurchaseApply', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyStaffDetailPurchaseApply: function () {
                $that._loadStaffDetailPurchaseApplyData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetailPurchaseApplyModel: function (_purchaseApply) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=10000");
            },
            _openRunWorkflowImage: function (_purchaseApply) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: _purchaseApply.applyOrderId
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listRunWorkflowImage',
                    param,
                    function (json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            vc.toast(_workflowManageInfo.msg);
                            return;
                        }
                        vc.emit('viewImage', 'showImage', {
                            url: 'data:image/png;base64,' + _workflowManageInfo.data
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);