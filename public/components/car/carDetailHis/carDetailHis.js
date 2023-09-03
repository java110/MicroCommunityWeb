/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carDetailHisInfo: {
                cars: [],
                carId: '',
                memberId:'',
                carNum:'',
                carNumLike:'',
                logStartTime:'',
                logEndTime:'',
                paId:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('carDetailHis', 'switch', function (_data) {
                $that.carDetailHisInfo.carId = _data.carId;
                $that.carDetailHisInfo.carNum = _data.carNum;
                $that.carDetailHisInfo.paId = _data.paId;
                $that.carDetailHisInfo.memberId = _data.memberId;
                $that.carDetailHisInfo.carNumLike = _data.carNumLike;
                $that.carDetailHisInfo.logStartTime = _data.logStartTime;
                $that.carDetailHisInfo.logEndTime = _data.logEndTime;
                $that._loadCarDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('carDetailHis', 'notify',
                function (_data) {
                    $that._loadCarDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('carDetailHis', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadCarDetailHisData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadCarDetailHisData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        carNum: $that.carDetailHisInfo.carNum,
                        carNumLike:$that.carDetailHisInfo.carNumLike,
                        logStartTime:$that.carDetailHisInfo.logStartTime,
                        logEndTime:$that.carDetailHisInfo.logEndTime,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/car.queryHisOwnerCar',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.carDetailHisInfo.cars = _roomInfo.data;
                        vc.emit('carDetailHis', 'paginationPlus', 'init', {
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
            _qureyCarDetailHis: function () {
                $that._loadCarDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
            },

            _getHisOperate:function(_car){
                let _carCount = 0;
                $that.carDetailHisInfo.cars.forEach(item => {
                    if(_car.bId == item.bId){
                        _carCount += 1;
                    }
                });

                if(_carCount <= 1){
                    if(_car.operate == 'ADD'){
                        return '添加';
                    }
                    if(_car.operate == 'DEL'){
                        return '删除';
                    }
                    return "-"
                }

                if(_car.operate == 'ADD'){
                    return '修改(新)';
                }
                if(_car.operate == 'DEL'){
                    return '修改(旧)';
                }

                return "-"
            }
        }
    });
})(window.vc);