(function(vc,vm){

    vc.extends({
        data:{
            deleteClassesInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteClasses','openDeleteClassesModal',function(_params){

                vc.component.deleteClassesInfo = _params;
                $('#deleteClassesModel').modal('show');

            });
        },
        methods:{
            deleteClasses:function(){
                vc.http.apiPost(
                    '/classes.deleteClasses',
                    JSON.stringify(vc.component.deleteClassesInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteClassesModel').modal('hide');
                            vc.emit('classesManage','listClasses',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteClassesModel:function(){
                $('#deleteClassesModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
