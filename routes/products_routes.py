from flask import Blueprint, request, jsonify, send_from_directory
from db import db_connection
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

product_bp = Blueprint('product', __name__)
CORS(product_bp)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static', 'images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif','webp','avif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# GET all products
@product_bp.route('', methods=['GET'])
def get_all_products():
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM product")
        products = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)})

# ADD product - POST /api/product
@product_bp.route('', methods=['POST'])
def add_product():
    try:
        name = request.form['name']
        price = request.form['price']
        stock = request.form['stock']
        description = request.form['description']
        category_id = request.form['category_id']

        image_file = request.files.get('image')
        image_filename = ''
        if image_file and allowed_file(image_file.filename):
            image_filename = secure_filename(image_file.filename)
            image_path = os.path.join(UPLOAD_FOLDER, image_filename)
            image_file.save(image_path)

        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO product (name, price, stock, image, description, category_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (name, price, stock, image_filename, description, category_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Product added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# UPDATE product - PUT /api/product/<product_id>
@product_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        name = request.form['name']
        price = request.form['price']
        stock = request.form['stock']
        description = request.form['description']
        category_id = request.form['category_id']

        image_file = request.files.get('image')
        image_filename = None
        if image_file and allowed_file(image_file.filename):
            image_filename = secure_filename(image_file.filename)
            image_path = os.path.join(UPLOAD_FOLDER, image_filename)
            image_file.save(image_path)

        conn = db_connection()
        cursor = conn.cursor()

        if image_filename:
            cursor.execute("""
                UPDATE product
                SET name=%s, price=%s, stock=%s, image=%s, description=%s, category_id=%s
                WHERE id=%s
            """, (name, price, stock, image_filename, description, category_id, product_id))
        else:
            cursor.execute("""
                UPDATE product
                SET name=%s, price=%s, stock=%s, description=%s, category_id=%s
                WHERE id=%s
            """, (name, price, stock, description, category_id, product_id))

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Product updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# DELETE product
@product_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM product WHERE id = %s", (product_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Product deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Serve image
@product_bp.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ✅ Get products by category ID
@product_bp.route('/category/<int:category_id>', methods=['GET'])
def get_products_by_category(category_id):
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM product WHERE category_id = %s", (category_id,))
        products = cursor.fetchall()
        cursor.close()
        conn.close()

        if not products:
            return jsonify([])  # return empty list instead of 404
        return jsonify(products)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
