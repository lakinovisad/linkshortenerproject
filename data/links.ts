import { db } from '@/db';
import { links } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { NewLink } from '@/db/schema';

/**
 * Fetches all links for a specific user
 * @param userId - The Clerk user ID
 * @returns Array of links belonging to the user, sorted by creation date (newest first)
 */
export async function getUserLinks(userId: string) {
  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));

  return userLinks;
}

/**
 * Fetches a single link by its short code
 * @param shortCode - The short code of the link
 * @returns The link if found, undefined otherwise
 */
export async function getLinkByShortCode(shortCode: string) {
  const link = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return link[0];
}

/**
 * Fetches a single link by its ID and user ID (for authorization)
 * @param id - The link ID
 * @param userId - The Clerk user ID
 * @returns The link if found and belongs to user, undefined otherwise
 */
export async function getUserLinkById(id: string, userId: string) {
  const link = await db
    .select()
    .from(links)
    .where(eq(links.id, id))
    .limit(1);

  if (link[0]?.userId !== userId) {
    return undefined;
  }

  return link[0];
}

/**
 * Creates a new shortened link
 * @param data - The link data to insert
 * @returns The newly created link
 */
export async function createLinkInDb(data: NewLink) {
  const [newLink] = await db
    .insert(links)
    .values(data)
    .returning();

  return newLink;
}

/**
 * Updates an existing link
 * @param id - The link ID
 * @param userId - The Clerk user ID (for authorization)
 * @param data - The data to update
 * @returns The updated link, or undefined if not found/unauthorized
 */
export async function updateLinkInDb(
  id: number,
  userId: string,
  data: { originalUrl?: string; shortCode?: string }
) {
  // First verify the link belongs to the user
  const existingLink = await db
    .select()
    .from(links)
    .where(eq(links.id, id))
    .limit(1);

  if (!existingLink[0] || existingLink[0].userId !== userId) {
    return undefined;
  }

  const [updatedLink] = await db
    .update(links)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(links.id, id))
    .returning();

  return updatedLink;
}

/**
 * Deletes a link
 * @param id - The link ID
 * @param userId - The Clerk user ID (for authorization)
 * @returns True if deleted, false if not found/unauthorized
 */
export async function deleteLinkFromDb(id: number, userId: string) {
  // First verify the link belongs to the user
  const existingLink = await db
    .select()
    .from(links)
    .where(eq(links.id, id))
    .limit(1);

  if (!existingLink[0] || existingLink[0].userId !== userId) {
    return false;
  }

  await db.delete(links).where(eq(links.id, id));

  return true;
}

/**
 * Increments the click counter for a link
 * @param shortCode - The short code of the link
 * @returns The updated link, or undefined if not found
 */
export async function incrementLinkClicks(shortCode: string) {
  const [updatedLink] = await db
    .update(links)
    .set({ 
      clicks: sql`${links.clicks} + 1`,
      updatedAt: new Date() 
    })
    .where(eq(links.shortCode, shortCode))
    .returning();

  return updatedLink;
}
