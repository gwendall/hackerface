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

if ($('a[href^="user?"]').length) {
	var box = "<div id='boxHackerface'";
	if (localStorage['shown']==0) {
		box += " class='hackerboxHidden'";
	}
	box += ">";
		box += "<div class='hackerfaceHide hackerfaceCross'>x</div>";
		box += "<div id='boxHackerfaceInner'>";
			box += "<div class='hackerfaceEntry'>";
				box += "<div>"+$('a[href^="user?"]').length+" users found in this page.</div>";
				box += "<div style='margin-top:3px;'>Hover over a username to get details.</div>";
			box += "</div>";
		box += "</div>";
	box += "</div>";
	$('tbody:eq(0)').css({"position":"relative"}).prepend(box);

	var msg = "<td style='text-align:right;color:black;cursor:pointer;' id='hackerfaceHide' class='hackerfaceHide'>";
	if (localStorage['shown']==1) {
		msg += "hide hackerface";
	} else {
		msg += "show hackerface";
	}
	msg += "</td>";
	$('tr:eq(1) td:eq(1)').after(msg);	
}

$(".hackerfaceHide").live("click",function() {
	$("#boxHackerface").toggleClass("hackerboxHidden");
	if ($("#boxHackerface").hasClass("hackerboxHidden")) {
		$("#hackerfaceHide").html("show hackerface");
		localStorage['shown'] = 0;
	} else {
		$("#hackerfaceHide").html("hide hackerface");		
		localStorage['shown'] = 1;
	}
});

