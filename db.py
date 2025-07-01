# db.py
import mysql.connector

def db_connection():
    return mysql.connector.connect(
        host='localhost',
        port=3307,
        user='root',
        password='',
        database='ecom'
    )
