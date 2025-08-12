import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xedaqlkmfsjphnxlzxnc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGFxbGttZnNqcGhueGx6eG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjY5NjcsImV4cCI6MjA3MDM0Mjk2N30.DBsdvAWnRnmkv0yk90aOvlFgDf3X-Mdo5rHdc3O745M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
