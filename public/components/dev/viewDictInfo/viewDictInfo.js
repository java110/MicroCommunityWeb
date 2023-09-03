/**
    字典 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewDictInfo:{
                index:0,
                flowComponent:'viewDictInfo',
                statusCd:'',
name:'',
description:'',
tableName:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadDictInfoData();
        },
        _initEvent:function(){
            vc.on('viewDictInfo','chooseDict',function(_app){
                vc.copyObject(_app, vc.component.viewDictInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewDictInfo);
            });

            vc.on('viewDictInfo', 'onIndex', function(_index){
                vc.component.viewDictInfo.index = _index;
            });

        },
        methods:{

            _openSelectDictInfoModel(){
                vc.emit('chooseDict','openChooseDictModel',{});
            },
            _openAddDictInfoModel(){
                vc.emit('addDict','openAddDictModal',{});
            },
            _loadDictInfoData:function(){

            }
        }
    });

})(window.vc);
