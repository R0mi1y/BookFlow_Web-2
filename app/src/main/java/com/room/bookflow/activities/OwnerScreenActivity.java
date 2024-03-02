package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.Toast;

import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityOwnerScreenBinding;
import com.room.bookflow.models.User;
import com.squareup.picasso.Picasso;

import java.util.Objects;

public class OwnerScreenActivity extends AppCompatActivity {

    ActivityOwnerScreenBinding binding;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOwnerScreenBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Intent localIt = getIntent();
        int ownerId = Integer.parseInt(localIt.getStringExtra("ownerId"));

        User owner = new User();

        new Thread(() -> {
            Log.e("wjkwnf", "weolfgjner");
            owner.getUserById(ownerId, this);
            if (owner.getId() > -1){
                runOnUiThread(() -> {
                    String name = owner.getFirstName() + " " + owner.getLastName();

                    binding.username.setText(owner.getUsername());
                    binding.biography.setText(owner.getBiography());
                    binding.email.setText(owner.getEmail());
                    binding.name.setText(name);
                    binding.phone.setText(owner.getPhone());
                    binding.city.setText(owner.getAddress().getCity());
                    binding.street.setText(owner.getAddress().getStreet());
                    binding.district.setText(owner.getAddress().getDistrict());
                    binding.postalCode.setText(owner.getAddress().getPostalCode());
                    binding.state.setText(owner.getAddress().getState());
                    ImageView perfil = binding.perfil;

                    Picasso.get()
                            .load(owner.getPhoto().contains("http") ? owner.getPhoto() : getString(R.string.api_url) + owner.getPhoto())
                            .into(perfil);
                });
            }
        }).start();

        binding.backBtn.setOnClickListener(v -> finish());
    }
}