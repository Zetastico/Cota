import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión persistida al montar el componente
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        // En caso de corrupción de datos en localStorage, limpiar
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);

    // Escuchar el evento de token expirado (emitido desde Axios interceptor)
    const handleAuthExpired = () => {
      logout();
      alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
    };

    window.addEventListener('cotal-auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('cotal-auth-expired', handleAuthExpired);
    };
  }, []);

  /**
   * Iniciar sesión en el backend
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      const { token: jwtToken, user: userData } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Actualizar estado
      setToken(jwtToken);
      setUser(userData);
      
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - { nombre, apellido, email, password, rol }
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      return await authService.register(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cerrar sesión limpiando el almacenamiento y el estado
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

