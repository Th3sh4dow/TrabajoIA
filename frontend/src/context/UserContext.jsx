import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // 1. Verificar sesión persistente manual (MySQL local)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // 2. Verificar sesión de Supabase (Google / Email Supabase)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                const userData = {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
                    avatar: session.user.user_metadata.avatar_url
                };
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            }
        });

        // 3. Escuchar cambios en el estado de autenticación de Supabase
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                const userData = {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
                    avatar: session.user.user_metadata.avatar_url
                };
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            } else if (_event === 'SIGNED_OUT') {
                setUser(null);
                localStorage.removeItem("user");
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = async () => {
        // Cerrar sesión en Supabase si existe
        await supabase.auth.signOut();
        // Limpiar estado local
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
