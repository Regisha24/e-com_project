from flask import Blueprint, request, jsonify
from db import db_connection
from flask_cors import CORS

addtocart_bp = Blueprint('cart', __name__)
CORS(addtocart_bp)

# ✅ Add item to cart (with check to avoid duplicates)
@addtocart_bp.route('/cart', methods=['POST'])
def add_order_item():
    try:
        data = request.get_json()
        product_id = data['product_id']
        quantity = data.get('quantity', 1)
        price = data['price']

        conn = db_connection()
        cursor = conn.cursor()

        # Check if the product already exists in the cart
        cursor.execute("SELECT id FROM cart WHERE product_id = %s", (product_id,))
        if cursor.fetchone():
            return jsonify({"message": "Item already in cart."}), 200

        # Insert into cart
        cursor.execute(
            "INSERT INTO cart (product_id, quantity, price) VALUES (%s, %s, %s)",
            (product_id, quantity, price)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Item added to cart successfully!"}), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ✅ Get all items in cart (ONLY THIS ONE — no duplicates!)
@addtocart_bp.route('/cart/all', methods=['GET'])
def get_order_items():
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                c.id, 
                c.product_id,
                p.name,
                p.image,
                p.stock,
                p.description,
                c.quantity,
                c.price
            FROM cart c
            LEFT JOIN product p ON c.product_id = p.id
        """)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(rows), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ✅ Check if item already in cart
@addtocart_bp.route('/cart/check', methods=['GET'])
def check_order_item():
    try:
        product_id = request.args.get('product_id')
        if not product_id:
            return jsonify({'error': 'Product ID is required'}), 400

        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM cart WHERE product_id = %s LIMIT 1", (product_id,))
        exists = cursor.fetchone() is not None
        cursor.close()
        conn.close()

        return jsonify({'exists': exists}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
# ✅ Remove item from cart by ID
@addtocart_bp.route('/cart/<int:cart_id>', methods=['DELETE'])
def delete_cart_item(cart_id):
    try:
        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM cart WHERE id = %s", (cart_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Item removed from cart"}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
