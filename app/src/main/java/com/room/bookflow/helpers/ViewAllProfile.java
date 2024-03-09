package com.room.bookflow.helpers;

import static com.room.bookflow.helpers.Utilitary.isNetworkAvailable;
import static com.room.bookflow.helpers.Utilitary.popUp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ImageView;
import com.room.bookflow.R;
import com.room.bookflow.activities.ProfileActivity;
import com.room.bookflow.databinding.ActivityOwnerScreenBinding;
import com.room.bookflow.databinding.ActivityViewProfileBinding;
import com.squareup.picasso.Picasso;
import com.room.bookflow.models.User;

public class ViewAllProfile extends AppCompatActivity {
    ActivityViewProfileBinding binding;
    User authenticatedUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityViewProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        new Thread(() -> {
            authenticatedUser = User.getAuthenticatedUser(this);

            if (authenticatedUser != null && authenticatedUser.getId() > -1) {
                runOnUiThread(() -> {
                    // Compondo o nome completo do usuário
                    String name = authenticatedUser.getFirstName() + " " + authenticatedUser.getLastName();

                    // Atualizando a UI com os dados do usuário
                    binding.username.setText(authenticatedUser.getUsername());
                    binding.biography.setText(authenticatedUser.getBiography());
                    binding.email.setText(authenticatedUser.getEmail());
                    binding.name.setText(name);
                    binding.phone.setText(authenticatedUser.getPhone());

                    if (authenticatedUser.getAddress() != null) {
                        binding.city.setText(authenticatedUser.getAddress().getCity());
                        binding.street.setText(authenticatedUser.getAddress().getStreet());
                        binding.district.setText(authenticatedUser.getAddress().getDistrict());
                        binding.postalCode.setText(authenticatedUser.getAddress().getPostalCode());
                        binding.state.setText(authenticatedUser.getAddress().getState());
                    } else {
                        binding.city.setText("");
                        binding.street.setText("");
                        binding.district.setText("");
                        binding.postalCode.setText("");
                        binding.state.setText("");
                    }

                    ImageView perfil = binding.perfil;

                    Picasso.get()
                            .load(authenticatedUser.getPhoto().contains("http") ? authenticatedUser.getPhoto() : getString(R.string.api_url) + authenticatedUser.getPhoto())
                            .into(perfil);
                });
            } else {
                runOnUiThread(() -> {
                    // Tratar o caso em que o usuário autenticado não é encontrado ou houve um erro
                });
            }
        }).start();

        binding.backBtn.setOnClickListener(v -> finish());

        binding.ProfileEdtView.setOnClickListener(v -> {
            if (isNetworkAvailable(this)) {
                Intent intent = new Intent(ViewAllProfile.this, ProfileActivity.class);
                startActivity(intent);
            } else {
                popUp("Erro", "Voçê precisa de internet para isso!", this);
            }
        });

    }
}
