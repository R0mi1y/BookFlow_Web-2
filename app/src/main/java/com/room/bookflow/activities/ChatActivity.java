package com.room.bookflow.activities;

import static com.room.bookflow.helpers.Utilitary.popUp;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.LiveData;

import android.os.Bundle;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;
import com.room.bookflow.adapters.MessageAdapter;
import com.room.bookflow.databinding.ActivityChatBinding;
import com.room.bookflow.models.Chat;
import com.room.bookflow.models.Message;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

public class ChatActivity extends AppCompatActivity {
    ActivityChatBinding binding;
    Chat chat;
    BookFlowDatabase database;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityChatBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        int chatId = getIntent().getIntExtra("chatId", -1);
        if (chatId == -1) {
            popUp("Erro", "Falha ao tentar abrir chat", this);
            return;
        }

        binding.backBtn3.setOnClickListener(v -> finish());
        chat = database.chatDao().getById(chatId);

        // new Thread(() -> {}).start();
        // TODO: mudar o nome do butão e armazenar os users que tem chat, além de por uma var "autenticated" binding.perfilChat.setText();

        AtomicReference<LiveData<List<Message>>> messages = new AtomicReference<>(database.messageDao().getMessageByChatId(chatId));
        binding.items.setAdapter(new MessageAdapter(messages.get(), R.layout.message_adapter, this));

        new Thread(() -> {
            while (true) {
                List<Message> messagesRecived = chat.updateChat(this, chat.getId());
                if (messagesRecived.size() > 0) {
                    messages.set(database.messageDao().getMessageByChatId(chatId));
                }
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}