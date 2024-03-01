package com.room.bookflow.activities;

import static com.room.bookflow.components.Utilitary.popUp;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.os.Bundle;

import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityDetailBookBinding;
import com.room.bookflow.models.Book;
import com.squareup.picasso.Picasso;

public class DetailBook extends AppCompatActivity {

    Book book;
    ActivityDetailBookBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityDetailBookBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.backBtn.setOnClickListener(v -> {
            finish();
        });

        book = new Book();
        String bookId = getIntent().getStringExtra("bookId");

        if (bookId != null) {
            book.setId(Integer.parseInt(bookId));
            setDetails();
        }
        else popUp("Erro", "Livro não encontrado na base de dados, tente novamente mais tarde!", this);
    }

    private void setDetails(){
        new Thread(() -> {
            book.getBookById(this);

            runOnUiThread(() -> {
                binding.title.setText(book.getTitle());
                binding.summary.setText(book.getSummary());
                binding.genre.setText(book.getGenre());

                Picasso.get()
                        .load(book.getCover().contains("http") ? book.getCover() : getString(R.string.api_url) + book.getCover())
                        .into(binding.cover);
            });
        }).start();
    }
}