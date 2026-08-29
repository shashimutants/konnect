'use server';

import { db } from '@/lib/db';
import { getCurrentSession, hashPassword } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUsersList() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') return [];

  return db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createUserAction(data: {
  email: string;
  name: string;
  password: string;
  role: string;
}) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') return { error: 'Unauthorized.' };

  const existing = await db.user.findUnique({
    where: { email: data.email.toLowerCase().trim() },
  });
  if (existing) return { error: 'User with this email already exists.' };

  const passwordHash = await hashPassword(data.password);

  const user = await db.user.create({
    data: {
      email: data.email.toLowerCase().trim(),
      name: data.name,
      passwordHash,
      role: data.role || 'EDITOR',
      isActive: true,
    },
  });

  revalidatePath('/admin/users');
  return { success: true, user: { id: user.id, email: user.email, name: user.name } };
}

export async function updateUserAction(data: {
  userId: string;
  name: string;
  email: string;
  role: string;
}) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') return { error: 'Unauthorized.' };

  const existing = await db.user.findFirst({
    where: {
      email: data.email.toLowerCase().trim(),
      NOT: { id: data.userId },
    },
  });
  if (existing) return { error: 'Another user already uses this email.' };

  await db.user.update({
    where: { id: data.userId },
    data: {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      role: data.role,
    },
  });

  revalidatePath('/admin/users');
  return { success: true };
}

export async function toggleUserStatusAction(userId: string, isActive: boolean) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') return { error: 'Unauthorized.' };

  if (session.userId === userId) {
    return { error: 'Security restriction: You cannot deactivate your own account.' };
  }

  await db.user.update({
    where: { id: userId },
    data: { isActive },
  });

  revalidatePath('/admin/users');
  return { success: true };
}

export async function deleteUserAction(userId: string) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') return { error: 'Unauthorized.' };

  if (session.userId === userId) {
    return { error: 'Security restriction: You cannot delete your own account.' };
  }

  await db.user.delete({ where: { id: userId } });
  revalidatePath('/admin/users');
  return { success: true };
}
