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
                total: 0,
                records: 1,
                moreCondition: false,
                spaceId: '',
                conditions: {
                    spaceId: '',
                    name: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._listCommunitySpaces(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

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
            _openAddCommunitySpaceModal: function() {
                vc.emit('addCommunitySpace', 'openAddCommunitySpaceModal', {});
            },
            _openEditCommunitySpaceModel: function(_communitySpace) {
                vc.emit('editCommunitySpace', 'openEditCommunitySpaceModal', _communitySpace);
            },
            _openDeleteCommunitySpaceModel: function(_communitySpace) {
                vc.emit('deleteCommunitySpace', 'openDeleteCommunitySpaceModal', _communitySpace);
            },
            _queryCommunitySpaceMethod: function() {
                vc.component._listCommunitySpaces(DEFAULT_PAGE, DEFAULT_ROWS);

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