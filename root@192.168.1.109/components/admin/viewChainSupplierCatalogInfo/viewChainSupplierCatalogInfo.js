/**
    供应商分类 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewChainSupplierCatalogInfo:{
                index:0,
                flowComponent:'viewChainSupplierCatalogInfo',
                catalogName:'',
csId:'',
intfUrlParam:'',
seq:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadChainSupplierCatalogInfoData();
        },
        _initEvent:function(){
            vc.on('viewChainSupplierCatalogInfo','chooseChainSupplierCatalog',function(_app){
                vc.copyObject(_app, vc.component.viewChainSupplierCatalogInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewChainSupplierCatalogInfo);
            });

            vc.on('viewChainSupplierCatalogInfo', 'onIndex', function(_index){
                vc.component.viewChainSupplierCatalogInfo.index = _index;
            });

        },
        methods:{

            _openSelectChainSupplierCatalogInfoModel(){
                vc.emit('chooseChainSupplierCatalog','openChooseChainSupplierCatalogModel',{});
            },
            _openAddChainSupplierCatalogInfoModel(){
                vc.emit('addChainSupplierCatalog','openAddChainSupplierCatalogModal',{});
            },
            _loadChainSupplierCatalogInfoData:function(){

            }
        }
    });

})(window.vc);
