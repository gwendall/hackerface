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

printObject = function(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '<br/>';
  }
  return out;
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

getLinks = function(string) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return string.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
}

var box = "<div id='boxHackerface'><div id='boxHackerfaceInner'><div class='hackerfaceEntry'>Hover a name to see magic</div></div></div>";
$('a[href^="user?"]:eq(1)').parent().parent().parent().parent().parent().css({"position":"relative"}).prepend(box);
$(".default").css({"width":"600px"});

displayProfile = function(face) {
	var profile = "";
	profile += "<div class='hackerfaceEntry'>";
		profile += "<div style='width:50px;height:50px;float:left;'><img style='width:50px;height:50px;' src='"+face.pictures[0]+"'></div>";
		profile += "<div style='margin-left:10px;float:left;font-weight:bold;'>"+face.user+" ("+face.karma+")</div>";
	profile += "</div>";
	profile += "<div class='hackerfaceEntry'>"+getLinks(face.about)+"</div>";
	if (face.twitters.length) {
		profile += "<div class='hackerfaceEntry'>Twitter: <a href='http://twitter.com/"+face.twitters[0]+"' target='_blank'>"+face.twitters[0]+"</a></div>";		
	}
	if (face.githubs.length) {
		profile += "<div class='hackerfaceEntry'>Github: <a href='http://github.com/"+face.githubs[0]+"' target='_blank'>"+face.githubs[0]+"</a></div>";		
	}
//	for (i in face.websites) {
//		profile += "<div class='hackerfaceEntry'>"+face.websites[i]+"</div>";		
//	}
	return profile;
}

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
					if (url.substring(0,4)!="http") {
						url = "http://"+url;
						face.websites.push(url);
					} else {
						face.websites.push(url);
					}
				}
			}
		}
		if (details.match(regTwitters)!==null) {
			for (i in details.match(regTwitters)) {
				var twitter = cleanUsername(details.match(regTwitters)[i]);
				face.twitters.push(twitter);
				face.pictures.push("https://api.twitter.com/1/users/profile_image?screen_name="+twitter+"&size=normal");
			}
		}
		if (face.websites.length) {
			for (i in face.websites) {
				if (face.websites[i].indexOf("twitter.com") !=-1) {
					var twitter = cleanUsername(face.websites[i]);
					if (twitter!==undefined) {
						twitter = twitter.split("twitter.com/")[1]
						if (twitter!==undefined) {
							twitter = twitter.split("/")[0];
						}
					}
					delete face.websites[i];
					if ((!inArray(twitter,face.twitters))&&(!inArray(twitter,forb_twitter))) {
						face.twitters.push(twitter);
						face.pictures.push("https://api.twitter.com/1/users/profile_image?screen_name="+twitter+"&size=normal");
					}					
				} else if (face.websites[i].indexOf("github.com") !=-1) {
					var github = cleanUsername(face.websites[i]);
					if (github!==undefined) {
						github = github.split("github.com/")[1];
						if (github!==undefined) {
							github = github.split("/")[0];
						}
					}
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
	
	var to;
	$('a[href^="user?"]').live("mouseenter",function() {
		var face = {};
		face.user = $(this).attr("href").replace("user?id=","");
		if(to!=null) {
			clearTimeout(to);
			to = null;
		}
		to = setTimeout(function() {
			$("#boxHackerfaceInner").html("<div class='hackerfaceEntry'>Loading...</div>");
//			face.request = "http://api.thriftdb.com/api.hnsearch.com/users/_search?filter[fields][username][]="+face.user;
			face.request = "http://news.ycombinator.com/user?id="+face.user;
			face.websites = [];
			face.twitters = [];
			face.githubs = [];
			face.linkedins = [];
			face.pictures = [];
			$.ajax({
				accepts: "text/html",
				url : face.request
			}).success(function(data) {
				//				face.about = $.parseJSON(data)["results"][0]["item"]["about"];
				//				face.karma = $.parseJSON(data)["results"][0]["item"]["karma"];
				$("#boxHackerfaceInner").html("<div class='hackerfaceEntry'>Found HN profile...</div>");
				face.about = $(data).find('tbody:eq(2)').find('td:eq(9)')[0].innerHTML;
				face.karma = $(data).find('tbody:eq(2)').find('td:eq(5)')[0].innerHTML;
				if (face.about !== null) {
					face = extractContacts(face.about,face);
					if (face.websites.length) {
						var face_b = face;
						for (i in face.websites) {
							if (face.websites[i] !== undefined) {
								$("#boxHackerfaceInner").html("<div class='hackerfaceEntry'>Extracting "+face.websites[i]+"...</div>");
								$.ajax({
									accepts: "text/html",
									url: face.websites[i]
								}).success(function(data) {
									$("#boxHackerfaceInner").html("<div class='hackerfaceEntry'>Extracted "+face.websites[i]+"</div>");
									if (data!==null) {				
										face_b = extractContacts(data,face_b);
										if (i == face.websites.length - 1) {
											$("#boxHackerfaceInner").html(displayProfile(face_b));
										}
									} else {
										$("#boxHackerfaceInner").html("<div class='hackerfaceEntry'>Nothing found in "+face.websites[i]+"</div>");										
									}
								});							
							} else {
								$("#boxHackerfaceInner").html("<div class='hackerfaceEntry'>"+face.websites[i]+" undefined</div>");									
							}
						}					
					} else {
						$("#boxHackerfaceInner").html(displayProfile(face));						
					}
				} else {
					$("#boxHackerfaceInner").html(displayProfile(face));					
				}
			});
		},1000); 			
	});


});