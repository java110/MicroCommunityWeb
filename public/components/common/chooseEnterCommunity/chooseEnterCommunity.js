(function(vc){
    let DEFAULT_PAGE = 1;
    let DEFAULT_ROW = 10;
    vc.extends({
        data:{
            navCommunityInfo: {
                _currentCommunity: {},
                communityInfos: [],
                communityInfo: [],
                errorInfo: '',
                searchCommunityName: '',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseEnterCommunity','openChooseEnterCommunityModel',function(_param){
                $('#chooseEnterCommunityModel').modal('show');
                $that.navCommunityInfo.searchCommunityName = '';
                $that.listEnterCommunity(DEFAULT_PAGE, DEFAULT_ROW);
            });
            vc.on('chooseEnterCommunity','paginationPlus', 'page_event', function (_currentPage) {
                vc.component.listEnterCommunity(_currentPage, DEFAULT_ROW);
            });
        },
        methods:{
            listEnterCommunity: function (_page, _row) {
                var param = {
                    params: {
                        _uid: '123mlkdinkldldijdhuudjdjkkd',
                        page: _page,
                        row: _row,
                        communityName: $that.navCommunityInfo.searchCommunityName
                    }
                };
                vc.http.get('nav',
                    'getCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _data = JSON.parse(json);
                            $that.navCommunityInfo.communityInfo = _data.communitys;
                            vc.emit('chooseEnterCommunity','paginationPlus', 'init', {
                                total: _data.records,
                                dataCount: _data.total,
                                currentPage: _page
                            });
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _chooseCurrentCommunity: function (_currentCommunity) {
                vc.setCurrentCommunity(_currentCommunity);
                //vm.navCommunityInfo._currentCommunity = _currentCommunity;
                //中心加载当前页
                location.reload();
            },
            _queryEnterCommunity: function () {
                $that.listEnterCommunity(DEFAULT_PAGE, DEFAULT_ROW)
            }
        }

    });
})(window.vc);
