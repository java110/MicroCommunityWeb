(function(vc,vm){

    vc.extends({
        data:{
            deleteConvenienceMenusInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteConvenienceMenus','openDeleteConvenienceMenusModal',function(_params){

                vc.component.deleteConvenienceMenusInfo = _params;
                $('#deleteConvenienceMenusModel').modal('show');

            });
        },
        methods:{
            deleteConvenienceMenus:function(){
                vc.component.deleteConvenienceMenusInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/convenienceMenus/deleteConvenienceMenus',
                    JSON.stringify(vc.component.deleteConvenienceMenusInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteConvenienceMenusModel').modal('hide');
                            vc.emit('convenienceMenusManage','listConvenienceMenus',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteConvenienceMenusModel:function(){
                $('#deleteConvenienceMenusModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
