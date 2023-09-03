(function(vc,vm){

    vc.extends({
        data:{
            deleteMarketRuleObjInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMarketRuleObj','openDeleteMarketRuleObjModal',function(_params){

                vc.component.deleteMarketRuleObjInfo = _params;
                $('#deleteMarketRuleObjModel').modal('show');

            });
        },
        methods:{
            deleteMarketRuleObj:function(){
                vc.http.apiPost(
                    '/marketRule.deleteMarketRuleObj',
                    JSON.stringify(vc.component.deleteMarketRuleObjInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMarketRuleObjModel').modal('hide');
                            vc.emit('marketRuleObjInfo', 'listMarketRuleObj',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteMarketRuleObjModel:function(){
                $('#deleteMarketRuleObjModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
