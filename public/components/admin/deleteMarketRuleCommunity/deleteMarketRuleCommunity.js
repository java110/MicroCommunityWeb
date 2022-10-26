(function(vc,vm){

    vc.extends({
        data:{
            deleteMarketRuleCommunityInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMarketRuleCommunity','openDeleteMarketRuleCommunityModal',function(_params){

                vc.component.deleteMarketRuleCommunityInfo = _params;
                $('#deleteMarketRuleCommunityModel').modal('show');

            });
        },
        methods:{
            deleteMarketRuleCommunity:function(){
                vc.http.apiPost(
                    '/marketRule.deleteMarketRuleCommunity',
                    JSON.stringify(vc.component.deleteMarketRuleCommunityInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMarketRuleCommunityModel').modal('hide');
                            vc.emit('marketRuleCommunityInfo', 'listMarketRuleCommunity',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteMarketRuleCommunityModel:function(){
                $('#deleteMarketRuleCommunityModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
