package com.room.bookflow.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

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
    String searchCamp;
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityListBooksBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Intent thisIntent = getIntent();
        String initialFilter = thisIntent.getStringExtra("filter");

        Map<String, Button> filterToButtonMap = new HashMap<>();
        filterToButtonMap.put("MY_BOOKS", binding.myBooksButton);
        filterToButtonMap.put("PENDING", binding.pendingButton);
        filterToButtonMap.put("WISHLIST", binding.wishButton);
        filterToButtonMap.put("POPULARS", binding.popularsButton);
//        filterToButtonMap.put("REQUIRED_BY_ME", binding.requestButton);
//        filterToButtonMap.put("REQUIRED", binding.requestByMeButton);

        Button[] selectedButton = {filterToButtonMap.get(initialFilter)};
        if (!initialFilter.equals("SEARCH") && selectedButton[0] != null) {
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


        for (Map.Entry<String, Button> entry : filterToButtonMap.entrySet()) {
            entry.getValue().setOnClickListener(v -> {
                if (selectedButton[0] != null) {
                    selectedButton[0].setBackground(getDrawable(R.drawable.default_border));
                    selectedButton[0].setTextColor(getColor(R.color.white));
                }
                selectedButton[0] = entry.getValue();
                selectedButton[0].setBackgroundColor(getColor(R.color.white));
                selectedButton[0].setTextColor(getColor(R.color.black));

                loadBooksForFilter(entry.getKey());
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

    private void loadBooksForFilter(String filter) {
        Executors.newSingleThreadExecutor().execute(() -> {
            List<Book> items = Book.getAllBooks(this, filter);
            runOnUiThread(() -> {
                binding.items.setAdapter(new CardSideBookAdapter(items, R.layout.book_card_horizontal_adapter, this));
            });
        });
    }
}