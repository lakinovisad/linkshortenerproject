'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { 
  createLinkInDb, 
  getLinkByShortCode, 
  updateLinkInDb, 
  deleteLinkFromDb 
} from '@/data/links';

const createLinkSchema = z.object({
  originalUrl: z.string().url('Please enter a valid URL'),
  shortCode: z
    .string()
    .min(3, 'Short code must be at least 3 characters')
    .max(20, 'Short code must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Short code can only contain letters, numbers, hyphens, and underscores'),
});

type CreateLinkInput = {
  originalUrl: string;
  shortCode: string;
};

export async function createLink(input: CreateLinkInput) {
  // Check authentication
  const { userId } = await auth();
  
  if (!userId) {
    return { error: 'Unauthorized' };
  }
  
  // Validate input
  const parsed = createLinkSchema.safeParse(input);
  
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError.message };
  }
  
  const { originalUrl, shortCode } = parsed.data;
  
  // Check if short code already exists
  try {
    const existingLink = await getLinkByShortCode(shortCode);
    
    if (existingLink) {
      return { error: 'This short code is already taken. Please choose another.' };
    }
    
    // Create the link
    const newLink = await createLinkInDb({
      userId,
      originalUrl,
      shortCode,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Revalidate the dashboard page to show the new link
    revalidatePath('/dashboard');
    
    return { success: true, link: newLink };
  } catch (error) {
    console.error('Create link error:', error);
    return { error: 'Failed to create link. Please try again.' };
  }
}

const updateLinkSchema = z.object({
  id: z.number(),
  originalUrl: z.string().url('Please enter a valid URL'),
  shortCode: z
    .string()
    .min(3, 'Short code must be at least 3 characters')
    .max(20, 'Short code must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Short code can only contain letters, numbers, hyphens, and underscores'),
});

type UpdateLinkInput = {
  id: number;
  originalUrl: string;
  shortCode: string;
};

export async function updateLink(input: UpdateLinkInput) {
  // Check authentication
  const { userId } = await auth();
  
  if (!userId) {
    return { error: 'Unauthorized' };
  }
  
  // Validate input
  const parsed = updateLinkSchema.safeParse(input);
  
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError.message };
  }
  
  const { id, originalUrl, shortCode } = parsed.data;
  
  try {
    // Check if the new short code is already taken by another link
    const existingLink = await getLinkByShortCode(shortCode);
    
    if (existingLink && existingLink.id !== id) {
      return { error: 'This short code is already taken. Please choose another.' };
    }
    
    // Update the link
    const updatedLink = await updateLinkInDb(id, userId, {
      originalUrl,
      shortCode,
    });
    
    if (!updatedLink) {
      return { error: 'Link not found or unauthorized' };
    }
    
    // Revalidate the dashboard page
    revalidatePath('/dashboard');
    
    return { success: true, link: updatedLink };
  } catch (error) {
    console.error('Update link error:', error);
    return { error: 'Failed to update link. Please try again.' };
  }
}

export async function deleteLink(linkId: number) {
  // Check authentication
  const { userId } = await auth();
  
  if (!userId) {
    return { error: 'Unauthorized' };
  }
  
  try {
    const deleted = await deleteLinkFromDb(linkId, userId);
    
    if (!deleted) {
      return { error: 'Link not found or unauthorized' };
    }
    
    // Revalidate the dashboard page
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Delete link error:', error);
    return { error: 'Failed to delete link. Please try again.' };
  }
}
