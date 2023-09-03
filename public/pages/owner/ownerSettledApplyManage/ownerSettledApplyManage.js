/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            ownerSettledApplyManageInfo:{
                ownerSettledApplys:[],
                total:0,
                records:1,
                moreCondition:false,
                applyId:'',
                conditions:{
                    ownerNameLike:'',
                    communityId:vc.getCurrentCommunity().communityId,
                    state:'',

                }
            }
        },
        _initMethod:function(){
            vc.component._listOwnerSettledApplys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('ownerSettledApplyManage','listOwnerSettledApply',function(_param){
                  vc.component._listOwnerSettledApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listOwnerSettledApplys(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listOwnerSettledApplys:function(_page, _rows){

                vc.component.ownerSettledApplyManageInfo.conditions.page = _page;
                vc.component.ownerSettledApplyManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.ownerSettledApplyManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('/ownerSettled.listOwnerSettledApply',
                             param,
                             function(json,res){
                                var _ownerSettledApplyManageInfo=JSON.parse(json);
                                vc.component.ownerSettledApplyManageInfo.total = _ownerSettledApplyManageInfo.total;
                                vc.component.ownerSettledApplyManageInfo.records = _ownerSettledApplyManageInfo.records;
                                vc.component.ownerSettledApplyManageInfo.ownerSettledApplys = _ownerSettledApplyManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.ownerSettledApplyManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddOwnerSettledApplyModal:function(){
                vc.jumpToPage('/#/pages/owner/addOwnerSettledApply');
            },
            _openEditOwnerSettledApplyModel:function(_ownerSettledApply){
                vc.jumpToPage('/#/pages/owner/editOwnerSettledApply?applyId='+_ownerSettledApply.applyId);
            },
            _openDeleteOwnerSettledApplyModel:function(_ownerSettledApply){
                vc.emit('deleteOwnerSettledApply','openDeleteOwnerSettledApplyModal',_ownerSettledApply);
            },
            _queryOwnerSettledApplyMethod:function(){
                vc.component._listOwnerSettledApplys(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.ownerSettledApplyManageInfo.moreCondition){
                    vc.component.ownerSettledApplyManageInfo.moreCondition = false;
                }else{
                    vc.component.ownerSettledApplyManageInfo.moreCondition = true;
                }
            },
            _toSetting:function(){
                vc.jumpToPage('/#/pages/owner/ownerSettledSettingManage')
            },
            viewOwnerSettledRooms:function(_item){
                vc.emit('viewOwnerSettledRooms', 'openChooseItemReleaseRes',_item);
            },
            _openDetail: function(_item) {
                vc.jumpToPage("/#/pages/owner/ownerSettledApplyDetail?applyId=" + _item.applyId + "&flowId=" + _item.flowId);
            },
             
        }
    });
})(window.vc);
