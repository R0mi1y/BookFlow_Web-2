package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.room.bookflow.R;
import com.room.bookflow.adapters.CardSideBookAdapter;
import com.room.bookflow.databinding.ActivityHomeBinding;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.User;

import java.util.Arrays;
import java.util.List;

public class HomeActivity extends AppCompatActivity {
    private ActivityHomeBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        RecyclerView recyclerView0 = findViewById(R.id.book_side_cards_0);
        RecyclerView recyclerView1 = findViewById(R.id.book_side_cards_1);
        RecyclerView recyclerView2 = findViewById(R.id.book_side_cards_2);
        Toast.makeText(this, "BBB", Toast.LENGTH_SHORT).show();

        new Thread(() -> {
            runOnUiThread(() -> Toast.makeText(this, "000", Toast.LENGTH_SHORT).show());
            List<Book> items = new User().getUserById(5, this).getWishlist(this);
            runOnUiThread(() -> {
                recyclerView0.setAdapter(new CardSideBookAdapter(items, getApplicationContext()));
                recyclerView1.setAdapter(new CardSideBookAdapter(items, getApplicationContext()));
                recyclerView2.setAdapter(new CardSideBookAdapter(items, getApplicationContext()));
            });
        }).start();
    }

    private void getUser() {
        new Thread(() -> {
            try {
                User user = new User().getUserById(5, this);
                if (user != null) {

                    RecyclerView recyclerView = findViewById(R.id.book_side_cards_1);
                    List<Book> items = new User().getUserById(5, this).getWishlist(this);
                    runOnUiThread(() -> {
                        recyclerView.setAdapter(new CardSideBookAdapter(items, getApplicationContext()));
                    });

                    StringBuilder books = new StringBuilder();
                    for (Book book : items) {
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
