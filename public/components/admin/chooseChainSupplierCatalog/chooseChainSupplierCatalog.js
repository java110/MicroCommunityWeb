(function(vc){
    vc.extends({
        propTypes: {
           emitChooseChainSupplierCatalog:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseChainSupplierCatalogInfo:{
                chainSupplierCatalogs:[],
                _currentChainSupplierCatalogName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseChainSupplierCatalog','openChooseChainSupplierCatalogModel',function(_param){
                $('#chooseChainSupplierCatalogModel').modal('show');
                vc.component._refreshChooseChainSupplierCatalogInfo();
                vc.component._loadAllChainSupplierCatalogInfo(1,10,'');
            });
        },
        methods:{
            _loadAllChainSupplierCatalogInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('chainSupplierCatalog.listChainSupplierCatalogs',
                             param,
                             function(json){
                                var _chainSupplierCatalogInfo = JSON.parse(json);
                                vc.component.chooseChainSupplierCatalogInfo.chainSupplierCatalogs = _chainSupplierCatalogInfo.chainSupplierCatalogs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseChainSupplierCatalog:function(_chainSupplierCatalog){
                if(_chainSupplierCatalog.hasOwnProperty('name')){
                     _chainSupplierCatalog.chainSupplierCatalogName = _chainSupplierCatalog.name;
                }
                vc.emit($props.emitChooseChainSupplierCatalog,'chooseChainSupplierCatalog',_chainSupplierCatalog);
                vc.emit($props.emitLoadData,'listChainSupplierCatalogData',{
                    chainSupplierCatalogId:_chainSupplierCatalog.chainSupplierCatalogId
                });
                $('#chooseChainSupplierCatalogModel').modal('hide');
            },
            queryChainSupplierCatalogs:function(){
                vc.component._loadAllChainSupplierCatalogInfo(1,10,vc.component.chooseChainSupplierCatalogInfo._currentChainSupplierCatalogName);
            },
            _refreshChooseChainSupplierCatalogInfo:function(){
                vc.component.chooseChainSupplierCatalogInfo._currentChainSupplierCatalogName = "";
            }
        }

    });
})(window.vc);
