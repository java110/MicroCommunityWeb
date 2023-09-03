(function (vc) {
    vc.extends({
        data: {
            viewOwnerSettledRoomsInfo: {
                rooms: [],
                applyId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewOwnerSettledRooms', 'openChooseItemReleaseRes', function (_param) {
                $('#viewOwnerSettledRoomsModel').modal('show');
                vc.copyObject(_param, $that.viewOwnerSettledRoomsInfo);
                vc.component._loadItemReleaseRes();
            });

        },
        methods: {
            _loadItemReleaseRes: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        applyId: vc.component.viewOwnerSettledRoomsInfo.applyId,
                    }
                };

                //发送get请求
                vc.http.apiGet('/ownerSettled.listOwnerSettledRooms',
                    param,
                    function (json) {
                        let _unitInfo = JSON.parse(json);
                        vc.component.viewOwnerSettledRoomsInfo.rooms = _unitInfo.data;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
        }

    });
})(window.vc);