displayProfile = function(face) {
	var profile = "";
	profile += "<div class='hackerfaceEntry'>";
		profile += "<div style='display:table;width:100%;'>";
			if (face.pictures[0]) {
				picture = face.pictures[0];
			} else {
				picture = "https://raw.github.com/Gwendall/hackerface/gh-pages/stache.png";
			}
			profile += "<div style='width:50px;height:50px;float:left;'><img style='width:50px;height:50px;border-radius:2px;' src='"+picture+"'></div>";
			profile += "<div style='margin-left:10px;float:left;'>";
				if (face.names[0]!=undefined) {
					profile += "<div style='font-weight:bold;'>"+face.names[0]+"</div>";				
				}
				if (face.locations[0]!=undefined) {
					profile += "<div style='margin-top:5px;font-size:11px;'>"+face.locations[0]+"</div>";				
				}
			profile += "</div>";
		profile += "</div>";
		if (face.about) {
			profile += "<div style='width:100%;margin-top:10px;'>"+getLinks(face.about)+"</div>";		
		}
	profile += "</div>";

	profile += "<div class='hackerfaceEntry'>";
		profile += "<div>";
			profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/hackernews.png' class='hackerfaceIcon'>";
			profile += "<a class='hackerfaceUsername' href='http://news.ycombinator.com/user?id="+face.user+"' target='_blank'>"+face.user+"</a>";
			profile += "<span style='margin-left:3px;margin-right:3px;color:gray;'>·</span>"
			profile += "<span>"+addCommas(face.karma)+" karma</span>";
		profile += "</div>";
	profile += "</div>";			
	if (face.facebooks.length) {
		profile += "<div class='hackerfaceEntry'>";
			profile += "<div>";
				profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/facebook.png' class='hackerfaceIcon'>";
				profile += "<a class='hackerfaceUsername' href='http://facebook.com/"+face.facebooks[0]+"' target='_blank'>Facebook</a>";
			profile += "</div>";
		profile += "</div>";			
	}
	if (face.twitters.length) {
//		for (i in face.twitters) {
			profile += "<div class='hackerfaceEntry'>";
				profile += "<div>";
					profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/twitter.png' class='hackerfaceIcon'>";
					profile += "<a class='hackerfaceUsername' href='http://twitter.com/"+face.twitters[0]+"' target='_blank'>"+face.twitters[0]+"</a>";
					if (face.twitterDetails.followers_count!==undefined) {
						profile += "<span style='margin-left:3px;margin-right:3px;color:gray;'>·</span>"
						profile += "<span>"+addCommas(face.twitterDetails.followers_count)+" followers</span>";
					}
					if (face.twitterDetails.friends_count!==undefined) {
						profile += "<span style='margin-left:3px;margin-right:3px;color:gray;'>·</span>"
						profile += "<span>"+addCommas(face.twitterDetails.friends_count)+" following</span>";
					}
				profile += "</div>";
			profile += "</div>";			
//		}
	}
	if (face.angels.length) {
		profile += "<div class='hackerfaceEntry'>";
			profile += "<div>";
				profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/angel.png' class='hackerfaceIcon'>";
				profile += "<a class='hackerfaceUsername' href='http://angel.co/"+face.angels[0]+"' target='_blank'>"+face.angels[0]+"</a>";
			profile += "</div>";
		profile += "</div>";			
	}
	if (face.googlepluses.length) {
		profile += "<div class='hackerfaceEntry'>";
			profile += "<div>";
				profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/googleplus.png' class='hackerfaceIcon'>";
				profile += "<a class='hackerfaceUsername' href='https://plus.google.com/"+face.googlepluses[0]+"' target='_blank'>Google+</a>";
			profile += "</div>";
		profile += "</div>";			
	}
	if (face.klouts.length) {
		profile += "<div class='hackerfaceEntry'>";
			profile += "<div>";
				profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/klout.png' class='hackerfaceIcon'>";
				profile += "<a class='hackerfaceUsername' href='http://klout.com/"+face.klouts[0]+"' target='_blank'>"+face.klouts[0]+"</a>";
				profile += "<span style='margin-left:3px;margin-right:3px;color:gray;'>·</span>"
				profile += "<span>"+Math.round(face.kloutDetails.score)+" klouts</span>";
			profile += "</div>";
		profile += "</div>";			
	}
	if (face.foursquares.length) {
		profile += "<div class='hackerfaceEntry'>";
			profile += "<div>";
				profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/foursquare.png' class='hackerfaceIcon'>";
				profile += "<a class='hackerfaceUsername' href='http://foursquare.com/user/"+face.foursquares[0]+"' target='_blank'>"+face.twitters[0]+"</a>";
			profile += "</div>";
		profile += "</div>";			
	}
	if (face.githubs.length) {
		profile += "<div class='hackerfaceEntry'>";
			profile += "<div>";
				profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/github.png' class='hackerfaceIcon'>";
				profile += "<a class='hackerfaceUsername' href='http://github.com/"+face.githubs[0]+"' target='_blank'>"+face.githubs[0]+"</a>";
				if (face.githubDetails.public_repos!==undefined) {
					profile += "<span style='margin-left:3px;margin-right:3px;color:gray;'>·</span>"
					profile += "<span>"+addCommas(face.githubDetails.public_repos)+" repos</span>";					
				}
				if (face.githubDetails.public_gists!==undefined) {
					profile += "<span style='margin-left:3px;margin-right:3px;color:gray;'>·</span>"
					profile += "<span>"+addCommas(face.githubDetails.public_gists)+" gists</span>";
				}
			profile += "</div>";
		profile += "</div>";			
	}
	if (face.linkedins.length) {
		profile += "<div class='hackerfaceEntry'>";
			profile += "<div>";
				profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/linkedin.png' class='hackerfaceIcon'>";
				profile += "<a class='hackerfaceUsername' href='http://linkedin.com/in/"+face.linkedins[0]+"' target='_blank'>"+face.linkedins[0]+"</a>";
			profile += "</div>";
		profile += "</div>";
	}
	if (face.emails.length && (face.emails[0]!=undefined)) {
		for (i in face.emails) {
			profile += "<div class='hackerfaceEntry'>";
				profile += "<div>";
					profile += "<img src='https://raw.github.com/Gwendall/hackerface/gh-pages/icons/mail.png' class='hackerfaceIcon'>";
					profile += "<a class='hackerfaceUsername' href='mailto:"+face.emails[i]+"' target='_blank'>"+face.emails[i]+"</a>";
				profile += "</div>";
			profile += "</div>";
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
	var regEmails = /^(>)?[A-Z0-9\._%+-]+(@|\s*\[\s*at\s*\]\s*)[A-Z0-9\.-]+(\.|\s*\[\s*dot\s*\]\s*)[a-z]{2,6}$/gim;
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
					// Get Twitter details
					$.ajax({
						accepts: "text/html",
						url: "https://api.twitter.com/1/users/show.json?include_entities=true&screen_name="+twitter
					}).success(function(data) {
						face.twitterDetails = data;
						face.locations.push(data.location);
						face.bios.push(data.description);
						face.about = data.description;
						face.names.push(data.name);
						$("#boxHackerfaceInner").html(displayProfile(face));						
					});
					// Get Foursquare details
					$.ajax({
						dataType: "json",
						url: "https://api.foursquare.com/v2/users/search?oauth_token=VYAAZLEWQT5QU4YN2YOF55NFMQ1WZNHGBAIYHPSCA00KBA5E&v=20120620&twitter="+twitter
					}).success(function(data) {
						data = data.response.results[0];
						face.foursquares.push(data.id);
						face.foursquareDetails = data;

						face.locations.push(data.homeCity);
						face.bios.push(data.bio);				
						face.names.push(data.firstName+" "+data.lastName);
						face.emails.push(data.contact.email);
						$("#boxHackerfaceInner").html(displayProfile(face));
						if (data.contact.facebook!==undefined) {
							face.facebooks.push(data.contact.facebook);
							$.ajax({
								dataType: "json",
								url: "http://graph.facebook.com/"+data.contact.facebook
							}).success(function(data) {
								face.names.push(data.name);
								face.facebookDetails = data;
								$("#boxHackerfaceInner").html(displayProfile(face));
							});
						}
					});
					// Get Klout details
					$.ajax({
						dataType: "json",
						url: "http://api.klout.com/v2/identity.json/twitter?key=t3zd36eerj6h2scqea86qex6&screenName="+twitter
					}).success(function(data) {
						$.ajax({
							dataType: "json",
							url: "http://api.klout.com/v2/user.json/"+data.id+"/score?key=t3zd36eerj6h2scqea86qex6"
						}).success(function(data) {
							face.klouts.push(twitter);
							face.kloutDetails = data;
							$("#boxHackerfaceInner").html(displayProfile(face));						
						});						
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
							face.twitterDetails = data;
							face.locations.push(data.location);
							face.bios.push(data.description);
							face.about = data.description;
							face.names.push(data.name);
							$("#boxHackerfaceInner").html(displayProfile(face));						
							$.ajax({
								dataType: "json",
								url: "http://api.klout.com/v2/identity.json/twitter?key=t3zd36eerj6h2scqea86qex6&screenName="+twitter
							}).success(function(data) {
								$.ajax({
									dataType: "json",
									url: "http://api.klout.com/v2/user.json/"+data.id+"/score?key=t3zd36eerj6h2scqea86qex6"
								}).success(function(data) {
									face.klouts.push(twitter);
									face.kloutDetails = data;
									$("#boxHackerfaceInner").html(displayProfile(face));						
								});						
							});
						}).error(function(data) {
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
							dataType: "json",
							url: "https://api.github.com/users/"+github
						}).success(function(data) {
							face.githubDetails = data;
							face.locations.push(data.location);
							face.bios.push(data.bio);
							face.names.push(data.name);
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
				} else if (face.websites[i].indexOf("angel.co") !=-1) {
					var angel = cleanUsername(face.websites[i]);
					if (angel!==undefined) {
						angel = angel.split("angel.co/")[1];
						if (angel!==undefined) {
							angel = angel.split("/")[0];
						}
					}
					delete face.websites[i];
					if (!inArray(angel,face.angels)) {
						face.angels.push(angel);
					}					
				} else if (face.websites[i].indexOf("plus.google.com") !=-1) {
					var googleplus = cleanUsername(face.websites[i]);
					if (googleplus!==undefined) {
						googleplus = googleplus.split("plus.google.com/")[1];
						if (googleplus!==undefined) {
							googleplus = googleplus.split("/")[0];
						}
					}
					delete face.websites[i];
					if (!inArray(googleplus,face.googlepluses)) {
						face.googlepluses.push(googleplus);
					}					
				}
			}
		}
		return face;
	}

	var to;
	var face = {};
	$('a[href^="user?"]').live("mouseenter",function() {
		face = {};
		face.user = $(this).attr("href").replace("user?id=","");
		if(to!=null) {
			clearTimeout(to);
			to = null;
		}
		to = setTimeout(function() {
			$("#boxHackerfaceInner").html("<div class='hackerfaceEntry'>Searching about "+face.user+"...</div>");
			face.request = "http://news.ycombinator.com/user?id="+face.user;
			face.websites = [];
			face.emails = [];
			face.twitters = [];
			face.twitterDetails = {};
			face.githubs = [];
			face.githubDetails = {};
			face.klouts = [];
			face.kloutDetails = {};
			face.facebooks = [];
			face.facebookDetails = {};
			face.foursquares = [];
			face.foursquareDetails = {};
			face.googlepluses = [];
			face.googleplusDetails = {};
			face.angels = [];
			face.angelDetails = {};
			face.linkedins = [];
			face.pictures = [];
			face.locations = [];
			face.bios = [];
			face.names = [];

			$.ajax({
				accepts: "text/html",
				url : face.request
			}).success(function(data) {
				$("#boxHackerfaceInner").html("<div class='hackerfaceEntry'>Found HN profile...</div>");
				if (face.user=="pg") {
					face.about = "@paulg";					
				} else {
					face.about = $(data).find('tbody:eq(2)').find('td:eq(9)')[0].innerHTML;
				}
				face.karma = $(data).find('tbody:eq(2)').find('td:eq(5)')[0].innerHTML;
				if (face.about !== null) {
					face.bios.push(face.about);
					extractContacts(face.about,face);
					if (face.websites.length) {
						for (i in face.websites) {
							if (face.websites[i] !== undefined) {
								$("#boxHackerfaceInner").html("<div class='hackerfaceEntry'>Extracting "+face.websites[i]+"...</div>");
								$.ajax({
									accepts: "text/html",
									url: face.websites[i]
								}).success(function(data) {
									$("#boxHackerfaceInner").html("<div class='hackerfaceEntry'>Extracted "+face.websites[i]+"</div>");
									if (data!==null) {
										extractContacts(data,face);
										if (i == face.websites.length - 1) {
											$("#boxHackerfaceInner").html(displayProfile(face));
										}
									} else {
										$("#boxHackerfaceInner").html("<div class='hackerfaceEntry'>Nothing found in "+face.websites[i]+"</div>");										
									}
								}).error(function(data) {
									$("#boxHackerfaceInner").html(displayProfile(face));
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