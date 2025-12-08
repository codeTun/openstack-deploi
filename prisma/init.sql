-- PostgreSQL Initialization Script
-- This creates the necessary databases for the Todo App

-- Create the main database if it doesn't exist
SELECT 'CREATE DATABASE tododb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tododb')\gexec

-- Create additional database for any connection attempts
SELECT 'CREATE DATABASE todouser'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'todouser')\gexec

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE tododb TO todouser;
GRANT ALL PRIVILEGES ON DATABASE todouser TO todouser;

