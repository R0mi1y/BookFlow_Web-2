package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityOwnerScreenBinding;
import com.room.bookflow.databinding.ActivityProfileBinding;
import com.room.bookflow.models.User;

public class ProfileView extends AppCompatActivity {

    ActivityProfileBinding binding;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());


        new Thread(() -> {
            User userProfile = User.getAuthenticatedUser(this);
            int userId = userProfile.getId();

            runOnUiThread(() -> {
                binding.editTextName.setText(userProfile.getUsername());
            });
        }).start();

    }
}