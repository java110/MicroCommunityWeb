/**
    考勤班组 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewAttendanceClassesInfo:{
                index:0,
                flowComponent:'viewAttendanceClassesInfo',
                classesName:'',
timeOffset:'',
clockCount:'',
clockType:'',
clockTypeValue:'',
leaveOffset:'',
lateOffset:'',
classesObjType:'',
classesObjId:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadAttendanceClassesInfoData();
        },
        _initEvent:function(){
            vc.on('viewAttendanceClassesInfo','chooseAttendanceClasses',function(_app){
                vc.copyObject(_app, vc.component.viewAttendanceClassesInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewAttendanceClassesInfo);
            });

            vc.on('viewAttendanceClassesInfo', 'onIndex', function(_index){
                vc.component.viewAttendanceClassesInfo.index = _index;
            });

        },
        methods:{

            _openSelectAttendanceClassesInfoModel(){
                vc.emit('chooseAttendanceClasses','openChooseAttendanceClassesModel',{});
            },
            _openAddAttendanceClassesInfoModel(){
                vc.emit('addAttendanceClasses','openAddAttendanceClassesModal',{});
            },
            _loadAttendanceClassesInfoData:function(){

            }
        }
    });

})(window.vc);
