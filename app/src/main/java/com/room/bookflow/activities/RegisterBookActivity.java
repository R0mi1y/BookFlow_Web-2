package com.room.bookflow.activities;

import static com.room.bookflow.components.Utilitary.popUp;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;

import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityRegisterBookBinding;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.User;

public class RegisterBookActivity extends AppCompatActivity {
    ActivityRegisterBookBinding binding;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRegisterBookBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        View.OnClickListener backButtonClickListener = v -> {
            finish();
        };

        binding.backBtn1.setOnClickListener(backButtonClickListener);
        binding.backBtn2.setOnClickListener(backButtonClickListener);
        binding.backBtn3.setOnClickListener(backButtonClickListener);

        binding.registerBook.setOnClickListener(v -> {
            new Thread(() -> {
                Book book = new Book("", binding.title.getText().toString(), binding.author.getText().toString(), binding.genre.getText().toString(), binding.summary.getText().toString(), binding.requirements.getText().toString(), false, User.getAuthenticatedUser().getId());

                book = book.save(this);

                if (book.getId() > -1) {
                    runOnUiThread(() -> {
                        Intent resultIntent = new Intent();
                        resultIntent.putExtra("message", "O livro foi cadastrado com sucesso!");
                        resultIntent.putExtra("title", "Sucesso");
                        setResult(Activity.RESULT_OK, resultIntent);
                        finish();
                    });
                } else {
                    runOnUiThread(() -> {
                        popUp("Erro!", "Tente novamente mais tarde", RegisterBookActivity.this);
                    });
                }
            }).start();

        });

    }
}