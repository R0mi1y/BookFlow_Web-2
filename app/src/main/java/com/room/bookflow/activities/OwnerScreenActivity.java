package com.room.bookflow.activities;

import static com.room.bookflow.helpers.Utilitary.popUp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;

import com.room.bookflow.R;
import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.databinding.ActivityOwnerScreenBinding;
import com.room.bookflow.models.Chat;
import com.room.bookflow.models.User;
import com.squareup.picasso.Picasso;

public class OwnerScreenActivity extends AppCompatActivity {

    ActivityOwnerScreenBinding binding;
    User owner;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOwnerScreenBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Intent localIt = getIntent();
        int ownerId = Integer.parseInt(localIt.getStringExtra("ownerId"));

        owner = new User();

        new Thread(() -> {
            Log.e("wjkwnf", "weolfgjner");
            owner.getUserById(ownerId, this);
            if (owner.getId() > -1){
                runOnUiThread(() -> {
                    String name = owner.getFirstName() + " " + owner.getLastName();

                    binding.username.setText(owner.getUsername());
                    binding.biography.setText(owner.getBiography());
                    binding.email.setText(owner.getEmail());
                    binding.name.setText(name);
                    binding.phone.setText(owner.getPhone());
                    binding.city.setText(owner.getAddress().getCity());
                    binding.street.setText(owner.getAddress().getStreet());
                    binding.district.setText(owner.getAddress().getDistrict());
                    binding.postalCode.setText(owner.getAddress().getPostalCode());
                    binding.state.setText(owner.getAddress().getState());
                    ImageView perfil = binding.perfil;

                    Picasso.get()
                            .load(owner.getPhoto().contains("http") ? owner.getPhoto() : getString(R.string.api_url) + owner.getPhoto())
                            .into(perfil);
                });
            }
        }).start();

        binding.startChat.setOnClickListener(v -> {
            startChat();
        });

        binding.backBtn.setOnClickListener(v -> finish());
    }

    private void startChat() {
        new Thread(() -> {
            BookFlowDatabase database = BookFlowDatabase.getDatabase(this);
            Intent intent = new Intent(OwnerScreenActivity.this, ChatActivity.class);
            try {
                Chat chat = database.chatDao().getByReciver(owner.getId());
                if (chat != null) {
                    intent.putExtra("chatId", chat.getId());
                    runOnUiThread(() -> startActivity(intent));
                } else {
                    chat = new Chat(owner.getId());
                    if (chat.startChat(this, owner.getId())) {
                        long id = database.chatDao().insert(chat);
                        intent.putExtra("chatId", id);
                        runOnUiThread(() -> startActivity(intent));
                    } else {
                        popUp("Erro", "Falha ao tentar abrir chat!", this);
                    }
                }
            } catch (Exception e) {
                runOnUiThread(() -> {
                    popUp("Erro", "Erro tentando abrir o chat!", this);
                });
            }
        }).start();
    }
}