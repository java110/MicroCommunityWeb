/**
业主详情页面
 **/
 (function (vc) {
    var _fileUrl = '/callComponent/download/getFile/fileByObjId';
    vc.extends({
        data: {
            carDetailInfo: {
                memberId: '',
                carId:'',
                carNum:'',
                carTypeCd:'',
                carTypeCdName: '',
                carType: '',
                carTypeName: '',
                startTime: '',
                endTime: '',
                leaseType:'',
                leaseTypeName: '',    
                areaNum: '',
                num:'',
                remark:'',
                stateName:'',
                carColor:'',
                carBrand:'',
                ownerId:'',
                roomName:'',
                carNumType: '',
                paId:'',
                _currentTab: 'carDetailFee',
                needBack:false,
            }
        },
        _initMethod: function () {
            $that.carDetailInfo.memberId = vc.getParam('memberId');
            if (!vc.notNull($that.carDetailInfo.memberId)) {
                return;
            }
            vc.component._loadCarDetailInfo();
           
        },
        _initEvent: function () {
            vc.on('carDetail', 'listCarData', function (_info) {
                //vc.component._loadCarDetailInfo();
                $that.changeTab($that.carDetailInfo._currentTab);
            });
        },
        methods: {
            _loadCarDetailInfo: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        memberId: $that.carDetailInfo.memberId,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/owner.queryOwnerCars',
                    param,
                    function (json) {
                        let _carInfo = JSON.parse(json);
                        // 员工列表 和 岗位列表匹配
                        vc.copyObject(_carInfo.data[0], $that.carDetailInfo);
                        $that.changeTab($that.carDetailInfo._currentTab);
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function (_tab) {
                $that.carDetailInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    memberId: $that.carDetailInfo.memberId,
                    carId:$that.carDetailInfo.carId,
                    ownerId:$that.carDetailInfo.ownerId,
                    carNum:$that.carDetailInfo.carNum,
                    paId:$that.carDetailInfo.paId
                })
            },
            _openEditDetailOwnerCar: function () {
                vc.emit('editCar', 'openEditCar', $that.carDetailInfo);
            },
        }
    });
})(window.vc);