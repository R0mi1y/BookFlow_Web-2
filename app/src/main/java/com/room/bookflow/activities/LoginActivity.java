package com.room.bookflow.activities;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.android.volley.NoConnectionError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.ServerError;
import com.android.volley.TimeoutError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityLoginBinding;

import org.json.JSONException;
import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding binding;
    private GoogleSignInClient googleSignInClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setupGoogleSignIn();

        binding.loginBtn.setOnClickListener(v -> {
            Log.i("Login with google", "Começando o login!");
            Toast.makeText(this, "Começando o login!", Toast.LENGTH_SHORT).show();
            doLogin();
        });

        binding.googleLoginBtn.setOnClickListener(v -> {
            Log.i("Login with google", "Começando o login com o google!");
            Toast.makeText(this, "Começando o login com o google!", Toast.LENGTH_SHORT).show();
            Intent signInIntent = googleSignInClient.getSignInIntent();
            singInGoogleActivity.launch(signInIntent);
        });

        binding.sigUpButton.setOnClickListener(view -> {
            Intent intent = new Intent(LoginActivity.this, SignUpActivity.class);
            singUpActivity.launch(intent);
        });
    }

    public void PopUp(String title, String message) {
        AlertDialog.Builder builder = new AlertDialog.Builder(LoginActivity.this);
        builder.setTitle(title)
                .setMessage(message);

        builder.setPositiveButton("OK", (dialogInterface, i) -> dialogInterface.dismiss());

        AlertDialog alertDialog = builder.create();
        alertDialog.getWindow().setBackgroundDrawableResource(R.drawable.dialog_border);

        alertDialog.show();
    }

    ActivityResultLauncher<Intent> singInGoogleActivity = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == -1) {
                    Intent intent = result.getData();

                    Toast.makeText(this, "Resultado recebido do sign in google intent!", Toast.LENGTH_SHORT).show();
                    Log.i("Login with google", "Resultado recebido do sign in google intent!");

                    try {
                        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(intent);

                        Toast.makeText(this, "intent: " + intent.getExtras().toString(), Toast.LENGTH_SHORT).show();
                        Log.i("Login with google", "intent: " + intent.getExtras().toString());
                        GoogleSignInAccount account = task.getResult(ApiException.class);

                        Toast.makeText(this, "Api pass", Toast.LENGTH_SHORT).show();
                        Log.i("Login with google", "Api pass");

                        doLoginWithGoogle(account);
                    } catch (ApiException e) {
                        e.printStackTrace();
                        Toast.makeText(this, "Google sign in failed > " + e.toString(), Toast.LENGTH_SHORT).show();
                        Log.e("LoginActivity", "Google sign in failed", e);
                    } catch (Exception e) {
                        Toast.makeText(this, "Google sign in failed > " + e.toString(), Toast.LENGTH_SHORT).show();
                        Log.e("LoginActivity", "Google sign in failed", e);
                    }
                }
            }
    );

    ActivityResultLauncher<Intent> singUpActivity = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == -1) {
                    Intent intent = result.getData();

                    PopUp("Sucesso!", "Sua conta foi criada com sucesso, agora faça login e seja bem vindo!");
                }
            }
    );

    private void setupGoogleSignIn() {
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();

        googleSignInClient = GoogleSignIn.getClient(this, gso);
    }

    private void doLoginWithGoogle(GoogleSignInAccount account) {
        Intent intent = new Intent(LoginActivity.this, HomeActivity.class);

        // Criar um objeto JSON com os dados da conta Google
        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("id", account.getId());
            jsonBody.put("email", account.getEmail());
            jsonBody.put("name", account.getDisplayName());
            jsonBody.put("given_name", account.getGivenName());
            jsonBody.put("family_name", account.getFamilyName());
            jsonBody.put("picture", account.getPhotoUrl().toString());
        } catch (JSONException e) {
            e.printStackTrace();
            // Lidar com erro ao criar o JSON, se necessário
        }

        String url = getString(R.string.api_url) + "/api/user/signup/googleaccount/";

        // Criar a requisição Volley
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonBody,
                response -> {
                    // Lidar com a resposta bem-sucedida
                    intent.putExtra("user", response.toString());
                    startActivity(intent);
                },
                error -> {
                    // Lidar com erros na requisição
                    if (error instanceof NoConnectionError) {
                        // Sem conexão de internet
                        Toast.makeText(LoginActivity.this, "Sem conexão de internet", Toast.LENGTH_SHORT).show();
                    } else if (error instanceof TimeoutError) {
                        // Tempo de espera excedido
                        Toast.makeText(LoginActivity.this, "Tempo de espera excedido", Toast.LENGTH_SHORT).show();
                    } else if (error instanceof ServerError) {
                        // Erro no servidor
                        Toast.makeText(LoginActivity.this, "Erro no servidor", Toast.LENGTH_SHORT).show();
                    } else {
                        // Outro tipo de erro
                        Toast.makeText(LoginActivity.this, "Erro desconhecido", Toast.LENGTH_SHORT).show();
                    }
                });

        // Adicionar a requisição à fila
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(request);
    }

    private void doLogin() {
        Intent intent = new Intent(LoginActivity.this, HomeActivity.class);

        // Criar um objeto JSON com os dados da conta Google
        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("email", binding.email.getText());
            jsonBody.put("password", binding.password.getText());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        String url = getString(R.string.api_url) + "/api/user/login/";

        // Criar a requisição Volley
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonBody,
                response -> {
                    // Lidar com a resposta bem-sucedida
                    intent.putExtra("user", response.toString());
                    startActivity(intent);
                },
                error -> {
                    // Lidar com erros na requisição
                    if (error instanceof NoConnectionError) {
                        // Sem conexão de internet
                        Toast.makeText(LoginActivity.this, "Sem conexão de internet", Toast.LENGTH_SHORT).show();
                    } else if (error instanceof TimeoutError) {
                        // Tempo de espera excedido
                        Toast.makeText(LoginActivity.this, "Tempo de espera excedido", Toast.LENGTH_SHORT).show();
                    } else if (error instanceof ServerError) {
                        // Erro no servidor
                        Toast.makeText(LoginActivity.this, "Erro no servidor", Toast.LENGTH_SHORT).show();
                    } else {
                        // Outro tipo de erro
                        Toast.makeText(LoginActivity.this, "Erro desconhecido", Toast.LENGTH_SHORT).show();
                    }
                });

        // Adicionar a requisição à fila
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(request);
    }
}