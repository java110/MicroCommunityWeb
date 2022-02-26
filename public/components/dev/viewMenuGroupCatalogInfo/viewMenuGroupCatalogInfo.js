/**
    目录组 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewMenuGroupCatalogInfo:{
                index:0,
                flowComponent:'viewMenuGroupCatalogInfo',
                gId:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadMenuGroupCatalogInfoData();
        },
        _initEvent:function(){
            vc.on('viewMenuGroupCatalogInfo','chooseMenuGroupCatalog',function(_app){
                vc.copyObject(_app, vc.component.viewMenuGroupCatalogInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewMenuGroupCatalogInfo);
            });

            vc.on('viewMenuGroupCatalogInfo', 'onIndex', function(_index){
                vc.component.viewMenuGroupCatalogInfo.index = _index;
            });

        },
        methods:{

            _openSelectMenuGroupCatalogInfoModel(){
                vc.emit('chooseMenuGroupCatalog','openChooseMenuGroupCatalogModel',{});
            },
            _openAddMenuGroupCatalogInfoModel(){
                vc.emit('addMenuGroupCatalog','openAddMenuGroupCatalogModal',{});
            },
            _loadMenuGroupCatalogInfoData:function(){

            }
        }
    });

})(window.vc);
