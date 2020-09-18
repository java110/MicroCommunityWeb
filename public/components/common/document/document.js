(function(vc){
    let DEFAULT_PAGE = 1;
    let DEFAULT_ROW = 10;
    vc.extends({
        data:{
            documentInfo: {
                title: '帮助文档',
                context: '非常抱歉，当前页面未配置文档'
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('document','openDocument',function(_param){
                $('#documentModal').modal('show');
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
                                currentPage: _page
                            });
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            }
        }

    });
})(window.vc);