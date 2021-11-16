(function(vc){
    vc.extends({
        propTypes: {
           emitChooseParkingBox:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseParkingBoxInfo:{
                parkingBoxs:[],
                _currentParkingBoxName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseParkingBox','openChooseParkingBoxModel',function(_param){
                $('#chooseParkingBoxModel').modal('show');
                vc.component._refreshChooseParkingBoxInfo();
                vc.component._loadAllParkingBoxInfo(1,10,'');
            });
        },
        methods:{
            _loadAllParkingBoxInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('parkingBox.listParkingBoxs',
                             param,
                             function(json){
                                var _parkingBoxInfo = JSON.parse(json);
                                vc.component.chooseParkingBoxInfo.parkingBoxs = _parkingBoxInfo.parkingBoxs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseParkingBox:function(_parkingBox){
                if(_parkingBox.hasOwnProperty('name')){
                     _parkingBox.parkingBoxName = _parkingBox.name;
                }
                vc.emit($props.emitChooseParkingBox,'chooseParkingBox',_parkingBox);
                vc.emit($props.emitLoadData,'listParkingBoxData',{
                    parkingBoxId:_parkingBox.parkingBoxId
                });
                $('#chooseParkingBoxModel').modal('hide');
            },
            queryParkingBoxs:function(){
                vc.component._loadAllParkingBoxInfo(1,10,vc.component.chooseParkingBoxInfo._currentParkingBoxName);
            },
            _refreshChooseParkingBoxInfo:function(){
                vc.component.chooseParkingBoxInfo._currentParkingBoxName = "";
            }
        }

    });
})(window.vc);
