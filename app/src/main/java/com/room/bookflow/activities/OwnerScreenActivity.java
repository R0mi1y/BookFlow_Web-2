package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ImageView;

import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityOwnerScreenBinding;
import com.room.bookflow.models.User;
import com.squareup.picasso.Picasso;

public class OwnerScreenActivity extends AppCompatActivity {

    ActivityOwnerScreenBinding binding;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOwnerScreenBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Intent localIt = getIntent();
        int ownerId = Integer.valueOf(localIt.getStringExtra("ownerId"));

        User owner = new User();

        new Thread(() -> {
            owner.getUserById(ownerId, this);
            String name = owner.getFirstName() + " " + owner.getLastName();

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
        }).start();

        binding.backBtn.setOnClickListener(v -> finish());
    }
}