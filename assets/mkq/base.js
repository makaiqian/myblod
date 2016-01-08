	
(function() {
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
		

}());