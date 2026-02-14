'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { usernameToEmail } from '@/lib/auth/helpers';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const locale = formData.get('locale') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  const supabase = await createClient();
  const email = usernameToEmail(username);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(`/${locale}/dashboard`);
}
