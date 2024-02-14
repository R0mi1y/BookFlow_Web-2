package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityHomeBinding;
import com.room.bookflow.databinding.ActivityLoginBinding;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.User;

import java.util.Arrays;

public class HomeActivity extends AppCompatActivity {
    private ActivityHomeBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Intent it = getIntent();
        String st = it.getStringExtra("user");
//        binding.textView.setText(st);
//
//        binding.mapsBtn.setOnClickListener(v -> {
//            Intent intent = new Intent(HomeActivity.this, MapsActivity.class);
//            startActivity(intent);
//        });

        getUser();
    }

    private void getUser() {
        new Thread(() -> {
            try {
                User u = new User().getUserById(5, this);
                u.setLastName("admda");
                u.update(u, this);
                User user = new User().getUserById(5, this);

                if (user != null) {
                    runOnUiThread(() -> showToast(user.getLastName()));
                    user.getWishlist(this);

                    StringBuilder books = new StringBuilder();
                    for (Book book : user.getWishlist()) {
                        books.append(book.getTitle()).append("\n\n");
                    }

                    runOnUiThread(() -> showToast(books.toString()));
                } else {
                    runOnUiThread(() -> showToast("Failed to retrieve user"));
                }
            } catch (Exception e) {
                Log.e("Error causing", Arrays.toString(e.getStackTrace()));
            }
        }).start();
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }
}
