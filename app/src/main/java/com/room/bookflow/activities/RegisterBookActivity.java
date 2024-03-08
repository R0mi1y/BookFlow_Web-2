package com.room.bookflow.activities;

import static com.room.bookflow.helpers.Utilitary.convertBitmapToFile;
import static com.room.bookflow.helpers.Utilitary.popUp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityRegisterBookBinding;
import com.room.bookflow.helpers.BookSuggestion;
import com.room.bookflow.helpers.SslRemoveCertified;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.User;
import com.squareup.picasso.Callback;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import pub.devrel.easypermissions.EasyPermissions;

public class RegisterBookActivity extends AppCompatActivity {
    private static final int PICK_IMAGE_REQUEST = 1;
    private static final int REQUEST_IMAGE_CAPTURE = 2;
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 123;
    private Uri imageUri;
    private Bitmap imageBitMap;
    private Boolean hasImage = false;
    ActivityRegisterBookBinding binding;

    private File convertBitmapToFile(Context context, Bitmap bitmap, String fileName) {
        // Crie um arquivo no diretório cache da aplicação
        File file = new File(context.getCacheDir(), fileName);
        try {
            FileOutputStream fos = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return file;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRegisterBookBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());


        binding.title.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (s.toString().trim().length() > 2) { // Verifica se o texto tem mais de 3 caracteres para começar a busca
                    fetchBookSuggestions(s.toString().trim(), RegisterBookActivity.this, binding.title);
                }
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        binding.title.setOnItemClickListener((parent, view, position, id) -> {
            BookSuggestion selectedBook = (BookSuggestion) parent.getItemAtPosition(position);
            binding.author.setText(selectedBook.getAuthors());
            binding.genre.setText(selectedBook.getCategories());
            binding.summary.setText(selectedBook.getDescription());

            if (!TextUtils.isEmpty(selectedBook.getImageUrl())) {
                Picasso.get().load(selectedBook.getImageUrl()).into(binding.coverImage, new Callback() {
                    @Override
                    public void onSuccess() {
                        binding.coverImage.invalidate();
                        BitmapDrawable drawable = (BitmapDrawable) binding.coverImage.getDrawable();
                        imageBitMap = drawable.getBitmap();
                        hasImage = true;
                    }

                    @Override
                    public void onError(Exception e) {
                        hasImage = false;
                    }
                });
            }
        });

        View.OnClickListener backButtonClickListener = v -> {
            finish();
        };

        binding.backBtn1.setOnClickListener(backButtonClickListener);
        binding.backBtn2.setOnClickListener(backButtonClickListener);
        binding.backBtn3.setOnClickListener(backButtonClickListener);

        binding.registerBook.setOnClickListener(v -> {
            if (!(!binding.title.getText().toString().replaceAll("\\s+", " ").equals("") &&
                    !binding.author.getText().toString().replaceAll("\\s+", " ").equals("") &&
                    !binding.genre.getText().toString().replaceAll("\\s+", " ").equals("") &&
                    !binding.summary.getText().toString().replaceAll("\\s+", " ").equals("") &&
                    !binding.requirements.getText().toString().replaceAll("\\s+", " ").equals(""))) {
                popUp("Erro", "Preencha todos os campos antes de cadastrar o livro!", this);
                return;
            }

            new Thread(() -> {
                Book book = new Book("", binding.title.getText().toString(), binding.author.getText().toString(), binding.genre.getText().toString(), binding.summary.getText().toString(), binding.requirements.getText().toString(), true, User.getAuthenticatedUser(getApplicationContext()).getId());

                // Adicionando verificação se imageBitmap é nulo
                if (hasImage && imageBitMap != null) {
                    try {
                        File imageFile = convertBitmapToFile(this, imageBitMap, "cover.png");
                        book = book.registerBook(imageFile, this);
                    } catch (Exception e) {
                        e.printStackTrace();
                        runOnUiThread(() -> popUp("Erro", "Falha ao processar a imagem!", RegisterBookActivity.this));
                        return;
                    }
                } else {
                    book = book.registerBook(this);
                }

                try {
                    if (book.getId() > -1) {
                        runOnUiThread(() -> {
                            Intent resultIntent = new Intent();
                            resultIntent.putExtra("message", "O livro foi cadastrado com sucesso!");
                            resultIntent.putExtra("title", "Sucesso");
                            setResult(Activity.RESULT_OK, resultIntent);
                            finish();
                        });
                    } else {
                        runOnUiThread(() -> popUp("Erro!", "Tente novamente mais tarde", RegisterBookActivity.this));
                    }
                } catch (NullPointerException e) {
                    runOnUiThread(() -> popUp("Erro!", "Tente novamente mais tarde", RegisterBookActivity.this));
                }
            }).start();
        });

        binding.insertCover.setOnClickListener(v -> showImageSourceDialog());
    }

