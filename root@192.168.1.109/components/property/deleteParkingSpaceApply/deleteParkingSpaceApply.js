(function(vc,vm){

    vc.extends({
        data:{
            deleteParkingSpaceApplyInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteParkingSpaceApply','openDeleteParkingSpaceApplyModal',function(_params){

                vc.component.deleteParkingSpaceApplyInfo = _params;
                $('#deleteParkingSpaceApplyModel').modal('show');

            });
        },
        methods:{
            deleteParkingSpaceApply:function(){
                vc.component.deleteParkingSpaceApplyInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'parkingSpaceApply.deleteParkingSpaceApply',
                    JSON.stringify(vc.component.deleteParkingSpaceApplyInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteParkingSpaceApplyModel').modal('hide');
                            vc.emit('parkingSpaceApplyManage','listParkingSpaceApply',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteParkingSpaceApplyModel:function(){
                $('#deleteParkingSpaceApplyModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
