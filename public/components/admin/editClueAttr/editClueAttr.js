(function(vc,vm){

    vc.extends({
        data:{
            editClueAttrInfo:{
                attrId:'',
                clueId:'',
                nowTime:'',
                nowSituation:'',
                nextSituation:'',

            }
        },
         _initMethod:function(){
            vc.initDateTime('editNowTime', function (_value) {
                $that.editClueAttrInfo.nowTime = _value;
            });
         },
         _initEvent:function(){
             vc.on('editClueAttr','openEditClueAttrModal',function(_params){
                vc.component.refreshEditClueAttrInfo();
                $('#editClueAttrModel').modal('show');
                vc.copyObject(_params, vc.component.editClueAttrInfo );
                vc.component.editClueAttrInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editClueAttrValidate:function(){
                        return vc.validate.validate({
                            editClueAttrInfo:vc.component.editClueAttrInfo
                        },{
                            'editClueAttrInfo.nowSituation':[
{
                            limit:"required",
                            param:"",
                            errInfo:"目前进展情况不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"目前进展情况太长"
                        },
                    ],
'editClueAttrInfo.nextSituation':[
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"下一步推进计划太长"
                        },
                    ],
'editClueAttrInfo.attrId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"线索ID不能为空"
                        }]

                        });
             },
            editClueAttr:function(){
                if(!vc.component.editClueAttrValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    '/clueAttr/updateClueAttr',
                    JSON.stringify(vc.component.editClueAttrInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editClueAttrModel').modal('hide');
                             vc.emit('clueAttrManage','listClueAttr',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditClueAttrInfo:function(){
                vc.component.editClueAttrInfo= {
                  attrId:'',
                  nowTime:'',
                  clueId:'',
                    nowSituation:'',
                    nextSituation:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
