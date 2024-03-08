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
    BookFlowDatabase database = BookFlowDatabase.getDatabase(this);

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

        new Thread(() -> {
            // binding.perfilChat.setText(database.userDao());
            chat = database.chatDao().getById(chatId);

            AtomicReference<LiveData<List<Message>>> messages = new AtomicReference<>(database.messageDao().getMessageByChatId(chatId));
            runOnUiThread(() -> binding.items.setAdapter(new MessageAdapter(messages.get(), R.layout.message_adapter, this)));

            while (true) {
                List<Message> messagesRecived = chat.updateChat(this, chat.getId());
                if (messagesRecived.size() > 0) {
                    messages.set(database.messageDao().getMessageByChatId(chatId));
                }
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}