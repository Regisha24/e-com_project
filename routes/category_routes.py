from flask import Blueprint, request, jsonify, send_from_directory
from db import db_connection
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

category_bp = Blueprint('category', __name__)
CORS(category_bp)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static', 'images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ✅ GET all categories with DISTINCT to avoid duplicates
@category_bp.route('/category', methods=['GET'])
def get_all_categories():
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT MIN(id) as id, name, image, description, price
            FROM category
            GROUP BY name, image, description, price
        """)
        categories = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(categories)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ✅ GET category by ID
@category_bp.route('/category/<int:category_id>', methods=['GET'])
def get_category_by_id(category_id):
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM category WHERE id = %s", (category_id,))
        category = cursor.fetchone()
        cursor.close()
        conn.close()
        if category:
            return jsonify(category)
        return jsonify({"message": "Category not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Add new category with image
@category_bp.route('/category', methods=['POST'])
def add_category():
    try:
        name = request.form['name']
        description = request.form.get('description', '')
        image_file = request.files.get('image')

        filename = ''
        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(UPLOAD_FOLDER, filename))

        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO category (name, description, image) VALUES (%s, %s, %s)",
            (name, description, filename)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Category added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Update category
@category_bp.route('/category/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    try:
        name = request.form['name']
        description = request.form.get('description', '')
        image_file = request.files.get('image')

        filename = ''
        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(UPLOAD_FOLDER, filename))
        else:
            filename = request.form.get('existing_image', '')  # use existing if no new file

        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE category SET name = %s, description = %s, image = %s WHERE id = %s",
            (name, description, filename, category_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Category updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Delete category
@category_bp.route('/category/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM category WHERE id = %s", (category_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Category deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Serve category images
@category_bp.route('/category/images/<filename>')
def serve_category_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
