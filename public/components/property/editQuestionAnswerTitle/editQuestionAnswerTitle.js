(function(vc,vm){

    vc.extends({
        data:{
            editQuestionAnswerTitleInfo:{
                titleId:'',
titleType:'',
qaTitle:'',
seq:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editQuestionAnswerTitle','openEditQuestionAnswerTitleModal',function(_params){
                vc.component.refreshEditQuestionAnswerTitleInfo();
                $('#editQuestionAnswerTitleModel').modal('show');
                vc.copyObject(_params, vc.component.editQuestionAnswerTitleInfo );
                vc.component.editQuestionAnswerTitleInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editQuestionAnswerTitleValidate:function(){
                        return vc.validate.validate({
                            editQuestionAnswerTitleInfo:vc.component.editQuestionAnswerTitleInfo
                        },{
                            'editQuestionAnswerTitleInfo.titleType':[
{
                            limit:"required",
                            param:"",
                            errInfo:"题目类型不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"题目类型格式错误"
                        },
                    ],
'editQuestionAnswerTitleInfo.qaTitle':[
{
                            limit:"required",
                            param:"",
                            errInfo:"问卷题目不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"256",
                            errInfo:"问卷题目太长"
                        },
                    ],
'editQuestionAnswerTitleInfo.seq':[
{
                            limit:"required",
                            param:"",
                            errInfo:"顺序不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"顺序必须是数字"
                        },
                    ],
'editQuestionAnswerTitleInfo.titleId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"题目ID不能为空"
                        }]

                        });
             },
            editQuestionAnswerTitle:function(){
                if(!vc.component.editQuestionAnswerTitleValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'questionAnswerTitle.updateQuestionAnswerTitle',
                    JSON.stringify(vc.component.editQuestionAnswerTitleInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editQuestionAnswerTitleModel').modal('hide');
                             vc.emit('questionAnswerTitleManage','listQuestionAnswerTitle',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditQuestionAnswerTitleInfo:function(){
                vc.component.editQuestionAnswerTitleInfo= {
                  titleId:'',
titleType:'',
qaTitle:'',
seq:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
