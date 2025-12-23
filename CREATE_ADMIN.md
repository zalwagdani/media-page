# How to Create an Admin User for a Page

If you're seeing the error "You do not have admin access to this page", you need to create an admin record for that page.

## Quick Fix: Create Admin via SQL

1. **Get your User ID from Supabase**:
   - Go to Supabase Dashboard → Authentication → Users
   - Find your user (by email)
   - Copy the **User ID** (UUID)

2. **Run this SQL in Supabase SQL Editor**:
   ```sql
   -- Replace 'your-user-id' with the UUID from step 1
   -- Replace 'slm' with your page ID
   INSERT INTO admins (user_id, page_id, email)
   VALUES ('your-user-id', 'slm', 'your-email@example.com');
   ```

3. **Verify it was created**:
   ```sql
   SELECT * FROM admins WHERE page_id = 'slm';
   ```

## Step-by-Step Example for Page "slm"

### Step 1: Create User in Supabase Auth (if not exists)

1. Go to **Authentication** → **Users**
2. Click **"Add User"** → **"Create New User"**
3. Enter:
   - **Email**: your-email@example.com
   - **Password**: (choose a password)
   - **Auto Confirm User**: ✅ (check this)
4. Click **"Create User"**
5. **Copy the User ID** (it's a UUID like `123e4567-e89b-12d3-a456-426614174000`)

### Step 2: Create Admin Record

1. Go to **SQL Editor** in Supabase
2. Run this SQL (replace with your values):
   ```sql
   -- First, make sure the page exists
   INSERT INTO pages (id, name) 
   VALUES ('slm', 'SLM Page')
   ON CONFLICT (id) DO NOTHING;

   -- Then create the admin record
   -- Replace 'YOUR_USER_ID_HERE' with the UUID from Step 1
   -- Replace 'your-email@example.com' with your actual email
   INSERT INTO admins (user_id, page_id, email)
   VALUES ('YOUR_USER_ID_HERE', 'slm', 'your-email@example.com');
   ```

### Step 3: Test Login

1. Go to: `http://localhost:5173/page/slm/login`
2. Enter your email and password
3. You should now be able to log in!

## For Multiple Pages

If you want the same user to be admin of multiple pages:

```sql
-- User is admin of both "default" and "slm"
INSERT INTO admins (user_id, page_id, email) VALUES
  ('your-user-id', 'default', 'your-email@example.com'),
  ('your-user-id', 'slm', 'your-email@example.com');
```

## Troubleshooting

### "duplicate key value violates unique constraint"
- The admin record already exists
- Check: `SELECT * FROM admins WHERE page_id = 'slm';`
- If it exists, you're good! Just try logging in again

### "foreign key constraint"
- The user doesn't exist in `auth.users`
- Create the user first in Authentication → Users

### "relation does not exist"
- The `admins` table doesn't exist
- Run `database/schema.sql` first

### Still can't log in?
1. Check browser console (F12) for errors
2. Verify the page ID matches:
   - URL: `/page/slm/login` → page_id should be "slm"
   - Check console log: "Authenticating admin for page: slm"
3. Verify admin record exists:
   ```sql
   SELECT a.*, p.name as page_name 
   FROM admins a 
   JOIN pages p ON a.page_id = p.id 
   WHERE a.email = 'your-email@example.com';
   ```

## Quick SQL Commands

```sql
-- List all admins
SELECT * FROM admins;

-- List admins for a specific page
SELECT * FROM admins WHERE page_id = 'slm';

-- List all pages a user is admin of
SELECT a.page_id, p.name 
FROM admins a 
JOIN pages p ON a.page_id = p.id 
WHERE a.email = 'your-email@example.com';

-- Delete an admin (if needed)
DELETE FROM admins WHERE page_id = 'slm' AND email = 'your-email@example.com';
```
