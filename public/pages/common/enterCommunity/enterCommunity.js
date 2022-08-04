/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            communityInfo: {
                enterCommunityInfo: [],
                showPage: 'myCommunity'
            }
        },
        _initMethod: function () {
            vc.component.listMyCommunity();
        },
        _initEvent: function () {
            vc.on('enterCommunity', 'listMyCommunity', function (_param) {
                vc.component.listMyCommunity();
            });
        },
        methods: {
            listMyCommunity: function () {
                var param = {
                    params: {
                        msg: this.message,
                        _sb: '123',
                        communityId: vc.getCurrentCommunity().communityId
                    }
                    //发送get请求
                vc.http.apiGet('/communitys/queryStoreCommunitys',
                    param,
                    function(json, res) {
                        vc.component.communityInfo.enterCommunityInfo = JSON.parse(json).data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openEnterCommunityModal: function () {
                vc.emit('storeEnterCommunity', 'openStoreEnterCommunity', {});
            },
            _openExitCommunityModel: function (_community) {
                vc.emit('storeExitCommunity', 'openStoreExitCommunityModal', _community);
            },
            _openUpdateCommunityModel: function (_community) {
                vc.emit('editCommunityArea', 'openEditCommunityModal', _community);
            },
            _showCommunityStatus(_statusCd) {
                if (_statusCd == '1000') {
                    return "入驻审核";
                } else if (_statusCd == '1200') {
                    return "入驻失败";
                } else if (_statusCd == '1100') {
                    return "入驻成功";
                }
                return "未知";
            },
            _showHcUse: function () {
                $that.communityInfo.showPage = "hcUse"
            },
            _goBack: function () {
                $that.communityInfo.showPage = 'myCommunity';
            }
        }
    });
})(window.vc);