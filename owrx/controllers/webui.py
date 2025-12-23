from . import Controller
from owrx.controllers.assets import AssetsController
import os
import pkg_resources

class WebUIController(AssetsController):
    """
    Serves the new React-based web UI from the built webui directory.
    """
    def getFilePath(self, file):
        # Serve from htdocs/static/webui (where Vite builds to)
        webui_path = pkg_resources.resource_filename("htdocs", "static/webui")
        file_path = os.path.join(webui_path, file)
        
        # If file doesn't exist in webui, try to serve index.html for SPA routing
        if not os.path.exists(file_path) or not os.path.isfile(file_path):
            index_path = os.path.join(webui_path, "index.html")
            if os.path.exists(index_path):
                return index_path
        
        return file_path

    def indexAction(self):
        # For root path or any non-file path, serve index.html for SPA routing
        index_path = pkg_resources.resource_filename("htdocs", "static/webui/index.html")
        if os.path.exists(index_path):
            self.serve_file("index.html")
        else:
            self.send_response("WebUI not built. Run 'npm run build' in the webui directory.", code=404)

