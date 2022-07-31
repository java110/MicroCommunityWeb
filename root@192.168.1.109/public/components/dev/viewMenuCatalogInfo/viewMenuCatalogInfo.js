/**
    菜单目录 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewMenuCatalogInfo:{
                index:0,
                flowComponent:'viewMenuCatalogInfo',
                name:'',
icon:'',
seq:'',
storeType:'',
url:'',
isShow:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadMenuCatalogInfoData();
        },
        _initEvent:function(){
            vc.on('viewMenuCatalogInfo','chooseMenuCatalog',function(_app){
                vc.copyObject(_app, vc.component.viewMenuCatalogInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewMenuCatalogInfo);
            });

            vc.on('viewMenuCatalogInfo', 'onIndex', function(_index){
                vc.component.viewMenuCatalogInfo.index = _index;
            });

        },
        methods:{

            _openSelectMenuCatalogInfoModel(){
                vc.emit('chooseMenuCatalog','openChooseMenuCatalogModel',{});
            },
            _openAddMenuCatalogInfoModel(){
                vc.emit('addMenuCatalog','openAddMenuCatalogModal',{});
            },
            _loadMenuCatalogInfoData:function(){

            }
        }
    });

})(window.vc);
