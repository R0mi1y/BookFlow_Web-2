package com.room.bookflow.activities;

import static com.room.bookflow.helpers.Utilitary.isNetworkAvailable;

import androidx.appcompat.app.AppCompatActivity;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.WorkerParameters;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.databinding.ActivitySplashBinding;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.User;
import com.room.bookflow.workers.NotificationWorker;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class SplashActivity extends AppCompatActivity {

    private ActivitySplashBinding binding;
    private BookFlowDatabase bookFlowDatabase;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySplashBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        bookFlowDatabase = BookFlowDatabase.getDatabase(this);

        WorkManager workManager = WorkManager.getInstance(this);

        workManager.cancelUniqueWork("notificationWork");

        PeriodicWorkRequest notificationWork =
                new PeriodicWorkRequest.Builder(
                        NotificationWorker.class,
                        5, TimeUnit.SECONDS)
                        .build();

        workManager.enqueueUniquePeriodicWork(
                        "notificationWork",
                        ExistingPeriodicWorkPolicy.KEEP,
                        notificationWork);

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
    }


}