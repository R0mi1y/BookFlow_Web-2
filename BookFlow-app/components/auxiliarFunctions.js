import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

const getAccessToken = async (navigation) => {
    try {
        const user = JSON.parse(await SecureStore.getItemAsync("user"));

        if (!user) {
            console.error("Usuário não encontrado");
            navigation.reset({
                index: 0,
                routes: [{ name: "LogInScreen" }],
            });
            return;
        }

        const refreshToken = user.refresh_token;

        if (!refreshToken) {
            console.error(refreshToken);
            console.error("Refresh token não encontrado");
            navigation.reset({
                index: 0,
                routes: [{ name: "LogInScreen" }],
            });
            return;
        }

        const response = await fetch(
            `${apiUrl}/api/token/refresh/`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: refreshToken,
            }),
            }
        );

        if (!response.ok) {
            console.error(`Erro na requisição de atualização do token: ${response.statusText}`);
            return;
        }

        if (response.code === "token_not_valid") {
            console.error("Invalid token: " + response.statusText);
            navigation.reset({
                index: 0,
                routes: [{ name: "LogInScreen" }],
            });
        }

        const data = await response.json();

        if (!('access' in data)) {
            console.error("Resposta não contém o token de acesso");
            navigation.reset({
                index: 0,
                routes: [{ name: "LogInScreen" }],
            });
            return;
        }

        return data.access;

    } catch (error) {
        console.error("Erro ao obter o token de acesso", error);
        navigation.reset({
            index: 0,
            routes: [{ name: "LogInScreen" }],
        });
    }
};

export default getAccessToken;