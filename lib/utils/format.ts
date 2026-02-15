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
 * Format student full name based on locale.
 * EN: "First Father Family" | AR: "الأول الأب العائلة"
 */
export function formatStudentName(
  student: {
    first_name: string;
    first_name_ar: string;
    father_name: string;
    father_name_ar: string;
    family_name: string;
    family_name_ar: string;
  },
  locale: string
): string {
  if (locale === 'ar') {
    return `${student.first_name_ar} ${student.father_name_ar} ${student.family_name_ar}`;
  }
  return `${student.first_name} ${student.father_name} ${student.family_name}`;
}

/**
 * Format teacher full name based on locale.
 * EN: "First Last" | AR: "الأول الأخير"
 */
export function formatTeacherName(
  teacher: {
    first_name: string;
    first_name_ar: string;
    last_name: string;
    last_name_ar: string;
  },
  locale: string
): string {
  if (locale === 'ar') {
    return `${teacher.first_name_ar} ${teacher.last_name_ar}`;
  }
  return `${teacher.first_name} ${teacher.last_name}`;
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
