package com.room.bookflow.activities;

import static com.room.bookflow.helpers.Utilitary.popUp;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.Observer;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;
import com.room.bookflow.adapters.MessageAdapter;
import com.room.bookflow.databinding.ActivityChatBinding;
import com.room.bookflow.models.Chat;
import com.room.bookflow.models.Message;
import com.room.bookflow.models.User;

import java.util.List;
import java.util.Objects;

public class ChatActivity extends AppCompatActivity {
    ActivityChatBinding binding;
    Chat chat;
    BookFlowDatabase database = BookFlowDatabase.getDatabase(this);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityChatBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.backBtn3.setOnClickListener(v -> finish());

        Intent myIntent = getIntent();

        int chatId = myIntent.getIntExtra("chatId", -1);
        if (chatId == -1) {
            popUp("Erro", "Falha ao tentar abrir chat!", this);
            return;
        }

        new Thread(() -> {
            chat = database.chatDao().getById(chatId);
            chat.updateChat(this, chatId);
            User reciever = database.userDao().getById(chat.getReceiver_id());
            runOnUiThread(() -> {
                binding.perfilChat.setText(reciever.getUsername());
            });

            binding.sendMessageBtn.setOnClickListener(v -> {
                new Thread(() -> {
                    String message = binding.messageInput.getText().toString();
                    if (message != null && !message.replace(" ", "").equals("")) {
                        runOnUiThread(() -> {
                            binding.messageInput.setText("");
                        });
                        reciever.sendMessage(message, chat.getReceiver_id(), this);
                    }
                }).start();
            });

            runOnUiThread(() -> {
                binding.perfilChat.setOnClickListener(v -> {
                    Intent intent = new Intent(this, OwnerScreenActivity.class);
                    intent.putExtra("ownerId", String.valueOf(chat.getReceiver_id()));
                    startActivity(intent);
                });
            });

            List<Message> messages1 = database.messageDao().getMessageByChatId(chatId);

            runOnUiThread(() -> {
                binding.items.setAdapter(new MessageAdapter(messages1, R.layout.message_adapter, this));
                int cont = 0;
                Log.i("SEARCHING MESSAGE", "Searching for messages...");

                database.messageDao().getLiveDataMessageByChatId(chatId).observe(this, messages -> runOnUiThread(() -> {
                    binding.items.setAdapter(new MessageAdapter(messages, R.layout.message_adapter, this));
                    binding.items.scrollToPosition(messages.size() - 1);
                }));
            });
        }).start();
    }
}