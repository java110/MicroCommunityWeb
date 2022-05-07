(function(vc,vm){

    vc.extends({
        data:{
            deleteFeeComboInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteFeeCombo','openDeleteFeeComboModal',function(_params){

                vc.component.deleteFeeComboInfo = _params;
                $('#deleteFeeComboModel').modal('show');

            });
        },
        methods:{
            deleteFeeCombo:function(){
                vc.component.deleteFeeComboInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'feeCombo.deleteFeeCombo',
                    JSON.stringify(vc.component.deleteFeeComboInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeeComboModel').modal('hide');
                            vc.emit('feeComboManage','listFeeCombo',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteFeeComboModel:function(){
                $('#deleteFeeComboModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
