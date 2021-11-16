(function(vc,vm){

    vc.extends({
        data:{
            editClueInfo:{
                clueId:'',
projectName:'',
projectSite:'',
projectSummary:'',
investmentAmount:'',
investmentName:'',
tel:'',
investmentSummary:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editClue','openEditClueModal',function(_params){
                vc.component.refreshEditClueInfo();
                $('#editClueModel').modal('show');
                vc.copyObject(_params, vc.component.editClueInfo );
                vc.component.editClueInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editClueValidate:function(){
                        return vc.validate.validate({
                            editClueInfo:vc.component.editClueInfo
                        },{
                            'editClueInfo.projectName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"项目名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"50",
                            errInfo:"项目名称太长"
                        },
                    ],
'editClueInfo.projectSite':[
{
                            limit:"required",
                            param:"",
                            errInfo:"项目位置不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"100",
                            errInfo:"项目位置太长"
                        },
                    ],
'editClueInfo.projectSummary':[
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"项目概述"
                        },
                    ],
'editClueInfo.investmentAmount':[
 {
                            limit:"maxLength",
                            param:"30",
                            errInfo:"投资额"
                        },
                    ],
'editClueInfo.investmentName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"投资方名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"50",
                            errInfo:"投资方名称太长"
                        },
                    ],
'editClueInfo.tel':[
{
                            limit:"required",
                            param:"",
                            errInfo:"电话不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"13",
                            errInfo:"电话太长"
                        },
                    ],
'editClueInfo.investmentSummary':[
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"投资方简介"
                        },
                    ],

'editClueInfo.clueId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"线索ID不能为空"
                        }]

                        });
             },
            editClue:function(){
                if(!vc.component.editClueValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    '/clue/updateClue',
                    JSON.stringify(vc.component.editClueInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editClueModel').modal('hide');
                             vc.emit('clueManage','listClue',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditClueInfo:function(){
                vc.component.editClueInfo= {
                  clueId:'',
projectName:'',
projectSite:'',
projectSummary:'',
investmentAmount:'',
investmentName:'',
tel:'',
investmentSummary:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
