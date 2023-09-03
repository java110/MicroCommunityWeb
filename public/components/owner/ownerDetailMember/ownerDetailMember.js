/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailMemberInfo: {
                members: [],
                ownerId: '',
                name: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailMember', 'switch', function (_data) {
                $that.ownerDetailMemberInfo.ownerId = _data.ownerId;
                $that._loadOwnerDetailMemberData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailMember', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailMemberData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('ownerDetailMember', 'listOwnerData', function (_param) {
                $that._loadOwnerDetailMemberData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadOwnerDetailMemberData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.ownerDetailMemberInfo.ownerId,
                        name: $that.ownerDetailMemberInfo.name,
                    }
                };

                //发送get请求
                vc.http.apiGet('/owner.queryOwnerMembers',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailMemberInfo.members = _roomInfo.owners;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyOwnerDetailMember: function () {
                $that._loadOwnerDetailMemberData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            openAddMemberModel() {
                vc.emit('addOwner', 'openAddOwnerModal', vc.component.ownerDetailMemberInfo.ownerId);
            },
            _openDeleteOwnerModel: function (_member) {
                _member.ownerId = vc.component.ownerDetailMemberInfo.ownerId;
                vc.emit('deleteOwner', 'openOwnerModel', _member);
            },
            _openEditOwnerModel: function (_member) {
                _member.ownerId = vc.component.ownerDetailMemberInfo.ownerId;
                vc.emit('editOwner', 'openEditOwnerModal', _member);
            },

        }
    });
})(window.vc);