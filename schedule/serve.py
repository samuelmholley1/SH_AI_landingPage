#!/usr/bin/env python3

import http.server
import socketserver
import os
import sys

# Change to the public directory
try:
    os.chdir('public')
    print("Starting server from public/ directory...")
except FileNotFoundError:
    print("Error: public/ directory not found. Run the build script first.")
    sys.exit(1)

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add headers to prevent caching during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}/")
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
