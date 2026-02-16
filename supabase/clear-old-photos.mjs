/**
 * Migration: Clear old pravatar.cc photo URLs from students and bus drivers.
 * Default photos are now served from /public/photos/students/ based on gender + grade.
 * Run with: node supabase/clear-old-photos.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  // 1. Clear student photo_url (old pravatar URLs)
  const { data: students, error: sErr } = await supabase
    .from('students')
    .update({ photo_url: null })
    .like('photo_url', '%pravatar%')
    .select('id');

  if (sErr) {
    console.error('Error clearing student photos:', sErr.message);
  } else {
    console.log(`Cleared photo_url for ${students.length} students`);
  }

  // 2. Clear bus driver_photo_url (old pravatar URLs)
  const { data: buses, error: bErr } = await supabase
    .from('buses')
    .update({ driver_photo_url: null })
    .like('driver_photo_url', '%pravatar%')
    .select('id');

  if (bErr) {
    console.error('Error clearing driver photos:', bErr.message);
  } else {
    console.log(`Cleared driver_photo_url for ${buses.length} buses`);
  }

  console.log('Done!');
}

main();
