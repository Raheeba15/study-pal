-- Check if profiles table exists and its structure
SELECT 
    table_schema,
    table_name,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles';

-- Check existing RLS policies
SELECT *
FROM pg_policies
WHERE tablename = 'profiles';