/**
 * Returns the default student photo path based on gender and grade level.
 *
 * Photo mapping:
 *   - Boy  KG1–Grade4  → boy-young.png
 *   - Boy  Grade5–Grade8 → boy-senior-1.png or boy-senior-2.png
 *   - Girl KG1–Grade4  → girl-young.png
 *   - Girl Grade5–Grade8 → girl-senior-1.png or girl-senior-2.png
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
    if (isYoung) return '/photos/students/boy-young.png';
    const variant = studentId ? (simpleHash(studentId) % 2) + 1 : 1;
    return `/photos/students/boy-senior-${variant}.png`;
  }

  // female
  if (isYoung) return '/photos/students/girl-young.png';
  const variant = studentId ? (simpleHash(studentId) % 2) + 1 : 1;
  return `/photos/students/girl-senior-${variant}.png`;
}
