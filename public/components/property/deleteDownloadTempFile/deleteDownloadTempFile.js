(function(vc,vm){

    vc.extends({
        data:{
            deteteDownloadTempFileInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deteteDownloadTempFile','openDeteteDownloadTempFileModal',function(_params){

                vc.component.deteteDownloadTempFileInfo = _params;
                $('#deteteDownloadTempFileModel').modal('show');

            });
        },
        methods:{
            deteteDownloadTempFile:function(){
                vc.component.deteteDownloadTempFileInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/userDownloadFile.deleteUserDownloadFile',
                    JSON.stringify(vc.component.deteteDownloadTempFileInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deteteDownloadTempFileModel').modal('hide');
                            vc.emit('downloadTempFile', 'listFile',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeteteDownloadTempFileModel:function(){
                $('#deteteDownloadTempFileModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
