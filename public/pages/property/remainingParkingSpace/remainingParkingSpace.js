(function (vc) {
    vc.extends({
        data: {
            remainingParkingSpaceInfo: {
                total: 0,
                freeCount: 0,
                createTime: vc.dateTimeFormat(new Date().getTime())
            }
        },
        _initMethod: function () {
            vc.component._listRemainingParkingSpaceData();
        },
        _initEvent: function () {

        },
        methods: {
            _listRemainingParkingSpaceData: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }

                //发送get请求
                vc.http.apiGet('/machineTranslate.machineGetFreeParkingSpace',
                    param,
                    function (json, res) {
                        var listParkingSpaceData = JSON.parse(json).data;

                        vc.component.remainingParkingSpaceInfo.total = listParkingSpaceData.total;
                        vc.component.remainingParkingSpaceInfo.freeCount = listParkingSpaceData.freeCount;
                        vc.component.remainingParkingSpaceInfo.createTime = vc.dateTimeFormat(new Date().getTime());
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _freshRemainingParkingSpace:function(){
                vc.component._listRemainingParkingSpaceData();
            }
        }
    })
})(window.vc);