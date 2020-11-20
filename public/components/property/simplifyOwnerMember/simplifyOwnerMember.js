(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyOwnerMemberInfo: {
                members: [],
                ownerId: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyOwnerMember', 'switch', function (_param) {
                vc.copyObject(_param, $that.simplifyOwnerMemberInfo)
                $that._listSimplifyOwnerMember(DEFAULT_PAGE, DEFAULT_ROWS);


            });
            vc.on('pagination', 'page_event',
                function (_currentPage) {
                    $that._listSimplifyOwnerMember(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listSimplifyOwnerMember: function (_param) {

                let param = {
                    params: {
                        ownerId: vc.component.simplifyOwnerMemberInfo.ownerId,
                        communityId: vc.getCurrentCommunity().communityId

                    }
                };
                //发送get请求
                vc.http.get('listOwnerMember',
                    'list',
                    param,
                    function (json) {
                        let _memberInfo = JSON.parse(json);
                        $that.simplifyOwnerMemberInfo.members = _memberInfo.owners;
                    }, function () {
                        console.log('请求失败处理');
                    });
            },
            openAddMemberModel(){
                vc.emit('addOwner','openAddOwnerModal',vc.component.simplifyOwnerMemberInfo.ownerId
                );
            },
            _openDeleteOwnerModel: function (_member) {
                _member.ownerId = vc.component.simplifyOwnerMemberInfo.ownerId;
                vc.emit('deleteOwner', 'openOwnerModel', _member);
            },
            _openEditOwnerModel: function (_member) {
                _member.ownerId = vc.component.simplifyOwnerMemberInfo.ownerId;
                vc.emit('editOwner', 'openEditOwnerModal', _member);
            },
        }

    });
})(window.vc);
