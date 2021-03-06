// $.QianLoad.PageLoading({
// 	sleep: 20
// });


$(document).ready(function() {
	$('li.mainlevel').mousemove(function() {
		$(this).find('ul').stop(true, true).slideDown();
	});
	$('li.mainlevel').mouseleave(function() {
		$(this).find('ul').stop(true, true).slideUp();
	});
	$(".wechat").click(function() {
		art.dialog({
			title: '扫微信直接对话',
			fixed: true,
			padding: 10,
			width: 200,
			height: 200,
			content: '<img src="tpl/mytpl/images/wechat.jpg" width="200" height="200" alt="恒健海外官网微信" />',
			lock: true
		})
	})
	$(".hd-detail").slide({
		titCell: ".hd-title li",
		mainCell: ".hd-content",
		'titOnClassName': 'current',
		'trigger': 'click'
	});
	$("#th-hospital").slide({
		'autoPlay': true,
		'interTime': '3000',
		'effect': "leftLoop",
		'mainCell': 'ul.th-hospital',
		'scroll': '1',
		'vis': '4',
		'titOnClassName': 'on',
		'prevCell': '.th-hospital-tit-prev',
		'nextCell': '.th-hospital-tit-next'
	});
	$("#th-doctors").slide({
		'autoPlay': true,
		'interTime': '3000',
		'effect': "leftLoop",
		'mainCell': 'ul.th-doctors',
		'scroll': '1',
		'vis': '4',
		'titOnClassName': 'on',
		'prevCell': '.th-doctors-tit-prev',
		'nextCell': '.th-doctors-tit-next'
	});
	$("#hospital-photo").slide({
		'autoPlay': true,
		'interTime': '3000',
		'effect': 'leftLoop',
		'mainCell': 'ul.hospital-photo',
		'scroll': '1',
		'vis': '5',
		'titOnClassName': 'on',
		'prevCell': '.prev',
		'nextCell': '.next'
	});
	$("#hospital-more").slide({
		'autoPlay': true,
		'interTime': '3000',
		'effect': 'leftLoop',
		'mainCell': 'ul.hospital-list',
		'scroll': '2',
		'vis': '2',
		'titOnClassName': 'on',
		'prevCell': '.prev',
		'nextCell': '.next'
	});
	$("#doctors-photo").slide({
		'autoPlay': true,
		'interTime': '3000',
		'effect': "leftLoop",
		'mainCell': 'ul.doctors-photo',
		'scroll': '1',
		'vis': '5',
		'titOnClassName': 'on',
		'prevCell': '.prev',
		'nextCell': '.next'
	});
	$("#doctors-more").slide({
		'autoPlay': true,
		'interTime': '3000',
		'effect': "leftLoop",
		'mainCell': 'ul.doctors-list',
		'scroll': '2',
		'vis': '2',
		'titOnClassName': 'on',
		'prevCell': '.prev',
		'nextCell': '.next'
	});
	$("#case").slide({
		'autoPlay': true,
		'interTime': '3000',
		'effect': "leftLoop",
		'mainCell': 'ul.case-list',
		'scroll': '2',
		'vis': '2',
		'titOnClassName': 'on',
		'prevCell': '.prev',
		'nextCell': '.next'
	});
	$("#honor").slide({
		'autoPlay': true,
		'interTime': '3000',
		'effect': "leftLoop",
		'mainCell': 'ul.honor-list',
		'scroll': '1',
		'vis': '4',
		'titOnClassName': 'on',
		'prevCell': '.prev',
		'nextCell': '.next'
	});
	$("#aboutpic").slide({
		'autoPlay': true,
		'interTime': '3000',
		'effect': "leftLoop",
		'mainCell': 'ul.aboutpic-list',
		'scroll': '1',
		'vis': '1'
	});
	$("#case-photo").slide({
		'autoPlay': true,
		'interTime': '3000',
		'effect': "leftLoop",
		'mainCell': 'ul.case-photo-list',
		'scroll': '1',
		'vis': '1'
	});
	$('#reason-top').hide();
	$('#reason').on('click', function() {
		layer.open({
			type: 1,
			title: false,
			area: ['1035px', '632px'],
			closeBtn: 1,
			shadeClose: false,
			zIndex: 99999,
			content: $('#reason-top')
		})
	});
	$('#share-top').hide();
	$('#share').on('click', function() {
		layer.open({
			type: 1,
			title: false,
			area: ['270px', '150px'],
			closeBtn: 1,
			shadeClose: false,
			zIndex: 99,
			content: $('#share-top')
		})
	});
	$("#customer-form").submit(function() {
		var pattern = /^[\u4e00-\u9fa5]+$/;
		if (!pattern.test($("#title").val())) {
			$.dialog.alert("请输入您的姓名且必须为中文！");
			return false;
		}
		if (!$('#mobile').val()) {
			$.dialog.alert("请输入您的手机号码！");
			return false;
		}
		if (!$("#mobile").val().match(/^1[3|4|5|8]\d{9}$/)) {
			$.dialog.alert("您输入的手机号码不正确，请检查！");
			$("#mobile").focus();
			return false;
		}
		if (!pattern.test($("#city").val())) {
			$.dialog.alert("请输入您所在城市且必须为中文！");
			return false;
		}
		$(this).ajaxSubmit({
			'url': api_url('post', 'save'),
			'type': 'post',
			'dataType': 'json',
			'success': function(a) {
				if (a.status == 'ok') {
					$.dialog.alert('提交成功，谢谢！', function() {
						$.mysoft.reload();
					});
				} else {
					if (!a.content) a.content = "提交失败！";
					$.dialog.alert(a.content);
					return false;
				}
			}
		});
		return false;
	});
	$("#submail-form").submit(function() {
		if (!$('#title').val()) {
			$.dialog.alert("请输入您的邮箱");
			return false;
		}
		if (!$("#title").val().match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)) {
			$.dialog.alert("邮箱格式不正确");
			$("#title").focus();
			return false;
		}
		$(this).ajaxSubmit({
			'url': api_url('post', 'save'),
			'type': 'post',
			'dataType': 'json',
			'success': function(rs) {
				if (rs.status == 'ok') {
					$.dialog.alert("订阅成功！", function() {
						$.mysoft.reload();
					});
				} else {
					if (!rs.content) rs.content = "提交失败！";
					$.dialog.alert(rs.content);
					return false;
				}
			}
		});
		return false;
	});
	if ($("meta[name=toTop]").attr("content") == "true") {
		$("<div id='toTop'><img src='tpl/mytpl/js/images/to-top.png' width='48' height='48' alt='返回顶部'></div>").appendTo(
			'body');
		$("#toTop").css({
			width: '50px',
			height: '50px',
			bottom: '10px',
			right: '15px',
			position: 'fixed',
			cursor: 'pointer',
			zIndex: '999999'
		});
		if ($(this).scrollTop() == 0) {
			$("#toTop").hide();
		}
		$(window).scroll(function(a) {
			if ($(this).scrollTop() == 0) {
				$("#toTop").hide();
			}
			if ($(this).scrollTop() != 0) {
				$("#toTop").show();
			}
		});
		$("#toTop").click(function(a) {
			$("html,body").animate({
				scrollTop: "0px"
			}, 666);
		})
	}
	$('dd[id^="video_id_"]').click(function(a) {
		var b = $(this).attr("data");
		layer.open({
			type: 2,
			title: false,
			closeBtn: 1,
			area: ['716px', '546px'],
			shadeClose: false,
			skin: 'yourclass',
			content: (b) + '.html'
		});
	});
	$.getScript("http://www.hengjiansg.com/tpl/mytpl/js/footjs.js");
});
setTimeout(function() {
	layer.open({
		type: 1,
		title: false,
		closeBtn: true,
		area: '600px;',
		shade: 0.6,
		id: 'LAY_layuipro',
		resize: false,
		moveType: 1,
		content: '<div class="pt_30 pb_10 lh25 ys_r f14 b_c oh" style="background:#fafafa url(tpl/mytpl/images/callme.jpg) no-repeat top right;"><div class="wd-65 pb_30 fl oh"><h3 class="pl_20 lh40 ys_y fw_b">资深医务顾问微信在线...</h3><p class="pt_10 pr_20 pb_20 pl_20">您已经停留一段时间了，是否还有疑问没有得到解答？<br />恒健海外资深医务顾问在线为您提供泰国试管婴儿相关专业咨询服务，扫描微信即可获得免费咨询机会。</p><div class="pr_20 pl_20"><span class="mt_10 mr_20 fl lh40 dp_ib f16 ys_y fw_b ta_c"><img src="tpl/mytpl/images/hjgw-j.jpg" width="110" height="110" class="p_5 dp_b bg_f" alt="恒健海外纪顾问" />纪顾问</span><span class="mt_10 mr_20 fl lh40 dp_ib f16 ys_y fw_b ta_c"><img src="tpl/mytpl/images/hjgw-r.jpg" width="110" height="110" class="p_5 dp_b bg_f" alt="恒健海外宋顾问" />宋顾问</span></div></div></div>'
	});
}, 180000);
