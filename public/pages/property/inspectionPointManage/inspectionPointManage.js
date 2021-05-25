/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            inspectionPointManageInfo: {
                inspectionPoints: [],
                total: 0,
                records: 1,
                moreCondition: false,
                inspectionName: '',
                pointObjTypes: [],
                conditions: {
                    inspectionId: '',
                    machineId: '',
                    inspectionName: '',
                    machineCode: '',
                    pointObjType: ''
                }
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('inspection_point', "point_obj_type", function (_data) {
                vc.component.inspectionPointManageInfo.pointObjTypes = _data;
            });
            vc.component._listInspectionPoints(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('inspectionPointManage', 'listInspectionPoint', function (_param) {
                vc.component._listInspectionPoints(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listInspectionPoints(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listInspectionPoints: function (_page, _rows) {
                vc.component.inspectionPointManageInfo.conditions.page = _page;
                vc.component.inspectionPointManageInfo.conditions.row = _rows;
                vc.component.inspectionPointManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.inspectionPointManageInfo.conditions
                };
                param.params.inspectionId = param.params.inspectionId.trim();
                param.params.inspectionName = param.params.inspectionName.trim();
                param.params.machineCode = param.params.machineCode.trim();
                //发送get请求
                vc.http.get('inspectionPointManage',
                    'list',
                    param,
                    function (json, res) {
                        var _inspectionPointManageInfo = JSON.parse(json);
                        vc.component.inspectionPointManageInfo.total = _inspectionPointManageInfo.total;
                        vc.component.inspectionPointManageInfo.records = _inspectionPointManageInfo.records;
                        vc.component.inspectionPointManageInfo.inspectionPoints = _inspectionPointManageInfo.inspectionPoints;
                        vc.emit('pagination', 'init', {
                            total: vc.component.inspectionPointManageInfo.records,
                            dataCount: vc.component.inspectionPointManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddInspectionPointModal: function () {
                vc.emit('addInspectionPoint', 'openAddInspectionPointModal', {});
            },
            _openEditInspectionPointModel: function (_inspectionPoint) {
                vc.emit('editInspectionPoint', 'openEditInspectionPointModal', _inspectionPoint);
            },
            _openDeleteInspectionPointModel: function (_inspectionPoint) {
                vc.emit('deleteInspectionPoint', 'openDeleteInspectionPointModal', _inspectionPoint);
            },
            //查询
            _queryInspectionPointMethod: function () {
                vc.component._listInspectionPoints(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetInspectionPointMethod: function () {
                vc.component.inspectionPointManageInfo.conditions.inspectionId = '';
                vc.component.inspectionPointManageInfo.conditions.inspectionName = '';
                vc.component.inspectionPointManageInfo.conditions.machineCode = '';
                vc.component.inspectionPointManageInfo.conditions.pointObjType = '';
                vc.component._listInspectionPoints(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.inspectionPointManageInfo.moreCondition) {
                    vc.component.inspectionPointManageInfo.moreCondition = false;
                } else {
                    vc.component.inspectionPointManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
