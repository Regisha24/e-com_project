from flask import Flask, request, jsonify, send_from_directory
from db import db_connection
from routes.products_routes import product_bp
from routes.users_routes import user_bp
from routes.addtocart import addtocart_bp 
from routes.category_routes import category_bp

from routes.order_routes import order_bp
from flask_cors import CORS
import os

app = Flask(__name__)

# ✅ Fix: Only allow requests from frontend (React app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
app.secret_key = 'your_secret_key_here'
CORS(app, supports_credentials=True)

# ✅ Register blueprints with proper prefixes
app.register_blueprint(product_bp, url_prefix='/api/product')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(addtocart_bp, url_prefix='/api')
app.register_blueprint(category_bp, url_prefix='/api')

app.register_blueprint(order_bp)

# ✅ Static file serving
@app.route('/images/<filename>')
def uploaded_file(filename):
    return send_from_directory('static/images', filename)

# ✅ Run the app

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # ensure port 5000 is used
