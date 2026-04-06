import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  userId: string;       // Cognito sub
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UserProfileRecord {
  id: string;
  cognitoUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatarS3Key?: string | null;
}

interface AuthContextValue {
  /** Cognito identity + resolved name fields */
  user: AuthUser | null;
  /** DynamoDB UserProfile record */
  profile: UserProfileRecord | null;
  /** true while we're figuring out who the user is */
  loading: boolean;
  signOut: () => Promise<void>;
  /** Call after saving profile edits to refresh context */
  refreshProfile: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Fetch the UserProfile for a given Cognito userId.
 * Returns null if not found yet.
 */
async function fetchProfile(cognitoUserId: string): Promise<UserProfileRecord | null> {
  try {
    const { data } = await client.models.UserProfile.list({
      filter: { cognitoUserId: { eq: cognitoUserId } },
    });
    return (data?.[0] as UserProfileRecord) ?? null;
  } catch {
    return null;
  }
}

/**
 * Create a UserProfile record for a first-time user.
 * Cognito attributes come from the token claims via getCurrentUser().
 */
async function createProfile(
  cognitoUserId: string,
  email: string,
  firstName: string,
  lastName: string,
): Promise<UserProfileRecord | null> {
  try {
    const { data } = await client.models.UserProfile.create({
      cognitoUserId,
      email,
      firstName,
      lastName,
    });
    return data as UserProfileRecord;
  } catch (err) {
    console.error('Failed to create UserProfile', err);
    return null;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      // getCurrentUser() throws if not signed in
      const cognitoUser = await getCurrentUser();
      const { userId, signInDetails } = cognitoUser;

      // signInDetails.loginId is the email for email-based auth
      const email = signInDetails?.loginId ?? '';

      // Cognito user attributes aren't directly on getCurrentUser() —
      // we pull them from the UserProfile record (or token claims if needed).
      // For the first load, firstName/lastName may come from the profile record.
      let prof = await fetchProfile(userId);

      if (!prof) {
        // First login — create a profile.
        // Name fields: Amplify stores given_name/family_name as Cognito attributes.
        // We default to empty strings; the user will fill them in the profile dialog.
        prof = await createProfile(userId, email, '', '');
      }

      setUser({
        userId,
        email,
        firstName: prof?.firstName ?? '',
        lastName: prof?.lastName ?? '',
        phone: prof?.phone ?? undefined,
      });
      setProfile(prof);
    } catch {
      // Not signed in
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function refreshProfile() {
    if (!user) return;
    const prof = await fetchProfile(user.userId);
    if (prof) {
      setProfile(prof);
      setUser((u) =>
        u
          ? { ...u, firstName: prof.firstName, lastName: prof.lastName, phone: prof.phone ?? undefined }
          : u,
      );
    }
  }

  async function signOut() {
    await amplifySignOut();
    setUser(null);
    setProfile(null);
  }

  useEffect(() => {
    loadUser();

    // Re-run when Amplify fires auth events (sign in, sign out, token refresh)
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          loadUser();
          break;
        case 'signedOut':
          setUser(null);
          setProfile(null);
          setLoading(false);
          break;
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}