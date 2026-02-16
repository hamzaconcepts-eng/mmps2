/**
 * Formatting utilities for the Mashaail School Management System.
 * Handles OMR currency, bilingual names, and grade levels.
 */

/**
 * Format a number as OMR currency (3 decimal places).
 * Example: 1500.500 → "OMR 1,500.500"
 */
export function formatCurrency(amount: number): string {
  return `OMR ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })}`;
}

/**
 * Append ة (taa marbuta) to Arabic family name for females.
 * If it already ends with ة or ي, return as-is.
 */
function feminizeFamilyAr(name: string): string {
  if (!name) return name;
  if (name.endsWith('ة') || name.endsWith('ي')) return name;
  return name + 'ة';
}

/**
 * Format student full name (4-part Omani official name) based on locale.
 * Females: بنت after first name, بن after father name, ة on family name
 * Males: بن after first name and father name
 * EN: "First Father Grandfather Family"
 * AR male: "أحمد بن سالم بن خالد البلوشي"
 * AR female: "فاطمة بنت سالم بن خالد البلوشية"
 */
export function formatStudentName(
  student: {
    first_name: string;
    first_name_ar: string;
    father_name: string;
    father_name_ar: string;
    grandfather_name?: string;
    grandfather_name_ar?: string;
    family_name: string;
    family_name_ar: string;
    gender?: string;
  },
  locale: string
): string {
  const isFemale = student.gender === 'female';
  if (locale === 'ar') {
    const connector1 = isFemale ? 'بنت' : 'بن';
    const parts = [student.first_name_ar, connector1, student.father_name_ar];
    if (student.grandfather_name_ar) {
      parts.push('بن', student.grandfather_name_ar);
    }
    const family = isFemale ? feminizeFamilyAr(student.family_name_ar) : student.family_name_ar;
    parts.push(family);
    return parts.join(' ');
  }
  const parts = [student.first_name, student.father_name];
  if (student.grandfather_name) {
    parts.push(student.grandfather_name);
  }
  parts.push(student.family_name);
  return parts.join(' ');
}

/**
 * Format guardian full name (4-part Omani official name) based on locale.
 * Mother (female): بنت after first name, بن after father, ة on family name
 * Father (male): بن throughout
 */
export function formatGuardianName(
  guardian: {
    first_name: string;
    first_name_ar: string;
    father_name?: string;
    father_name_ar?: string;
    grandfather_name?: string;
    grandfather_name_ar?: string;
    family_name: string;
    family_name_ar: string;
    relationship?: string;
  },
  locale: string
): string {
  const isFemale = guardian.relationship === 'Mother';
  if (locale === 'ar') {
    const connector1 = isFemale ? 'بنت' : 'بن';
    const parts = [guardian.first_name_ar];
    if (guardian.father_name_ar) {
      parts.push(connector1, guardian.father_name_ar);
    }
    if (guardian.grandfather_name_ar) {
      parts.push('بن', guardian.grandfather_name_ar);
    }
    const family = isFemale ? feminizeFamilyAr(guardian.family_name_ar) : guardian.family_name_ar;
    parts.push(family);
    return parts.join(' ');
  }
  const parts = [guardian.first_name];
  if (guardian.father_name) parts.push(guardian.father_name);
  if (guardian.grandfather_name) parts.push(guardian.grandfather_name);
  parts.push(guardian.family_name);
  return parts.join(' ');
}

/**
 * Format teacher full name (4-part Omani official name) based on locale.
 * Females: بنت after first name, بن after father name, ة on family name
 * Males: بن throughout
 */
export function formatTeacherName(
  teacher: {
    first_name: string;
    first_name_ar: string;
    father_name?: string;
    father_name_ar?: string;
    grandfather_name?: string;
    grandfather_name_ar?: string;
    last_name?: string;
    last_name_ar?: string;
    family_name?: string;
    family_name_ar?: string;
    gender?: string;
  },
  locale: string
): string {
  const familyEn = teacher.family_name || teacher.last_name || '';
  const familyAr = teacher.family_name_ar || teacher.last_name_ar || '';
  const isFemale = teacher.gender === 'female';

  if (locale === 'ar') {
    const connector1 = isFemale ? 'بنت' : 'بن';
    const parts = [teacher.first_name_ar];
    if (teacher.father_name_ar) {
      parts.push(connector1, teacher.father_name_ar);
    }
    if (teacher.grandfather_name_ar) {
      parts.push('بن', teacher.grandfather_name_ar);
    }
    const family = isFemale ? feminizeFamilyAr(familyAr) : familyAr;
    parts.push(family);
    return parts.join(' ');
  }
  const parts = [teacher.first_name];
  if (teacher.father_name) parts.push(teacher.father_name);
  if (teacher.grandfather_name) parts.push(teacher.grandfather_name);
  parts.push(familyEn);
  return parts.join(' ');
}

