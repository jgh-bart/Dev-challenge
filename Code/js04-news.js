// Heroku CORS proxy necessary due to lack of CORS 'Access-Control-Allow-Origin' header
var corsProxy = "https://cors-anywhere.herokuapp.com/"
var url = corsProxy + "https://rss.nytimes.com/services/xml/rss/nyt/World.xml";

$(document).ready(accessRSS(url));

// function to access a URL and return XML content
function accessRSS(url) {
	$.ajax({
		url: url,
		type: "GET",
		crossDomain: true,
		datatype: "xml",
		success: function (result) {
			var newsItem = result.getElementsByTagName("item")[0];
			console.log("ITEM", newsItem);
			var title       = childNodeByTag(newsItem, "title").textContent;
			var description = childNodeByTag(newsItem, "description").textContent;
			if (childNodeByTag(newsItem, "media:content")) {
				var img     = childNodeByTag(newsItem, "media:content").getAttribute("url");
			}
			if (childNodeByTag(newsItem, "media:description")) {
				var imgDescription = childNodeByTag(newsItem, "media:description").textContent;
			}
			$("#newsHeadline").html(title);
			$("#homeNewsHeadline").html(title);
			$("#newsBody").html(description);
			if (childNodeByTag(newsItem, "media:content")) {
				if (childNodeByTag(newsItem, "media:description")) {
					var newsImage = `<img class="centre-img" src=${img} alt=${imgDescription}/>`;
				} else {
					var newsImage = `<img class="centre-img" src=${img}/>`;
				}
				$("#newsImageHolder").append($(newsImage));
			}
		},
		error: function (error) {
			console.log(error);
		}
	})
}

// function to find the first child of a parent node with a given tag
function childNodeByTag(parentNode, tag) {
	var n = parentNode.firstChild;
	while (n.tagName !== tag) {
		if (!n.nextSibling) {
			return null;
		} else {
			n = n.nextSibling;
		}
	}
	return n;
}