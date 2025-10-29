import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
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
  const [lastProfileFetch, setLastProfileFetch] = useState<number>(0);
  const [profileFetching, setProfileFetching] = useState(false);
  const userIdRef = useRef<string | null>(null);

  const fetchProfile = useCallback(async (userId: string, force = false) => {
    // Evitar múltiplas chamadas simultâneas
    if (profileFetching && !force) {
      console.log("📋 [AuthContext] Já está buscando perfil, ignorando");
      return;
    }

    // Cache: só buscar se passou >30s ou force=true
    const now = Date.now();
    if (!force && now - lastProfileFetch < 30000) {
      console.log("📋 [AuthContext] Usando cache do perfil");
      return;
    }

    console.log("📋 [AuthContext] Buscando perfil para:", userId);
    setProfileFetching(true);
    
    const profileTimeout = setTimeout(() => {
      console.warn("⏰ [AuthContext] TIMEOUT: Perfil demorou +5s");
      setLoading(false);
    }, 5000);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      clearTimeout(profileTimeout);

      if (error) throw error;
      
      console.log("✅ [AuthContext] Perfil carregado:", data?.full_name);
      setProfile(data);
      setLastProfileFetch(now);
    } catch (error) {
      console.error("❌ [AuthContext] Erro ao buscar perfil:", error);
      clearTimeout(profileTimeout);
    } finally {
      setLoading(false);
      setProfileFetching(false);
    }
  }, [profileFetching, lastProfileFetch]);

  useEffect(() => {
    console.log("🔐 [AuthContext] Iniciando...");
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log("🔐 [AuthContext] Buscando sessão...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        console.log("🔐 [AuthContext] Sessão:", session ? "Encontrada" : "Não encontrada");
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ [AuthContext] Erro ao inicializar:", error);
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        console.log("🔐 [AuthContext] Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Buscar perfil apenas se mudou o user.id
          if (userIdRef.current !== session.user.id) {
            userIdRef.current = session.user.id;
            fetchProfile(session.user.id);
          }
        } else {
          userIdRef.current = null;
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

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
