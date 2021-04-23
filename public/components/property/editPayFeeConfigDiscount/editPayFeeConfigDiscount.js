(function(vc,vm){

    vc.extends({
        data:{
            editPayFeeConfigDiscountInfo:{
                configDiscountId:'',
discountId:'',
discountId:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editPayFeeConfigDiscount','openEditPayFeeConfigDiscountModal',function(_params){
                vc.component.refreshEditPayFeeConfigDiscountInfo();
                $('#editPayFeeConfigDiscountModel').modal('show');
                vc.copyObject(_params, vc.component.editPayFeeConfigDiscountInfo );
                vc.component.editPayFeeConfigDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editPayFeeConfigDiscountValidate:function(){
                        return vc.validate.validate({
                            editPayFeeConfigDiscountInfo:vc.component.editPayFeeConfigDiscountInfo
                        },{
                            'editPayFeeConfigDiscountInfo.discountId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"折扣名称不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"折扣格式错误"
                        },
                    ],
'editPayFeeConfigDiscountInfo.discountId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"折扣名称不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"折扣格式错误"
                        },
                    ],
'editPayFeeConfigDiscountInfo.configDiscountId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"费用折扣ID不能为空"
                        }]

                        });
             },
            editPayFeeConfigDiscount:function(){
                if(!vc.component.editPayFeeConfigDiscountValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'payFeeConfigDiscount.updatePayFeeConfigDiscount',
                    JSON.stringify(vc.component.editPayFeeConfigDiscountInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPayFeeConfigDiscountModel').modal('hide');
                             vc.emit('payFeeConfigDiscountManage','listPayFeeConfigDiscount',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditPayFeeConfigDiscountInfo:function(){
                vc.component.editPayFeeConfigDiscountInfo= {
                  configDiscountId:'',
discountId:'',
discountId:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
