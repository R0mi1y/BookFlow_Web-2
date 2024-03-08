package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityRegisterLocationBinding;
import com.room.bookflow.models.Address;
import com.room.bookflow.models.User;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class RegisterLocationActivity extends AppCompatActivity {

    private ActivityRegisterLocationBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityRegisterLocationBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        new Thread(() -> {
            BookFlowDatabase bookFlowDatabase = BookFlowDatabase.getDatabase(getApplicationContext());
            User userProfile = User.getAuthenticatedUser(this);

            if (userProfile != null) {
                Log.d("UserProfile", "ID: " + userProfile.getId());
                Log.d("UserProfile", "Username: " + userProfile.getUsername());
                Log.d("UserProfile", "Email: " + userProfile.getEmail());

                int userId = userProfile.getId();
                Log.d("UserProfile", "ID: " + userId);

                ExecutorService executorService = Executors.newSingleThreadExecutor();
                executorService.execute(() -> {
                    // Buscar o endereço do usuário
                    Address address = bookFlowDatabase.addressDao().getById(userProfile.getAddress_id());

                    Log.d("UserProfile", "ENDEREÇOOOOOOOOOOOOOOOOOO: " + address);
                    runOnUiThread(() -> {
                        if (address != null) {
                            // Se o endereço existir, preencher os campos na interface do usuário
                            binding.postalCode.setText(address.getPostalCode());
                            binding.state.setText(address.getState());
                            binding.city.setText(address.getCity());
                            binding.idstrict.setText(address.getDistrict());
                            binding.street.setText(address.getStreet());
                            binding.houseNumber.setText(address.getHouseNumber());

                            binding.btnUpdateLocate.setOnClickListener(v -> {
                                // Obter os dados dos campos de edição
                                String updatedPostalCode = binding.postalCode.getText().toString();
                                String updatedState = binding.state.getText().toString();
                                String updatedCity = binding.city.getText().toString();
                                String updatedDistrict = binding.idstrict.getText().toString();
                                String updatedStreet = binding.street.getText().toString();
                                String updatedHouseNumber = binding.houseNumber.getText().toString();

                                // Criar um objeto User com as alterações
                                User updatedUser = new User();

                                if (updatedUser.getAddress() == null) {
                                    updatedUser.setAddress(new Address());
                                }

                                updatedUser.getAddress().setPostalCode(updatedPostalCode);
                                updatedUser.getAddress().setState(updatedState);
                                updatedUser.getAddress().setCity(updatedCity);
                                updatedUser.getAddress().setDistrict(updatedDistrict);
                                updatedUser.getAddress().setStreet(updatedStreet);
                                updatedUser.getAddress().setHouseNumber(updatedHouseNumber);

                                // Chamar o método update com o callback para lidar com o resultado da atualização
                                ExecutorService updateExecutorService = Executors.newSingleThreadExecutor();
                                updateExecutorService.execute(() -> {
                                    updatedUser.updateLocate(userId, updatedUser, RegisterLocationActivity.this, new User.UpdateUserLocateCallback() {
                                        @Override
                                        public void onSuccess(User updatedUser) {
                                            updatedUser.setIs_autenticated(true);
                                            updatedUser.setAddress_id(userProfile.getAddress_id());
                                            changeUser(updatedUser);
                                        }

                                        @Override
                                        public void onError() {
                                            // Lidar com erro, se necessário
                                        }
                                    });
                                });
                            });
                        }
                    });
                });
            } else {
                runOnUiThread(() -> showToast("Erro ao obter perfil do usuário!"));
            }
        }).start();
    }

    private void showToast(String message) {
        Toast.makeText(RegisterLocationActivity.this, message, Toast.LENGTH_SHORT).show();
    }

    public void changeUser(User user) {
        new Thread(() -> {
            try {
                BookFlowDatabase bookFlowDatabase = BookFlowDatabase.getDatabase(getApplicationContext());

                user.getAddress().setId((int) user.getAddress_id());
                bookFlowDatabase.addressDao().update(user.getAddress());

                runOnUiThread(() -> {
                    Toast.makeText(RegisterLocationActivity.this, user.getUsername() + " inserida com sucesso", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(RegisterLocationActivity.this, ProfileView.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                });
            } catch (Exception e) {
                e.printStackTrace(); // Trate a exceção de acordo com os requisitos do seu aplicativo
            }
        }).start();
    }
}
