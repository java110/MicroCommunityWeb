/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            activitiesTypeManageInfo: {
                activitiesTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                typeCd: '',
                conditions: {
                    typeCd: '',
                    typeName: '',
                    defaultShow: '',
                    communityId:vc.getCurrentCommunity().communityId

                }
            }
        },
        _initMethod: function () {
            vc.component._listActivitiesTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('activitiesTypeManage', 'listActivitiesType', function (_param) {
                vc.component._listActivitiesTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listActivitiesTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listActivitiesTypes: function (_page, _rows) {

                vc.component.activitiesTypeManageInfo.conditions.page = _page;
                vc.component.activitiesTypeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.activitiesTypeManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/activitiesType/queryActivitiesType',
                    param,
                    function (json, res) {
                        var _activitiesTypeManageInfo = JSON.parse(json);
                        vc.component.activitiesTypeManageInfo.total = _activitiesTypeManageInfo.total;
                        vc.component.activitiesTypeManageInfo.records = _activitiesTypeManageInfo.records;
                        vc.component.activitiesTypeManageInfo.activitiesTypes = _activitiesTypeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.activitiesTypeManageInfo.records,
                            dataCount: vc.component.activitiesTypeManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddActivitiesTypeModal: function () {
                vc.emit('addActivitiesType', 'openAddActivitiesTypeModal', {});
            },
            _openEditActivitiesTypeModel: function (_activitiesType) {
                vc.emit('editActivitiesType', 'openEditActivitiesTypeModal', _activitiesType);
            },
            _openDeleteActivitiesTypeModel: function (_activitiesType) {
                vc.emit('deleteActivitiesType', 'openDeleteActivitiesTypeModal', _activitiesType);
            },
            _queryActivitiesTypeMethod: function () {
                vc.component._listActivitiesTypes(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.activitiesTypeManageInfo.moreCondition) {
                    vc.component.activitiesTypeManageInfo.moreCondition = false;
                } else {
                    vc.component.activitiesTypeManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
