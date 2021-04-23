(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            listOweFeeInfo:{
                fees:[],
                roomName:'',
                roomId:'',
                total: 0,
                records: 1,
                moreCondition:false,
                roomNum:'',
                conditions:{
                    floorName:'',
                    payObjType:'3333',
                    billType:'00123'
                },
                roomUnits:[],
                floorId:'',
                unitId:'',
            }
        },
        _initMethod:function(){
            vc.component._loadListOweFeeInfo(1,10);
        },
        _initEvent:function(){
            
            vc.on('pagination', 'page_event',
                function(_currentPage) {
                    vc.component._loadListOweFeeInfo(_currentPage, DEFAULT_ROWS);
                });
        },
        methods:{
            _loadListOweFeeInfo:function(_page,_row){

                vc.component.listOweFeeInfo.conditions.page = _page;
                vc.component.listOweFeeInfo.conditions.row = _row;
                vc.component.listOweFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: vc.component.listOweFeeInfo.conditions
                };

                //发送get请求
               vc.http.apiGet('/feeApi/getOweFees',
                             param,
                             function(json){
                                var _feeConfigInfo = JSON.parse(json);
                                vc.component.listOweFeeInfo.total = _feeConfigInfo.total;
                                vc.component.listOweFeeInfo.records = _feeConfigInfo.records;
                                vc.component.listOweFeeInfo.fees = _feeConfigInfo.data;
                                vc.emit('pagination', 'init', {
                                    total: _feeConfigInfo.records,
                                    currentPage: _page
                                });
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            _goBack:function(){
                vc.goBack();
            },
            _toOwnerPayFee:function(_fee){
                console.log('_fee',_fee);
                vc.jumpToPage('/admin.html#/pages/property/owePayFeeOrder?payObjId='+_fee.payerObjId+"&payObjType="+_fee.payerObjType+"&roomName="+_fee.roomName);
            },
            _moreCondition:function(){
                if(vc.component.listOweFeeInfo.moreCondition){
                    vc.component.listOweFeeInfo.moreCondition = false;
                }else{
                    vc.component.listOweFeeInfo.moreCondition = true;
                }
            },
            _openChooseFloorMethod:function(){
                vc.emit('searchFloor','openSearchFloorModel',{});
            },
            _queryOweFeeMethod:function(){
                vc.component._loadListOweFeeInfo(1,10);
            }
        
        }

    });
})(window.vc);
