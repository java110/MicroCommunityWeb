(function(vc){
    vc.extends({
        propTypes: {
           emitChooseOaWorkflow:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseOaWorkflowInfo:{
                oaWorkflows:[],
                _currentOaWorkflowName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseOaWorkflow','openChooseOaWorkflowModel',function(_param){
                $('#chooseOaWorkflowModel').modal('show');
                vc.component._refreshChooseOaWorkflowInfo();
                vc.component._loadAllOaWorkflowInfo(1,10,'');
            });
        },
        methods:{
            _loadAllOaWorkflowInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('oaWorkflow.listOaWorkflows',
                             param,
                             function(json){
                                var _oaWorkflowInfo = JSON.parse(json);
                                vc.component.chooseOaWorkflowInfo.oaWorkflows = _oaWorkflowInfo.oaWorkflows;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseOaWorkflow:function(_oaWorkflow){
                if(_oaWorkflow.hasOwnProperty('name')){
                     _oaWorkflow.oaWorkflowName = _oaWorkflow.name;
                }
                vc.emit($props.emitChooseOaWorkflow,'chooseOaWorkflow',_oaWorkflow);
                vc.emit($props.emitLoadData,'listOaWorkflowData',{
                    oaWorkflowId:_oaWorkflow.oaWorkflowId
                });
                $('#chooseOaWorkflowModel').modal('hide');
            },
            queryOaWorkflows:function(){
                vc.component._loadAllOaWorkflowInfo(1,10,vc.component.chooseOaWorkflowInfo._currentOaWorkflowName);
            },
            _refreshChooseOaWorkflowInfo:function(){
                vc.component.chooseOaWorkflowInfo._currentOaWorkflowName = "";
            }
        }

    });
})(window.vc);
