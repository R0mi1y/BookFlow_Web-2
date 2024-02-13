package com.room.bookflow.activities;

import static com.room.bookflow.components.Utilitary.popUp;
import static com.room.bookflow.components.Utilitary.hideLoadingScreen;
import static com.room.bookflow.components.Utilitary.showLoadingScreen;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.text.InputType;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import com.android.volley.NoConnectionError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.ServerError;
import com.android.volley.TimeoutError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.bumptech.glide.Glide;
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
    private int TYPE_TEXT_VARIATION_PASSWORD = -1;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setupGoogleSignIn();

        binding.showPass.setOnClickListener(v -> {
            int inputType = binding.password.getInputType();

            if (TYPE_TEXT_VARIATION_PASSWORD == -1) TYPE_TEXT_VARIATION_PASSWORD = inputType;

            int newInputType = inputType == TYPE_TEXT_VARIATION_PASSWORD ?
                    InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD :
                    TYPE_TEXT_VARIATION_PASSWORD;

            binding.password.setInputType(newInputType);
            binding.password.setSelection(binding.password.getText().length());
        });

        binding.loginBtn.setOnClickListener(v -> {
            showLoadingScreen(binding.loadingGif, this);
            Log.i("Login with google", "Começando o login!");
            new Thread(this::doLogin).start();
        });

        binding.googleLoginBtn.setOnClickListener(v -> {
            showLoadingScreen(binding.loadingGif, this);
            Log.i("Login with google", "Começando o login com o google!");
            Intent signInIntent = googleSignInClient.getSignInIntent();
            singInGoogleActivity.launch(signInIntent);
        });

        binding.sigUpButton.setOnClickListener(view -> {
            Intent intent = new Intent(LoginActivity.this, SignUpActivity.class);
            singUpActivity.launch(intent);
        });
    }

    ActivityResultLauncher<Intent> singInGoogleActivity = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == -1) {
                    Intent intent = result.getData();
                    Log.i("Login with google", "Resultado recebido do sign in google intent!");

                    try {
                        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(intent);

                        Log.i("Login with google", "intent: " + intent.getExtras().toString());
                        GoogleSignInAccount account = task.getResult(ApiException.class);

                        Log.i("Login with google", "Api pass");

                        doLoginWithGoogle(account);
                    } catch (ApiException e) {
                        hideLoadingScreen(binding.loadingGif);
                        e.printStackTrace();
                        Toast.makeText(this, "Google sign in failed > " + e.toString(), Toast.LENGTH_SHORT).show();
                        Log.e("LoginActivity", "Google sign in failed", e);
                    } catch (Exception e) {
                        hideLoadingScreen(binding.loadingGif);
                        Toast.makeText(this, "Google sign in failed > " + e.toString(), Toast.LENGTH_SHORT).show();
                        Log.e("LoginActivity", "Google sign in failed", e);
                    }
                }
            }
    );

    ActivityResultLauncher<Intent> singUpActivity = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == Activity.RESULT_OK) {
                    Intent intent = result.getData();

                    popUp("Sucesso!", "Sua conta foi criada com sucesso, agora faça login e seja bem vindo!", this);
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
        }

        String url = getString(R.string.api_url) + "/api/user/signup/googleaccount/";

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonBody,
                response -> {
                    Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);

                    intent.putExtra("user", response.toString());
                    startActivity(intent);
                },
                error -> {
                    if (error instanceof NoConnectionError) {
                        Toast.makeText(LoginActivity.this, "Sem conexão de internet", Toast.LENGTH_SHORT).show();
                    } else if (error instanceof TimeoutError) {
                        Toast.makeText(LoginActivity.this, "Tempo de espera excedido", Toast.LENGTH_SHORT).show();
                    } else if (error instanceof ServerError) {
                        Toast.makeText(LoginActivity.this, "Erro no servidor", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(LoginActivity.this, "Erro desconhecido", Toast.LENGTH_SHORT).show();
                    }
                });
        hideLoadingScreen(binding.loadingGif);
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(request);
    }

    private void doLogin() {
        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("email", binding.email.getText().toString());
            jsonBody.put("password", binding.password.getText().toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        String url = getString(R.string.api_url) + "/api/user/login/";

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonBody,
                response -> {
                    try {
                        if (response.has("status") && response.getString("status").equals("error")) {
                            String errorMessage = response.getString("message");
                            popUp("Erro ao efetuar login", errorMessage, this);
                        } else {
                            Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                            intent.putExtra("user", response.toString());
                            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);
                        }
                    } catch (JSONException e) {
                        Log.e("Erro ao processar resposta", e.getMessage());
                    }
                },
                error -> {
                    if (error instanceof NoConnectionError) {
                        Toast.makeText(LoginActivity.this, "Sem conexão de internet", Toast.LENGTH_SHORT).show();
                    } else if (error instanceof TimeoutError) {
                        Toast.makeText(LoginActivity.this, "Tempo de espera excedido", Toast.LENGTH_SHORT).show();
                    } else if (error instanceof ServerError) {
                        Toast.makeText(LoginActivity.this, "Erro no servidor", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(LoginActivity.this, "Erro desconhecido", Toast.LENGTH_SHORT).show();
                    }
                });
        hideLoadingScreen(binding.loadingGif);
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(request);
    }
}