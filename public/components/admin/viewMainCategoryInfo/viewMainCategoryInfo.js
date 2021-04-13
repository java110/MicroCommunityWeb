/**
    商品目录 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewMainCategoryInfo:{
                index:0,
                flowComponent:'viewMainCategoryInfo',
                categoryName:'',
categoryType:'',
startTime:'',
endTime:'',
categoryDesc:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadMainCategoryInfoData();
        },
        _initEvent:function(){
            vc.on('viewMainCategoryInfo','chooseMainCategory',function(_app){
                vc.copyObject(_app, vc.component.viewMainCategoryInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewMainCategoryInfo);
            });

            vc.on('viewMainCategoryInfo', 'onIndex', function(_index){
                vc.component.viewMainCategoryInfo.index = _index;
            });

        },
        methods:{

            _openSelectMainCategoryInfoModel(){
                vc.emit('chooseMainCategory','openChooseMainCategoryModel',{});
            },
            _openAddMainCategoryInfoModel(){
                vc.emit('addMainCategory','openAddMainCategoryModal',{});
            },
            _loadMainCategoryInfoData:function(){

            }
        }
    });

})(window.vc);
