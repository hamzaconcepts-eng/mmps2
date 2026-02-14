'use server';

import { createClient } from '@supabase/supabase-js';
import { usernameToEmail } from '@/lib/auth/helpers';

// Create admin client with service role (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export interface CreateUserData {
  username: string;
  password: string;
  role: string;
  full_name: string;
  full_name_ar: string;
  phone?: string;
}

export async function createUser(data: CreateUserData) {
  try {
    // Convert username to email format
    const email = usernameToEmail(data.username);

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true, // Auto-confirm
    });

    if (authError) throw authError;

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: data.username,
        role: data.role,
        full_name: data.full_name,
        full_name_ar: data.full_name_ar,
        phone: data.phone,
      });

    if (profileError) {
      // Rollback: delete auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return {
      success: true,
      user: {
        id: authData.user.id,
        username: data.username,
        role: data.role,
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create user'
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    // Delete from profiles (auth user will cascade delete)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) throw profileError;

    // Delete auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) throw authError;

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete user'
    };
  }
}

export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update password'
    };
  }
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  try {
    // Update profile active status
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId);

    if (profileError) throw profileError;

    // Ban/unban in auth
    if (isActive) {
      // Unban user
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: 'none'
      });
      if (authError) throw authError;
    } else {
      // Ban user indefinitely
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: '876000h' // ~100 years
      });
      if (authError) throw authError;
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update user status'
    };
  }
}
