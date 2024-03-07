package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityProfileBinding;
import com.room.bookflow.databinding.ActivityRegisterLocationBinding;
import com.room.bookflow.models.Address;
import com.room.bookflow.models.User;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class RegisterLocationActivity extends AppCompatActivity {

    ActivityRegisterLocationBinding binding;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityRegisterLocationBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

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

                        Executor executor = Executors.newSingleThreadExecutor();
                        executor.execute(() -> {
                            updatedUser.updateLocate(userId, updatedUser, RegisterLocationActivity.this, new User.UpdateUserLocateCallback() {
                                @Override
                                public void onSuccess(User updatedUser) {
                                    changeUser(updatedUser);
                                }

                                @Override
                                public void onError() {
                                }
                            });
                        });
                    });
                });
            } else {
                // Usuário não autenticado corretamente
                runOnUiThread(() -> showToast("Usuário não definido!"));
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

                bookFlowDatabase.userDao().delAll();
                bookFlowDatabase.addressDao().delAll();

                long userId = bookFlowDatabase.userDao().insert(user);
                long addressId = bookFlowDatabase.addressDao().insert(user.getAddress());



                runOnUiThread(() -> {
                    Toast.makeText(RegisterLocationActivity.this, user.getUsername() + " inserida com sucesso", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(RegisterLocationActivity.this, ProfileView.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                    intent.putExtra("user", user.toString());
                    startActivity(intent);
                });
            } catch (Exception e) {
                e.printStackTrace(); // Trate a exceção de acordo com os requisitos do seu aplicativo
            }
        }).start();
    }
}