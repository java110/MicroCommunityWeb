(function(vc){
    vc.extends({
        propTypes: {
           emitChooseParkingSpaceApply:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseParkingSpaceApplyInfo:{
                parkingSpaceApplys:[],
                _currentParkingSpaceApplyName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseParkingSpaceApply','openChooseParkingSpaceApplyModel',function(_param){
                $('#chooseParkingSpaceApplyModel').modal('show');
                vc.component._refreshChooseParkingSpaceApplyInfo();
                vc.component._loadAllParkingSpaceApplyInfo(1,10,'');
            });
        },
        methods:{
            _loadAllParkingSpaceApplyInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('parkingSpaceApply.listParkingSpaceApplys',
                             param,
                             function(json){
                                var _parkingSpaceApplyInfo = JSON.parse(json);
                                vc.component.chooseParkingSpaceApplyInfo.parkingSpaceApplys = _parkingSpaceApplyInfo.parkingSpaceApplys;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseParkingSpaceApply:function(_parkingSpaceApply){
                if(_parkingSpaceApply.hasOwnProperty('name')){
                     _parkingSpaceApply.parkingSpaceApplyName = _parkingSpaceApply.name;
                }
                vc.emit($props.emitChooseParkingSpaceApply,'chooseParkingSpaceApply',_parkingSpaceApply);
                vc.emit($props.emitLoadData,'listParkingSpaceApplyData',{
                    parkingSpaceApplyId:_parkingSpaceApply.parkingSpaceApplyId
                });
                $('#chooseParkingSpaceApplyModel').modal('hide');
            },
            queryParkingSpaceApplys:function(){
                vc.component._loadAllParkingSpaceApplyInfo(1,10,vc.component.chooseParkingSpaceApplyInfo._currentParkingSpaceApplyName);
            },
            _refreshChooseParkingSpaceApplyInfo:function(){
                vc.component.chooseParkingSpaceApplyInfo._currentParkingSpaceApplyName = "";
            }
        }

    });
})(window.vc);
