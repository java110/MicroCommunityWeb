/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roomStructureInfo: {
                rooms: [],
                parkRooms: {},
                layerRoomCount: 4,

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {

            vc.on('roomStructure', 'switchUnit', function(_param) {
                $that._loadRooms(_param.unitId)
            });

        },
        methods: {

            _loadRooms: function(_unitId) {
                $that.roomStructureInfo.rooms = [];
                $that.roomStructureInfo.parkRooms = {};
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        unitId: _unitId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet('/room.listRoomStructure',
                    param,
                    function(json, res) {
                        let listRoomData = JSON.parse(json);
                        $that.roomStructureInfo.rooms = listRoomData.data;
                        $that.supportPark();
                        $that.$forceUpdate();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getBgColor: function(room) {
                if (!room.ownerName) {
                    return "#1AB394";
                }
                if (room.oweAmount > 0) {
                    return "#DC3545";
                }
                return "#1296db"
            },
            _toSimplifyAcceptance: function(_room) {
                let _date = new Date();
                vc.saveData("JAVA110_IS_BACK", _date.getTime());
                vc.saveData('simplifyAcceptanceSearch', {
                    searchType: '1',
                    searchValue: _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum,
                    searchPlaceholder: '请输入房屋编号 楼栋-单元-房屋 如1-1-1',
                })

                vc.jumpToPage('/#/pages/property/simplifyAcceptance?tab=业务受理');

            },
            supportPark: function() {
                let _parkRooms = $that.roomStructureInfo.parkRooms;
                if ($that.roomStructureInfo.rooms.length < 1) {
                    return;
                }
                $that.roomStructureInfo.rooms.forEach(item => {
                    if (!_parkRooms.hasOwnProperty(item.layer)) {
                        _parkRooms[item.layer] = [];
                    }

                    _parkRooms[item.layer].push(item);
                });

                $that.roomStructureInfo.parkRooms = _parkRooms;

                $that.roomStructureInfo.layerRoomCount = _parkRooms[Object.keys(_parkRooms)[0]].length;
            },
            hasInParkRooms: function() {

            }

        }
    });
})(window.vc);