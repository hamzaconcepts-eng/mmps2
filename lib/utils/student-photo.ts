/**
 * Returns the default student photo path based on gender and grade level.
 *
 * Photo mapping:
 *   - Boy  KG1–Grade4  → boy-young.jpg
 *   - Boy  Grade5–Grade8 → boy-senior-1.jpg or boy-senior-2.jpg
 *   - Girl KG1–Grade4  → girl-young.jpg
 *   - Girl Grade5–Grade8 → girl-senior-1.jpg or girl-senior-2.jpg
 *
 * For senior grades (5-8) there are 2 variants per gender.
 * A deterministic hash of the studentId picks which variant so the same
 * student always sees the same photo.
 */

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getDefaultStudentPhoto(
  gender: 'male' | 'female',
  gradeLevel: number,
  studentId?: string,
): string {
  const isYoung = gradeLevel <= 4; // KG1(-1), KG2(0), Grade 1-4

  if (gender === 'male') {
    if (isYoung) return '/photos/students/boy-young.jpg';
    const variant = studentId ? (simpleHash(studentId) % 2) + 1 : 1;
    return `/photos/students/boy-senior-${variant}.jpg`;
  }

  // female
  if (isYoung) return '/photos/students/girl-young.jpg';
  const variant = studentId ? (simpleHash(studentId) % 2) + 1 : 1;
  return `/photos/students/girl-senior-${variant}.jpg`;
}
