(function(vc,vm){

    vc.extends({
        data:{
            deleteMarketBlacklistInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMarketBlacklist','openDeleteMarketBlacklistModal',function(_params){

                vc.component.deleteMarketBlacklistInfo = _params;
                $('#deleteMarketBlacklistModel').modal('show');

            });
        },
        methods:{
            deleteMarketBlacklist:function(){
                vc.http.apiPost(
                    '/marketBlacklist.deleteMarketBlacklist',
                    JSON.stringify(vc.component.deleteMarketBlacklistInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMarketBlacklistModel').modal('hide');
                            vc.emit('marketBlacklistManage','listMarketBlacklist',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteMarketBlacklistModel:function(){
                $('#deleteMarketBlacklistModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
