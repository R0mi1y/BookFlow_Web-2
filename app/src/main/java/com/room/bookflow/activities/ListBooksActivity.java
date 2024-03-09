package com.room.bookflow.activities;

import static com.room.bookflow.helpers.Utilitary.isNetworkAvailable;
import static com.room.bookflow.helpers.Utilitary.popUp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;
import com.room.bookflow.adapters.CardSideBookAdapter;
import com.room.bookflow.helpers.Utilitary;
import com.room.bookflow.databinding.ActivityListBooksBinding;
import com.room.bookflow.models.Book;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

public class ListBooksActivity extends AppCompatActivity {

    ActivityListBooksBinding binding;
    BookFlowDatabase bookFlowDatabase;
    String searchCamp;
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityListBooksBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        bookFlowDatabase = BookFlowDatabase.getDatabase(this);

        Intent thisIntent = getIntent();
        String initialFilter = thisIntent.getStringExtra("filter");

        Map<String, Button> filterToButtonMap = new HashMap<>();
        filterToButtonMap.put("MY_BOOKS", binding.myBooksButton);
        filterToButtonMap.put("PENDING", binding.pendingButton);
        filterToButtonMap.put("WISHLIST", binding.wishButton);
        filterToButtonMap.put("POPULARS", binding.popularsButton);

        Button[] selectedButton = {filterToButtonMap.get(initialFilter)};
        if (!isNetworkAvailable(this)) {
        } else if (!initialFilter.equals("SEARCH") && selectedButton[0] != null) {
            selectedButton[0].setBackground(getDrawable(R.drawable.default_border_white));
            selectedButton[0].setTextColor(getColor(R.color.black));

            loadBooksForFilter(initialFilter);
        } else if (initialFilter.equals("SEARCH")) {
            if(selectedButton[0] != null) {
                selectedButton[0].setBackground(getDrawable(R.drawable.default_border));
                selectedButton[0].setTextColor(getColor(R.color.white));
            }
            searchCamp = thisIntent.getStringExtra("search");
            loadBooksForFilter(initialFilter, searchCamp);

            binding.searchButton.setOnClickListener(v -> Utilitary.showInputDialog(this, "Digite um título, descrição ou gênero:", searchCamp, text -> {
                searchCamp = text;
                loadBooksForFilter(initialFilter, searchCamp);
            }));
        }

        if (!isNetworkAvailable(this) && initialFilter.equals("MY_BOOKS")) {
            loadBooksForDatabase();
        }

        for (Map.Entry<String, Button> entry : filterToButtonMap.entrySet()) {
            entry.getValue().setOnClickListener(v -> {
                if(isNetworkAvailable(this)){
                    if (selectedButton[0] != null) {
                        selectedButton[0].setBackground(getDrawable(R.drawable.default_border));
                        selectedButton[0].setTextColor(getColor(R.color.white));
                    }
                    selectedButton[0] = entry.getValue();
                    selectedButton[0].setBackgroundColor(getColor(R.color.white));
                    selectedButton[0].setTextColor(getColor(R.color.black));

                    loadBooksForFilter(entry.getKey());
                } else {
                    popUp("Erro", "Você precisa ter conexão com a internet para isso!", this);
                }
            });
        }

        binding.homeBtn1.setOnClickListener(v -> finish());
        binding.homeBtn2.setOnClickListener(v -> finish());
        binding.backBtn.setOnClickListener(v -> finish());
    }

    private void loadBooksForFilter(String filter, String search) {
        Executors.newSingleThreadExecutor().execute(() -> {
            List<Book> items = Book.getAllBooks(this, filter, search);
            runOnUiThread(() -> {
                binding.items.setAdapter(new CardSideBookAdapter(items, R.layout.book_card_horizontal_adapter, this));
            });
        });
    }

    private void loadBooksForDatabase() {
        Executors.newSingleThreadExecutor().execute(() -> {
            List<Book> items = bookFlowDatabase.bookDao().getAllBooks();
            runOnUiThread(() -> {
                binding.items.setAdapter(new CardSideBookAdapter(items, R.layout.book_card_horizontal_adapter, this));
            });
        });
    }

    private void loadBooksForFilter(String filter) {
        Executors.newSingleThreadExecutor().execute(() -> {
            List<Book> items = Book.getAllBooks(this, filter);
            runOnUiThread(() -> {
                binding.items.setAdapter(new CardSideBookAdapter(items, R.layout.book_card_horizontal_adapter, this));
            });
        });
    }
}