(function(vc) {

    vc.extends({
        data: {
            editPropertyCommunityInfo: {
                memberId: '',
                menuGroups: [],
                groupIds: [],
                communityId: '',
                name: '',
                isAll: true,
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editPropertyCommunity', 'openEditPropertyCommunityModal', function(_param) {
                $that.editPropertyCommunityInfo.groupIds = [];
                $that.editPropertyCommunityInfo.communityId = _param.communityId;
                $that._listEditPropertyCommunityMenuGroups();
                $that._listMenuGroupCommunity();

                $that.editPropertyCommunityInfo.memberId = _param.storeId;
                $that.editPropertyCommunityInfo.name = _param.name;
                $('#editPropertyCommunityModel').modal('show');
            });
        },
        methods: {
            updatePropertyCommunityInfo: function() {
                vc.http.apiPost(
                    '/menuGroupCommunity.updateMenuGroupCommunity',
                    JSON.stringify(vc.component.editPropertyCommunityInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPropertyCommunityModel').modal('hide');
                            vc.component.clearEditPropertyCommunityInfo();
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
            clearEditPropertyCommunityInfo: function() {
                vc.component.editPropertyCommunityInfo = {
                    storeId: '',
                    menuGroups: [],
                    groupIds: [],
                    communityId: '',
                    name: '',
                    isAll: true,
                };
            },
            changeEditAllCommunity: function() {
                $that.editPropertyCommunityInfo.groupIds = [];
                if (!$that.editPropertyCommunityInfo.isAll) {
                    $that.editPropertyCommunityInfo.isAll = true;
                    return;
                }

                $that.editPropertyCommunityInfo.menuGroups.forEach(item => {
                    //$that.editPropertyCommunityInfo.groupIds.push(item.groupId);
                    $that.editPropertyCommunityInfo.groupIds.push(item.gId);
                });
            },
            changeEditItemCommunity: function() {
                if ($that.editPropertyCommunityInfo.groupIds.length < $that.editPropertyCommunityInfo.menuGroups.length) {
                    $that.editPropertyCommunityInfo.isAll = false;
                    return;
                }
                $that.editPropertyCommunityInfo.isAll = true;

            },
            _listEditPropertyCommunityMenuGroups: function() {
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
                        $that.editPropertyCommunityInfo.menuGroups = _propertyCompanyManageInfo.data;

                        $that._listMenuGroupCommunity();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listMenuGroupCommunity: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: $that.editPropertyCommunityInfo.communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/menuGroupCommunity.listMenuGroupCommunity',
                    param,
                    function(json, res) {
                        let _propertyCompanyManageInfo = JSON.parse(json);
                        //$that.editPropertyCommunityInfo.menuGroups = _propertyCompanyManageInfo.data;

                        _propertyCompanyManageInfo.data.forEach(item => {
                            $that.editPropertyCommunityInfo.groupIds.push(item.gId);
                        })
                        $that.changeEditItemCommunity();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },


        }
    });

})(window.vc);