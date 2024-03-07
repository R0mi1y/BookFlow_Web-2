package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.Toast;

import com.room.bookflow.databinding.ActivityProfileBinding;
import com.room.bookflow.models.User;

public class ProfileView extends AppCompatActivity {

    ActivityProfileBinding binding;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.backBtn.setOnClickListener(v -> {
            finish();
        });

        new Thread(() -> {
            User userProfile = User.getAuthenticatedUser(this);
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

                    // Chamar o método update para salvar as alterações
                    updatedUser.update(userId, updatedUser, ProfileView.this);

                    Toast.makeText(this, "Alterações salvas com sucesso!", Toast.LENGTH_SHORT).show();
                });
            });
        }).start();


    }
}