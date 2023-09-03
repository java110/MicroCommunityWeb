(function (vc) {
    vc.extends({
        data: {
            resourceStoreTimesInfo: {
                timeses: [],
                resCode: '',
                totalPrice: 0.0
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('resourceStoreTimes', 'openChooseResourceStoreModel', function (_param) {
                $('#resourceStoreTimesModel').modal('show');
                vc.component._loadAllResourceStoreTimes(1, 10, _param.resCode, _param.shId);
            });
        },
        methods: {
            _loadAllResourceStoreTimes: function (_page, _row, _resCode, _shId) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        resCode: _resCode,
                        shId: _shId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreTimes.listResourceStoreTimes',
                    param,
                    function (json) {
                        let _resourceStoreInfo = JSON.parse(json);
                        $that.resourceStoreTimesInfo.timeses = _resourceStoreInfo.data;
                        let _totalPrice = 0;
                        _resourceStoreInfo.data.forEach(item => {
                            _totalPrice += parseFloat(item.totalPrice)
                        });
                        $that.resourceStoreTimesInfo.totalPrice = _totalPrice.toFixed(2);
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);