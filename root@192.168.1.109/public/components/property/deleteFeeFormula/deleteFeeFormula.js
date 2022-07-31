(function(vc,vm){

    vc.extends({
        data:{
            deleteFeeFormulaInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteFeeFormula','openDeleteFeeFormulaModal',function(_params){

                vc.component.deleteFeeFormulaInfo = _params;
                $('#deleteFeeFormulaModel').modal('show');

            });
        },
        methods:{
            deleteFeeFormula:function(){
                vc.component.deleteFeeFormulaInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/feeFormula/deleteFeeFormula',
                    JSON.stringify(vc.component.deleteFeeFormulaInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeeFormulaModel').modal('hide');
                            vc.emit('feeFormulaManage','listFeeFormula',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteFeeFormulaModel:function(){
                $('#deleteFeeFormulaModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
