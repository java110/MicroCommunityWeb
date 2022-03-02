(function(vc) {

    vc.extends({
        data: {
            addPropertyCommunityInfo: {
                memberId: '',
                menuGroups: [],
                groupIds: [],
                communitys: [],
                communityIds: [],
                isAll: true,
            }
        },
        watch: {
            'addPropertyCommunityInfo.communitys': function() { //'goodList'是我要渲染的对象，也就是我要等到它渲染完才能调用函数
                this.$nextTick(function() {
                    $('#communityCommunityIds').selectpicker({
                        title: '选填，请选择开通小区',
                        styleBase: 'form-control',
                        width: 'auto'
                    });
                })
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addPropertyCommunity', 'openAddPropertyCommunityModal', function(_param) {
                $that._listPropertyCommunityMenuGroups();
                $that._listCommunityFreeCommunitys();
                $that.addPropertyCommunityInfo.memberId = _param.storeId;
                $('#addPropertyCommunityModel').modal('show');
            });
        },
        methods: {
            savePropertyCommunityInfo: function() {
                vc.http.apiPost(
                    '/member.join.community',
                    JSON.stringify(vc.component.addPropertyCommunityInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPropertyCommunityModel').modal('hide');
                            vc.component.clearAddPropertyCommunityInfo();
                            vc.emit('propertyCommunity', 'listCommunity', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddPropertyCommunityInfo: function() {
                vc.component.addPropertyCommunityInfo = {
                    storeId: '',
                    menuGroups: [],
                    groupIds: [],
                    communitys: [],
                    communityIds: [],
                    isAll: true,
                };
            },
            changeAllCommunity: function() {
                $that.addPropertyCommunityInfo.groupIds = [];
                if (!$that.addPropertyCommunityInfo.isAll) {
                    return;
                }

                $that.addPropertyCommunityInfo.menuGroups.forEach(item => {
                    $that.addPropertyCommunityInfo.groupIds.push(item.groupId);
                });
            },
            changeItemCommunity: function() {
                if ($that.addPropertyCommunityInfo.groupIds.length < $that.addPropertyCommunityInfo.menuGroups.length) {
                    $that.addPropertyCommunityInfo.isAll = false;
                    return;
                }
                $that.addPropertyCommunityInfo.isAll = true;

            },
            _listPropertyCommunityMenuGroups: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        storeType: '800900000003'
                    }
                };

                //发送get请求
                vc.http.apiGet('/menuGroup.listMenuGroup',
                    param,
                    function(json, res) {
                        let _propertyCompanyManageInfo = JSON.parse(json);
                        $that.addPropertyCommunityInfo.menuGroups = _propertyCompanyManageInfo.data;

                        _propertyCompanyManageInfo.data.forEach(item => {
                            $that.addPropertyCommunityInfo.groupIds.push(item.gId)
                        })

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listCommunityFreeCommunitys: function() {
                let param = {
                        params: {
                            communityName: ''
                        }
                    }
                    //发送get请求
                vc.http.get('storeEnterCommunity',
                    'listNoEnterCommunity',
                    param,
                    function(json, res) {
                        vc.component.addPropertyCommunityInfo.communitys = JSON.parse(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);