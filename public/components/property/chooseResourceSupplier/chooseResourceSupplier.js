(function(vc){
    vc.extends({
        propTypes: {
           emitChooseResourceSupplier:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseResourceSupplierInfo:{
                resourceSuppliers:[],
                _currentResourceSupplierName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseResourceSupplier','openChooseResourceSupplierModel',function(_param){
                $('#chooseResourceSupplierModel').modal('show');
                vc.component._refreshChooseResourceSupplierInfo();
                vc.component._loadAllResourceSupplierInfo(1,10,'');
            });
        },
        methods:{
            _loadAllResourceSupplierInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('resourceSupplier.listResourceSuppliers',
                             param,
                             function(json){
                                var _resourceSupplierInfo = JSON.parse(json);
                                vc.component.chooseResourceSupplierInfo.resourceSuppliers = _resourceSupplierInfo.resourceSuppliers;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseResourceSupplier:function(_resourceSupplier){
                if(_resourceSupplier.hasOwnProperty('name')){
                     _resourceSupplier.resourceSupplierName = _resourceSupplier.name;
                }
                vc.emit($props.emitChooseResourceSupplier,'chooseResourceSupplier',_resourceSupplier);
                vc.emit($props.emitLoadData,'listResourceSupplierData',{
                    resourceSupplierId:_resourceSupplier.resourceSupplierId
                });
                $('#chooseResourceSupplierModel').modal('hide');
            },
            queryResourceSuppliers:function(){
                vc.component._loadAllResourceSupplierInfo(1,10,vc.component.chooseResourceSupplierInfo._currentResourceSupplierName);
            },
            _refreshChooseResourceSupplierInfo:function(){
                vc.component.chooseResourceSupplierInfo._currentResourceSupplierName = "";
            }
        }

    });
})(window.vc);
