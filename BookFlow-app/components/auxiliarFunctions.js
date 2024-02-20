import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

const getAccessToken = async (navigation) => {
    try {
        const user = JSON.parse(await SecureStore.getItemAsync("user"));

        if (!user) {
            console.log("Usuário não logado");
            navigation.reset({
                index: 0,
                routes: [{ name: "LogInScreen" }],
            });
            return;
        }

        const refreshToken = user.refresh_token;

        if (!refreshToken) {
            console.log("Refresh token não encontrado");
            navigation.reset({
                index: 0,
                routes: [{ name: "LogInScreen" }],
            });
            return;
        }
        let url = `${apiUrl}/api/token/refresh/`;

        const response = await fetch(url,
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
            console.log(`Erro na requisição de atualização do token: ${response.statusText}`);
            return;
        }

        if (response.code === "token_not_valid") {
            console.log("Invalid token: " + response.statusText);
            navigation.reset({
                index: 0,
                routes: [{ name: "LogInScreen" }],
            });
        }

        const data = await response.json();

        if (!(data.includes('access'))) {
            console.error("Resposta não contém o token de acesso");
            navigation.reset({
                index: 0,
                routes: [{ name: "LogInScreen" }],
            });
            return;
        }

        return data.access;

    } catch (error) {
        console.log("Erro ao obter o token de acesso", error);
        navigation.reset({
            index: 0,
            routes: [{ name: "LogInScreen" }],
        });
    }
};

export default getAccessToken;