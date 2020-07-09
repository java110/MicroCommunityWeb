(function(vc,vm){

    vc.extends({
        data:{
            deleteJobInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteJob','openDeleteJobModal',function(_params){

                vc.component.deleteJobInfo = _params;
                $('#deleteJobModel').modal('show');

            });
        },
        methods:{
            deleteJob:function(){
                //vc.component.deleteJobInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'task.deleteTask',
                    JSON.stringify(vc.component.deleteJobInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        //let data = res.data;
                        if (_json.code == 200 || _json.code == 0) {
                            //关闭model
                            $('#deleteJobModel').modal('hide');
                            vc.component.clearAddJobInfo();
                            vc.emit('jobManage', 'listJob', {});
                            return;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteJobModel:function(){
                $('#deleteJobModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
