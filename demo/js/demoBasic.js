/*
* @Author: jinhaiyue
* @Date:   2017-08-03 10:49:50
* @Last Modified by:   jinhaiyue
* @Last Modified time: 2017-08-03 10:49:50
*/

'use strict';
// 下拉框数据
var selectData = [
	{text: 1111},
	{text: 2222},
	{text: 3333}
];
var selectWhetherData = [
	{text: '是'},
	{text: '否'}
];
// 树状下拉框数据
var ztreeData = [
    {"nodeTypeId":0,"tenantId":"admin","orgId":"root","parentId":null,"path":"/root","ord":1,"orgName":"北京分公司"},
    {"nodeTypeId":0,"tenantId":"admin","orgId":"xicheng","parentId":"root","path":"/root/xicheng","ord":1,"orgName":"西城区"},
    	    {"nodeTypeId":1,"tenantId":"admin","orgId":"testOrg003","parentId":"xicheng","path":"/root/xicheng/testOrg003","ord":1,"orgName":"testName003"},
            {"nodeTypeId":1,"tenantId":"admin","orgId":"xc01","parentId":"xicheng","path":"/root/xicheng/xc01","ord":1,"orgName":"西城区01"},
            {"nodeTypeId":1,"tenantId":"admin","orgId":"testOrg002","parentId":"xicheng","path":"/root/xicheng/testOrg002","ord":1,"orgName":"testName002"},
            {"nodeTypeId":1,"tenantId":"admin","orgId":"xc02","parentId":"xicheng","path":"/root/xicheng/xc02","ord":2,"orgName":"西城区02"},
            {"nodeTypeId":0,"tenantId":"admin","orgId":"dongcheng","parentId":"root","path":"/root/dongcheng","ord":2,"orgName":"东城区"},
            {"nodeTypeId":1,"tenantId":"admin","orgId":"xc03","parentId":"xicheng","path":"/root/xicheng/xc03","ord":3,"orgName":"西城区03"},
            {"nodeTypeId":0,"tenantId":"admin","orgId":"haidian","parentId":"root","path":"/root/haidian","ord":3,"orgName":"海淀区"},
            {"nodeTypeId":0,"tenantId":"admin","orgId":"chaoyang","parentId":"root","path":"/root/chaoyang","ord":4,"orgName":"朝阳区"}
];
// 树状下拉框的配置
var ztreeOption = {
	id: 'orgId',
	pId: 'parentId',
	name: 'orgName',
	flag: true
};

$(function(){	
	// 加载下拉框
	peacock.initCommonSelect('.common-select', selectData);
	peacock.initCommonSelect('.whether-select', selectWhetherData);
	
	// 加载带checkbox复选框的多选下拉菜单树状结构
	peacock.initDownTree('downTree', ztreeData, ztreeOption);
	//初始化zTree树状结构---带右键菜单
	initTree();
	
	//初始化修改图标的zTree树状结构---带右键菜单
	identityTree();
	
	// 初始化文件上传
	initUploader();
	
});






//初始化zTree默认树状结构
var initTree = function(){
	var setting = {
		data: {
			simpleData: {
				enable:true, 
				idKey:'orgId',
				pIdKey:'parentId'
			},
			key:{
				name:'orgName'
			}
		},		
		callback: {
			beforeClick: function(treeId, treeNode){
				var zTree = $.fn.zTree.getZTreeObj("defaultTree");
				zTree.checkNode(treeNode, !treeNode.checked, null, true);
				return false;
			}
		}
	};
	var data = [
	            {"nodeTypeId":0,"tenantId":"admin","orgId":"root","parentId":null,"path":"/root","ord":1,"orgName":"北京分公司"},
	            {"nodeTypeId":0,"tenantId":"admin","orgId":"xicheng","parentId":"root","path":"/root/xicheng","ord":1,"orgName":"西城区"},
	            {"nodeTypeId":1,"tenantId":"admin","orgId":"testOrg003","parentId":"xicheng","path":"/root/xicheng/testOrg003","ord":1,"orgName":"testName003"},
	            {"nodeTypeId":1,"tenantId":"admin","orgId":"xc01","parentId":"xicheng","path":"/root/xicheng/xc01","ord":1,"orgName":"西城区01"},
	            {"nodeTypeId":1,"tenantId":"admin","orgId":"testOrg002","parentId":"xicheng","path":"/root/xicheng/testOrg002","ord":1,"orgName":"testName002"},
	            {"nodeTypeId":1,"tenantId":"admin","orgId":"xc02","parentId":"xicheng","path":"/root/xicheng/xc02","ord":2,"orgName":"西城区02"},
	            {"nodeTypeId":0,"tenantId":"admin","orgId":"dongcheng","parentId":"root","path":"/root/dongcheng","ord":2,"orgName":"东城区"},
	            {"nodeTypeId":1,"tenantId":"admin","orgId":"xc03","parentId":"xicheng","path":"/root/xicheng/xc03","ord":3,"orgName":"西城区03"},
	            {"nodeTypeId":0,"tenantId":"admin","orgId":"haidian","parentId":"root","path":"/root/haidian","ord":3,"orgName":"海淀区"},
	            {"nodeTypeId":0,"tenantId":"admin","orgId":"chaoyang","parentId":"root","path":"/root/chaoyang","ord":4,"orgName":"朝阳区"}
	];
//	$.ajax({//初始化组织人员树
//		"url":webpath+"/user/org",
//		"type":"POST",
//		dataType:"json",
//		success:function(data){	
			if(data!=null&&data.length>0){
				var treeObj = $.fn.zTree.init($("#defaultTree"), setting, data);
				treeObj.expandAll(true);
			}else{
				layer.msg('暂无数据', {time:1000, icon:5});
			}
			
//		}
//	});
	// 内容过多出现滚动条
	$('.identity-tree').niceScroll({cursorcolor: '#ccc', horizrailenabled: false});
}


