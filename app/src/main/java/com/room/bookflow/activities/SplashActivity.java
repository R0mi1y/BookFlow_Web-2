package com.room.bookflow.activities;

import static com.room.bookflow.helpers.Utilitary.isNetworkAvailable;
import static com.room.bookflow.helpers.Utilitary.popUp;

import androidx.appcompat.app.AppCompatActivity;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.databinding.ActivitySplashBinding;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.Chat;
import com.room.bookflow.models.User;
import com.room.bookflow.workers.NotificationWorker;


public class SplashActivity extends AppCompatActivity {

    private ActivitySplashBinding binding;
    private BookFlowDatabase bookFlowDatabase;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySplashBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        bookFlowDatabase = BookFlowDatabase.getDatabase(this);

        Intent localIntrnt = getIntent();
        String from = localIntrnt.getStringExtra("from");

        if (from != null) {
            if (from.startsWith("bookPage::")) {
                Intent fromIntent = new Intent(SplashActivity.this, DetailBook.class);
                fromIntent.putExtra("bookId", from.replace("bookPage::", ""));
                startActivity(fromIntent);
                finish();
            } else if (from.startsWith("chatPage::")) {
                Intent fromIntent = new Intent(SplashActivity.this, ChatActivity.class);
                int reciever_id = Integer.parseInt(from.replace("chatPage::", ""));

                new Thread(() -> {
                    Chat chat = bookFlowDatabase.chatDao().getByReciver(reciever_id);

                    if (chat != null) {
                        fromIntent.putExtra("chatId", chat.getId());
                        startActivity(fromIntent);
                        finish();
                    } else {
                        chat = new Chat(reciever_id);
                        long chat_id = bookFlowDatabase.chatDao().insert(chat);
                        chat.setId((int)chat_id);
                        if (chat.startChat(this, reciever_id)) {
                            chat.recoveryMessages(chat, this);
                            fromIntent.putExtra("chatId", (int) chat_id);
                            runOnUiThread(() -> {
                                startActivity(fromIntent);
                                finish();
                            });
                        } else {
                            popUp("Erro", "Falha ao tentar abrir chat!", this);
                        }
                    }

                }).start();
            }
        } else {
            new Thread(() -> {
                OneTimeWorkRequest notificationWork = new OneTimeWorkRequest.Builder(NotificationWorker.class)
                        .build();

                WorkManager.getInstance(this).enqueue(notificationWork);

                if (isNetworkAvailable(this)) {
                    Chat.recoveryChats(this);
                }

                runOnUiThread(() -> {
                    new Handler().postDelayed(() -> {
                        new Thread(() -> {
                            boolean is_authenticated = false;
                            if (User.getAuthenticatedUser(this) != null) {
                                if (!isNetworkAvailable(this)) {
                                    is_authenticated = true;
                                } else {
                                    String token = User.getAccessToken(this);
                                    if (token != null) {
                                        is_authenticated = true;
                                    }
                                }
                            }

                            if (is_authenticated) {
                                Book.actualizeBooksDatabase(this);

                                Intent intent = new Intent(SplashActivity.this, HomeActivity.class);
                                runOnUiThread(() -> {
                                    startActivity(intent);
                                    finish();
                                });
                            } else {
                                Intent intent = new Intent(SplashActivity.this, LoginActivity.class);
                                runOnUiThread(() -> {
                                    startActivity(intent);
                                    finish();
                                });
                            }
                        }).start();
                    }, 1000);
                });
            }).start();
        }
    }


}