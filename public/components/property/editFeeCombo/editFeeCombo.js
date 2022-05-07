(function(vc,vm){

    vc.extends({
        data:{
            editFeeComboInfo:{
                comboId:'',
comboName:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editFeeCombo','openEditFeeComboModal',function(_params){
                vc.component.refreshEditFeeComboInfo();
                $('#editFeeComboModel').modal('show');
                vc.copyObject(_params, vc.component.editFeeComboInfo );
                vc.component.editFeeComboInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editFeeComboValidate:function(){
                        return vc.validate.validate({
                            editFeeComboInfo:vc.component.editFeeComboInfo
                        },{
                            'editFeeComboInfo.comboName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"套餐名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"30",
                            errInfo:"套餐名称不能超过30"
                        },
                    ],
'editFeeComboInfo.comboId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"编号不能为空"
                        }]

                        });
             },
            editFeeCombo:function(){
                if(!vc.component.editFeeComboValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'feeCombo.updateFeeCombo',
                    JSON.stringify(vc.component.editFeeComboInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editFeeComboModel').modal('hide');
                             vc.emit('feeComboManage','listFeeCombo',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditFeeComboInfo:function(){
                vc.component.editFeeComboInfo= {
                  comboId:'',
comboName:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
