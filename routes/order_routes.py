from flask import Blueprint, request, jsonify
from db import db_connection

order_bp = Blueprint('order_bp', __name__)

@order_bp.route('/api/order', methods=['POST'])
def place_order():
    data = request.json
    print("Received order data:", data)
    
    required_fields = ['product_id', 'product_name', 'quantity', 'total_price', 'payment_method']
    for field in required_fields:
        if field not in data or data[field] is None:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    upi_id = data.get('upi_id', None)
    phone = data.get('phone', None)
    account_number = data.get('account_number', None)
    ifsc = data.get('ifsc', None)

    try:
        conn = db_connection()
        cursor = conn.cursor()
        
        sql = """
            INSERT INTO orders (
              product_id, product_name, quantity, total_price,
              payment_method, upi_id, phone, account_number, ifsc
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data['product_id'],
            data['product_name'],
            data['quantity'],
            data['total_price'],
            data['payment_method'],
            upi_id,
            phone,
            account_number,
            ifsc
        )
        print("Executing SQL with values:", values)

        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Order saved successfully'}), 200

    except Exception as e:
        print("Error saving order:", e)
        return jsonify({'error': 'Internal server error. ' + str(e)}), 500
