/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            inspectionRoutePointManageInfo: {
                inspectionPoints: [],
                inspectionRouteId: '',
                total: 0,
                records: 1,
                routeName: ''
            }
        },
        _initMethod: function() {
            //vc.component._listInspectionRoutePoints(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('inspectionRoutePointManage', 'listInspectionPoint', function(_param) {
                if (!_param.hasOwnProperty('inspectionRouteId')) {
                    return;
                }
                vc.component.inspectionRoutePointManageInfo.inspectionRouteId = _param.inspectionRouteId;
                vc.component._listInspectionRoutePoints(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('inspectionRoutePointManage', 'paginationPlus', 'page_event', function(_currentPage) {
                vc.component._listInspectionRoutePoints(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listInspectionRoutePoints: function(_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId,
                        inspectionRouteId: vc.component.inspectionRoutePointManageInfo.inspectionRouteId
                    }
                };
                //发送get请求
                vc.http.apiGet('/inspectionRoute.listInspectionRoutePoints',
                    param,
                    function(json, res) {
                        var _inspectionRouteManageInfo = JSON.parse(json);
                        vc.component.inspectionRoutePointManageInfo.total = _inspectionRouteManageInfo.total;
                        vc.component.inspectionRoutePointManageInfo.records = _inspectionRouteManageInfo.records;
                        vc.component.inspectionRoutePointManageInfo.inspectionPoints = _inspectionRouteManageInfo.inspectionPoints;
                        vc.emit('inspectionRoutePointManage', 'paginationPlus', 'init', {
                            total: vc.component.inspectionRoutePointManageInfo.records,
                            dataCount: vc.component.inspectionRoutePointManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddInspectionRoutePointModal: function() {
                vc.emit('chooseInspectionRoutePoint', 'openchooseInspectionRoutePointModal', $that.inspectionRoutePointManageInfo);
            },
            _openDeleteInspectionRoutePointModel: function(_inspectionPoint) {
                _inspectionPoint.inspectionRouteId = $that.inspectionRoutePointManageInfo.inspectionRouteId;
                vc.emit('deleteInspectionRoutePoint', 'openDeleteInspectionRoutePointModal', _inspectionPoint);
            },
            _openEditInspectionRoutePointModel: function(_inspectionPoint) {
                _inspectionPoint.inspectionRouteId = $that.inspectionRoutePointManageInfo.inspectionRouteId;
                vc.emit('editInspectionRoutePoint', 'openEditInspectionRoutePointModal', _inspectionPoint);
            },
            _goBack: function() {
                vc.emit('inspectionRouteManage', 'goBack', {});
            }
        }
    });
})(window.vc);