(function(vc){
    vc.extends({
        data:{
            exitRoomInfo:{}
        },
        _initEvent:function(){
             vc.on('ownerExitRoom','openExitRoomModel',function(_roomInfo){
                    vc.component.exitRoomInfo = _roomInfo;
                    $('#exitRoomModel').modal('show');
                });
        },
        methods:{
            closeExitRoomModel:function(){
                $('#exitRoomModel').modal('hide');
            },
            doOwnerExitRoom:function(){

                vc.component.exitRoomInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/room.exitRoom',
                    JSON.stringify(vc.component.exitRoomInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if(_json.code == 0){
                            //关闭model
                            $('#exitRoomModel').modal('hide');
                            vc.emit('showOwnerRoom','notify',vc.component.exitRoomInfo);
                            vc.emit('ownerDetailRoom','notify',vc.component.exitRoomInfo);

                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                     });
            }
        }
    });
})(window.vc);