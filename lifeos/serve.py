import http.server, socketserver, webbrowser, os

PORT = 8080
os.chdir(os.path.dirname(os.path.abspath(__file__)))

handler = http.server.SimpleHTTPRequestHandler
handler.extensions_map.update({'.html':'text/html','.js':'application/javascript','.css':'text/css'})

print(f"LifeOS running at http://localhost:{PORT}")
print("Press Ctrl+C to stop.\n")
webbrowser.open(f"http://localhost:{PORT}/index.html")

with socketserver.TCPServer(("", PORT), handler) as httpd:
    httpd.serve_forever()
