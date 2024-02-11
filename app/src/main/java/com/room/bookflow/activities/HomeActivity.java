package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityHomeBinding;
import com.room.bookflow.databinding.ActivityLoginBinding;

public class HomeActivity extends AppCompatActivity {
    private ActivityHomeBinding binding;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Intent it = getIntent();

        String st = it.getStringExtra("user");
        binding.textView.setText(st);
    }
}