(function (vc) {
    vc.extends({
        data: {
            initDataInfo: {}
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('initData', 'loadCommunityInfo', function (_param) {
                vc.component._validateHasStore(_param);
            })
        },
        methods: {
            _loadCommunityInfo: function (_param) {
                var param = {
                    params:{
                        _uId:'ccdd00opikookjuhyyttvhnnjuuu',
                        page:1,
                        row:3
                    }
                };
                vc.http.get('initData',
                    'getCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            var _communityInfos = JSON.parse(json).communitys;
                            if (_communityInfos != null && _communityInfos.length > 0) {
                                vc.setCurrentCommunity(_communityInfos[0]);
                                vc.setCommunitys(_communityInfos);
                            }
                            vc.jumpToPage(_param.url);
                        }
                    }, function () {
                        console.log('请求失败处理');
                        vc.jumpToPage(_param.url);
                    }
                );
            },
            _validateHasStore: function (_param) {
                console.log("_param",_param);
                var param = {
                    params:{
                        _uId:'ccdd00opikookjuhyyttvhnnjuuu'
                    }
                };
                vc.http.get('hasCompany',
                    'check',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            vc.component._loadCommunityInfo(_param);
                        }else{
                            vc.jumpToPage("/initCompany.html#/company");
                        }
                    }, function (e) {
                        console.log('请求失败处理',e);
                        //vc.jumpToPage(_param.url);
                        vc.jumpToPage("/initCompany.html#/company");
                    }
                );
            }
        }
    });


})(window.vc);