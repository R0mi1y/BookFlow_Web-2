package com.room.bookflow.activities;

import static com.room.bookflow.components.Utilitary.hideLoadingScreen;
import static com.room.bookflow.components.Utilitary.popUp;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.RecyclerView;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.room.bookflow.R;
import com.room.bookflow.adapters.CardSideBookAdapter;
import com.room.bookflow.databinding.ActivityHomeBinding;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.User;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class HomeActivity extends AppCompatActivity {
    private ActivityHomeBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        binding = ActivityHomeBinding.inflate(getLayoutInflater());
        super.onCreate(savedInstanceState);
        setContentView(binding.getRoot());

        setBooks();

        binding.registerBookBtn.setOnClickListener(v -> {
            Intent intent = new Intent(HomeActivity.this, RegisterBookActivity.class);
            registerBook.launch(intent);
        });

        binding.listBooksBtn.setOnClickListener(v -> {
            Intent intent = new Intent(HomeActivity.this, ListBooksActivity.class);
            intent.putExtra("filter", "MY_BOOKS");
            startActivity(intent);
        });

        binding.searchButton.setOnClickListener(v -> showInputDialog(this));
    }

    ActivityResultLauncher<Intent> registerBook = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {

                if (result.getResultCode() == Activity.RESULT_OK) {
                    Intent intent = result.getData();
                    if (intent != null) {
                        String title = intent.getStringExtra("title");
                        String message = intent.getStringExtra("message");

                        runOnUiThread(() -> {
                            popUp(title, message, HomeActivity.this);
                        });
                    }
                }
            }
    );

    public void showInputDialog(Context context) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.dialog_input, null);

        final EditText editText = view.findViewById(R.id.editText);

        builder.setView(view)
                .setTitle("Digite um titulo, descrição ou gênero:")
                .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss())
                .setPositiveButton("OK", (dialog, which) -> {
                    String userInput = editText.getText().toString();
                    Intent intent = new Intent(this, ListBooksActivity.class);
                    intent.putExtra("filter", "SEARCH");
                    intent.putExtra("search", userInput);
                    startActivity(intent);
                });

        AlertDialog alertDialog = builder.create();
        Objects.requireNonNull(alertDialog.getWindow()).setBackgroundDrawableResource(R.drawable.dialog_border);
        alertDialog.show();
    }

    private void setBooks() {
        List<RecyclerView> recyclerViews = new ArrayList<>();
        recyclerViews.add(binding.bookSideCards0);
        recyclerViews.add(binding.bookSideCards1);
        recyclerViews.add(binding.bookSideCards2);

        String[] filters = new String[]{"ALL", "PENDING", "WISHLIST"};

        ExecutorService executorService = Executors.newFixedThreadPool(recyclerViews.size());

        for (int i = 0; i < recyclerViews.size(); i++) {
            int finalI = i;
            executorService.execute(() -> {
                List<Book> items = Book.getAllBooks(this, filters[finalI]);
                new Handler(Looper.getMainLooper()).post(() -> {
                    recyclerViews.get(finalI).setAdapter(new CardSideBookAdapter(items, R.layout.book_card_side_adapter, getApplicationContext()));
                });
            });
        }
        executorService.shutdown();
    }
}
