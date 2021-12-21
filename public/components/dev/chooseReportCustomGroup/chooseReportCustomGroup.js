(function(vc){
    vc.extends({
        propTypes: {
           emitChooseReportCustomGroup:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseReportCustomGroupInfo:{
                reportCustomGroups:[],
                _currentReportCustomGroupName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseReportCustomGroup','openChooseReportCustomGroupModel',function(_param){
                $('#chooseReportCustomGroupModel').modal('show');
                vc.component._refreshChooseReportCustomGroupInfo();
                vc.component._loadAllReportCustomGroupInfo(1,10,'');
            });
        },
        methods:{
            _loadAllReportCustomGroupInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('reportCustomGroup.listReportCustomGroups',
                             param,
                             function(json){
                                var _reportCustomGroupInfo = JSON.parse(json);
                                vc.component.chooseReportCustomGroupInfo.reportCustomGroups = _reportCustomGroupInfo.reportCustomGroups;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseReportCustomGroup:function(_reportCustomGroup){
                if(_reportCustomGroup.hasOwnProperty('name')){
                     _reportCustomGroup.reportCustomGroupName = _reportCustomGroup.name;
                }
                vc.emit($props.emitChooseReportCustomGroup,'chooseReportCustomGroup',_reportCustomGroup);
                vc.emit($props.emitLoadData,'listReportCustomGroupData',{
                    reportCustomGroupId:_reportCustomGroup.reportCustomGroupId
                });
                $('#chooseReportCustomGroupModel').modal('hide');
            },
            queryReportCustomGroups:function(){
                vc.component._loadAllReportCustomGroupInfo(1,10,vc.component.chooseReportCustomGroupInfo._currentReportCustomGroupName);
            },
            _refreshChooseReportCustomGroupInfo:function(){
                vc.component.chooseReportCustomGroupInfo._currentReportCustomGroupName = "";
            }
        }

    });
})(window.vc);
