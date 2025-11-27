-- Initial database setup
-- This file is automatically executed when the PostgreSQL container is first created

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Database is already created by POSTGRES_DB environment variable
-- Tables will be created by DrizzleORM migrations
