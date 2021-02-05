(function(vc,vm){

    vc.extends({
        data:{
            editQuestionAnswerInfo:{
                qaId:'',
qaType:'',
qaName:'',
startTime:'',
endTime:'',
remark:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editQuestionAnswer','openEditQuestionAnswerModal',function(_params){
                vc.component.refreshEditQuestionAnswerInfo();
                $('#editQuestionAnswerModel').modal('show');
                vc.copyObject(_params, vc.component.editQuestionAnswerInfo );
                vc.component.editQuestionAnswerInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editQuestionAnswerValidate:function(){
                        return vc.validate.validate({
                            editQuestionAnswerInfo:vc.component.editQuestionAnswerInfo
                        },{
                            'editQuestionAnswerInfo.qaType':[
{
                            limit:"required",
                            param:"",
                            errInfo:"问卷类型不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"问卷类型格式错误"
                        },
                    ],
'editQuestionAnswerInfo.qaName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"问卷名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"256",
                            errInfo:"问卷名称太长"
                        },
                    ],
'editQuestionAnswerInfo.startTime':[
{
                            limit:"required",
                            param:"",
                            errInfo:"开始时间不能为空"
                        },
 {
                            limit:"datetime",
                            param:"",
                            errInfo:"开始时间错误"
                        },
                    ],
'editQuestionAnswerInfo.endTime':[
{
                            limit:"required",
                            param:"",
                            errInfo:"结束时间不能为空"
                        },
 {
                            limit:"datetime",
                            param:"",
                            errInfo:"结束时间错误"
                        },
                    ],
'editQuestionAnswerInfo.remark':[
 {
                            limit:"maxLength",
                            param:"512",
                            errInfo:"备注太长"
                        },
                    ],
'editQuestionAnswerInfo.qaId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"问卷ID不能为空"
                        }]

                        });
             },
            editQuestionAnswer:function(){
                if(!vc.component.editQuestionAnswerValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'questionAnswer.updateQuestionAnswer',
                    JSON.stringify(vc.component.editQuestionAnswerInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editQuestionAnswerModel').modal('hide');
                             vc.emit('questionAnswerManage','listQuestionAnswer',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditQuestionAnswerInfo:function(){
                vc.component.editQuestionAnswerInfo= {
                  qaId:'',
qaType:'',
qaName:'',
startTime:'',
endTime:'',
remark:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
