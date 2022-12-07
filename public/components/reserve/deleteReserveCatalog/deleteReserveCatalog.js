(function(vc,vm){

    vc.extends({
        data:{
            deleteReserveCatalogInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteReserveCatalog','openDeleteReserveCatalogModal',function(_params){

                vc.component.deleteReserveCatalogInfo = _params;
                $('#deleteReserveCatalogModel').modal('show');

            });
        },
        methods:{
            deleteReserveCatalog:function(){
                vc.component.deleteReserveCatalogInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/reserve.deleteReserveCatalog',
                    JSON.stringify(vc.component.deleteReserveCatalogInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteReserveCatalogModel').modal('hide');
                            vc.emit('reserveCatalogManage','listReserveCatalog',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteReserveCatalogModel:function(){
                $('#deleteReserveCatalogModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
