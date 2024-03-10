package com.room.bookflow.activities;

import static com.room.bookflow.helpers.Utilitary.showLoadingScreen;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.util.Log;
import android.util.Patterns;
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
import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivitySignUpBinding;
import com.room.bookflow.models.User;

import org.json.JSONException;
import org.json.JSONObject;

public class SignUpActivity extends AppCompatActivity {

    private ActivitySignUpBinding binding;
    private GoogleSignInClient googleSignInClient;
    private BookFlowDatabase database;
    private int TYPE_TEXT_VARIATION_PASSWORD = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySignUpBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        database = BookFlowDatabase.getDatabase(this);

        Intent resultIntent = new Intent();

        setupGoogleSignIn();

        binding.backButton.setOnClickListener(v -> {
            finish();
        });

        binding.showPass.setOnClickListener(v -> {
            int inputType = binding.password.getInputType();

            if (TYPE_TEXT_VARIATION_PASSWORD == -1) TYPE_TEXT_VARIATION_PASSWORD = inputType;

            int newInputType = inputType == TYPE_TEXT_VARIATION_PASSWORD ?
                    InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD :
                    TYPE_TEXT_VARIATION_PASSWORD;

            binding.password.setInputType(newInputType);
            binding.password.setSelection(binding.password.getText().length());
        });

        binding.showConfirmPass.setOnClickListener(v -> {
            int inputType = binding.confirmPassword.getInputType();

            if (TYPE_TEXT_VARIATION_PASSWORD == -1) TYPE_TEXT_VARIATION_PASSWORD = inputType;

            int newInputType = inputType == TYPE_TEXT_VARIATION_PASSWORD ?
                    InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD :
                    TYPE_TEXT_VARIATION_PASSWORD;

            binding.confirmPassword.setInputType(newInputType);
            binding.confirmPassword.setSelection(binding.confirmPassword.getText().length());
        });

        binding.googleSinginBtn.setOnClickListener(v -> {
                Log.i("Login with google", "Começando o login com o google!");
                Intent signInIntent = googleSignInClient.getSignInIntent();
                singInGoogleActivity.launch(signInIntent);
            }
        );

        binding.singinBtn.setOnClickListener(v -> {
           binding.singinBtn.setEnabled(false);
            showLoadingScreen(binding.loadingGif, this, () -> {
                new Thread(() -> {
                    signUp();
                    runOnUiThread(() -> binding.singinBtn.setEnabled(false));
                }).start();
            });
        });
    }

    private void setupGoogleSignIn() {
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();

        googleSignInClient = GoogleSignIn.getClient(this, gso);
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
                    Intent intent = new Intent(SignUpActivity.this, HomeActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);

                    intent.putExtra("user", response.toString());
                    startActivity(intent);
                },
                error -> {
                    if (error instanceof NoConnectionError) {
                        Toast.makeText(SignUpActivity.this, "Sem conexão de internet", Toast.LENGTH_SHORT).show();
                    } else if (error instanceof TimeoutError) {
                        Toast.makeText(SignUpActivity.this, "Tempo de espera excedido", Toast.LENGTH_SHORT).show();
                    } else if (error instanceof ServerError) {
                        Toast.makeText(SignUpActivity.this, "Erro no servidor", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(SignUpActivity.this, "Erro desconhecido", Toast.LENGTH_SHORT).show();
                    }
                });

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(request);
    }

    private void signUp() {
        if (
                binding.email.getText().toString().isEmpty() ||
                binding.username.getText().toString().isEmpty() ||
                binding.password.getText().toString().isEmpty() ||
                binding.confirmPassword.getText().toString().isEmpty() ||
                binding.firstName.getText().toString().isEmpty() ||
                binding.lastName.getText().toString().isEmpty()
        ) {
            PopUp("Erro", "Preencha todos os campos!");
            return;
        } else if (
                !binding.password.getText().toString().equals(binding.confirmPassword.getText().toString())
        ) {
            PopUp("Erro", "Os campos de senha devem ser iguais!");
            return;
        } else if (
                binding.password.getText().toString().length() < 8
        ) {
            PopUp("Erro", "A senha deve ter no mínimo 8 caracteres!");
            return;
        } else if (
                !Patterns.EMAIL_ADDRESS.matcher(binding.email.getText().toString()).matches()
        ) {
            PopUp("Erro", "Digite um e-mail válido!");
            return;
        }

        User user = new User();

        user.setEmail(binding.email.getText().toString());
        user.setUsername(binding.username.getText().toString());
        user.setFirstName(binding.firstName.getText().toString());
        user.setLastName(binding.lastName.getText().toString());
        user.setPassword(binding.password.getText().toString());

        user.save(this);
        user.setIs_autenticated(true);
        user.setAddress_id(-1);
        database.userDao().insert(user);
    }


    public void PopUp(String title, String message) {
        AlertDialog.Builder builder = new AlertDialog.Builder(SignUpActivity.this);
        builder.setTitle(title)
                .setMessage(message);

        builder.setPositiveButton("OK", (dialogInterface, i) -> dialogInterface.dismiss());

        AlertDialog alertDialog = builder.create();
        alertDialog.getWindow().setBackgroundDrawableResource(R.drawable.dialog_border);

        alertDialog.show();
    }
}