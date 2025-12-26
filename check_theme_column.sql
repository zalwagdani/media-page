-- Check if theme column exists in profiles table
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM
    information_schema.columns
WHERE
    table_name = 'profiles'
    AND column_name = 'theme';

-- If no results, the column doesn't exist yet
-- Run add_theme_column.sql to add it
