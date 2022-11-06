/**
 入驻小区
 **/
 (function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            maintainanceStandardItemInfo: {
                items: [],
                standardId: '',
                total: 0,
                records: 1,
                routeName: ''
            }
        },
        _initMethod: function() {
            vc.component.maintainanceStandardItemInfo.standardId = vc.getParam('standardId');
            vc.component._listMaintainanceStandardItems(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('maintainanceStandardItem', 'loadItem', function() {
                vc.component._listMaintainanceStandardItems(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('maintainanceStandardItem', 'paginationPlus', 'page_event', function(_currentPage) {
                vc.component._listMaintainanceStandardItems(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMaintainanceStandardItems: function(_page, _rows) {
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId,
                        standardId: vc.component.maintainanceStandardItemInfo.standardId
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainance.listMaintainanceStandardItem',
                    param,
                    function(json, res) {
                        var _inspectionRouteManageInfo = JSON.parse(json);
                        vc.component.maintainanceStandardItemInfo.total = _inspectionRouteManageInfo.total;
                        vc.component.maintainanceStandardItemInfo.records = _inspectionRouteManageInfo.records;
                        vc.component.maintainanceStandardItemInfo.items = _inspectionRouteManageInfo.data;
                        vc.emit('maintainanceStandardItem', 'paginationPlus', 'init', {
                            total: vc.component.maintainanceStandardItemInfo.records,
                            dataCount: vc.component.maintainanceStandardItemInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMaintainanceStandardItemModal: function() {
                vc.emit('chooseMaintainanceStandardItem', 'openchooseMaintainanceStandardItemModal', {
                    standardId:$that.maintainanceStandardItemInfo.standardId
                });
            },
            _openDeleteMaintainanceStandardItemModel: function(_inspectionPoint) {
                _inspectionPoint.standardId = $that.maintainanceStandardItemInfo.standardId;
                vc.emit('deleteMaintainanceStandardItem', 'openDeleteMaintainanceStandardItemModal', _inspectionPoint);
            },
            _goBack: function() {
                vc.goBack();
            }
        }
    });
})(window.vc);