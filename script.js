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

cleanTwitterUsername = function(string) {
	return string.replace("@","").replace("#","").ltrim().rtrim();
}

$(document).ready(function() {

	var regUrls = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;;
	var regTwitters = /(^|\s)@(\w+)/g;
	var forb_twitter = ["share","widgets.js"];

	parseUrl = function(url,face) {
		$.ajax({
			accepts: "text/html",
			url : url
		}).success(function(data) {
			if (data!==null) {				
				face = extractContacts(data,face);
			}
		});
		return face;
	}
	
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
				var twitter = cleanTwitterUsername(details.match(regTwitters)[i]);
				face.twitters.push(twitter);											
			}
		}
		if (face.websites.length) {
			for (i in face.websites) {
				if (face.websites[i].indexOf("twitter.com") !=-1) {
					var twitter = cleanTwitterUsername(face.websites[i].split("twitter.com/")[1].split("/")[0]);
					if ((!inArray(twitter,face.twitters))&&(!inArray(twitter,forb_twitter))) {
						face.twitters.push(twitter);
					}					
				}
				if (face.websites[i].indexOf("github.com") !=-1) {
					var github = face.websites[i];
					if (!inArray(github,face.githubs)) {
						face.githubs.push(github);
					}					
				}
				if (face.websites[i].indexOf("linkedin.com/in") !=-1) {
					var linkedin = face.websites[i];
					if (!inArray(linkedin,face.linkedins)) {
						face.linkedins.push(linkedin);
					}					
				}
			}
		}
		return face;
	}
	
	parseUser = function(face) {
		face.request = "http://api.thriftdb.com/api.hnsearch.com/users/_search?filter[fields][username][]="+face.user;
		face.websites = [];
		face.twitters = [];
		face.githubs = [];
		face.linkedins = [];
		return $.ajax({
			accepts: "text/html",
			url : face.request
		}).success(function(data) {
			data = $.parseJSON(data)["results"][0]["item"]["about"];
			if (data !== null) {
				face.details = data;
				face = extractContacts(data,face);
				if (face.websites.length) {
					for (i = 0; i < face.websites.length; i++) {
						if (face.websites[i].indexOf("twitter.com") == -1) {
							face = parseUrl(face.websites[i],face);
						}
					}
					createEntry(face);
				}
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
			$("#yfacerName-"+face.pos).attr("href",face.twitterLink).html("(@"+face.twitters[0]+")");
		}
		return true;
	}
	
	var i = 0;	
	var picSize = 40;
	$(".subtext").find('a[href^="user?"]').each(function(e) {
		var face = {};
		face.pos = i;
		face.user = $(this).attr("href").replace("user?id=","");
		$(this).attr("id","user-"+i);
		$(this).after(" <a href='#' target='_blank' class='yfacerName' id='yfacerName-"+i+"'></a>");
		var img ="<a href='#' target='_blank' id='yfacerLink-"+i+"'><img src='' class='yfacerPic' id='yfacerPic-"+i+"'></a>";
		$(this).parent().parent().prev().find("td:eq(0)").attr("align","left").prepend(img);
		parseUser(face);
		i++;
	});
	
});