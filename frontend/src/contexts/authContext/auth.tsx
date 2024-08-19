import { authSystem } from "./authSystem";
  
export const SignUpWithEmail = async (email: string, displayName: string, password: string) => {
    try {
        const response = await fetch(`http://localhost:80/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                displayName: displayName,
                passwordHash: password
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const userData = await response.json();
        if (userData.error){
            return { error: userData.errorCode }
        } else {
            //console.log(userData); // Przypisujemy otrzymane dane do stanu
            authSystem.setUser(userData.user, userData.token);
        }
    } catch (error: any) {
        return { error: error.code };
    }
}
  
export const SignInWithEmail = async (email: string, password: string) => {
    try {
        const response = await fetch(`http://localhost:80/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                passwordHash: password
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const userData = await response.json();
        if (userData.error){
            return { error: userData.errorCode }
        } else {
            //console.log(userData); // Przypisujemy otrzymane dane do stanu
            authSystem.setUser(userData.user, userData.token);
        }
    } catch (error: any) {
        return { error: error.code };
    }
}

export const SignOut = async (token: string) => {
    try {
        authSystem.setUser(null);
        
        fetch(`http://localhost:80/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token: token})
        });
    } catch (error: any) {
        console.log(error.code);
        // return { error: error.code };
    }
}