(function(vc){

    vc.extends({
        propTypes: {
               callBackListener:vc.propTypes.string, //父组件名称
               callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            addJunkRequirementInfo:{
                junkRequirementId:'',
                classification:'',
inspectionPlanId:'',
context:'',
referencePrice:'',
publishUserName:'',
publishUserLink:'',
state:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addJunkRequirement','openAddJunkRequirementModal',function(){
                $('#addJunkRequirementModel').modal('show');
            });
        },
        methods:{
            addJunkRequirementValidate(){
                return vc.validate.validate({
                    addJunkRequirementInfo:vc.component.addJunkRequirementInfo
                },{
                    'addJunkRequirementInfo.classification':[
{
                            limit:"required",
                            param:"",
                            errInfo:"类别不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"任务编码格式错误"
                        },
                    ],
'addJunkRequirementInfo.inspectionPlanId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"巡检计划不能为空"
                        },
 {
                            limit:"maxin",
                            param:"1,100",
                            errInfo:"收费项目不能超过100位"
                        },
                    ],
'addJunkRequirementInfo.context':[
{
                            limit:"required",
                            param:"",
                            errInfo:"内容不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"200",
                            errInfo:"内容不能超过200个字符"
                        },
                    ],
'addJunkRequirementInfo.referencePrice':[
{
                            limit:"required",
                            param:"",
                            errInfo:"参考价格不能为空"
                        },
 {
                            limit:"money",
                            param:"",
                            errInfo:"参考价格格式错误"
                        },
                    ],
'addJunkRequirementInfo.publishUserName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"发布人不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"50",
                            errInfo:"发布人不能超过50"
                        },
                    ],
'addJunkRequirementInfo.publishUserLink':[
{
                            limit:"required",
                            param:"",
                            errInfo:"联系方式不能为空"
                        },
 {
                            limit:"phone",
                            param:"",
                            errInfo:"联系方式不是有效的电话格式"
                        },
                    ],
'addJunkRequirementInfo.state':[
{
                            limit:"required",
                            param:"",
                            errInfo:"状态不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"状态格式错误"
                        },
                    ],




                });
            },
            saveJunkRequirementInfo:function(){
                if(!vc.component.addJunkRequirementValidate()){
                    vc.toast(vc.validate.errInfo);

                    return ;
                }

                vc.component.addJunkRequirementInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if(vc.notNull($props.callBackListener)){
                    vc.emit($props.callBackListener,$props.callBackFunction,vc.component.addJunkRequirementInfo);
                    $('#addJunkRequirementModel').modal('hide');
                    return ;
                }

                vc.http.apiPost(
                    'junkRequirement.saveJunkRequirement',
                    JSON.stringify(vc.component.addJunkRequirementInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#addJunkRequirementModel').modal('hide');
                            vc.component.clearAddJunkRequirementInfo();
                            vc.emit('junkRequirementManage','listJunkRequirement',{});

                            return ;
                        }
                        vc.message(json);

                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);

                     });
            },
            clearAddJunkRequirementInfo:function(){
                vc.component.addJunkRequirementInfo = {
                                            classification:'',
inspectionPlanId:'',
context:'',
referencePrice:'',
publishUserName:'',
publishUserLink:'',
state:'',

                                        };
            }
        }
    });

})(window.vc);
