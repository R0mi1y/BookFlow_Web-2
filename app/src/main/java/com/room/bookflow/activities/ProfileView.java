package com.room.bookflow.activities;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.bumptech.glide.load.resource.bitmap.RoundedCorners;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.target.SimpleTarget;
import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;

import com.room.bookflow.databinding.ActivityProfileBinding;
import com.room.bookflow.models.Address;
import com.room.bookflow.models.User;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;
import jp.wasabeef.glide.transformations.RoundedCornersTransformation;
import android.graphics.drawable.Drawable;


import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class ProfileView extends AppCompatActivity {

    private ActivityResultLauncher<String> galleryLauncher;
    ActivityProfileBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        //Botão de Voltar
        binding.backBtn.setOnClickListener(v -> {
            Intent intent = new Intent(ProfileView.this, HomeActivity.class);
            startActivity(intent);
        });
        Context context = this;
        // PARTE DA IMAGEM
        galleryLauncher = registerForActivityResult(new ActivityResultContracts.GetContent(),
                uri -> {
                    if (uri != null) {
                        setPhotoFromUri(uri, context);
                    }
        });

        binding.btnEditLoc.setOnClickListener(v -> {
            Intent intent = new Intent(ProfileView.this, RegisterLocationActivity.class);
            startActivity(intent);
        });


        binding.cameraIcon.setOnClickListener(v -> {
            galleryLauncher.launch("image/*");
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

        binding.backBtn.setOnClickListener(v -> finish());

    }

    private void showToast(String message) {
        Toast.makeText(ProfileView.this, message, Toast.LENGTH_SHORT).show();
    }

    public void changeUser(User user) {
        new Thread(() -> {
            try {
                BookFlowDatabase bookFlowDatabase = BookFlowDatabase.getDatabase(getApplicationContext());

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

    public void setPhotoFromUri(Uri uri, Context context) {
        // Aqui você pode realizar as operações necessárias com a URI da imagem
        // Por exemplo, carregar a imagem para a interface do usuário ou enviá-la para o servidor

        // Exemplo: Carregar a imagem usando Glide (certifique-se de adicionar a dependência no build.gradle)
        Glide.with(context)
                .asDrawable()
                .load(uri).transform(new RoundedCorners(10))
                .into(new CustomTarget<Drawable>() {
                    @Override
                    public void onResourceReady(@NonNull Drawable resource, @Nullable Transition<? super Drawable> transition) {
                        // Atualizar a imagem na interface do usuário
                        binding.profileImage.setImageDrawable(resource);

                    }

                    @Override
                    public void onLoadCleared(@Nullable Drawable placeholder) {
                        // Chamado quando a imagem é removida do alvo
                    }
                });
        // Exemplo: Enviar a imagem para o servidor (você precisará implementar isso conforme necessário)
        // uploadImageToServer(uri);
    }
}