    public void fetchBookSuggestions(String query, Context context, AutoCompleteTextView autoCompleteTextView) {
        String baseUrl = "https://www.googleapis.com/books/v1/volumes";
        String url = baseUrl + "?q=" + Uri.encode(query);

        RequestQueue requestQueue = Volley.newRequestQueue(context, new SslRemoveCertified());

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
                    List<BookSuggestion> suggestions = new ArrayList<>();
                    try {
                        JSONArray items = response.getJSONArray("items");
                        for (int i = 0; i < items.length(); i++) {
                            JSONObject book = items.getJSONObject(i).getJSONObject("volumeInfo");
                            String title = book.optString("title");

                            // Extração e junção dos autores
                            String authors = "";
                            if (book.has("authors")) {
                                JSONArray authorsJsonArray = book.getJSONArray("authors");
                                List<String> authorsList = new ArrayList<>();
                                for (int j = 0; j < authorsJsonArray.length(); j++) {
                                    authorsList.add(authorsJsonArray.getString(j));
                                }
                                authors = TextUtils.join(", ", authorsList);
                            }

                            // Extração e junção das categorias
                            String categories = "";
                            if (book.has("categories")) {
                                JSONArray categoriesJsonArray = book.getJSONArray("categories");
                                List<String> categoriesList = new ArrayList<>();
                                for (int j = 0; j < categoriesJsonArray.length(); j++) {
                                    categoriesList.add(categoriesJsonArray.getString(j));
                                }
                                categories = TextUtils.join(", ", categoriesList);
                            }

                            String description = book.optString("description");
                            String imageUrl = book.has("imageLinks") ? book.getJSONObject("imageLinks").optString("thumbnail") : "";

                            suggestions.add(new BookSuggestion(title, authors, categories, description, imageUrl));
                        }

                        ArrayAdapter<BookSuggestion> adapter = new ArrayAdapter<>(context, android.R.layout.simple_dropdown_item_1line, suggestions);
                        autoCompleteTextView.setAdapter(adapter);
                        adapter.notifyDataSetChanged();
                    } catch (JSONException e) {
                        popUp("Erro ao processar sugestões de livros!", e.getMessage(), context);
                        e.printStackTrace();
                    }
                },
                error -> {
                    popUp("Erro ao buscar sugestões de livros!", error.toString(), context);
                    error.printStackTrace();
                });

        requestQueue.add(request);
    }

    private void showImageSourceDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Escolher fonte da imagem")
                .setItems(new CharSequence[]{"Galeria", "Câmera"}, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        switch (which) {
                            case 0:
                                openGallery();
                                break;
                            case 1:
                                takePhoto();
                                break;
                        }
                    }
                });

        AlertDialog alertDialog = builder.create();
        Objects.requireNonNull(alertDialog.getWindow()).setBackgroundDrawableResource(R.drawable.dialog_border);
        alertDialog.show();
    }

    private void openGallery() {
        Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        startActivityForResult(galleryIntent, PICK_IMAGE_REQUEST);
    }

    private void takePhoto() {
        String[] cameraPermission = {Manifest.permission.CAMERA};
        if (EasyPermissions.hasPermissions(this, cameraPermission)) {
            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
                startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
            }
        } else {
            EasyPermissions.requestPermissions(this, "É necessário permissão para acessar a câmera", CAMERA_PERMISSION_REQUEST_CODE, cameraPermission);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        EasyPermissions.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == RESULT_OK) {
            switch (requestCode) {
                case PICK_IMAGE_REQUEST:
                    if (data != null && data.getData() != null) {
                        imageUri = data.getData();
                        displaySelectedImage();
                    }
                    break;
                case REQUEST_IMAGE_CAPTURE:
                    if (data != null && data.getExtras() != null) {
                        Bitmap photo = (Bitmap) data.getExtras().get("data");
                        imageBitMap = photo;
                        binding.coverImage.setImageBitmap(photo);
                        hasImage = true;
                    }
                    break;
            }
        }
    }

    private void displaySelectedImage() {
        try {
            Bitmap bitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), imageUri);
            imageBitMap = bitmap;
            binding.coverImage.setImageBitmap(bitmap);
            hasImage = true;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

