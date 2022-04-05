/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carStructureInfo: {
                cars: [],

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {

            vc.on('carStructure', 'switchUnit', function(_param) {
                $that._loadCars(_param.unitId)
            });

        },
        methods: {

            _loadCars: function(_unitId) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        unitId: _unitId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet('/car.listCarStructure',
                    param,
                    function(json, res) {
                        let listCarData = JSON.parse(json);
                        $that.carStructureInfo.cars = listCarData.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getBgColor: function(car) {
                if (!car.ownerName) {
                    return "#1AB394";
                }
                if (car.oweAmount > 0) {
                    return "#DC3545";
                }
                return "#1296db"
            },
            _toSimplifyAcceptance: function(_car) {
                let _date = new Date();
                vc.saveData("JAVA110_IS_BACK", _date.getTime());
                vc.saveData('simplifyAcceptanceSearch', {
                    searchType: '1',
                    searchValue: _car.floorNum + "-" + _car.unitNum + "-" + _car.roomNum,
                    searchPlaceholder: '请输入房屋编号 楼栋-单元-房屋 如1-1-1',
                })

                vc.jumpToPage('/#/pages/property/simplifyAcceptance?tab=业务受理');

            }

        }
    });
})(window.vc);