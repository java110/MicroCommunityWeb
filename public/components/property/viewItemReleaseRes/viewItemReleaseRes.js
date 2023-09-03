(function (vc) {
    vc.extends({
        data: {
            viewItemReleaseResInfo: {
                resNames: [],
                irId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewItemReleaseRes', 'openChooseItemReleaseRes', function (_param) {
                $('#viewItemReleaseResModel').modal('show');
                vc.copyObject(_param, $that.viewItemReleaseResInfo);
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
                        irId: vc.component.viewItemReleaseResInfo.irId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/itemRelease.listItemReleaseRes',
                    param,
                    function (json) {
                        let _unitInfo = JSON.parse(json);
                        vc.component.viewItemReleaseResInfo.resNames = _unitInfo.data;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);
