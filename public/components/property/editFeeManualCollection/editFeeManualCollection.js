(function(vc,vm){

    vc.extends({
        data:{
            editFeeManualCollectionInfo:{
                collectionId:'',
roomName:'',
ownerName:'',
link:'',
roomArea:'',
squarePrice:'',
remark:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editFeeManualCollection','openEditFeeManualCollectionModal',function(_params){
                vc.component.refreshEditFeeManualCollectionInfo();
                $('#editFeeManualCollectionModel').modal('show');
                vc.copyObject(_params, vc.component.editFeeManualCollectionInfo );
                vc.component.editFeeManualCollectionInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editFeeManualCollectionValidate:function(){
                        return vc.validate.validate({
                            editFeeManualCollectionInfo:vc.component.editFeeManualCollectionInfo
                        },{
                            'editFeeManualCollectionInfo.roomName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"规格不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"100",
                            errInfo:"房屋错误"
                        },
                    ],
'editFeeManualCollectionInfo.ownerName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"业主名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"100",
                            errInfo:"业主名称超过100位"
                        },
                    ],
'editFeeManualCollectionInfo.link':[
{
                            limit:"required",
                            param:"",
                            errInfo:"业主电话不能为空"
                        },
 {
                            limit:"phone",
                            param:"",
                            errInfo:"业主电话格式错误"
                        },
                    ],
'editFeeManualCollectionInfo.roomArea':[
{
                            limit:"required",
                            param:"",
                            errInfo:"房屋面积不能为空"
                        },
 {
                            limit:"money",
                            param:"",
                            errInfo:"房屋面积格式错误"
                        },
                    ],
'editFeeManualCollectionInfo.squarePrice':[
{
                            limit:"required",
                            param:"",
                            errInfo:"房屋单价不能为空"
                        },
 {
                            limit:"money",
                            param:"",
                            errInfo:"房屋单价格式错误"
                        },
                    ],
'editFeeManualCollectionInfo.remark':[
 {
                            limit:"maxLength",
                            param:"200",
                            errInfo:"备注超过200位"
                        },
                    ],
'editFeeManualCollectionInfo.collectionId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"托收ID不能为空"
                        }]

                        });
             },
            editFeeManualCollection:function(){
                if(!vc.component.editFeeManualCollectionValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'feeManualCollection.updateFeeManualCollection',
                    JSON.stringify(vc.component.editFeeManualCollectionInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editFeeManualCollectionModel').modal('hide');
                             vc.emit('feeManualCollectionManage','listFeeManualCollection',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditFeeManualCollectionInfo:function(){
                vc.component.editFeeManualCollectionInfo= {
                  collectionId:'',
roomName:'',
ownerName:'',
link:'',
roomArea:'',
squarePrice:'',
remark:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