//初始化修改图标的zTree树状结构---带右键菜单
var identityTree = function(){
	var setting = {
		data: {
			simpleData: {
				enable:true, 
				idKey:'orgId',
				pIdKey:'parentId'
			},
			key:{
				name:'orgName'
			}
		},		
		callback: {
			onRightClick:function(e,treeId,treeNode){
				peacock.preventDefault(e);
				if(!treeNode) return;
				treeObj.selectNode(treeNode);
				$(".bootstrapMenu").hide();
				var oWidth = e.clientX - $('#idTreeContent').parents('.panel').offset().left + 15;
				var oHeight = e.clientY - $('#idTreeContent').parents('.panel').offset().top+$(document).scrollTop();
				switch (treeNode.nodeTypeId){
					case 0:
						$("#folderContextMenu").show();
						$("#folderContextMenu").css("left",oWidth);
						$("#folderContextMenu").css("top",oHeight);
						break;
					case 1:
						$("#linkContextMenu").show();
						$("#linkContextMenu").css("left",oWidth);
						$("#linkContextMenu").css("top",oHeight);
						break;
					default:;
						
				}
		    }
		}
	};
	var data = [
		{"nodeTypeId":0,"tenantId":"admin","orgId":"root","parentId":null,"path":"/root","ord":1,"orgName":"北京分公司"},
		{"nodeTypeId":0,"tenantId":"admin","orgId":"xicheng","parentId":"root","path":"/root/xicheng","ord":1,"orgName":"西城区"},
		{"nodeTypeId":1,"tenantId":"admin","orgId":"testOrg003","parentId":"xicheng","path":"/root/xicheng/testOrg003","ord":1,"orgName":"testName003"},
		{"nodeTypeId":1,"tenantId":"admin","orgId":"xc01","parentId":"xicheng","path":"/root/xicheng/xc01","ord":1,"orgName":"西城区01"},
		{"nodeTypeId":1,"tenantId":"admin","orgId":"testOrg002","parentId":"xicheng","path":"/root/xicheng/testOrg002","ord":1,"orgName":"testName002"},
		{"nodeTypeId":1,"tenantId":"admin","orgId":"xc02","parentId":"xicheng","path":"/root/xicheng/xc02","ord":2,"orgName":"西城区02"},
		{"nodeTypeId":0,"tenantId":"admin","orgId":"dongcheng","parentId":"root","path":"/root/dongcheng","ord":2,"orgName":"东城区"},
		{"nodeTypeId":1,"tenantId":"admin","orgId":"xc03","parentId":"xicheng","path":"/root/xicheng/xc03","ord":3,"orgName":"西城区03"},
		{"nodeTypeId":0,"tenantId":"admin","orgId":"haidian","parentId":"root","path":"/root/haidian","ord":3,"orgName":"海淀区"},
		{"nodeTypeId":0,"tenantId":"admin","orgId":"chaoyang","parentId":"root","path":"/root/chaoyang","ord":4,"orgName":"朝阳区"}
	];
	if(data!=null&&data.length>0){
		for(var i = 0; i < data.length; i++){
//			data[i].icon = webpath+nodeTypeIcon[data[i].nodeTypeId];
		}
		var treeObj = $.fn.zTree.init($("#identityTree"), setting, data);
		treeObj.expandAll(true);
	}else{
		layer.msg('暂无数据', {time:1000, icon:5});
	}
	
	$(document).click(function() {
		$(".bootstrapMenu").hide();
	});
}
// 图标样式
var nodeTypeIcon = {
		"0":"/resources/camel/img/icon/16x16/floder1-org.png",
		"1":"/resources/camel/img/icon/16x16/resorce.png"
};


