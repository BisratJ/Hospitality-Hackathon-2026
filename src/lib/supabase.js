import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pzdqaqtpctzsltngxxff.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHFhcXRwY3R6c2x0bmd4eGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODE0OTEsImV4cCI6MjA4OTI1NzQ5MX0.JxgBCvxy1Sh93B0T0FZFp1i_7dRv14pYVmvW_58iE8c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const GALLERY_BUCKET = 'gallery'
export const STORAGE_BASE_URL = `${supabaseUrl}/storage/v1/object/public/${GALLERY_BUCKET}`
