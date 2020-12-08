/**
    databus 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewBusinessDatabusInfo:{
                index:0,
                flowComponent:'viewBusinessDatabusInfo',
                businessTypeCd:'',
beanName:'',
seq:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadBusinessDatabusInfoData();
        },
        _initEvent:function(){
            vc.on('viewBusinessDatabusInfo','chooseBusinessDatabus',function(_app){
                vc.copyObject(_app, vc.component.viewBusinessDatabusInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewBusinessDatabusInfo);
            });

            vc.on('viewBusinessDatabusInfo', 'onIndex', function(_index){
                vc.component.viewBusinessDatabusInfo.index = _index;
            });

        },
        methods:{

            _openSelectBusinessDatabusInfoModel(){
                vc.emit('chooseBusinessDatabus','openChooseBusinessDatabusModel',{});
            },
            _openAddBusinessDatabusInfoModel(){
                vc.emit('addBusinessDatabus','openAddBusinessDatabusModal',{});
            },
            _loadBusinessDatabusInfoData:function(){

            }
        }
    });

})(window.vc);
