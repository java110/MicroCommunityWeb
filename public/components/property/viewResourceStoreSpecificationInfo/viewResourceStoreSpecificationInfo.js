/**
    物品规格 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewResourceStoreSpecificationInfo:{
                index:0,
                flowComponent:'viewResourceStoreSpecificationInfo',
                specName:'',
rstId:'',
description:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadResourceStoreSpecificationInfoData();
        },
        _initEvent:function(){
            vc.on('viewResourceStoreSpecificationInfo','chooseResourceStoreSpecification',function(_app){
                vc.copyObject(_app, vc.component.viewResourceStoreSpecificationInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewResourceStoreSpecificationInfo);
            });

            vc.on('viewResourceStoreSpecificationInfo', 'onIndex', function(_index){
                vc.component.viewResourceStoreSpecificationInfo.index = _index;
            });

        },
        methods:{

            _openSelectResourceStoreSpecificationInfoModel(){
                vc.emit('chooseResourceStoreSpecification','openChooseResourceStoreSpecificationModel',{});
            },
            _openAddResourceStoreSpecificationInfoModel(){
                vc.emit('addResourceStoreSpecification','openAddResourceStoreSpecificationModal',{});
            },
            _loadResourceStoreSpecificationInfoData:function(){

            }
        }
    });

})(window.vc);
