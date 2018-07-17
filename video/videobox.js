// --------------------------------------------------------------------
// videobox.js
// http://www.pupinc.com/videobox/
// --------------------------------------------------------------------

// Videobox object
VideoBox = Class.create();
VideoBox.prototype = {
	// Initialize object.
	initialize: function(index, item) {
		this.index = index;
		this.item = item;
		this.item.addClassName('videoboxjs');
		this.list = this.item.getElementsBySelector('ul')[0];
		// Create div.bigvideo and add it just before the ul.
		this.bigvideo = document.createElement('div');
		Element.addClassName(this.bigvideo, 'bigvideo');
		this.item.insertBefore(this.bigvideo, this.list);
		// Create array of videothumbs.
		this.thumbs = new Array;
		// Opera 9 doesn't like 'li a' in getElementsBySelector, so you
		// have to break it apart.
		var links = this.item.getElementsBySelector('li');
		for (var i=0; i < links.length; i++) {
			this.thumbs[i] = new VideoThumb(index, i, links[i].getElementsBySelector('a')[0]);
		}
		// Load up the first video.
		this.swap(0);
	},
	// Replace existing video with new one.
	swap: function(index) {
		// IE 6 won't show the video unless something else is in the box.
		// I chose to add a <br /> which I hide via CSS.
		this.bigvideo.innerHTML = '<br /><object width="425" height="350"><param name="movie" value="' + this.thumbs[index].video + '"></param><param name="wmode" value="transparent"></param><embed src="' + this.thumbs[index].video + '" type="application/x-shockwave-flash" wmode="transparent" width="425" height="350"></embed></object>';
		// Deselect all the thumbnails.
		this.thumbs.invoke('deselect');
		// Select the current thumbnail.
		this.thumbs[index].select();
	}
};

// Videothumb object
VideoThumb = Class.create();
VideoThumb.prototype = {
	// Initialize object.
	initialize: function(boxindex, index, link) {
		this.boxindex = boxindex;
		this.index = index;
		this.item = link;
		this.href = this.item.getAttribute('href');
		// Extract the v querystring value from the href. Youtube uses this
		// value for everything.
		this.videocode = this.href.toQueryParams().v;
		// Direct link to the video for use in the object/embed
		this.video = 'http://www.youtube.com/v/' + this.videocode;
		// Create thumbnail image and append it inside the list item
		var img = document.createElement('img');
		img.src = 'http://img.youtube.com/vi/' + this.videocode + '/default.jpg';
		img.alt = this.item.innerHTML;
		img.title = this.item.innerHTML;
		this.item.innerHTML = "";
		this.item.appendChild(img);
		// Observe the click event.
		Event.observe(this.item, 'click', this.swap.bindAsEventListener(this));
	},
	swap: function(evt) {
		// Call the swap method of the parent videobox with the thumbnail
		// thumbnail index as a parameter.
		aVB[this.boxindex].swap(this.index);
		// Stop the event so the browser doesn't follow the link.
		if (evt) {
			Event.stop(evt);
		}
	},
	select: function() {
		this.item.addClassName('current');
	},
	deselect: function() {
		this.item.removeClassName('current');
	}
};

// Don't do anything if we're using Opera 8 or earlier.
if (!Prototype.Browser.Opera || (Prototype.Browser.Opera && navigator.userAgent.toLowerCase().charAt(navigator.userAgent.toLowerCase().indexOf('opera') + 6) > 8)) {
	// Create array of videoboxes so you can have more than one on a page.
	var aVB = new Array;
	$$('div.videobox').each ( function(videobox, index) {
		aVB[index] = new VideoBox(index, videobox);
	});
}
