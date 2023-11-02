(function (vc) {
    vc.extends({
        data: {
            indexCommunityViewInfo: {
                floorCount:0,
                roomCount:0,
                shopCount:0,
                ownerCount:0,
                spaceCount:0,
                carCount:0,
            }
        },
        _initMethod: function () {
            
        },
        _initEvent: function () {
            vc.on('indexCommunityView','initData',function(){
                $that._loadPropertyIndexAssets();
            })
        },
        methods: {
            _loadPropertyIndexAssets: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/propertyIndex.queryPropertyAssetsIndex',
                    param,
                    function (json, res) {
                        let _res = JSON.parse(json);
                        if(_res.code != 0){
                            return;
                        }
                        vc.copyObject(_res.data, $that.indexCommunityViewInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                       
                    }
                );
            },
            _toOwner:function(){
                vc.jumpToPage('/#/pages/property/listOwner?tab=业主信息')
            },
            _toCar:function(){
                vc.jumpToPage('/#/pages/property/listOwnerCar?tab=业主车辆')
            }
        }
    })
})(window.vc);