(function(vc){

    vc.extends({
        propTypes: {
               callBackListener:vc.propTypes.string, //父组件名称
               callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            addClueInfo:{
                clueId:'',
                projectName:'',
projectSite:'',
projectSummary:'',
investmentAmount:'',
investmentName:'',
tel:'',
investmentSummary:'',
nowSituation:'',
nextSituation:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addClue','openAddClueModal',function(){
                $('#addClueModel').modal('show');
            });
        },
        methods:{
            addClueValidate(){
                return vc.validate.validate({
                    addClueInfo:vc.component.addClueInfo
                },{
                    'addClueInfo.projectName':[
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
'addClueInfo.projectSite':[
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
'addClueInfo.projectSummary':[
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"项目概述"
                        },
                    ],
'addClueInfo.investmentAmount':[
 {
                            limit:"maxLength",
                            param:"30",
                            errInfo:"投资额"
                        },
                    ],
'addClueInfo.investmentName':[
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
'addClueInfo.tel':[
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
'addClueInfo.investmentSummary':[
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"投资方简介"
                        },
                    ],
'addClueInfo.nowSituation':[
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"目前进展情况太长"
                        },
                    ],
'addClueInfo.nextSituation':[
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"下一步推进计划太长"
                        },
                    ],




                });
            },
            saveClueInfo:function(){
                if(!vc.component.addClueValidate()){
                    vc.toast(vc.validate.errInfo);

                    return ;
                }

                vc.component.addClueInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if(vc.notNull($props.callBackListener)){
                    vc.emit($props.callBackListener,$props.callBackFunction,vc.component.addClueInfo);
                    $('#addClueModel').modal('hide');
                    return ;
                }

                vc.http.apiPost(
                    '/clue/saveClue',
                    JSON.stringify(vc.component.addClueInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addClueModel').modal('hide');
                            vc.component.clearAddClueInfo();
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
            clearAddClueInfo:function(){
                vc.component.addClueInfo = {
                                            projectName:'',
projectSite:'',
projectSummary:'',
investmentAmount:'',
investmentName:'',
tel:'',
investmentSummary:'',
nowSituation:'',
nextSituation:'',

                                        };
            }
        }
    });

})(window.vc);
