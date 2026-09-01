/**
 * PetPin Unique Smart Tag ID Generator
 * Generates collision-resistant, human-readable hardware serial identifiers
 * Example format: PETPIN-TR-8F3A29
 */
export function generateUniqueTagId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars like 0/O, 1/I
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PETPIN-TR-${randomPart}`;
}
