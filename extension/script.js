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
	return string.replace("@","").replace("#","").replace(">","").ltrim().rtrim().toLowerCase();
}

addCommas = function(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

getLinks = function(string) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return string.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
}

var box = "<div id='boxHackerface'";
if (localStorage['shown']==0) {
	box += " class='hackerboxHidden'";
}
box += "><div class='hackerfaceHide' style='position:fixed;margin-left:285px;margin-top:30px;z-index:100;cursor:pointer;'>x</div>";
box += "<div id='boxHackerfaceInner'><div class='hackerfaceEntry'>Hover a name to see magic</div></div></div>";
$('tbody:eq(0)').css({"position":"relative"}).prepend(box);

var msg = "<td style='text-align:right;color:black;cursor:pointer;' id='hackerfaceHide' class='hackerfaceHide'>";
if (localStorage['shown']==1) {
	msg += "Hide hackerface";
} else {
	msg += "Show hackerface";
}
msg += "</td>";
$('tr:eq(1) td:eq(1)').after(msg);

$(".hackerfaceHide").live("click",function() {
	$("#boxHackerface").toggleClass("hackerboxHidden");
	if ($("#boxHackerface").hasClass("hackerboxHidden")) {
		$("#hackerfaceHide").html("Show hackerface");
		localStorage['shown'] = 0;
	} else {
		$("#hackerfaceHide").html("Hide hackerface");		
		localStorage['shown'] = 1;
	}
});

displayProfile = function(face) {
	var profile = "";
	profile += "<div class='hackerfaceEntry'>";
		if (face.pictures[0]) {
			picture = face.pictures[0];
		} else {
			picture = "https://raw.github.com/Gwendall/hackerface/gh-pages/stache.png";
		}
		profile += "<div style='width:50px;height:50px;float:left;'><img style='width:50px;height:50px;border-radius:2px;' src='"+picture+"'></div>";
		profile += "<div style='margin-left:10px;float:left;font-weight:bold;'>";
			profile += "<div>"+face.names[0]+"</div>";
			profile += "<div>"+face.locations[0]+"</div>";
			profile += "<div>"+face.user+" ("+addCommas(face.karma)+")</div>";
		profile += "</div>";
	profile += "</div>";
	if (face.about) {
		profile += "<div class='hackerfaceEntry'>HN bio: "+getLinks(face.about)+"</div>";		
	}

	profile += "<div class='hackerfaceEntry'>";
		profile += "<div>";
			profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/hackernews.png' class='hackerfaceIcon'>";
			profile += "<a class='hackerfaceUsername' href='http://http://news.ycombinator.com/user?id="+face.user+"' target='_blank'>"+face.user+"</a>";
		profile += "</div>";
	profile += "</div>";			

	if (face.twitters.length) {
//		for (i in face.twitters) {
			profile += "<div class='hackerfaceEntry'>";
				profile += "<div>";
					profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/twitter.png' class='hackerfaceIcon'>";
					profile += "<a class='hackerfaceUsername' href='http://twitter.com/"+face.twitters[0]+"' target='_blank'>"+face.twitters[0]+"</a>";
				profile += "</div>";
			profile += "</div>";			
//		}
	}
	if (face.githubs.length) {
		profile += "<div class='hackerfaceEntry'>";
			profile += "<div>";
				profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/github.png' class='hackerfaceIcon'>";
				profile += "<a class='hackerfaceUsername' href='http://github.com/"+face.githubs[0]+"' target='_blank'>"+face.githubs[0]+"</a>";
			profile += "</div>";
		profile += "</div>";			
	}
	if (face.linkedins.length) {
		profile += "<div class='hackerfaceEntry'>Linkedin: <a href='http://linkedin.com/in/"+face.linkedins[0]+"' target='_blank'>"+face.linkedins[0]+"</a></div>";		
	}
	if (face.emails.length) {
		for (i in face.emails) {
			profile += "<div class='hackerfaceEntry'>Email: <a href='mailto:"+face.emails[i]+"'>"+face.emails[i]+"</a></div>";			
		}
	}
//	for (i in face.websites) {
	if (face.websites.length) {
		profile += "<div class='hackerfaceEntry'>Website: <a href='"+face.websites[0]+"' target='_blank'>"+face.websites[0]+"</a></div>";		
	}
	return profile;
}

