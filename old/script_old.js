jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}

inArray = function(needle,haystack) {
	var result = false;
    for (var i = 0; i < haystack.length; i++) {
        if (haystack[i] == needle) {
			result = true;
		}
    }
	return result;
}

cleanUsername = function(string) {
	return string.replace("@","").replace("#","").ltrim().rtrim();
}

var box = "<div id='boxHackerface'><div id='boxHackerfaceInner'>hello world</div></div>";
$('a[href^="user?"]:eq(1)').parent().parent().parent().parent().parent().css({"position":"relative"}).prepend(box);
$(".default").css({"width":"600px"});

$(document).ready(function() {

	var regUrls = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;;
	var regTwitters = /(^|\s)@(\w+)/g;
	var forb_twitter = ["share","widgets.js","intent"];
	var faces = [];	
	var i = 0;	
	var picSize = 40;

	extractContacts = function(details,face) {
		if (details.match(regUrls)!==null) {
			for (i in details.match(regUrls)) {
				var url = details.match(regUrls)[i];
				if ((url.indexOf("http://news.ycombinator.com")==-1)&&(url.indexOf("http://ycombinator.com")==-1)&&(!inArray(url,face.websites))) {
					face.websites.push(url);
				}
			}
		}
		if (details.match(regTwitters)!==null) {
			for (i in details.match(regTwitters)) {
				var twitter = cleanUsername(details.match(regTwitters)[i]);
				face.twitters.push(twitter);											
			}
		}
		if (face.websites.length) {
			for (i in face.websites) {
				if (face.websites[i].indexOf("twitter.com") !=-1) {
					var twitter = cleanUsername(face.websites[i].split("twitter.com/")[1].split("/")[0]);
					delete face.websites[i];
					if ((!inArray(twitter,face.twitters))&&(!inArray(twitter,forb_twitter))) {
						face.twitters.push(twitter);
					}					
				} else if (face.websites[i].indexOf("github.com") !=-1) {
					var github = cleanUsername(face.websites[i].split("github.com/")[1].split("/")[0]);
					delete face.websites[i];
					if (!inArray(github,face.githubs)) {
						face.githubs.push(github);
					}					
				} else if (face.websites[i].indexOf("linkedin.com/in") !=-1) {
					var linkedin = face.websites[i];
					delete face.websites[i];
					if (!inArray(linkedin,face.linkedins)) {
						face.linkedins.push(linkedin);
					}					
				}
			}
		}
		return face;
	}

	loopThroughUrls = function(face) {
		face_b = face;
		if (face.websites.length) {
			for (i in face.websites) {
				if (face.websites[i] !== undefined) {
					$.ajax({
						accepts: "text/html",
						url: face.websites[i]
					}).success(function(data) {
						if (data!==null) {				
							face_b = extractContacts(data,face_b);
						}
					});							
				}
			}					
		}
		createEntry(face_b);
		return face_b;		
	}
	
	parseUser = function(i) {
		var face = faces[i];
		face.request = "http://api.thriftdb.com/api.hnsearch.com/users/_search?filter[fields][username][]="+face.user;
		face.websites = [];
		face.twitters = [];
		face.githubs = [];
		face.linkedins = [];
		$.ajax({
			accepts: "text/html",
			url : face.request
		}).success(function(data) {
			face.about = $.parseJSON(data)["results"][0]["item"]["about"];
			if (face.about !== null) {
				face = extractContacts(face.about,face);
				face = loopThroughUrls(face);
			}
		});
		return face;
	}

	createEntry = function(face) {
		var entry = "";
		if ((face.twitters) && (face.twitters.length > 0) && (face.twitters[0]!="")) {
			face.twitterPic = "https://api.twitter.com/1/users/profile_image?screen_name="+face.twitters[0]+"&size=normal";
			face.twitterLink = "http://twitter.com/"+face.twitters[0];
			$("#yfacerPic-"+face.pos).attr("src",face.twitterPic).show();
			$("#yfacerLink-"+face.pos).attr("href",face.twitterLink);
			$("#yfacerName-"+face.pos).attr("href",face.twitterLink).html(face.twitters[0]).before(" | @");
			$("#user-"+face.pos).css("margin-left","30px");
		}
		return true;
	}

/*
	$('a[href^="user?"]').each(function(e) {
		var face = {};
		face.pos = i;
		face.user = $(this).attr("href").replace("user?id=","");
		$(this).attr("id","user-"+i);
		$(this).after("<a href='#' target='_blank' class='yfacerName' id='yfacerName-"+i+"'></a> | ");
		$(this).before("<a href='#' target='_blank' id='yfacerLink-"+i+"'><img src='' class='yfacerPic' id='yfacerPic-"+i+"'></a>");
		faces.push(face);
		i++;
	});

	for (i in faces) {
		faces[i] = parseUser(i);
		console.log(faces[i]);
	}
*/

//	$('a[href^="user?"]:eq(1)').parent().parent().parent().parent().css({"width":"600px"}).parent().css({"position":"relative"}).prepend(box);
//	$(".top").css({"width":"600px"});
//	$(".title").css({"width":"600px"});

	var to;
	$('a[href^="user?"]').live("mouseenter",function() {
		var user = $(this);
		if(to!=null) {
			clearTimeout(to);
			to = null;
		}
		to = setTimeout(function() {
			user = user.attr("href").replace("user?id=","");
			$("#boxHackerfaceInner").html(user);
		},1000); 			
	});

	$('a[href^="user?"]').live("mouseleave",function() {
		var face = {};
		face.pos = i;
		face.user = $(this).attr("href").replace("user?id=","");
		face = parseUser(i);

//		$("#boxHackerfaceInner").html("outside");		
	});
	

});