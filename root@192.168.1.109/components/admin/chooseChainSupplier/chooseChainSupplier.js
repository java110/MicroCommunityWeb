(function(vc){
    vc.extends({
        propTypes: {
           emitChooseChainSupplier:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseChainSupplierInfo:{
                chainSuppliers:[],
                _currentChainSupplierName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseChainSupplier','openChooseChainSupplierModel',function(_param){
                $('#chooseChainSupplierModel').modal('show');
                vc.component._refreshChooseChainSupplierInfo();
                vc.component._loadAllChainSupplierInfo(1,10,'');
            });
        },
        methods:{
            _loadAllChainSupplierInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('chainSupplier.listChainSupplier',
                             param,
                             function(json){
                                var _chainSupplierInfo = JSON.parse(json);
                                vc.component.chooseChainSupplierInfo.chainSuppliers = _chainSupplierInfo.chainSuppliers;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseChainSupplier:function(_chainSupplier){
                if(_chainSupplier.hasOwnProperty('name')){
                     _chainSupplier.chainSupplierName = _chainSupplier.name;
                }
                vc.emit($props.emitChooseChainSupplier,'chooseChainSupplier',_chainSupplier);
                vc.emit($props.emitLoadData,'listChainSupplierData',{
                    chainSupplierId:_chainSupplier.chainSupplierId
                });
                $('#chooseChainSupplierModel').modal('hide');
            },
            queryChainSuppliers:function(){
                vc.component._loadAllChainSupplierInfo(1,10,vc.component.chooseChainSupplierInfo._currentChainSupplierName);
            },
            _refreshChooseChainSupplierInfo:function(){
                vc.component.chooseChainSupplierInfo._currentChainSupplierName = "";
            }
        }

    });
})(window.vc);
