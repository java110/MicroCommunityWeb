/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractDetailOwnerInfo: {
                owners: [],
                ownerId: '',
                
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('contractDetailOwner', 'switch', function (_data) {
                $that.contractDetailOwnerInfo.ownerId = _data.ownerId;
                $that._loadContractDetailOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('contractDetailOwner', 'notify',
                function (_data) {
                    $that._loadContractDetailOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('contractDetailOwner', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadContractDetailOwnerData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadContractDetailOwnerData: function (_page, _row) {
                let param = {
                    params: {
                        ownerId: $that.contractDetailOwnerInfo.ownerId,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerTypeCd: '1001',
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/owner.queryOwners',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.contractDetailOwnerInfo.owners = _roomInfo.owners;
                        vc.emit('contractDetailOwner', 'paginationPlus', 'init', {
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
            //查询
            _qureyContractDetailOwner: function () {
                $that._loadContractDetailOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewOwnerRooms: function (_owner) {
                vc.emit('ownerRooms', 'openOwnerRoomModel', _owner);
            },
            _viewOwnerMembers: function (_owner) {
                vc.emit('ownerMembers', 'openOwnerMemberModel', _owner);
            },

            _viewOwnerCars: function (_owner) {
                vc.emit('ownerCars', 'openOwnerCarModel', _owner);
            },
            _viewComplaints: function (_owner) {
                vc.emit('ownerComplaints', 'openOwnerComplaintModel', _owner);
            },
            _viewRepairs: function (_owner) {
                vc.emit('ownerRepairs', 'openOwnerRepairModel', _owner);
            },
            _viewOweFees: function (_owner) {
                vc.emit('ownerOweFees', 'openOwnerOweFeeModel', _owner);
            },
            _viewRoomContracts: function (_owner) {
                vc.emit('roomContracts', 'openRoomContractModel', _owner);
            },
            _viewOwnerFace: function (_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            },
        }
    });
})(window.vc);