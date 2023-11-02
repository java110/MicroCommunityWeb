/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailItemOutApplyInfo: {
                purchaseApplys: [],
                staffId: '',
                tel: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('staffDetailItemOutApply', 'switch', function (_data) {
                $that.staffDetailItemOutApplyInfo.staffId = _data.staffId;
                $that.staffDetailItemOutApplyInfo.tel = _data.tel;
                $that._loadStaffDetailItemOutApplyData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('staffDetailItemOutApply', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadStaffDetailItemOutApplyData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadStaffDetailItemOutApplyData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        resOrderType: '20000',
                        endUserTel: $that.staffDetailItemOutApplyInfo.tel,
                    }
                };
                //发送get请求
                vc.http.apiGet('/purchaseApply.listPurchaseApplys',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.staffDetailItemOutApplyInfo.purchaseApplys = _roomInfo.purchaseApplys;
                        vc.emit('staffDetailItemOutApply', 'paginationPlus', 'init', {
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
            _qureyStaffDetailItemOutApply: function () {
                $that._loadStaffDetailItemOutApplyData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetailItemOutModel: function (_itemOut) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _itemOut.applyOrderId + "&resOrderType=20000");
            },
            _openRunWorkflowImage: function (_itemOut) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: _itemOut.applyOrderId
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