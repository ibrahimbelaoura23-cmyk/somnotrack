from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import hashlib

# =============================================
# CONFIGURATION
# =============================================
SUPABASE_URL = "https://ptvlocrojxvlnahkhdyl.supabase.co"    # ← REPLACE WITH YOUR URL
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0dmxvY3Jvanh2bG5haGtoZHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzA2MjYsImV4cCI6MjA5MjEwNjYyNn0.PkiIjWri9uejPLnNb9VFdYP8uos2vTeb_BVgI6GcvTA"                       # ← REPLACE WITH YOUR KEY

# =============================================
# FLASK APP SETUP
# =============================================
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# =============================================
# HELPER FUNCTIONS
# =============================================
def supabase_request(method, endpoint, data=None):
    """Make authenticated request to Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        elif method == "PUT":
            response = requests.put(url, headers=headers, json=data)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        else:
            return {"error": "Method not allowed"}, 405
        
        if response.status_code >= 400:
            return {"error": response.text}, response.status_code
        
        return response.json() if response.text else {}
    except Exception as e:
        return {"error": str(e)}, 500

def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

# =============================================
# BASIC ROUTES
# =============================================
@app.route('/')
def home():
    return {"message": "SomnoTrack API", "status": "running"}

@app.route('/api/health')
def health():
    return {"status": "ok"}

# =============================================
# AUTHENTICATION ROUTES
# =============================================
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    identifier = data.get('identifier')
    password = data.get('password')
    
    if not identifier or not password:
        return jsonify({"success": False, "error": "Identifier and password required"}), 400
    
    result = supabase_request("GET", f"users?email=eq.{identifier}&select=*")
    
    if isinstance(result, list) and len(result) > 0:
        user = result[0]
        
        # Verify password
        if user['password_hash'] != hash_password(password):
            return jsonify({"success": False, "error": "Invalid password"}), 401
        
        return jsonify({
            "success": True,
            "token": "test-token",
            "user": {
                "id": user['id'],
                "email": user['email'],
                "firstName": user['first_name'],
                "lastName": user['last_name'],
                "role": user['role']
            }
        })
    
    return jsonify({"success": False, "error": "User not found"}), 401

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    
    required_fields = ['firstName', 'lastName', 'email', 'role', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"success": False, "error": f"{field} is required"}), 400
    
    # Check if email exists
    result = supabase_request("GET", f"users?email=eq.{data['email']}&select=*")
    if isinstance(result, list) and len(result) > 0:
        return jsonify({"success": False, "error": "Email already registered"}), 409
    
    # Create user
    user_data = {
        "email": data['email'],
        "first_name": data['firstName'],
        "last_name": data['lastName'],
        "role": data['role'].upper(),
        "password_hash": hash_password(data['password'])
    }
    
    result = supabase_request("POST", "users", data=user_data)
    
    if isinstance(result, dict) and result.get('error'):
        return jsonify({"success": False, "error": "Registration failed"}), 500
    
    return jsonify({
        "success": True,
        "message": "Account created successfully"
    }), 201

# =============================================
# PATIENT ROUTES
# =============================================
@app.route('/api/patients', methods=['GET'])
def get_patients():
    result = supabase_request("GET", "patients?select=*&order=created_at.desc")
    if isinstance(result, dict) and result.get('error'):
        return jsonify([])
    return jsonify(result)

@app.route('/api/patients/add', methods=['POST'])
def add_patient():
    data = request.json
    
    required = ['firstName', 'lastName', 'nationalId', 'phone']
    for field in required:
        if not data.get(field):
            return jsonify({"success": False, "error": f"{field} is required"}), 400
    
    # Check if patient exists
    result = supabase_request("GET", f"patients?national_id=eq.{data['nationalId']}&select=id")
    if isinstance(result, list) and len(result) > 0:
        return jsonify({"success": False, "error": "Patient already exists"}), 409
    
    patient_data = {
        "first_name": data['firstName'],
        "last_name": data['lastName'],
        "national_id": data['nationalId'],
        "phone": data['phone'],
        "weight": data.get('weight'),
        "height": data.get('height'),
        "symptoms": data.get('selectedSymptoms', []),
        "antecedents": data.get('selectedAntecedents', [])
    }
    
    result = supabase_request("POST", "patients", data=patient_data)
    
    if isinstance(result, dict) and result.get('error'):
        return jsonify({"success": False, "error": "Failed to create patient"}), 500
    
    return jsonify({
        "success": True,
        "message": "Patient registered successfully"
    }), 201

@app.route('/api/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    result = supabase_request("GET", f"patients?id=eq.{patient_id}&select=*")
    if isinstance(result, list) and len(result) > 0:
        return jsonify(result[0])
    return jsonify({"success": False, "error": "Patient not found"}), 404

# =============================================
# START SERVER
# =============================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)