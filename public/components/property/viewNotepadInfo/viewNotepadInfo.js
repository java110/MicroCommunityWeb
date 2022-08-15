/**
    记事薄 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewNotepadInfo:{
                index:0,
                flowComponent:'viewNotepadInfo',
                noteType:'',
title:'',
roomName:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadNotepadInfoData();
        },
        _initEvent:function(){
            vc.on('viewNotepadInfo','chooseNotepad',function(_app){
                vc.copyObject(_app, vc.component.viewNotepadInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewNotepadInfo);
            });

            vc.on('viewNotepadInfo', 'onIndex', function(_index){
                vc.component.viewNotepadInfo.index = _index;
            });

        },
        methods:{

            _openSelectNotepadInfoModel(){
                vc.emit('chooseNotepad','openChooseNotepadModel',{});
            },
            _openAddNotepadInfoModel(){
                vc.emit('addNotepad','openAddNotepadModal',{});
            },
            _loadNotepadInfoData:function(){

            }
        }
    });

})(window.vc);
