/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            locationManageInfo: {
                locations: [],
                total: 0,
                records: 1,
                moreCondition: false,
                locationName: '',
                conditions: {
                    locationName: '',
                    locationId: '',
                    locationType: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listLocations(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('locationManage', 'listLocation', function (_param) {
                vc.component._listLocations(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listLocations(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listLocations: function (_page, _rows) {
                vc.component.locationManageInfo.conditions.page = _page;
                vc.component.locationManageInfo.conditions.row = _rows;
                vc.component.locationManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.locationManageInfo.conditions
                };
                param.params.locationId = param.params.locationId.trim();
                param.params.locationName = param.params.locationName.trim();
                //发送get请求
                vc.http.apiGet('communityLocation.listCommunityLocations',
                    param,
                    function (json, res) {
                        var _locationManageInfo = JSON.parse(json);
                        vc.component.locationManageInfo.total = _locationManageInfo.total;
                        vc.component.locationManageInfo.records = _locationManageInfo.records;
                        vc.component.locationManageInfo.locations = _locationManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.locationManageInfo.records,
                            dataCount: vc.component.locationManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddLocationModal: function () {
                vc.emit('addLocation', 'openAddLocationModal', {});
            },
            _openEditLocationModel: function (_location) {
                vc.emit('editLocation', 'openEditLocationModal', _location);
            },
            _openDeleteLocationModel: function (_location) {
                vc.emit('deleteLocation', 'openDeleteLocationModal', _location);
            },
            //查询
            _queryLocationMethod: function () {
                vc.component._listLocations(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetLocationMethod: function () {
                vc.component.locationManageInfo.conditions.locationName = "";
                vc.component.locationManageInfo.conditions.locationId = "";
                vc.component.locationManageInfo.conditions.locationType = "";
                vc.component._listLocations(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.locationManageInfo.moreCondition) {
                    vc.component.locationManageInfo.moreCondition = false;
                } else {
                    vc.component.locationManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
