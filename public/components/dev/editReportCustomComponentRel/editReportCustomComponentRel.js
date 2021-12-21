(function(vc,vm){

    vc.extends({
        data:{
            editReportCustomComponentRelInfo:{
                relId:'',
componentId:'',
customId:'',
seq:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editReportCustomComponentRel','openEditReportCustomComponentRelModal',function(_params){
                vc.component.refreshEditReportCustomComponentRelInfo();
                $('#editReportCustomComponentRelModel').modal('show');
                vc.copyObject(_params, vc.component.editReportCustomComponentRelInfo );
                vc.component.editReportCustomComponentRelInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editReportCustomComponentRelValidate:function(){
                        return vc.validate.validate({
                            editReportCustomComponentRelInfo:vc.component.editReportCustomComponentRelInfo
                        },{
                            'editReportCustomComponentRelInfo.componentId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"组件ID不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"30",
                            errInfo:"组件ID不能超过30"
                        },
                    ],
'editReportCustomComponentRelInfo.customId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"报表编号不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"30",
                            errInfo:"报表编号不能超过30"
                        },
                    ],
'editReportCustomComponentRelInfo.seq':[
{
                            limit:"required",
                            param:"",
                            errInfo:"组件序号不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"11",
                            errInfo:"组件序号不能超过11"
                        },
                    ],
'editReportCustomComponentRelInfo.relId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"关系编号不能为空"
                        }]

                        });
             },
            editReportCustomComponentRel:function(){
                if(!vc.component.editReportCustomComponentRelValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'reportCustomComponentRel.updateReportCustomComponentRel',
                    JSON.stringify(vc.component.editReportCustomComponentRelInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editReportCustomComponentRelModel').modal('hide');
                             vc.emit('reportCustomComponentRelManage','listReportCustomComponentRel',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditReportCustomComponentRelInfo:function(){
                vc.component.editReportCustomComponentRelInfo= {
                  relId:'',
componentId:'',
customId:'',
seq:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
