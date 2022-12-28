let http = require("http");
let httpProxy = require("http-proxy");
let proxy = new httpProxy.createProxyServer({ proxyTimeout: 180000 });

var proxyServer = http.createServer(async function (req, res) {
	try {

        if (req.url === '/favicon.ico') {
			res.writeHead(204);
			res.end();
			return;
		}
        
		console.log("req.url : ", req.url);
        
        // NOTE: this logic of getting port I have simplified for DEMO purpose, in actual URL won't be having port number etc.
        let uiPort = req.url.split("/")[1].split("_")[1]; // gets cotainer name from the URL
		
        // if (req.url.split("/").length == 1) {
		// 	req.url = "/";
		// } else if (req.url.split("/").length > 1) {
		// 	req.url = req.url.split("/").slice(2).join("/");
		// }

        // "/containerId_3001/@vite/client".split("/")[1].split("_")[1]
		let targetUrl = "http://localhost" + ":" + uiPort + req.url.split("/").join("/");
        console.log("targetUrl : ", targetUrl);
		proxy.web(req, res, {
			target: targetUrl,
		});

    } catch (exception) {
		console.error(
			"Request URL: " + req.url + " " + exception + " exception"
		);
		res.statusCode = 500;
		res.statusMessage = exception;
		res.writeHead(500);
		res.end();
	}
});


proxy.on('error', function (err, req, res) {
    console.error("Request URL: "+req.url+" Error while connecting to container :", err);
    res.writeHead(500, {'Content-Type': 'text/html'});
    res.write(`Error`);
    res.end();
});

var server = proxyServer.listen("5000", function () {
	console.info("proxy server started on port 5000");
});
