/**
    业务轨迹 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewBusinessTableHisInfo:{
                index:0,
                flowComponent:'viewBusinessTableHisInfo',
                businessTypeCd:'',
action:'',
actionObj:'',
actionObjHis:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadBusinessTableHisInfoData();
        },
        _initEvent:function(){
            vc.on('viewBusinessTableHisInfo','chooseBusinessTableHis',function(_app){
                vc.copyObject(_app, vc.component.viewBusinessTableHisInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewBusinessTableHisInfo);
            });

            vc.on('viewBusinessTableHisInfo', 'onIndex', function(_index){
                vc.component.viewBusinessTableHisInfo.index = _index;
            });

        },
        methods:{

            _openSelectBusinessTableHisInfoModel(){
                vc.emit('chooseBusinessTableHis','openChooseBusinessTableHisModel',{});
            },
            _openAddBusinessTableHisInfoModel(){
                vc.emit('addBusinessTableHis','openAddBusinessTableHisModal',{});
            },
            _loadBusinessTableHisInfoData:function(){

            }
        }
    });

})(window.vc);
