package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import com.room.bookflow.R;
import com.room.bookflow.adapters.NotificationAdapter;
import com.room.bookflow.databinding.ActivityNotificationsBinding;
import com.room.bookflow.models.Notification;

import java.util.List;

public class NotificationsActivity extends AppCompatActivity {

    ActivityNotificationsBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityNotificationsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        new Thread(() -> {
            List<Notification> items = Notification.getAllNotifications(this);
            runOnUiThread(() -> {
                binding.items.setAdapter(new NotificationAdapter(items, R.layout.notification_adapter, this));
            });
        }).start();

        binding.backBtn3.setOnClickListener(v -> {
            finish();
        });
    }
}