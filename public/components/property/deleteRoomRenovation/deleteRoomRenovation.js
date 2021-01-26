(function(vc,vm){

    vc.extends({
        data:{
            deleteRoomRenovationInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteRoomRenovation','openDeleteRoomRenovationModal',function(_params){

                vc.component.deleteRoomRenovationInfo = _params;
                $('#deleteRoomRenovationModel').modal('show');

            });
        },
        methods:{
            deleteRoomRenovation:function(){
                vc.component.deleteRoomRenovationInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'roomRenovation.deleteRoomRenovation',
                    JSON.stringify(vc.component.deleteRoomRenovationInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteRoomRenovationModel').modal('hide');
                            vc.emit('roomRenovationManage','listRoomRenovation',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteRoomRenovationModel:function(){
                $('#deleteRoomRenovationModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
