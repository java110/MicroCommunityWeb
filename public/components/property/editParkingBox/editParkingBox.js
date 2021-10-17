(function(vc,vm){

    vc.extends({
        data:{
            editParkingBoxInfo:{
                boxId:'',
boxName:'',
tempCarIn:'',
fee:'',
blueCarIn:'',
yelowCarIn:'',
remark:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editParkingBox','openEditParkingBoxModal',function(_params){
                vc.component.refreshEditParkingBoxInfo();
                $('#editParkingBoxModel').modal('show');
                vc.copyObject(_params, vc.component.editParkingBoxInfo );
                vc.component.editParkingBoxInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editParkingBoxValidate:function(){
                        return vc.validate.validate({
                            editParkingBoxInfo:vc.component.editParkingBoxInfo
                        },{
                            'editParkingBoxInfo.boxName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"岗亭名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"64",
                            errInfo:"岗亭名称不能超过64"
                        },
                    ],
'editParkingBoxInfo.tempCarIn':[
{
                            limit:"required",
                            param:"",
                            errInfo:"临时车是否进场不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"12",
                            errInfo:"临时车是否进场不能超过12"
                        },
                    ],
'editParkingBoxInfo.fee':[
{
                            limit:"required",
                            param:"",
                            errInfo:"是否收费不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"12",
                            errInfo:"岗亭是否不能超过12"
                        },
                    ],
'editParkingBoxInfo.blueCarIn':[
{
                            limit:"required",
                            param:"",
                            errInfo:"蓝牌车进场不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"12",
                            errInfo:"蓝牌车是否可以进场不能超过12"
                        },
                    ],
'editParkingBoxInfo.yelowCarIn':[
{
                            limit:"required",
                            param:"",
                            errInfo:"黄牌车进场不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"12",
                            errInfo:"黄牌车是否可以进场不能超过12"
                        },
                    ],
'editParkingBoxInfo.remark':[
{
                            limit:"required",
                            param:"",
                            errInfo:"备注不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"300",
                            errInfo:"备注不能超过300"
                        },
                    ],
'editParkingBoxInfo.boxId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"岗亭ID不能为空"
                        }]

                        });
             },
            editParkingBox:function(){
                if(!vc.component.editParkingBoxValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'parkingBox.updateParkingBox',
                    JSON.stringify(vc.component.editParkingBoxInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editParkingBoxModel').modal('hide');
                             vc.emit('parkingBoxManage','listParkingBox',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditParkingBoxInfo:function(){
                vc.component.editParkingBoxInfo= {
                  boxId:'',
boxName:'',
tempCarIn:'',
fee:'',
blueCarIn:'',
yelowCarIn:'',
remark:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
