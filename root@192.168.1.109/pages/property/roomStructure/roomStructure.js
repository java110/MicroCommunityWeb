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
            /**
             *   2002	未销售
             *   2001	已入住
             *   2003	已交房
             *   2005	已装修
             *   2004	未入住
             *   2006	已出租
             *   2007	已出售
             *   2008	空闲
             *   2009	装修中
             * @param {*} room 
             * @returns 
             */
            _getBgColor: function(room) {
                if (room.oweAmount > 0) {
                    return "#DC3545";
                }
                if (!room.ownerName) {
                    return "#1AB394";
                }
                if (room.state == '2001') {
                    return '#1296db'
                }
                if (room.state == '2003') {
                    return '#4C8CDE'
                }
                if (room.state == '2005') {
                    return '#085DC9'
                }
                if (room.state == '2004') {
                    return '#9DBFEA'
                }
                if (room.state == '2006') {
                    return '#365A87'
                }
                if (room.state == '2007') {
                    return '#1053A8'
                }
                if (room.state == '2008') {
                    return '#4E79AF'
                }
                if (room.state == '2009') {
                    return '#5B81B1'
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