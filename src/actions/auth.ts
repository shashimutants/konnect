'use server';

import { db } from '@/lib/db';
import { LoginSchema } from '@/lib/validations';
import {
  verifyPassword,
  hashPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getCurrentSession,
} from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirect') as string) || '/admin/dashboard';

  const validated = LoginSchema.safeParse({ email, password });
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || 'Invalid form input.' };
  }

  const user = await db.user.findUnique({
    where: { email: validated.data.email.toLowerCase().trim() },
  });

  if (!user || !user.isActive) {
    return { error: 'Invalid email or password.' };
  }

  const isValid = await verifyPassword(validated.data.password, user.passwordHash);
  if (!isValid) {
    return { error: 'Invalid email or password.' };
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await setSessionCookie(token);
  redirect(redirectTo);
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect('/admin/login');
}

export async function getCurrentUserSession() {
  const session = await getCurrentSession();
  if (!session) return null;
  return {
    userId: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
  };
}

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized. Please login again.' };

  if (!newPassword || newPassword.length < 6) {
    return { error: 'New password must be at least 6 characters long.' };
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return { error: 'User not found.' };
  }

  const isValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!isValid) {
    return { error: 'Current password is incorrect.' };
  }

  const newHash = await hashPassword(newPassword);
  await db.user.update({
    where: { id: session.userId },
    data: { passwordHash: newHash },
  });

  return { success: true, message: 'Password changed successfully.' };
}

export async function adminResetPasswordAction(userId: string, newPassword: string) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized. Only Super Admins can reset user passwords.' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { error: 'New password must be at least 6 characters long.' };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: 'Target user not found.' };
  }

  const newHash = await hashPassword(newPassword);
  await db.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  return { success: true, message: `Password for ${user.name} reset successfully.` };
}
