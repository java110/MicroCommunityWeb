(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseOwner: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            searchOwnerInfo: {
                owners: [],
                _currentOwnerName: '',
                roomName: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('searchOwner', 'openSearchOwnerModel', function (_param) {
                $('#searchOwnerModel').modal('show');
                vc.component._refreshSearchOwnerData();
                vc.component._loadAllOwnerInfo(1, 10);
            });
            vc.on('searchOwner', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadAllOwnerInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadAllOwnerInfo: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        name: vc.component.searchOwnerInfo._currentOwnerName.trim(),
                        roomName: vc.component.searchOwnerInfo.roomName.trim(),
                        ownerTypeCd: '1001'
                    }
                };
                //发送get请求
                vc.http.apiGet('/owner.queryOwners',
                    param,
                    function (json) {
                        var _ownerInfo = JSON.parse(json);
                        vc.component.searchOwnerInfo.owners = _ownerInfo.owners;
                        vc.emit('searchOwner', 'paginationPlus', 'init', {
                            total: _ownerInfo.records,
                            dataCount: _ownerInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseOwner: function (_owner) {
                vc.emit($props.emitChooseOwner, 'chooseOwner', _owner);
                vc.emit($props.emitLoadData, 'listOwnerData', {
                    ownerId: _owner.ownerId
                });
                $('#searchOwnerModel').modal('hide');
            },
            //查询
            searchOwners: function () {
                vc.component._loadAllOwnerInfo(1, 10, vc.component.searchOwnerInfo._currentOwnerName);
            },
            //重置
            resetOwners: function () {
                vc.component.searchOwnerInfo.roomName = "";
                vc.component.searchOwnerInfo._currentOwnerName = "";
                vc.component._loadAllOwnerInfo(1, 10, vc.component.searchOwnerInfo._currentOwnerName);
            },
            _refreshSearchOwnerData: function () {
                vc.component.searchOwnerInfo._currentOwnerName = "";
            }
        }
    });
})(window.vc);