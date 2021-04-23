(function(vc){
    vc.extends({
        propTypes: {
           emitChooseFeePrintSpec:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseFeePrintSpecInfo:{
                feePrintSpecs:[],
                _currentFeePrintSpecName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseFeePrintSpec','openChooseFeePrintSpecModel',function(_param){
                $('#chooseFeePrintSpecModel').modal('show');
                vc.component._refreshChooseFeePrintSpecInfo();
                vc.component._loadAllFeePrintSpecInfo(1,10,'');
            });
        },
        methods:{
            _loadAllFeePrintSpecInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('feePrintSpec.listFeePrintSpecs',
                             param,
                             function(json){
                                var _feePrintSpecInfo = JSON.parse(json);
                                vc.component.chooseFeePrintSpecInfo.feePrintSpecs = _feePrintSpecInfo.feePrintSpecs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseFeePrintSpec:function(_feePrintSpec){
                if(_feePrintSpec.hasOwnProperty('name')){
                     _feePrintSpec.feePrintSpecName = _feePrintSpec.name;
                }
                vc.emit($props.emitChooseFeePrintSpec,'chooseFeePrintSpec',_feePrintSpec);
                vc.emit($props.emitLoadData,'listFeePrintSpecData',{
                    feePrintSpecId:_feePrintSpec.feePrintSpecId
                });
                $('#chooseFeePrintSpecModel').modal('hide');
            },
            queryFeePrintSpecs:function(){
                vc.component._loadAllFeePrintSpecInfo(1,10,vc.component.chooseFeePrintSpecInfo._currentFeePrintSpecName);
            },
            _refreshChooseFeePrintSpecInfo:function(){
                vc.component.chooseFeePrintSpecInfo._currentFeePrintSpecName = "";
            }
        }

    });
})(window.vc);
