// authSystem.ts
type AuthStateChangeCallback = (token: string | null) => void;

export interface User {
  uid: string;
  displayName: string;
  email: string;
}

class AuthSystem {
  private user: User | null = null;
  private token: string | null = null;
  private listeners: AuthStateChangeCallback[] = [];

  // Metoda do nasłuchiwania zmian stanu autoryzacji
  onAuthStateChanged(callback: AuthStateChangeCallback): () => void {
    this.listeners.push(callback);
    // Wywołanie callbacka z aktualnym stanem użytkownika
    callback(this.token);

    // Funkcja do usuwania nasłuchiwania
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Metoda do zmiany stanu użytkownika (symulacja logowania/wylogowania)
  setUser(user: User | null, token: string | null = null) {
    this.user = user;
    this.token = token;
    this.notifyListeners();
  }

  getToken(): string | null {
    return this.token;
  }

  // Powiadomienie wszystkich zarejestrowanych listenerów
  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.token));
  }
}

export const authSystem = new AuthSystem();