/**
 * Format bus driver full name (4-part Omani official name) based on locale.
 * Uses driver_gender if available; otherwise infers from common female Arabic names.
 * Females: بنت after first name, بن after father name, ة on family name
 * Males: بن throughout
 */
export function formatDriverName(
  driver: {
    driver_name: string;
    driver_name_ar: string;
    driver_father_name?: string;
    driver_father_name_ar?: string;
    driver_grandfather_name?: string;
    driver_grandfather_name_ar?: string;
    driver_family_name?: string;
    driver_family_name_ar?: string;
    driver_gender?: string;
  },
  locale: string
): string {
  // Detect female drivers by Arabic first name pattern (common female names ending with ة or specific names)
  const femaleNames = ['فاطمة', 'مريم', 'عائشة', 'نورة', 'هدى', 'ليلى', 'سارة', 'آمنة', 'زينب', 'خديجة', 'سلمى', 'رية', 'حليمة', 'منى'];
  const isFemale = driver.driver_gender === 'female' || femaleNames.includes(driver.driver_name_ar);

  if (locale === 'ar') {
    const connector1 = isFemale ? 'بنت' : 'بن';
    const parts = [driver.driver_name_ar];
    if (driver.driver_father_name_ar) {
      parts.push(connector1, driver.driver_father_name_ar);
    }
    if (driver.driver_grandfather_name_ar) {
      parts.push('بن', driver.driver_grandfather_name_ar);
    }
    if (driver.driver_family_name_ar) {
      const family = isFemale ? feminizeFamilyAr(driver.driver_family_name_ar) : driver.driver_family_name_ar;
      parts.push(family);
    }
    return parts.join(' ');
  }
  const parts = [driver.driver_name];
  if (driver.driver_father_name) parts.push(driver.driver_father_name);
  if (driver.driver_grandfather_name) parts.push(driver.driver_grandfather_name);
  if (driver.driver_family_name) parts.push(driver.driver_family_name);
  return parts.join(' ');
}

/**
 * Format grade level integer to display string.
 * -1 → KG-1 / روضة أولى
 *  0 → KG-2 / روضة ثانية
 *  1-8 → Grade 1-8 / الصف ١-٨
 */
export function formatGradeLevel(level: number, locale: string): string {
  if (locale === 'ar') {
    if (level === -1) return 'روضة أولى';
    if (level === 0) return 'روضة ثانية';
    return `الصف ${level}`;
  }
  if (level === -1) return 'KG-1';
  if (level === 0) return 'KG-2';
  return `Grade ${level}`;
}

/**
 * Format a date string to locale-appropriate display.
 */
export function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === 'ar' ? 'ar-OM' : 'en-OM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get today's date formatted in both English and Arabic (Hijri).
 * Returns { en: "Sunday, 16 February 2026", ar: "الأحد، ٢٣ رجب ١٤٤٧ هـ" }
 */
export function getDualDate(): { en: string; ar: string } {
  const now = new Date();
  const en = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const ar = now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return { en, ar };
}

/**
 * Get class display name based on locale.
 */
export function formatClassName(
  cls: { name: string; name_ar: string },
  locale: string
): string {
  return locale === 'ar' ? cls.name_ar : cls.name;
}

/**
 * Get subject display name based on locale.
 */
export function formatSubjectName(
  subject: { name: string; name_ar: string },
  locale: string
): string {
  return locale === 'ar' ? subject.name_ar : subject.name;
}

/**
 * Format phone number: 8 digits only, no country code.
 * Strips +968 prefix if present.
 */
export function formatPhone(phone: string): string {
  if (!phone) return '—';
  return phone.replace(/^\+?968/, '').replace(/\D/g, '');
}
