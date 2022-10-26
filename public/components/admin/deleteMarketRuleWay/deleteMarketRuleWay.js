(function(vc,vm){

    vc.extends({
        data:{
            deleteMarketRuleWayInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMarketRuleWay','openDeleteMarketRuleWayModal',function(_params){

                vc.component.deleteMarketRuleWayInfo = _params;
                $('#deleteMarketRuleWayModel').modal('show');

            });
        },
        methods:{
            deleteMarketRuleWay:function(){
                vc.http.apiPost(
                    '/marketRule.deleteMarketRuleWay',
                    JSON.stringify(vc.component.deleteMarketRuleWayInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMarketRuleWayModel').modal('hide');
                            vc.emit('marketRuleWayInfo', 'listMarketRuleWay',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteMarketRuleWayModel:function(){
                $('#deleteMarketRuleWayModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
