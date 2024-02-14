package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.widget.Toast;

import com.room.bookflow.R;
import com.room.bookflow.adapters.CardSideBookAdapter;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.User;

import java.util.List;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        RecyclerView recyclerView = findViewById(R.id.book_side_cards_1);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        Toast.makeText(this, "BBB", Toast.LENGTH_SHORT).show();

        new Thread(() -> {
            runOnUiThread(() -> Toast.makeText(this, "000", Toast.LENGTH_SHORT).show());
            List<Book> items = new User().getUserById(5, this).getWishlist(this);
            runOnUiThread(() -> {
                recyclerView.setAdapter(new CardSideBookAdapter(items, getApplicationContext()));
            });
        }).start();
    }
}