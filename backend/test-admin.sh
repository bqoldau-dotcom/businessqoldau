#!/bin/bash
set -e

API="http://localhost:3001"
EMAIL="admin@businesscamp.kz"
PASS="AdminPass123"

echo "=== Admin API Testing ==="
echo "Logging in..."

# Login and extract token
RESPONSE=$(curl -s -X POST "$API/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")

TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "ERROR: Failed to login"
  echo "$RESPONSE"
  exit 1
fi

echo "✓ Logged in successfully"
echo ""

# Test 1: GET /api/admin/stats
echo "=== Test 1: GET /api/admin/stats ==="
curl -s -H "Authorization: Bearer $TOKEN" "$API/api/admin/stats" | python3 -m json.tool
echo ""

# Test 2: GET /api/admin/applications
echo "=== Test 2: GET /api/admin/applications ==="
curl -s -H "Authorization: Bearer $TOKEN" "$API/api/admin/applications" | python3 -m json.tool
echo ""

# Test 3: GET /api/admin/users
echo "=== Test 3: GET /api/admin/users ==="
curl -s -H "Authorization: Bearer $TOKEN" "$API/api/admin/users?limit=3" | python3 -m json.tool
echo ""

echo "=== All tests complete ==="
