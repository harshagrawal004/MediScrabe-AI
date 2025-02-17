import { supabase } from './supabase'

// Initialize Supabase tables and indexes
export async function initializeSupabaseTables() {
  try {
    // Try to create the SQL function first if it doesn't exist
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    }).catch(console.error);

    // Create tables using the SQL function
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.patients (
          id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          name TEXT NOT NULL,
          identifier TEXT NOT NULL,
          gender TEXT NOT NULL,
          age INTEGER NOT NULL CHECK (age >= 0 AND age <= 150),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS public.consultations (
          id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          patient_id BIGINT NOT NULL REFERENCES public.patients(id),
          doctor_id UUID NOT NULL,
          date TIMESTAMPTZ DEFAULT NOW(),
          duration INTEGER,
          status TEXT NOT NULL DEFAULT 'pending',
          audio_data TEXT,
          transcription JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON public.consultations(patient_id);
        CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON public.consultations(doctor_id);
        CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
      `
    });
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
    // Continue loading the app even if table creation fails
  }
}