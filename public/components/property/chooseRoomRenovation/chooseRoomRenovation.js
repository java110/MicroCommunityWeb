(function(vc){
    vc.extends({
        propTypes: {
           emitChooseRoomRenovation:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseRoomRenovationInfo:{
                roomRenovations:[],
                _currentRoomRenovationName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseRoomRenovation','openChooseRoomRenovationModel',function(_param){
                $('#chooseRoomRenovationModel').modal('show');
                vc.component._refreshChooseRoomRenovationInfo();
                vc.component._loadAllRoomRenovationInfo(1,10,'');
            });
        },
        methods:{
            _loadAllRoomRenovationInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('roomRenovation.listRoomRenovations',
                             param,
                             function(json){
                                var _roomRenovationInfo = JSON.parse(json);
                                vc.component.chooseRoomRenovationInfo.roomRenovations = _roomRenovationInfo.roomRenovations;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseRoomRenovation:function(_roomRenovation){
                if(_roomRenovation.hasOwnProperty('name')){
                     _roomRenovation.roomRenovationName = _roomRenovation.name;
                }
                vc.emit($props.emitChooseRoomRenovation,'chooseRoomRenovation',_roomRenovation);
                vc.emit($props.emitLoadData,'listRoomRenovationData',{
                    roomRenovationId:_roomRenovation.roomRenovationId
                });
                $('#chooseRoomRenovationModel').modal('hide');
            },
            queryRoomRenovations:function(){
                vc.component._loadAllRoomRenovationInfo(1,10,vc.component.chooseRoomRenovationInfo._currentRoomRenovationName);
            },
            _refreshChooseRoomRenovationInfo:function(){
                vc.component.chooseRoomRenovationInfo._currentRoomRenovationName = "";
            }
        }

    });
})(window.vc);