//初始化文件上传功能
var initUploader = function(){
	// 初始化webuploader组件，设置上传等事件监听
	var $list = $('#thelist');
	var $btn =$("#ctlBtn");   //开始上传
	var thumbnailWidth = 100;   //缩略图高度和宽度 （单位是像素），当宽高度是0~1的时候，是按照百分比计算  
	var thumbnailHeight = 100; 
	var uploader = WebUploader.create({		
	    // swf文件路径
	    swf: '../../dist/lib/webuploader-0.1.5/Uploader.swf',
	    // 文件接收服务端。
//	    server: '/file/uploadAll',
	    // 选择文件的按钮。可选。
	    pick: '#picker',
	    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
	    resize: false,
	    method:'POST',
	    // 可重复上传
	    duplicate: true
	});
	$btn.on('click',function(){
		//添加完需要与图片一起上传的参数之后,就可以手动触发uploader的上传事件了.
		uploader.upload();
	});
	
	// 上传事件对象
	var uploaderObj = {
		'fileQueued': function(file){
			$list.append( '<div id="' + file.id + '" class="item">' +
			        '<h4 class="info clearfix" name="'+file.name+'">' + file.name + '<i class="fr iconfont file-delete" title="删除">&#xe61b;</i>'+
			        												'<i class="fr iconfont file-download" title="下载">&#xe724;</i>'+
			        '</h4>' +
			        '<p class="state">等待上传...</p>' +
			    '</div>' );
		},
		'uploadProgress': function( file, percentage ) {
		    var $li = $( '#'+file.id ),
		        $percent = $li.find('.progress .progress-bar');

		    // 避免重复创建
		    if ( !$percent.length ) {
		        $percent = $('<div class="progress progress-striped active">' +
		          '<div class="progress-bar" role="progressbar" style="width: 0%">' +
		          '</div>' +
		        '</div>').appendTo( $li ).find('.progress-bar');
		    }

		    $li.find('p.state').text('上传中');

		    $percent.css( 'width', percentage * 100 + '%' );
		},
		'uploadSucc': function( file ) {
		    $( '#'+file.id ).find('p.state').text('已上传');
		    $('.info .iconfont').show();
		    // 文件下载
		    $('.file-download').on('click', function(){
		    	var name = $(this).parent().attr('name');
//		    	window.open(webpath+'/file/download?fileName='+name+'&filePath=D\:\\frame\\app\\res\\cruser\\'+name);
		    })
		    // 文件删除
		    $('.file-delete').on('click', function(){
		    	var name = $(this).parent().attr('name');
		    	var _this = this;
		    	layer.confirm('删除该用户？（删除后不可恢复）', {
		    		icon: 3,
		    		btn: ['是', '否']   		
		    	}, function(index, layero){
//		    		$.ajax({
//			    		url: webpath + '/file/delete',
//			    		type: 'POST',
//			    		data: {
//			    			filePath: 'D\:\\frame\\app\\res\\cruser\\'+name
//			    		},
//			    		success: function(data){			    			
//			    			if(data){
//			    				$(_this).parents('.item').remove();
//			    				layer.msg('删除成功！', {icon: 1});			    				
//			    			}else{
//			    				layer.msg('删除失败！', {icon: 1});
//			    			}
//			    		}
//			    	})
		    	})
		    	
		    })
		},
		'uploadErr': function( file ) {
		    $( '#'+file.id ).find('p.state').text('上传出错');
		},
		'uploadComp': function( file ) {
		    $( '#'+file.id ).find('.progress').fadeOut();
		}
	};
	
	// 当有文件被添加进队列的时候
	uploader.on( 'fileQueued', uploaderObj.fileQueued);	
	// 文件上传过程中创建进度条实时显示。
	uploader.on( 'uploadProgress', uploaderObj.uploadProgress);	
	// 文件上传成功
	uploader.on( 'uploadSuccess', uploaderObj.uploadSucc);
	// 文件上传失败，显示上传出错。
	uploader.on( 'uploadError', uploaderObj.uploadErr);
	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on( 'uploadComplete', uploaderObj.uploadComp);
}


//显示本页面弹出层
var showLayer = function(){
	layer.open({
		type: 1,
		title:'<i class="iconfont">&#xe65b;</i>&nbsp;弹出层标题',
		area: ['900px', '600px'],
		content: '<div>此处为弹出层内容区</div>',
		btn: ['确定','取消'],
		btn1: function(index, layero){
			layer.close(index);
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	})
}
// 显示父页面弹出层，父页面若无显示弹出层方法，则调用本页面方法
var showHrefLayer = function(){
	layer.open({
		type: 2,
		title: false,
		closeBtn: true,
		area: ['900px', '600px'],
		content: 'http://www.baidu.com',
		btn: ['关闭'],
		btn1: function(index, layero){
			layer.close(index);
		}
	})
}

// 提交进行校验
function submitValidator() {
	var formObj = $('#demoForm');
	//	给可编辑的div上面的input框赋值
	$('.cm-form-editDiv').prev().val($('.cm-form-editDiv').text());
	if(form.isValidator(formObj)) {
		layer.msg('校验通过！')
	}
}

var showSuccessMsg = function(){
	layer.msg('保存成功！', {icon: 1,time:5000});
}

var showFailMsg = function(){
	layer.msg('保存失败！', {icon: 2,time:5000});
}