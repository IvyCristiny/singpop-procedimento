import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  updateEmail: (newEmail: string) => Promise<{ error: any }>;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  
  // Cache de sessão para evitar múltiplas chamadas getSession()
  const [sessionCache, setSessionCache] = useState<{
    session: Session | null;
    timestamp: number;
  } | null>(null);

  // Função para obter sessão válida com cache
  const getValidSession = async (): Promise<Session | null> => {
    const now = Date.now();
    
    // Usar cache se ainda válido (30 segundos)
    if (sessionCache && (now - sessionCache.timestamp) < 30000) {
      return sessionCache.session;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    setSessionCache({ session, timestamp: now });
    return session;
  };

  useEffect(() => {
    let isMounted = true;

    // Initialize session
    const initializeAuth = async () => {
      try {
        const session = await getValidSession();
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    };

    initializeAuth();

    // Set up listener SEM debounce mas com controle de initializing
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Ignorar eventos durante inicialização
        if (!isMounted || initializing) return;
        
        // Atualizar estado de forma síncrona
        setSession(session);
        setUser(session?.user ?? null);
        
        // Buscar perfil apenas se mudou de usuário
        if (session?.user) {
          // Usar setTimeout para evitar deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
    return { error };
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { error: new Error("No user logged in") };
    
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id);
    
    if (!error) {
      await fetchProfile(user.id);
    }
    
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    return { error };
  };

  const updateEmail = async (newEmail: string) => {
    const { error: authError } = await supabase.auth.updateUser({
      email: newEmail
    });
    
    if (authError) return { error: authError };
    
    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ email: newEmail })
        .eq("id", user.id);
      
      if (profileError) return { error: profileError };
      await fetchProfile(user.id);
    }
    
    return { error: null };
  };

  const refetchProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      updatePassword,
      updateEmail,
      refetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
