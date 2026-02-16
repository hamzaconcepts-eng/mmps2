/**
 * Migration script: Populate teacher & driver 4-part names in live Supabase DB.
 * Run with: node supabase/run-migration.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Parse .env.local manually (no dotenv dependency needed)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Teacher name data: [employee_id, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar]
const teacherNames = [
  ['TCH-001', 'Mohammed', 'محمد', 'Khalfan', 'خلفان', 'Al Balushi', 'البلوشي'],
  ['TCH-002', 'Ali', 'علي', 'Hilal', 'هلال', 'Al Harthi', 'الحارثي'],
  ['TCH-003', 'Salim', 'سالم', 'Mohammed', 'محمد', 'Al Rashdi', 'الراشدي'],
  ['TCH-004', 'Said', 'سعيد', 'Ali', 'علي', 'Al Busaidi', 'البوسعيدي'],
  ['TCH-005', 'Nasser', 'ناصر', 'Hamad', 'حمد', 'Al Kindi', 'الكندي'],
  ['TCH-006', 'Khalid', 'خالد', 'Salim', 'سالم', 'Al Wahaibi', 'الوهيبي'],
  ['TCH-007', 'Ahmed', 'أحمد', 'Nasser', 'ناصر', 'Al Mahrouqi', 'المحروقي'],
  ['TCH-008', 'Ibrahim', 'إبراهيم', 'Said', 'سعيد', 'Al Maskari', 'المسكري'],
  ['TCH-009', 'Hamad', 'حمد', 'Ahmed', 'أحمد', 'Al Habsi', 'الحبسي'],
  ['TCH-010', 'Abdullah', 'عبدالله', 'Ibrahim', 'إبراهيم', 'Al Siyabi', 'السيابي'],
  ['TCH-011', 'Rashid', 'راشد', 'Sultan', 'سلطان', 'Al Naamani', 'النعماني'],
  ['TCH-012', 'Sultan', 'سلطان', 'Rashid', 'راشد', 'Al Farsi', 'الفارسي'],
  ['TCH-013', 'Yusuf', 'يوسف', 'Khalid', 'خالد', 'Al Rawahi', 'الرواحي'],
  ['TCH-014', 'Omar', 'عمر', 'Abdullah', 'عبدالله', 'Al Hosni', 'الحسني'],
  ['TCH-015', 'Hassan', 'حسن', 'Omar', 'عمر', 'Al Lawati', 'اللواتي'],
  ['TCH-016', 'Majid', 'ماجد', 'Yusuf', 'يوسف', 'Al Ghafri', 'الغافري'],
  ['TCH-017', 'Hamed', 'حامد', 'Hassan', 'حسن', 'Al Hinai', 'الهنائي'],
  ['TCH-018', 'Suleiman', 'سليمان', 'Majid', 'ماجد', 'Al Amri', 'العامري'],
  ['TCH-019', 'Mubarak', 'مبارك', 'Hamed', 'حامد', 'Al Zadjali', 'الزدجالي'],
  ['TCH-020', 'Saif', 'سيف', 'Suleiman', 'سليمان', 'Al Shukaili', 'الشكيلي'],
  ['TCH-021', 'Khalfan', 'خلفان', 'Saif', 'سيف', 'Al Kharousi', 'الخروصي'],
  ['TCH-022', 'Hilal', 'هلال', 'Mubarak', 'مبارك', 'Al Shamsi', 'الشامسي'],
  ['TCH-023', 'Badr', 'بدر', 'Badr', 'بدر', 'Al Jabri', 'الجابري'],
  ['TCH-024', 'Harith', 'حارث', 'Fahad', 'فهد', 'Al Riyami', 'الريامي'],
  ['TCH-025', 'Fahad', 'فهد', 'Harith', 'حارث', 'Al Tobi', 'الطوبي'],
  ['TCH-026', 'Amer', 'عامر', 'Amer', 'عامر', 'Al Harrasi', 'الحراصي'],
  ['TCH-027', 'Talal', 'طلال', 'Talal', 'طلال', 'Al Mamari', 'المعمري'],
  ['TCH-028', 'Mansour', 'منصور', 'Mansour', 'منصور', 'Al Battashi', 'البطاشي'],
  ['TCH-029', 'Mohammed', 'محمد', 'Khalfan', 'خلفان', 'Al Saadi', 'السعدي'],
  ['TCH-030', 'Ali', 'علي', 'Hilal', 'هلال', 'Al Qasmi', 'القاسمي'],
  ['TCH-031', 'Salim', 'سالم', 'Mohammed', 'محمد', 'Al Maqbali', 'المقبالي'],
  ['TCH-032', 'Said', 'سعيد', 'Ali', 'علي', 'Al Khusaibi', 'الخصيبي'],
];

// Driver name data: [bus_number, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, photo_url]
const driverNames = [
  ['BUS-01', 'Khalid', 'خالد', 'Nasser', 'ناصر', 'Al Balushi', 'البلوشي', 'https://i.pravatar.cc/200?u=driver01'],
  ['BUS-02', 'Ali', 'علي', 'Mohammed', 'محمد', 'Al Harthi', 'الحارثي', 'https://i.pravatar.cc/200?u=driver02'],
  ['BUS-03', 'Said', 'سعيد', 'Ibrahim', 'إبراهيم', 'Al Rashdi', 'الراشدي', 'https://i.pravatar.cc/200?u=driver03'],
  ['BUS-04', 'Hamad', 'حمد', 'Salim', 'سالم', 'Al Farsi', 'الفارسي', 'https://i.pravatar.cc/200?u=driver04'],
  ['BUS-05', 'Ahmed', 'أحمد', 'Khalfan', 'خلفان', 'Al Kindi', 'الكندي', 'https://i.pravatar.cc/200?u=driver05'],
  ['BUS-06', 'Nasser', 'ناصر', 'Ali', 'علي', 'Al Wahaibi', 'الوهيبي', 'https://i.pravatar.cc/200?u=driver06'],
  ['BUS-07', 'Sultan', 'سلطان', 'Rashid', 'راشد', 'Al Mahrouqi', 'المحروقي', 'https://i.pravatar.cc/200?u=driver07'],
  ['BUS-08', 'Abdullah', 'عبدالله', 'Hassan', 'حسن', 'Al Busaidi', 'البوسعيدي', 'https://i.pravatar.cc/200?u=driver08'],
  ['BUS-09', 'Ibrahim', 'إبراهيم', 'Majid', 'ماجد', 'Al Habsi', 'الحبسي', 'https://i.pravatar.cc/200?u=driver09'],
  ['BUS-10', 'Yusuf', 'يوسف', 'Suleiman', 'سليمان', 'Al Siyabi', 'السيابي', 'https://i.pravatar.cc/200?u=driver10'],
  ['BUS-11', 'Omar', 'عمر', 'Khalfan', 'خلفان', 'Al Naamani', 'النعماني', 'https://i.pravatar.cc/200?u=driver11'],
  ['BUS-12', 'Hassan', 'حسن', 'Hilal', 'هلال', 'Al Rawahi', 'الرواحي', 'https://i.pravatar.cc/200?u=driver12'],
];

async function migrate() {
  console.log('🔄 Starting migration...\n');

  // First, check if columns exist by trying to read a teacher
  const { data: testTeacher, error: testErr } = await supabase
    .from('teachers')
    .select('employee_id, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar')
    .eq('employee_id', 'TCH-001')
    .single();

  if (testErr) {
    console.error('❌ Cannot read teacher columns. The columns may not exist yet.');
    console.error('   Error:', testErr.message);
    console.error('\n📋 You need to run the ALTER TABLE statements first.');
    console.error('   Open Supabase SQL Editor and run the contents of: supabase/migrate-names.sql');
    console.error('   (Only the ALTER TABLE section at the top)\n');
    process.exit(1);
  }

  console.log('✅ Teacher columns exist. Current TCH-001 father_name:', testTeacher?.father_name || '(empty)');

  // Update teachers
  let teacherSuccess = 0;
  let teacherFail = 0;
  for (const [eid, fn, fna, gn, gna, famn, famna] of teacherNames) {
    const { error } = await supabase
      .from('teachers')
      .update({
        father_name: fn,
        father_name_ar: fna,
        grandfather_name: gn,
        grandfather_name_ar: gna,
        family_name: famn,
        family_name_ar: famna,
      })
      .eq('employee_id', eid);

    if (error) {
      console.error(`  ❌ ${eid}: ${error.message}`);
      teacherFail++;
    } else {
      teacherSuccess++;
    }
  }
  console.log(`\n👩‍🏫 Teachers updated: ${teacherSuccess} success, ${teacherFail} failed`);

  // Check if bus columns exist
  const { data: testBus, error: busTestErr } = await supabase
    .from('buses')
    .select('bus_number, driver_father_name, driver_father_name_ar')
    .eq('bus_number', 'BUS-01')
    .single();

  if (busTestErr) {
    console.error('\n❌ Cannot read bus driver columns. The columns may not exist yet.');
    console.error('   Error:', busTestErr.message);
    console.error('   Run the ALTER TABLE section for buses from: supabase/migrate-names.sql');
    process.exit(1);
  }

  console.log('✅ Bus driver columns exist. Current BUS-01 driver_father_name:', testBus?.driver_father_name || '(empty)');

  // Update buses
  let busSuccess = 0;
  let busFail = 0;
  for (const [busNum, fn, fna, gn, gna, famn, famna, photo] of driverNames) {
    const { error } = await supabase
      .from('buses')
      .update({
        driver_father_name: fn,
        driver_father_name_ar: fna,
        driver_grandfather_name: gn,
        driver_grandfather_name_ar: gna,
        driver_family_name: famn,
        driver_family_name_ar: famna,
        driver_photo_url: photo,
      })
      .eq('bus_number', busNum);

    if (error) {
      console.error(`  ❌ ${busNum}: ${error.message}`);
      busFail++;
    } else {
      busSuccess++;
    }
  }
  console.log(`🚌 Buses updated: ${busSuccess} success, ${busFail} failed`);

  // Verify
  console.log('\n📋 Verification:');
  const { data: verify1 } = await supabase
    .from('teachers')
    .select('employee_id, first_name_ar, father_name_ar, grandfather_name_ar, family_name_ar')
    .in('employee_id', ['TCH-001', 'TCH-002', 'TCH-003'])
    .order('employee_id');

  verify1?.forEach((t) => {
    console.log(`  ${t.employee_id}: ${t.first_name_ar} بنت ${t.father_name_ar} بن ${t.grandfather_name_ar} ${t.family_name_ar}`);
  });

  const { data: verify2 } = await supabase
    .from('buses')
    .select('bus_number, driver_name_ar, driver_father_name_ar, driver_grandfather_name_ar, driver_family_name_ar')
    .in('bus_number', ['BUS-01', 'BUS-02', 'BUS-03'])
    .order('bus_number');

  verify2?.forEach((b) => {
    console.log(`  ${b.bus_number}: ${b.driver_name_ar} بن ${b.driver_father_name_ar} بن ${b.driver_grandfather_name_ar} ${b.driver_family_name_ar}`);
  });

  console.log('\n✅ Migration complete! Refresh your browser to see full names.');
}

migrate().catch(console.error);
