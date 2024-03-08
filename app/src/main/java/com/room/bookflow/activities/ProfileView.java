package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;

import com.room.bookflow.databinding.ActivityProfileBinding;
import com.room.bookflow.models.Address;
import com.room.bookflow.models.User;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class ProfileView extends AppCompatActivity {

    ActivityProfileBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.btnEditLoc.setOnClickListener(v -> {
            Intent intent = new Intent(ProfileView.this, RegisterLocationActivity.class);
            startActivity(intent);
        });

        new Thread(() -> {
            User userProfile = User.getAuthenticatedUser(this);

            if (userProfile != null) {
                Log.d("UserProfile", "ID: " + userProfile.getId());
                Log.d("UserProfile", "Username: " + userProfile.getUsername());
                Log.d("UserProfile", "Email: " + userProfile.getEmail());
                // Adicione mais logs conforme necessário para outras propriedades
            } else {
                Log.e("UserProfile", "UserProfile is null");
                runOnUiThread(() -> showToast("Erro ao obter perfil do usuário!"));
                return;
            }

            // Verificar se o perfil do usuário e o ID são válidos
            if (userProfile.getId() >= 0) {
                int userId = userProfile.getId();

                runOnUiThread(() -> {
                    binding.editTextName.setText(userProfile.getUsername());
                    binding.editTextEmail.setText(userProfile.getEmail());
                    binding.editTextPhone.setText(userProfile.getPhone());
                    binding.editTextBiography.setText(userProfile.getBiography());

                    binding.btnSalvChanges.setOnClickListener(v -> {
                        // Obter os dados dos campos de edição
                        String updatedName = binding.editTextName.getText().toString();
                        String updatedEmail = binding.editTextEmail.getText().toString();
                        String updatedPhone = binding.editTextPhone.getText().toString();
                        String updatedBiography = binding.editTextBiography.getText().toString();

                        // Criar um objeto User com as alterações
                        User updatedUser = new User();
                        updatedUser.setUsername(updatedName);
                        updatedUser.setEmail(updatedEmail);
                        updatedUser.setPhone(updatedPhone);
                        updatedUser.setBiography(updatedBiography);

                        // Chamar o método update com o callback para lidar com o resultado da atualização

                        new Thread(() -> {
                            updatedUser.update(userId, updatedUser, ProfileView.this, new User.UpdateUserCallback() {
                                @Override
                                public void onSuccess(User updatedUser) {
                                    updatedUser.setIs_autenticated(true);
                                    updatedUser.setAddress_id(userProfile.getAddress_id());
                                    changeUser(updatedUser);
                                }

                                @Override
                                public void onError() {
                                }
                            });
                        }).start();
                    });
                });
            } else {
                // Usuário não autenticado corretamente
                runOnUiThread(() -> showToast("Usuário não definido!"));
            }
        }).start();
    }

    private void showToast(String message) {
        Toast.makeText(ProfileView.this, message, Toast.LENGTH_SHORT).show();
    }

    public void changeUser(User user) {
        new Thread(() -> {
            try {
                BookFlowDatabase bookFlowDatabase = BookFlowDatabase.getDatabase(getApplicationContext());


                bookFlowDatabase.addressDao().update(user.getAddress());
                bookFlowDatabase.userDao().update(user);


                runOnUiThread(() -> {
                    Toast.makeText(ProfileView.this, user.getUsername() + " inserida com sucesso", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(ProfileView.this, HomeActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                });
            } catch (Exception e) {
                e.printStackTrace(); // Trate a exceção de acordo com os requisitos do seu aplicativo
            }
        }).start();
    }
}
