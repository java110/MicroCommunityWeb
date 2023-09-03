/**
    巡检项目 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewInspectionItemInfo:{
                index:0,
                flowComponent:'viewInspectionItemInfo',
                itemName:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadInspectionItemInfoData();
        },
        _initEvent:function(){
            vc.on('viewInspectionItemInfo','chooseInspectionItem',function(_app){
                vc.copyObject(_app, vc.component.viewInspectionItemInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewInspectionItemInfo);
            });

            vc.on('viewInspectionItemInfo', 'onIndex', function(_index){
                vc.component.viewInspectionItemInfo.index = _index;
            });

        },
        methods:{

            _openSelectInspectionItemInfoModel(){
                vc.emit('chooseInspectionItem','openChooseInspectionItemModel',{});
            },
            _openAddInspectionItemInfoModel(){
                vc.emit('addInspectionItem','openAddInspectionItemModal',{});
            },
            _loadInspectionItemInfoData:function(){

            }
        }
    });

})(window.vc);
