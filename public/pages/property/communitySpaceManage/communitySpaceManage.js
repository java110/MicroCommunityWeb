/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            communitySpaceManageInfo: {
                communitySpaces: [],
                venues:[],
                total: 0,
                records: 1,
                moreCondition: false,
                spaceId: '',
                conditions: {
                    spaceId: '',
                    name: '',
                    state: '',
                    venueId:'',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            $that._listCommunityVenues();
            vc.component._listCommunitySpaces(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('communitySpaceManage', 'listCommunityVenue', function(_param) {
                vc.component._listCommunityVenues(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('communitySpaceManage', 'listCommunitySpace', function(_param) {
                vc.component._listCommunitySpaces(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listCommunitySpaces(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCommunitySpaces: function(_page, _rows) {

                vc.component.communitySpaceManageInfo.conditions.page = _page;
                vc.component.communitySpaceManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.communitySpaceManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/communitySpace.listCommunitySpace',
                    param,
                    function(json, res) {
                        let _communitySpaceManageInfo = JSON.parse(json);
                        vc.component.communitySpaceManageInfo.total = _communitySpaceManageInfo.total;
                        vc.component.communitySpaceManageInfo.records = _communitySpaceManageInfo.records;
                        vc.component.communitySpaceManageInfo.communitySpaces = _communitySpaceManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.communitySpaceManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listCommunityVenues: function(_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/communityVenue.listCommunityVenue',
                    param,
                    function(json, res) {
                        let _communityVenue= JSON.parse(json);
                        vc.component.communitySpaceManageInfo.venues = _communityVenue.data;

                        if(_communityVenue.data && _communityVenue.data.length >0){
                            $that.swatchVenue(_communityVenue.data[0]);
                        }
                       
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCommunitySpaceModal: function() {
                if(!$that.communitySpaceManageInfo.conditions.venueId){
                    vc.toast('未选择场馆');
                    return ;
                }
                vc.emit('addCommunitySpace', 'openAddCommunitySpaceModal', {
                    venueId:$that.communitySpaceManageInfo.conditions.venueId
                });
            },
            _openEditCommunitySpaceModel: function(_communitySpace) {
                vc.emit('editCommunitySpace', 'openEditCommunitySpaceModal', _communitySpace);
            },
            _openEditOpenTime: function(_communitySpace) {
                vc.emit('editCommunitySpaceOpenTime', 'openEditCommunitySpaceModal', _communitySpace);
            },
            _openDeleteCommunitySpaceModel: function(_communitySpace) {
                vc.emit('deleteCommunitySpace', 'openDeleteCommunitySpaceModal', _communitySpace);
            },
            _queryCommunitySpaceMethod: function() {
                vc.component._listCommunitySpaces(DEFAULT_PAGE, DEFAULT_ROWS);
            },

            _openAddCommunityVenueModal:function(){
                vc.emit('addCommunityVenue','openAddCommunityVenueModal',{});
            },
            _openEditCommunityVenueModel:function(_communityVenue){
                if(!$that.communitySpaceManageInfo.conditions.venueId){
                    vc.toast('未选择场馆');
                    return ;
                }
                vc.emit('editCommunityVenue','openEditCommunityVenueModal',{
                    venueId:$that.communitySpaceManageInfo.conditions.venueId
                });
            },
            _openDeleteCommunityVenueModel:function(_communityVenue){
                if(!$that.communitySpaceManageInfo.conditions.venueId){
                    vc.toast('未选择场馆');
                    return ;
                }
                vc.emit('deleteCommunityVenue','openDeleteCommunityVenueModal',{
                    venueId:$that.communitySpaceManageInfo.conditions.venueId
                });
            },

            swatchVenue:function(_venue){
                $that.communitySpaceManageInfo.conditions.venueId = _venue.venueId;
                $that._listCommunitySpaces(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.communitySpaceManageInfo.moreCondition) {
                    vc.component.communitySpaceManageInfo.moreCondition = false;
                } else {
                    vc.component.communitySpaceManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);