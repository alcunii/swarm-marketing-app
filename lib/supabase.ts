/**
 * Supabase Client Configuration
 * File ini untuk koneksi ke Supabase (opsional, jika mau pakai Supabase client library)
 */

import { createClient } from '@supabase/supabase-js'

// Supabase URL dan Keys dari environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client untuk frontend (menggunakan anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client untuk backend/server-side (menggunakan service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Helper function untuk query database
export async function queryDatabase(query: string, params?: any[]) {
  try {
    const { data, error } = await supabaseAdmin.rpc('execute_sql', {
      query,
      params: params || []
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Database query error:', error)
    return { data: null, error }
  }
}

// Helper function untuk insert data
export async function insertData(table: string, data: any) {
  try {
    const { data: result, error } = await supabaseAdmin
      .from(table)
      .insert(data)
      .select()
    
    if (error) throw error
    return { data: result, error: null }
  } catch (error) {
    console.error('Insert error:', error)
    return { data: null, error }
  }
}

// Helper function untuk update data
export async function updateData(table: string, id: string, data: any) {
  try {
    const { data: result, error } = await supabaseAdmin
      .from(table)
      .update(data)
      .eq('batch_id', id)
      .select()
    
    if (error) throw error
    return { data: result, error: null }
  } catch (error) {
    console.error('Update error:', error)
    return { data: null, error }
  }
}

// Helper function untuk get data
export async function getData(table: string, filters?: any) {
  try {
    let query = supabaseAdmin.from(table).select('*')
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        query = query.eq(key, filters[key])
      })
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Get data error:', error)
    return { data: null, error }
  }
}
