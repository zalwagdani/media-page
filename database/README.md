# Database Setup Guide

This guide will help you set up the database for your scalable media pages application.

## Prerequisites

1. A Supabase account (free tier available at https://supabase.com)
2. A Supabase project created

## Setup Steps

### 1. Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created (takes a few minutes)

### 2. Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `schema.sql`
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. Verify all tables were created by going to **Table Editor**

### 3. Get Your API Credentials

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 4. Configure Your Application

1. Create a `.env` file in the root of your project:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

2. **Important**: Add `.env` to your `.gitignore` file to keep credentials secret

### 5. Create Your First Admin User

You can create admin users in two ways:

#### Option A: Using Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Enter email and password
4. Note the User ID
5. Go to **SQL Editor** and run:
   ```sql
   INSERT INTO admins (user_id, page_id, email)
   VALUES ('user_id_from_step_4', 'default', 'admin@example.com');
   ```

#### Option B: Using the Application
1. The app will automatically create admin users when they sign up
2. Make sure to run the `createAdmin` function from the API service

## Multi-Tenancy

Each media page is identified by a `page_id`. You can:

- **Use subdomains**: `page1.yourapp.com` → page_id = "page1"
- **Use URL paths**: `/page/page1` → page_id = "page1"
- **Use default**: If no page_id is specified, uses "default"

## Security

- Row Level Security (RLS) is enabled on all tables
- Public data (profiles, codes) is readable by anyone
- Admin operations require authentication
- Each admin is scoped to specific pages

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the schema.sql file completely
- Check that all tables were created in the Table Editor

### "permission denied" error
- Check that RLS policies are created correctly
- Verify the user is authenticated
- Check that the user has admin access to the page

### Authentication not working
- Verify your Supabase URL and key in `.env`
- Check browser console for errors
- Ensure email confirmation is disabled (for testing) in Supabase Auth settings
