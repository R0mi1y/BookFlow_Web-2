package com.room.bookflow.activities;

import static com.room.bookflow.components.Utilitary.popUp;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.Toast;

import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityDetailBookBinding;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.User;
import com.squareup.picasso.Picasso;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class DetailBook extends AppCompatActivity {

    Book book;
    ActivityDetailBookBinding binding;
    boolean isFavorited = false;

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
            new Thread(() -> {
                book.getBookById(this);
                setIsFavorited(book.isInWishlist());
                setDetails();

                binding.favoriteBtn.setOnClickListener(view -> {
                    toggleFavorite(bookId);
                });
            }).start();

        } else
            popUp("Erro", "Livro não encontrado na base de dados, tente novamente mais tarde!", this);

    }

    private void setDetails() {

            User authenticated = User.getAuthenticatedUser(this);

            runOnUiThread(() -> {
                binding.title.setText(book.getTitle());
                binding.summary.setText(book.getSummary());
                binding.genre.setText(book.getGenre());

                ImageView iv = findViewById(R.id.cover);
                Picasso.get().load(book.getCover().contains("http") ? book.getCover() : getString(R.string.api_url) + book.getCover()).into(iv);
                if (book.getOwnerId() == authenticated.getId()) {
                    binding.editBtn.setText("Editar");
                    Intent it = new Intent(DetailBook.this, EditBookActivity.class);

                    binding.editBtn.setOnClickListener(v -> {
                        it.putExtra("bookId", String.valueOf(book.getId()));
                        it.putExtra("title", String.valueOf(book.getTitle()));
                        it.putExtra("author", String.valueOf(book.getAuthor()));
                        it.putExtra("genre", String.valueOf(book.getGenre()));
                        it.putExtra("summary", String.valueOf(book.getSummary()));
                        it.putExtra("cover", String.valueOf(book.getCover()));
                        it.putExtra("availability", String.valueOf(book.isAvailability()));
                        it.putExtra("requirementsLoan", String.valueOf(book.getRequirementsLoan()));

                        startActivity(it);
                    });
                } else {
                    binding.editBtn.setText("Informações do dono");

                    binding.editBtn.setOnClickListener(v -> {
                        Intent it = new Intent(DetailBook.this, OwnerScreenActivity.class);
                        it.putExtra("ownerId", String.valueOf(book.getOwnerId()));
                        startActivity(it);
                    });
                }
            });
    }

    public void toggleFavorite(String bookId) {
        String apiUrl = getString(R.string.api_url);
        String url = apiUrl + "/api/book/" + bookId + "/wishlist/";

        Log.d("ToggleFavorite", url);

        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder().url(url).addHeader("Content-Type", "application/json").addHeader("Authorization", "Bearer " + User.getAccessToken(this)).build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e("ToggleFavorite", "Erro ao favoritar livro", e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful()) {
                    Log.e("ToggleFavorite", "Erro ao favoritar livro: " + response.body().string());
                    return;
                }

                runOnUiThread(() -> setIsFavorited(!isFavorited));


            }
        });


    }

    private void setIsFavorited(boolean favorited) {
        isFavorited = favorited;
        if (favorited) {
            binding.favoriteBtn.setImageResource(R.drawable.solarstarfilled); // Recurso de imagem para favorito ativado
        } else {
            binding.favoriteBtn.setImageResource(R.drawable.solarstaroutline); // Recurso de imagem para favorito desativado
        }
    }
}