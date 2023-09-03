(function(vc,vm){

    vc.extends({
        data:{
            deleteMaintainanceStandardInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMaintainanceStandard','openDeleteMaintainanceStandardModal',function(_params){

                vc.component.deleteMaintainanceStandardInfo = _params;
                $('#deleteMaintainanceStandardModel').modal('show');

            });
        },
        methods:{
            deleteMaintainanceStandard:function(){
                vc.component.deleteMaintainanceStandardInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/maintainance.deleteMaintainanceStandard',
                    JSON.stringify(vc.component.deleteMaintainanceStandardInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMaintainanceStandardModel').modal('hide');
                            vc.emit('maintainanceStandardManage','listMaintainanceStandard',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteMaintainanceStandardModel:function(){
                $('#deleteMaintainanceStandardModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
