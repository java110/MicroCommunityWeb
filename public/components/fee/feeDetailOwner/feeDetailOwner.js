/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailOwnerInfo: {
                owners: [],
                ownerId:'',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('feeDetailOwner', 'switch', function (_data) {
                if(!_data.ownerId){
                    return;
                }
                $that.feeDetailOwnerInfo.ownerId = _data.ownerId;
                $that._loadFeeDetailOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailOwner', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadFeeDetailOwnerData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('feeDetailOwner', 'notify', function (_data) {
                $that._loadFeeDetailOwnerData(DEFAULT_PAGE,DEFAULT_ROWS);
            })
        },
        methods: {
            _loadFeeDetailOwnerData: function (_page, _row) {
                let param = {
                    params: {
                        ownerId: $that.feeDetailOwnerInfo.ownerId,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerTypeCd: '1001',
                        page:_page,
                        row:_row
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/owner.queryOwners',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.feeDetailOwnerInfo.owners = _roomInfo.owners;
                        vc.emit('feeDetailOwner', 'paginationPlus', 'init', {
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
            _qureyFeeDetailOwner: function () {
                $that._loadFeeDetailOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
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