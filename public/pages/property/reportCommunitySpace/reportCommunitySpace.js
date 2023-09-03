/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportCommunitySpaceInfo: {
                communitySpaces: [],
                venues: [],
                persons: [],
                total: 0,
                records: 1,
                moreCondition: false,
                spaceId: '',
                appointmentTime: vc.getDateYYYYMMDD(),
                conditions: {
                    spaceId: '',
                    name: '',
                    state: '',
                    venueId: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.initDate('queryDate', function (_value) {
                $that.reportCommunitySpaceInfo.appointmentTime = _value;
            });
            $that._listCommunityVenues();
        },
        _initEvent: function () {
            vc.on('communitySpaceManage', 'listCommunityVenue', function (_param) {
                vc.component._listCommunityVenues(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('communitySpaceManage', 'listCommunitySpacePerson', function (_param) {
                vc.component._listCommunitySpacePerson(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCommunitySpaces: function (_page, _rows) {
                vc.component.reportCommunitySpaceInfo.conditions.page = _page;
                vc.component.reportCommunitySpaceInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportCommunitySpaceInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/communitySpace.listCommunitySpace',
                    param,
                    function (json, res) {
                        let _reportCommunitySpaceInfo = JSON.parse(json);
                        vc.component.reportCommunitySpaceInfo.total = _reportCommunitySpaceInfo.total;
                        vc.component.reportCommunitySpaceInfo.records = _reportCommunitySpaceInfo.records;
                        vc.component.reportCommunitySpaceInfo.communitySpaces = _reportCommunitySpaceInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportCommunitySpaceInfo.records,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listCommunitySpacePerson: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        venueId: $that.reportCommunitySpaceInfo.conditions.venueId,
                        appointmentTime: $that.reportCommunitySpaceInfo.appointmentTime,
                        communityId: vc.getCurrentCommunity().communityId,
                        state: 'S'
                    }
                };
                //发送get请求
                vc.http.apiGet('/communitySpace.listCommunitySpacePerson',
                    param,
                    function (json, res) {
                        let _reportCommunitySpaceInfo = JSON.parse(json);
                        vc.component.reportCommunitySpaceInfo.persons = _reportCommunitySpaceInfo.data;
                        $that._listCommunitySpaces(DEFAULT_PAGE, DEFAULT_ROWS);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listCommunityVenues: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/communityVenue.listCommunityVenue',
                    param,
                    function (json, res) {
                        let _communityVenue = JSON.parse(json);
                        vc.component.reportCommunitySpaceInfo.venues = _communityVenue.data;
                        if (_communityVenue.data && _communityVenue.data.length > 0) {
                            $that.swatchVenue(_communityVenue.data[0]);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCommunitySpaceModal: function () {
                if (!$that.reportCommunitySpaceInfo.conditions.venueId) {
                    vc.toast('未选择场馆');
                    return;
                }
                vc.emit('addCommunitySpace', 'openAddCommunitySpaceModal', {
                    venueId: $that.reportCommunitySpaceInfo.conditions.venueId
                });
            },
            _getSpaceHoursTime: function (_hours, _space) {
                let _times = _space.openTimes;
                let _person = '';
                _times.forEach(item => {
                    if (item.hours == _hours && item.isOpen == 'N') {
                        _person = '不可预约';
                    }
                });
                if (_person) {
                    return _person;
                }
                let _persons = $that.reportCommunitySpaceInfo.persons;
                _persons.forEach(item => {
                    if (item.spaceId == _space.spaceId) {
                        item.times.forEach(itemTime => {
                            if (itemTime.hours == _hours) {
                                _person = item.personName + ">" + item.personTel;
                            }
                        })
                    }
                })
                if (_person) {
                    return _person;
                }
                return "可预约";
            },
            swatchVenue: function (_venue) {
                $that.reportCommunitySpaceInfo.conditions.venueId = _venue.venueId;
                $that._listCommunitySpacePerson();
            },
            _moreCondition: function () {
                if (vc.component.reportCommunitySpaceInfo.moreCondition) {
                    vc.component.reportCommunitySpaceInfo.moreCondition = false;
                } else {
                    vc.component.reportCommunitySpaceInfo.moreCondition = true;
                }
            },
            _openAddCommunitySpacePersonModal: function (_spaceId, _hours) {
                vc.emit('addCommunitySpacePerson', 'openAddCommunitySpacePersonModal', {
                    spaceId: _spaceId,
                    hours: _hours,
                    appointmentTime: $that.reportCommunitySpaceInfo.appointmentTime,
                    openTime: _hours
                });
            },
            _changeDateQuery: function () {
                $that._listCommunityVenues();
            }
        }
    });
})(window.vc);