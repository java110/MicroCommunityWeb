/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            selectStaffCommunityInfo: {
                communitys: [],
                communityId: '',
            }
        },
        _initMethod: function () {
            $that._loadStaffCommunitys();

            let _community =  vc.getCurrentCommunity();
            $that.selectStaffCommunityInfo.communityId = _community.communityId;
        },
        _initEvent: function () {

        },
        methods: {
            _loadStaffCommunitys: function () {
                let param = {
                    params: {
                        _uid: '123mlkdinkldldijdhuudjdjkkd',
                        page: 1,
                        row: 100,
                    }
                };
                vc.http.apiGet('/community.listMyEnteredCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _data = JSON.parse(json);
                            $that.selectStaffCommunityInfo.communitys = _data.communitys;
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _swatchStaffCommunity: function (_community) {
                $that.selectStaffCommunityInfo.communityId = _community.communityId;
                //todo 切换小区
                
                vc.emit('selectStaffCommunity','changeCommunity',_community);
            }
        }
    });
})(window.vc);