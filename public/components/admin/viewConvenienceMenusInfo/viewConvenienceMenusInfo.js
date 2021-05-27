/**
    便民服务菜单 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewConvenienceMenusInfo:{
                index:0,
                flowComponent:'viewConvenienceMenusInfo',
                name:'',
icon:'',
url:'',
seq:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadConvenienceMenusInfoData();
        },
        _initEvent:function(){
            vc.on('viewConvenienceMenusInfo','chooseConvenienceMenus',function(_app){
                vc.copyObject(_app, vc.component.viewConvenienceMenusInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewConvenienceMenusInfo);
            });

            vc.on('viewConvenienceMenusInfo', 'onIndex', function(_index){
                vc.component.viewConvenienceMenusInfo.index = _index;
            });

        },
        methods:{

            _openSelectConvenienceMenusInfoModel(){
                vc.emit('chooseConvenienceMenus','openChooseConvenienceMenusModel',{});
            },
            _openAddConvenienceMenusInfoModel(){
                vc.emit('addConvenienceMenus','openAddConvenienceMenusModal',{});
            },
            _loadConvenienceMenusInfoData:function(){

            }
        }
    });

})(window.vc);
