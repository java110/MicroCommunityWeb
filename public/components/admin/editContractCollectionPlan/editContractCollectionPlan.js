(function(vc,vm){

    vc.extends({
        data:{
            editContractCollectionPlanInfo:{
                planId:'',
planName:'',
contractCode:'',
feeName:'',
remark:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editContractCollectionPlan','openEditContractCollectionPlanModal',function(_params){
                vc.component.refreshEditContractCollectionPlanInfo();
                $('#editContractCollectionPlanModel').modal('show');
                vc.copyObject(_params, vc.component.editContractCollectionPlanInfo );
                vc.component.editContractCollectionPlanInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editContractCollectionPlanValidate:function(){
                        return vc.validate.validate({
                            editContractCollectionPlanInfo:vc.component.editContractCollectionPlanInfo
                        },{
                            'editContractCollectionPlanInfo.planName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"计划名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"128",
                            errInfo:"计划名称太长"
                        },
                    ],
'editContractCollectionPlanInfo.contractCode':[
{
                            limit:"required",
                            param:"",
                            errInfo:"合同号不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"30",
                            errInfo:"合同号格式错误"
                        },
                    ],
'editContractCollectionPlanInfo.feeName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"费用不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"128",
                            errInfo:"费用不正确"
                        },
                    ],
'editContractCollectionPlanInfo.remark':[
 {
                            limit:"maxLength",
                            param:"512",
                            errInfo:"备注太长"
                        },
                    ],
'editContractCollectionPlanInfo.planId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"计划ID不能为空"
                        }]

                        });
             },
            editContractCollectionPlan:function(){
                if(!vc.component.editContractCollectionPlanValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'contractCollectionPlan.updateContractCollectionPlan',
                    JSON.stringify(vc.component.editContractCollectionPlanInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editContractCollectionPlanModel').modal('hide');
                             vc.emit('contractCollectionPlanManage','listContractCollectionPlan',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditContractCollectionPlanInfo:function(){
                vc.component.editContractCollectionPlanInfo= {
                  planId:'',
planName:'',
contractCode:'',
feeName:'',
remark:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
