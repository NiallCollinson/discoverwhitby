type Role = "guest" | "customer" | "host_owner" | "host_member" | "moderator" | "admin";

export type Permission =
  | "property:read"
  | "property:write"
  | "payout:view"
  | "payout:manage"
  | "support:resolve"
  | "admin:all";

const rolePermissions: Record<Role, Permission[]> = {
  guest: ["property:read"],
  customer: ["property:read"],
  host_member: ["property:read", "property:write", "payout:view"],
  host_owner: ["property:read", "property:write", "payout:view", "payout:manage"],
  moderator: ["property:read", "support:resolve"],
  admin: ["admin:all"],
};

export function can(user: { role?: Role; permissions?: Permission[] } | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  const allowed = new Set([...(rolePermissions[user.role ?? "guest"] ?? []), ...(user.permissions ?? [])]);
  return allowed.has(permission);
}

export function requireRole(user: { role?: Role } | null | undefined, roles: Role[]) {
  if (!user || !user.role || !roles.includes(user.role)) {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  }
}


