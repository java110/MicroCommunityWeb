(function(vc,vm){

    vc.extends({
        data:{
            deleteDictInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteDict','openDeleteDictModal',function(_params){

                vc.component.deleteDictInfo = _params;
                $('#deleteDictModel').modal('show');

            });
        },
        methods:{
            deleteDict:function(){
                vc.http.apiPost(
                    '/dict.deleteDict',
                    JSON.stringify(vc.component.deleteDictInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteDictModel').modal('hide');
                            vc.emit('dictManage','listDict',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteDictModel:function(){
                $('#deleteDictModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
