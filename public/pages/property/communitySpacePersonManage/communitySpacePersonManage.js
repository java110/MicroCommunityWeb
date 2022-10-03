/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            communitySpacePersonManageInfo: {
                communitySpacePersons: [],
                spaces: [],
                total: 0,
                records: 1,
                moreCondition: false,
                cspId: '',
                conditions: {
                    spaceId: '',
                    personName: '',
                    personTel: '',
                    appointmentTime: '',
                    receivableAmount: '',
                    receivedAmount: '',
                    payWay: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            $that._listCommunitySpacePersonCommunitySpaces();
            vc.component._listCommunitySpacePersons(DEFAULT_PAGE, DEFAULT_ROWS);

        },
        _initEvent: function() {

            vc.on('communitySpacePersonManage', 'listCommunitySpacePerson', function(_param) {
                vc.component._listCommunitySpacePersons(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listCommunitySpacePersons(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCommunitySpacePersons: function(_page, _rows) {

                vc.component.communitySpacePersonManageInfo.conditions.page = _page;
                vc.component.communitySpacePersonManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.communitySpacePersonManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/communitySpace.listCommunitySpacePerson',
                    param,
                    function(json, res) {
                        var _communitySpacePersonManageInfo = JSON.parse(json);
                        vc.component.communitySpacePersonManageInfo.total = _communitySpacePersonManageInfo.total;
                        vc.component.communitySpacePersonManageInfo.records = _communitySpacePersonManageInfo.records;
                        vc.component.communitySpacePersonManageInfo.communitySpacePersons = _communitySpacePersonManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.communitySpacePersonManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            
            _openCommunitySpacePersonTimeModel: function(_communitySpacePerson) {
                vc.emit('communitySpacePersonTime', 'openEditCommunitySpaceModal', _communitySpacePerson.times);
            },
            _openDeleteCommunitySpacePersonModel: function(_communitySpacePerson) {
                vc.emit('deleteCommunitySpacePerson', 'openDeleteCommunitySpacePersonModal', _communitySpacePerson);
            },
            _queryCommunitySpacePersonMethod: function() {
                vc.component._listCommunitySpacePersons(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.communitySpacePersonManageInfo.moreCondition) {
                    vc.component.communitySpacePersonManageInfo.moreCondition = false;
                } else {
                    vc.component.communitySpacePersonManageInfo.moreCondition = true;
                }
            },
            _listCommunitySpacePersonCommunitySpaces: function(_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/communitySpace.listCommunitySpace',
                    param,
                    function(json, res) {
                        let _communitySpaceManageInfo = JSON.parse(json);

                        vc.component.communitySpacePersonManageInfo.spaces = _communitySpaceManageInfo.data;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },


        }
    });
})(window.vc);