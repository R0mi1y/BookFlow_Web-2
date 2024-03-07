package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityChatBinding;

public class ChatActivity extends AppCompatActivity {
    ActivityChatBinding binding;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityChatBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());


    }
}