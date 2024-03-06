package com.room.bookflow.activities;

import static com.room.bookflow.components.Utilitary.convertBitmapToFile;
import static com.room.bookflow.components.Utilitary.popUp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.documentfile.provider.DocumentFile;
import android.Manifest;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.ImageView;

import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityEditBookBinding;
import com.room.bookflow.models.Book;
import com.squareup.picasso.MemoryPolicy;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Objects;

import pub.devrel.easypermissions.EasyPermissions;

public class EditBookActivity extends AppCompatActivity {
    private static final int PICK_IMAGE_REQUEST = 1;
    private static final int REQUEST_IMAGE_CAPTURE = 2;
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 123;
    ActivityEditBookBinding binding;
    Book book;
    private Uri imageUri;
    private Bitmap imageBitMap;
    private Boolean hasImage = false;
    private static final int REQUEST_CODE_PICK_DIRECTORY = 123;
    int bookId;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityEditBookBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Intent localIt = getIntent();

        binding.backBtn1.setOnClickListener(v -> finish());
        binding.backBtn2.setOnClickListener(v -> finish());
        binding.backBtn3.setOnClickListener(v -> finish());

        bookId = Integer.parseInt(Objects.requireNonNull(localIt.getStringExtra("bookId")));
        String title = localIt.getStringExtra("title");
        String author = localIt.getStringExtra("author");
        String genre = localIt.getStringExtra("genre");
        String summary = localIt.getStringExtra("summary");
        String cover = localIt.getStringExtra("cover");
        boolean availability = Objects.equals(localIt.getStringExtra("availability"), "1");
        String requirementsLoan = localIt.getStringExtra("requirementsLoan");

        book = new Book(cover, bookId, title, author, genre, summary, requirementsLoan, availability);

        ImageView iv = binding.coverImage;

        binding.title.setText(book.getTitle());
        binding.author.setText(book.getAuthor());
        binding.summary.setText(book.getSummary());
        binding.genre.setText(book.getGenre());
        binding.requirements.setText(book.getRequirementsLoan());
        binding.avaliability.setChecked(book.isAvailability());

        Picasso.get()
                .load(book.getCover())
                .into(iv);

        ImageView qrImage = findViewById(R.id.qr_code);
        String urlQrCode = getString(R.string.api_url) + "/api/book/" + bookId + "/get_qr/?result=show";
        popUp("Log", urlQrCode, this);

        Picasso.get()
                .load(urlQrCode)  // Corrigir aqui para usar a variável urlQrCode
                .memoryPolicy(MemoryPolicy.NO_CACHE, MemoryPolicy.NO_STORE)
                .networkPolicy(NetworkPolicy.NO_CACHE, NetworkPolicy.NO_STORE)
                .into(qrImage);


        binding.downloadQrcode.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
            startActivityForResult(intent, REQUEST_CODE_PICK_DIRECTORY);
        });

        binding.saveBook.setOnClickListener(v -> updateBook());

        binding.insertCover.setOnClickListener(v -> showImageSourceDialog());
    }

    private void showImageSourceDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Escolher fonte da imagem")
                .setItems(new CharSequence[]{"Galeria", "Câmera"}, (dialog, which) -> {
                    switch (which) {
                        case 0:
                            openGallery();
                            break;
                        case 1:
                            takePhoto();
                            break;
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
                case REQUEST_CODE_PICK_DIRECTORY:
                    if (data != null && data.getData() != null) {
                        Uri treeUri = data.getData();

                        ImageDownloader imageDownloader = new ImageDownloader(getApplicationContext(), treeUri);

                        imageDownloader.execute(getString(R.string.api_url) + "/api/book/" + bookId + "/get_qr?result=show");
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

    private void updateBook(){
        new Thread(() -> {
            book.setAuthor(binding.author.getText().toString());
            book.setTitle(binding.title.getText().toString());
            book.setGenre(binding.genre.getText().toString());
            book.setRequirementsLoan(binding.requirements.getText().toString());
            book.setSummary(binding.summary.getText().toString());
            book.setAvailability(binding.avaliability.isChecked());

            if (hasImage) book.updateBook(convertBitmapToFile(this, imageBitMap, "cover.png"), this);
            else {
                try {
                    Book.updateBook(book, this);
                } catch (IOException e) {
                    popUp("Erro", "Erro ao atualizar livro, tente novamente mais tarde!", this);
                    throw new RuntimeException(e);
                }
            }
        }).start();
    }
}

class ImageDownloader extends AsyncTask<String, Void, Bitmap> {

    private final Context context;
    private final Uri treeUri;

    public ImageDownloader(Context context, Uri treeUri) {
        this.context = context;
        this.treeUri = treeUri;
    }

    @Override
    protected Bitmap doInBackground(String... params) {
        String imageUrl = params[0];
        try {
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            Bitmap bitmap = BitmapFactory.decodeStream(input);

            saveImageToSelectedDirectory(bitmap, "imagem_salva.png");

            return bitmap;
        } catch (Exception e) {
            Log.e("ImageDownloader", "Erro ao baixar imagem: " + e.getMessage());
            return null;
        }
    }

    @Override
    protected void onPostExecute(Bitmap result) {
        popUp("Sucesso", "Imagem baixada com sucesso!", context);
    }

    private void saveImageToSelectedDirectory(Bitmap bitmap, String filename) {
        try {
            String directoryPath = getDirectoryPathFromUri(treeUri);

            if (directoryPath != null) {
                String filePath = directoryPath + File.separator + filename;
                FileOutputStream outputStream = new FileOutputStream(filePath);
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
                outputStream.close();
            }
        } catch (Exception e) {
            Log.e("ImageDownloader", "Erro ao salvar imagem: " + e.getMessage());
        }
    }

    private String getDirectoryPathFromUri(Uri treeUri) {
        DocumentFile pickedDir = DocumentFile.fromTreeUri(context, treeUri);
        return pickedDir != null ? pickedDir.getUri().getPath() : null;
    }
}