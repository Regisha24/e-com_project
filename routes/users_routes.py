from flask import Blueprint, request, jsonify
from db import db_connection
from flask_cors import CORS

user_bp = Blueprint('user', __name__)
CORS(user_bp)  # Enable CORS for this blueprint

# Get all users
@user_bp.route('/users', methods=['GET'])
def get_all_users():
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM `user`")
        users = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)})

# Get user by ID
@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM `user` WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if user:
            return jsonify(user)
        return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)})

# Add new user (admin purpose)
@user_bp.route('/users', methods=['POST'])
def add_user():
    try:
        data = request.json
        name = data['name']
        email = data['email']
        password = data['password']

        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO `user` (name, email, password) VALUES (%s, %s, %s)",
            (name, email, password)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)})

# Update user
@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.json
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE `user` SET name=%s, email=%s, password=%s WHERE id=%s",
            (data['name'], data['email'], data['password'], user_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)})

# Delete user
@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM `user` WHERE id = %s", (user_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)})

# User registration
@user_bp.route('/user/register', methods=['POST', 'OPTIONS'])
def register_user():
    if request.method == 'OPTIONS':
        return jsonify({}), 200  # CORS preflight

    try:
        data = request.json
        name = data['name']
        email = data['email']
        password = data['password']

        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO `user` (name, email, password) VALUES (%s, %s, %s)",
            (name, email, password)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ User login route with validation
@user_bp.route('/user/login', methods=['POST'])
def login_user():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({"error": "All fields (name, email, password) are required"}), 400

        conn = db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM `user` WHERE name = %s AND email = %s", (name, email))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            if user['password'] == password:
                return jsonify({"message": "Login successful", "user": user}), 200
            else:
                return jsonify({"error": "Incorrect password"}), 401
        else:
            return jsonify({"error": "Invalid name or email"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
