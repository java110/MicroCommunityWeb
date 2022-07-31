(function(vc,vm){

    vc.extends({
        data:{
            deleteRentingConfigInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteRentingConfig','openDeleteRentingConfigModal',function(_params){

                vc.component.deleteRentingConfigInfo = _params;
                $('#deleteRentingConfigModel').modal('show');

            });
        },
        methods:{
            deleteRentingConfig:function(){
                vc.component.deleteRentingConfigInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/renting/deleteRentingConfig',
                    JSON.stringify(vc.component.deleteRentingConfigInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteRentingConfigModel').modal('hide');
                            vc.emit('rentingConfigManage','listRentingConfig',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteRentingConfigModel:function(){
                $('#deleteRentingConfigModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
