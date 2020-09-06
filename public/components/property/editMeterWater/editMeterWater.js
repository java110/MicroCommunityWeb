(function(vc,vm){

    vc.extends({
        data:{
            editMeterWaterInfo:{
                waterId:'',
meterType:'',
preDegrees:'',
curDegrees:'',
preReadingTime:'',
curReadingTime:'',
remark:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editMeterWater','openEditMeterWaterModal',function(_params){
                vc.component.refreshEditMeterWaterInfo();
                $('#editMeterWaterModel').modal('show');
                vc.copyObject(_params, vc.component.editMeterWaterInfo );
                vc.component.editMeterWaterInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editMeterWaterValidate:function(){
                        return vc.validate.validate({
                            editMeterWaterInfo:vc.component.editMeterWaterInfo
                        },{
                            'editMeterWaterInfo.meterType':[
{
                            limit:"required",
                            param:"",
                            errInfo:"表类型不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"表类型错误"
                        },
                    ],
'editMeterWaterInfo.preDegrees':[
{
                            limit:"required",
                            param:"",
                            errInfo:"上期度数不能为空"
                        },
 {
                            limit:"money",
                            param:"",
                            errInfo:"上期度数格式错误"
                        },
                    ],
'editMeterWaterInfo.curDegrees':[
{
                            limit:"required",
                            param:"",
                            errInfo:"本期度数不能为空"
                        },
 {
                            limit:"money",
                            param:"",
                            errInfo:"本期度数格式错误"
                        },
                    ],
'editMeterWaterInfo.preReadingTime':[
{
                            limit:"required",
                            param:"",
                            errInfo:"上期读表时间不能为空"
                        },
 {
                            limit:"date",
                            param:"",
                            errInfo:"格式错误"
                        },
                    ],
'editMeterWaterInfo.curReadingTime':[
{
                            limit:"required",
                            param:"",
                            errInfo:"本期读表时间不能为空"
                        },
 {
                            limit:"date",
                            param:"",
                            errInfo:"格式错误"
                        },
                    ],
'editMeterWaterInfo.remark':[
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"备注格式错误"
                        },
                    ],
'editMeterWaterInfo.waterId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"表ID不能为空"
                        }]

                        });
             },
            editMeterWater:function(){
                if(!vc.component.editMeterWaterValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'meterWater.updateMeterWater',
                    JSON.stringify(vc.component.editMeterWaterInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMeterWaterModel').modal('hide');
                             vc.emit('meterWaterManage','listMeterWater',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditMeterWaterInfo:function(){
                vc.component.editMeterWaterInfo= {
                  waterId:'',
meterType:'',
preDegrees:'',
curDegrees:'',
preReadingTime:'',
curReadingTime:'',
remark:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
