(function(vc){
    vc.extends({
        propTypes: {
           emitChooseBusinessTableHis:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseBusinessTableHisInfo:{
                businessTableHiss:[],
                _currentBusinessTableHisName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseBusinessTableHis','openChooseBusinessTableHisModel',function(_param){
                $('#chooseBusinessTableHisModel').modal('show');
                vc.component._refreshChooseBusinessTableHisInfo();
                vc.component._loadAllBusinessTableHisInfo(1,10,'');
            });
        },
        methods:{
            _loadAllBusinessTableHisInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('businessTableHis.listBusinessTableHiss',
                             param,
                             function(json){
                                var _businessTableHisInfo = JSON.parse(json);
                                vc.component.chooseBusinessTableHisInfo.businessTableHiss = _businessTableHisInfo.businessTableHiss;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseBusinessTableHis:function(_businessTableHis){
                if(_businessTableHis.hasOwnProperty('name')){
                     _businessTableHis.businessTableHisName = _businessTableHis.name;
                }
                vc.emit($props.emitChooseBusinessTableHis,'chooseBusinessTableHis',_businessTableHis);
                vc.emit($props.emitLoadData,'listBusinessTableHisData',{
                    businessTableHisId:_businessTableHis.businessTableHisId
                });
                $('#chooseBusinessTableHisModel').modal('hide');
            },
            queryBusinessTableHiss:function(){
                vc.component._loadAllBusinessTableHisInfo(1,10,vc.component.chooseBusinessTableHisInfo._currentBusinessTableHisName);
            },
            _refreshChooseBusinessTableHisInfo:function(){
                vc.component.chooseBusinessTableHisInfo._currentBusinessTableHisName = "";
            }
        }

    });
})(window.vc);
