#!/bin/bash

# Admin API Test Script
API_URL="http://localhost:3001"
ADMIN_EMAIL="admin@businesscamp.kz"
ADMIN_PASSWORD="Admin123456"

echo "=== Testing Admin API ==="
echo ""

# Step 1: Register new admin user
echo "1. Registering new admin user..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"'$ADMIN_EMAIL'","password":"'$ADMIN_PASSWORD'","fullName":"Admin User"}')
echo "$REGISTER_RESPONSE" | python3 -m json.tool
echo ""

# Step 2: Set admin role in database
echo "2. Setting admin role..."
PGPASSWORD=businesscamp123 psql -U businesscamp -h localhost -d businesscamp -c "UPDATE users SET role = 'admin' WHERE email = '$ADMIN_EMAIL' RETURNING id, email, role;"
echo ""

# Step 3: Login as admin
echo "3. Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"'$ADMIN_EMAIL'","password":"'$ADMIN_PASSWORD'"}')
TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('accessToken', d.get('data',{}).get('accessToken',''))")
if [ -z "$TOKEN" ]; then
  echo "ERROR: Failed to login"
  echo "$LOGIN_RESPONSE" | python3 -m json.tool
  exit 1
fi
echo "Token obtained: ${TOKEN:0:30}..."
echo ""

# Step 4: Test GET /api/admin/stats
echo "4. Testing GET /api/admin/stats..."
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/api/admin/stats" | python3 -m json.tool
echo ""

# Step 5: Test GET /api/admin/applications
echo "5. Testing GET /api/admin/applications..."
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/api/admin/applications" | python3 -m json.tool
echo ""

# Step 6: Test GET /api/admin/users
echo "6. Testing GET /api/admin/users..."
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/api/admin/users" | python3 -m json.tool
echo ""

echo "=== Admin API Tests Complete ==="
