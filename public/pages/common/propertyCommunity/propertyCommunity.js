/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            propertyCommunityInfo: {
                communitys: [],
                total: 0,
                records: 1,
                storeTypeCd: vc.getData('/nav/getUserInfo').storeTypeCd,
                conditions: {
                    name: '',
                    memberId: '',
                    communityId: ''
                }
            }
        },
        _initMethod: function() {
            $that.propertyCommunityInfo.conditions.memberId = vc.getParam('storeId');
            vc.component._listCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);

        },
        _initEvent: function() {
            vc.on('propertyCommunity', 'listCommunity', function(_param) {
                vc.component._listCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on("propertyCommunity", "propertyCommunity", "notifyArea", function(_param) {
                vc.component.propertyCommunityInfo.conditions.cityCode = _param.selectArea;
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listCommunitys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCommunitys: function(_page, _rows) {
                vc.component.propertyCommunityInfo.conditions.page = _page;
                vc.component.propertyCommunityInfo.conditions.row = _rows;
                var _param = {
                        params: vc.component.propertyCommunityInfo.conditions
                    }
                    //发送get请求
                vc.http.apiGet('/community.listCommunitys',
                    _param,
                    function(json, res) {
                        var _propertyCommunityInfo = JSON.parse(json);
                        vc.component.propertyCommunityInfo.total = _propertyCommunityInfo.total;
                        vc.component.propertyCommunityInfo.records = _propertyCommunityInfo.records;
                        vc.component.propertyCommunityInfo.communitys = _propertyCommunityInfo.communitys;
                        vc.emit('pagination', 'init', {
                            total: vc.component.propertyCommunityInfo.records,
                            dataCount: vc.component.propertyCommunityInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddPropertyCommunityModal: function() {
                vc.emit('addPropertyCommunity', 'openAddPropertyCommunityModal', {
                    storeId: vc.getParam('storeId')
                });
            },
            _openEditPropertyCommunityModel: function(_community) {
                _community.storeId = vc.getParam('storeId');
                vc.emit('editPropertyCommunity', 'openEditPropertyCommunityModal', _community);
            },
            _openDeletePropertyCommunityModel: function(_community) {
                _community.memberId = vc.getParam('storeId');
                vc.emit('deletePropertyCommunity', 'openDeletePropertyCommunityModal', _community);
            },
            _openRecallCommunityModel: function(_community) {
                vc.emit('recallAuditFinishCommunity', 'openRecallAuditFinishCommunityModal', _community);
            },
            _queryCommunityMethod: function() {
                vc.component._listCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDeleteCommunityModel(_community) {
                vc.emit('deleteCommunity', 'openDeleteCommunityModal', _community);
            },
        }
    });
})(window.vc);