# Database Setup Guide

This guide will help you migrate from localStorage to a scalable database solution using Supabase.

## Overview

The application now supports:
- ✅ **Multi-tenancy**: Multiple media pages with separate data
- ✅ **Database storage**: All data stored in Supabase (PostgreSQL)
- ✅ **User authentication**: Admin users with email/password
- ✅ **Scalability**: Ready for many pages and users

## Step 1: Install Dependencies

```bash
npm install
```

This will install `@supabase/supabase-js` which is required for database operations.

## Step 2: Create Supabase Project

1. Go to https://app.supabase.com
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: Your project name
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Wait 2-3 minutes for project creation

## Step 3: Set Up Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click **"New Query"** 
3. Open `database/schema.sql` from this project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. Verify tables were created in **Table Editor**:
   - `pages`
   - `admins`
   - `profiles`
   - `discount_codes`

## Step 4: Get API Credentials

1. In Supabase, go to **Settings** → **API**
2. Copy:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys" → "anon public")

## Step 5: Configure Environment Variables

1. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Important**: The `.env` file is already in `.gitignore` - never commit it!

## Step 6: Create Your First Admin User

### Option A: Using Supabase Dashboard (Recommended for first admin)

1. Go to **Authentication** → **Users**
2. Click **"Add User"** → **"Create New User"**
3. Enter:
   - **Email**: your-email@example.com
   - **Password**: (choose a strong password)
   - **Auto Confirm User**: ✅ (check this for testing)
4. Click **"Create User"**
5. Copy the **User ID** (UUID)
6. Go to **SQL Editor** and run:
   ```sql
   -- Replace 'your-user-id' with the UUID from step 5
   -- Replace 'default' with your page ID if different
   INSERT INTO admins (user_id, page_id, email)
   VALUES ('your-user-id', 'default', 'your-email@example.com');
   ```

### Option B: Using Application Sign-Up

The app will automatically create admin users when they sign up (requires additional setup).

## Step 7: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login`
3. Log in with the email/password you created
4. You should be redirected to `/admin`

## Multi-Tenancy: How Page IDs Work

Each media page is identified by a `page_id`. The system detects it in this order:

1. **URL Path**: `/page/my-page-id` → page_id = "my-page-id"
2. **Subdomain**: `my-page-id.yourapp.com` → page_id = "my-page-id"
3. **Default**: If neither is found, uses "default"

### Creating Multiple Pages

To create a new page:

1. **Create page record** (optional, auto-created on first use):
   ```sql
   INSERT INTO pages (id, name) VALUES ('my-new-page', 'My New Page');
   ```

2. **Create admin for the page**:
   ```sql
   INSERT INTO admins (user_id, page_id, email)
   VALUES ('user-uuid', 'my-new-page', 'admin@example.com');
   ```

3. **Access the page**:
   - Via URL: `/page/my-new-page`
   - Or set subdomain: `my-new-page.yourapp.com`

## Migration from localStorage

If you have existing data in localStorage:

1. Export your data from the old system
2. Use the admin panel to manually re-enter it, OR
3. Write a migration script to import data into Supabase

## Troubleshooting

### "Invalid API key" error
- Check your `.env` file has correct values
- Restart the dev server after changing `.env`
- Verify credentials in Supabase Settings → API

### "relation does not exist" error
- Make sure you ran `database/schema.sql` completely
- Check Table Editor to verify all tables exist

### "permission denied" error
- Verify RLS policies were created (check in SQL Editor)
- Ensure you're logged in as an admin
- Check that admin record exists for your page

### Can't log in
- Verify user exists in Authentication → Users
- Check admin record exists in `admins` table
- Ensure `page_id` matches (default is "default")
- Try auto-confirming the user in Supabase Auth settings

### Data not loading
- Check browser console for errors
- Verify Supabase URL and key are correct
- Check network tab for failed API calls
- Ensure RLS policies allow reading (profiles and codes are public)

## Security Notes

- ✅ Row Level Security (RLS) is enabled
- ✅ Public data (profiles, codes) is readable by anyone
- ✅ Admin operations require authentication
- ✅ Each admin is scoped to specific pages
- ⚠️ Never commit `.env` file to git
- ⚠️ Use environment variables for all secrets

## Next Steps

- Set up custom domain with subdomains for multi-tenancy
- Configure email templates in Supabase Auth
- Set up backups in Supabase
- Monitor usage in Supabase Dashboard
