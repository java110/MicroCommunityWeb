(function(vc,vm){

    vc.extends({
        data:{
            deleteActivitiesTypeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteActivitiesType','openDeleteActivitiesTypeModal',function(_params){

                vc.component.deleteActivitiesTypeInfo = _params;
                $('#deleteActivitiesTypeModel').modal('show');

            });
        },
        methods:{
            deleteActivitiesType:function(){
                vc.component.deleteActivitiesTypeInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/activitiesType/deleteActivitiesType',
                    JSON.stringify(vc.component.deleteActivitiesTypeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteActivitiesTypeModel').modal('hide');
                            vc.emit('activitiesTypeManage','listActivitiesType',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteActivitiesTypeModel:function(){
                $('#deleteActivitiesTypeModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
