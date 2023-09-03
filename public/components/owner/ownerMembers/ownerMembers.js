(function (vc) {
    vc.extends({
        data: {
            ownerMembersInfo: {
                members: [],
                ownerId:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerMembers', 'openOwnerMemberModel', function (_param) {
                $('#ownerMembersModel').modal('show');
                $that.ownerMembersInfo.ownerId = _param.ownerId;
                vc.component._loadOwnerMemberInfo(1, 10);
            });
            vc.on('ownerMembers', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadOwnerMemberInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadOwnerMemberInfo: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId:$that.ownerMembersInfo.ownerId 
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/owner.queryOwnerMembers',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.ownerMembersInfo.members = _roomInfo.owners;
                        vc.emit('ownerMembers', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseRoom: function (_room) {
                vc.emit($props.emitChooseRoom, 'chooseRoom', _room);
                vc.emit($props.emitLoadData, 'listRoomData', {
                    roomId: _room.roomId
                });
                $('#ownerMembersModel').modal('hide');
            },
            //查询
            ownerMemberss: function () {
                vc.component._loadAllRoomInfo(1, 15);
            },
            //重置
    
        }
    });
})(window.vc);