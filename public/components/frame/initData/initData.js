(function(vc) {
    vc.extends({
        data: {
            initDataInfo: {}
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('initData', 'loadCommunityInfo', function(_param) {

                vc.component._validateHasStore(_param);
            })
        },
        methods: {
            _loadCommunityInfo: function(_param) {
                var param = {
                    params: {
                        _uId: 'ccdd00opikookjuhyyttvhnnjuuu',
                        page: 1,
                        row: 3
                    }
                };
                vc.http.apiGet('/community.listMyEnteredCommunitys',
                    param,
                    function(json, res) {
                        if (res.status == 200) {
                            var _communityInfos = JSON.parse(json).communitys;
                            if (_communityInfos != null && _communityInfos.length > 0) {
                                vc.setCurrentCommunity(_communityInfos[0]);
                                vc.setCommunitys(_communityInfos);
                            } else {
                                vc.toast('运营团队未分配小区，请联系运营团队');
                                return;
                            }
                            vc.jumpToPage(_param.url);
                        }
                    },
                    function() {
                        console.log('请求失败处理');
                        vc.jumpToPage(_param.url);
                    }
                );
            },
            _validateHasStore: function(_param) {
                var param = {
                    params: {
                        _uId: 'ccdd00opikookjuhyyttvhnnjuuu'
                    }
                };
                vc.http.get('hasCompany',
                    'check',
                    param,
                    function(json, res) {
                        if (res.status == 200) {
                            $that._loadStaffPrivileges(_param);
                            //vc.component._loadCommunityInfo(_param);
                        } else {
                            vc.toast(json);
                        }
                    },
                    function(e, res) {
                        console.log('请求失败处理', e);
                        //vc.jumpToPage(_param.url);
                        vc.toast(e);
                    }
                );
            },
            _loadStaffPrivileges: function(_param) {

                var param = {
                    params: {
                        a: 'HC'
                    }
                };
                //发送get请求
                vc.http.get('staffPrivilege',
                    'listStaffPrivileges',
                    param,
                    function(json) {
                        var _staffPrivilegeInfo = JSON.parse(json);

                        let _privilege = [];
                        _staffPrivilegeInfo.datas.forEach(item => {
                            _privilege.push(item.pId);
                        });

                        vc.saveData('hc_staff_privilege', _privilege);
                        vc.component._loadCommunityInfo(_param);
                    },
                    function() {
                        console.log('请求失败处理');
                    });
            },
        }
    });


})(window.vc);