$(document).ready(function() {

//	var regUrls = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;;
	var regUrls = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
//	var regEmails = /^\S+@\S+\.\S+$/;
	var regEmails = /^[A-Z0-9\._%+-]+(@|\s*\[\s*at\s*\]\s*)[A-Z0-9\.-]+(\.|\s*\[\s*dot\s*\]\s*)[a-z]{2,6}$/gim;
	var regTwitters = /(^|\s|>)@(\w+)/g;
	var forb_twitter = ["share","widgets.js","intent","replies","statuses","!","search","import",undefined];
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
		if (details.match(regEmails)!==null) {
			for (i in details.match(regEmails)) {
				var email = details.match(regEmails)[i];
				if ((!inArray(email,face.emails))&&(email!="0")) {
					face.emails.push(email);
				}
			}
		}
		if (details.match(regTwitters)!==null) {
			for (i in details.match(regTwitters)) {
				var twitter = cleanUsername(details.match(regTwitters)[i]);
				if ((!inArray(twitter,face.twitters))&&(!inArray(twitter,forb_twitter))&&(twitter!="")) {
					face.twitters.push(twitter);
					face.pictures.push("https://api.twitter.com/1/users/profile_image?screen_name="+twitter+"&size=normal");
					$.ajax({
						accepts: "text/html",
						url: "https://api.twitter.com/1/users/show.json?include_entities=true&screen_name="+twitter
					}).success(function(data) {
						console.log(data);
						face.twitterDetails = data;
						face.locations.push(data.location);
						face.bios.push(data.description);
						face.names.push(data.name);
						$("#boxHackerfaceInner").html(displayProfile(face));						
					});
				}
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
							if (twitter!==undefined) {
								twitter = twitter.split("?")[0];
							}
						}
					}
					delete face.websites[i];
					if ((!inArray(twitter,face.twitters))&&(!inArray(twitter,forb_twitter))&&(twitter!="")) {
						face.twitters.push(twitter);
						face.pictures.push("https://api.twitter.com/1/users/profile_image?screen_name="+twitter+"&size=normal");
						$.ajax({
							dataType: "json",
							url: "https://api.twitter.com/1/users/show.json?include_entities=true&screen_name="+twitter
						}).success(function(data) {
							console.log(data);
							face.twitterDetails = data;
							face.locations.push(data.location);
							face.bios.push(data.description);
							face.names.push(data.name);
							$("#boxHackerfaceInner").html(displayProfile(face));						
						});
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
						$.ajax({
//							accepts: "text/html",
							dataType: "json",
							url: "https://api.github.com/users/"+github
						}).success(function(data) {
							face.githubDetails = data;
							console.log(data);
						});
					}					
				} else if (face.websites[i].indexOf("linkedin.com/in") !=-1) {
					var linkedin = cleanUsername(face.websites[i]);
					if (linkedin!==undefined) {
						linkedin = linkedin.split("linkedin.com/in/")[1];
						if (linkedin!==undefined) {
							linkedin = linkedin.split("/")[0];
						}
					}
					delete face.websites[i];
					if (!inArray(linkedin,face.linkedins)) {
						face.linkedins.push(linkedin);
					}					
				}
			}
		}
		return face;
	}

	//	$('td').live("mouseenter",function() {
	//		$(this) = $(this).find('a[href^="user?"]:eq(0)');
	
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
			face.emails = [];
			face.twitters = [];
			face.twitterDetails = {};
			face.githubs = [];
			face.githubDetails = {};
			face.linkedins = [];
			face.pictures = [];
			face.locations = [];
			face.bios = [];
			face.names = [];

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
					face.bios.push(face.about);
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