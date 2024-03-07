package com.room.bookflow.activities;

import static com.room.bookflow.helpers.Utilitary.popUp;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.recyclerview.widget.RecyclerView;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import com.room.bookflow.R;
import com.room.bookflow.adapters.CardSideBookAdapter;
import com.room.bookflow.helpers.Utilitary;
import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.databinding.ActivityHomeBinding;
import com.room.bookflow.models.Book;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import com.google.android.material.navigation.NavigationView;


public class HomeActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {
    private ActivityHomeBinding binding;
    private DrawerLayout drawerLayout;
    private Toolbar toolbar;
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

        Intent listBookIntent = new Intent(HomeActivity.this, ListBooksActivity.class);
        binding.bioSession.setOnClickListener(v -> {
            listBookIntent.putExtra("filter", "SEARCH");
            listBookIntent.putExtra("search", "bio");
            startActivity(listBookIntent);
        });
        binding.adventureSession.setOnClickListener(v -> {
            listBookIntent.putExtra("filter", "SEARCH");
            listBookIntent.putExtra("search", "aventura");
            startActivity(listBookIntent);
        });
        binding.crimeSession.setOnClickListener(v -> {
            listBookIntent.putExtra("filter", "SEARCH");
            listBookIntent.putExtra("search", "crime");
            startActivity(listBookIntent);
        });
        binding.fictionSession.setOnClickListener(v -> {
            listBookIntent.putExtra("filter", "SEARCH");
            listBookIntent.putExtra("search", "ficção");
            startActivity(listBookIntent);
        });
        binding.infantilSession.setOnClickListener(v -> {
            listBookIntent.putExtra("filter", "SEARCH");
            listBookIntent.putExtra("search", "infantil");
            startActivity(listBookIntent);
        });

        binding.listBooksBtn.setOnClickListener(v -> {
            listBookIntent.putExtra("filter", "MY_BOOKS");
            startActivity(listBookIntent);
        });
        binding.mapsBtn.setOnClickListener(v -> {
            Intent MapsActivity = new Intent(HomeActivity.this, MapsActivity.class);
            startActivity(MapsActivity);
        });

        Intent thisIt = getIntent();
        String message = thisIt.getStringExtra("message");
        if (message != null){
            String messageTitle = thisIt.getStringExtra("messageTitle");
            popUp(messageTitle, message, this);
        }

        binding.searchButton.setOnClickListener(v -> Utilitary.showInputDialog(this, "Digite um título, descrição ou gênero:", "", text -> {
            listBookIntent.putExtra("filter", "SEARCH");
            listBookIntent.putExtra("search", text);
            startActivity(listBookIntent);
        }));

        // MENU LATERAL

        toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open_nav, R.string.close_nav);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        int itemSelecionado = item.getItemId();

        if(itemSelecionado == R.id.edit_profile){
            Intent intent = new Intent(HomeActivity.this, ProfileView.class);
            startActivity(intent);
        }else if(itemSelecionado == R.id.notifications){
            Intent intent = new Intent(HomeActivity.this, NotificationsActivity.class);
            startActivity(intent);
        }else if(itemSelecionado == R.id.loan){
            Intent intent = new Intent(HomeActivity.this, ListBooksActivity.class);
            intent.putExtra("filter", "MY_BOOKS");
            startActivity(intent);
            startActivity(intent);
        }else if(itemSelecionado == R.id.nav_logout){
            Intent intent = new Intent(this, LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);

            new Thread(() -> {
                BookFlowDatabase database = BookFlowDatabase.getDatabase(getApplicationContext());
                database.addressDao().delAll();
                database.userDao().delAll();
            }).start();

            startActivity(intent);
            finish();
        }

        // Iapós o usuário selecionar um item no menu lateral, o código fecha o menu, proporcionando uma experiência de navegação mais fluida.
        drawerLayout.closeDrawer(GravityCompat.START);
        return true;
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
                if (items != null) {
                    new Handler(Looper.getMainLooper()).post(() -> {
                        recyclerViews.get(finalI).setAdapter(new CardSideBookAdapter(items, R.layout.book_card_side_adapter, this));
                    });
                }
            });
        }
        executorService.shutdown();
    }


}
