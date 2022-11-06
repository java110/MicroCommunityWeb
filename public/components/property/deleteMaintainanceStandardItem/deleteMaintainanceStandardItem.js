(function(vc,vm){

    vc.extends({
        data:{
            deleteMaintainanceStandardItemInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMaintainanceStandardItem','openDeleteMaintainanceStandardItemModal',function(_params){

                vc.component.deleteMaintainanceStandardItemInfo = _params;
                $('#deleteMaintainanceStandardItemModel').modal('show');

            });
        },
        methods:{
            deleteMaintainanceStandardItem:function(){
                vc.component.deleteMaintainanceStandardItemInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/maintainance.deleteMaintainanceStandardItem',
                    JSON.stringify(vc.component.deleteMaintainanceStandardItemInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if(_json.code == 0){
                            //关闭model
                            $('#deleteMaintainanceStandardItemModel').modal('hide');
                            vc.emit('maintainanceStandardItem', 'loadItem',$that.deleteMaintainanceStandardItemInfo);
                        
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closedeleteMaintainanceStandardItemModel:function(){
                $('#deleteMaintainanceStandardItemModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
