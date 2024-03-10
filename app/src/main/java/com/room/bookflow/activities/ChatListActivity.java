package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;
import com.room.bookflow.adapters.ChatAdapter;
import com.room.bookflow.databinding.ActivityChatListBinding;
import com.room.bookflow.models.Chat;

import java.util.List;

public class ChatListActivity extends AppCompatActivity {
    ActivityChatListBinding binding;
    BookFlowDatabase db;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityChatListBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.backBtn3.setOnClickListener(v -> finish());

        db = BookFlowDatabase.getDatabase(this);
        new Thread(() -> {
            List<Chat> chatList = db.chatDao().getAllChat();
            runOnUiThread(() -> binding.items.setAdapter(new ChatAdapter(chatList, R.layout.chat_list_adapter, this)));
        }).start();

    }
}