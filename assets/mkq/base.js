

(function() {
	window.template = function(tmpl, data) {
            if (!data) {
                return tmpl;
            } else {
                var tmplReg = /\{([!@]?)([\w-.]+)\}/g;
                return tmpl.replace(tmplReg, function(str, mask, key) {
                    var val = data[key];
                    if (val !== undefined) {
                        var ret;
                        if (val instanceof Function) {
                            ret = val.call(data);
                        } else {
                            ret = val;
                        }
                        if (ret === null) {
                            return ""
                        }
                        if (mask === '!') {
                            return ret;
                        } else if (mask === '@') {
                            return lib.aa.escapeHTML(ret)
                        }
                        return tmplReg.test(ret) ? lib.aa.template(ret, data) : ret;
                    } else {
                        //如果未能够在模板中找到对应的key就返回
                        return str
                    }
                });
            }
        }
	// 获取评论
	function getComments() {
		var comments = [];
		window.commentsInfo = function(data) {
			var res = data.response;
			for(key in res) {
				var comment = res[key].comments;
				comments.push(comment);
			}
			renderComments(comments);
		}
		// 获取threads
		function getThreads() {
			var threads = [];
			var $title = $('.post-title a');
			$title.each(function(i, item) {
				var href = $(item).attr('href');
				var thread = href.split('/')[1];
				threads.push(thread);
				threads.join(',');
			});
			requestComments(threads);
		}
		// 首页获取页面评论
		function requestComments(threads) {
			var $script = $('<script>');
			$script.attr('src', 'http://api.duoshuo.com/threads/counts.jsonp?callback=commentsInfo&short_name=makaiqian&threads=' + threads);
			$('body').append($script);
		}
		// 渲染评论
		function renderComments(comments) {
			var $container = $('.post-times');
			$container.each(function(i, item) {
				$(item).html('评论数：' + comments[i]);
			});
		}
		getThreads();
		
	}
	getComments();

	// 最近访客
	function getVisitor() {
		$.ajax({
			url: 'http://makaiqian.duoshuo.com/api/sites/listVisitors.json',
			type: 'get',
			dataType: 'json',
			data: {
				require: 'site,visitor,nonce,lang,unread,log,extraCss',
				site_ims: '1452274316',
				v: '15.11.15',
				num_items: 20
			},
			success: function(res) {
				var lists = res.response;
				$(lists).each(function(i, item) {
					setTimeout(function() {
						var html = template($('.tmpl-visitor-list').text(), item);
						$('.visitor-container').append(html);
					}, 200 * (i - 1));
				});
			}
		});
	}
	getVisitor();
}());