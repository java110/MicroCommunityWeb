/**
    收据模板 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewFeePrintPageInfo:{
                index:0,
                flowComponent:'viewFeePrintPageInfo',
                pageName:'',
communityId:'',
pageUrl:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadFeePrintPageInfoData();
        },
        _initEvent:function(){
            vc.on('viewFeePrintPageInfo','chooseFeePrintPage',function(_app){
                vc.copyObject(_app, vc.component.viewFeePrintPageInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewFeePrintPageInfo);
            });

            vc.on('viewFeePrintPageInfo', 'onIndex', function(_index){
                vc.component.viewFeePrintPageInfo.index = _index;
            });

        },
        methods:{

            _openSelectFeePrintPageInfoModel(){
                vc.emit('chooseFeePrintPage','openChooseFeePrintPageModel',{});
            },
            _openAddFeePrintPageInfoModel(){
                vc.emit('addFeePrintPage','openAddFeePrintPageModal',{});
            },
            _loadFeePrintPageInfoData:function(){

            }
        }
    });

})(window.vc);
