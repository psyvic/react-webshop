import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a criteria
export const permissions = {
  ...generatedPermissions,
};

// Rule based function
//   Rules can return a bool or a filter which
// limits which DB entries they can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1.Do they have permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. if not, do they own this item
    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1.Do they have permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. if not, do they own this item
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1.Do they have permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. if not, do they own this item
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; // can read everything
    }
    // otherwise only see available
    return { status: 'AVAILABLE' };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // 2. otherwise only update themselves
    return { id: session.itemId };
  },
};
