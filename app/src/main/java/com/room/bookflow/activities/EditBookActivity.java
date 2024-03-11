package com.room.bookflow.activities;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.ImageView;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.room.bookflow.R;
import com.room.bookflow.dao.BookDao;
import com.room.bookflow.databinding.ActivityEditBookBinding;
import com.room.bookflow.models.Book;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Objects;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import pub.devrel.easypermissions.EasyPermissions;

import static com.room.bookflow.helpers.Utilitary.convertBitmapToFile;
import static com.room.bookflow.helpers.Utilitary.popUp;

import android.widget.Toast;




public class EditBookActivity extends AppCompatActivity {
    private static final int PICK_IMAGE_REQUEST = 1;
    private static final int REQUEST_IMAGE_CAPTURE = 2;
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 123;
    private ActivityEditBookBinding binding;
    private Book book;
    private Uri imageUri;
    private Bitmap imageBitMap;
    private Boolean hasImage = false;
    private static final int CREATE_FILE = 1;
    private static final int STORAGE_PERMISSION_REQUEST_CODE = 456;
    private int bookId;

    private Bitmap qrCodeBitmap;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityEditBookBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Intent localIt = getIntent();

        bookId = Integer.parseInt(Objects.requireNonNull(localIt.getStringExtra("bookId")));
        String title = localIt.getStringExtra("title");
        String author = localIt.getStringExtra("author");
        String genre = localIt.getStringExtra("genre");
        String summary = localIt.getStringExtra("summary");
        String cover = localIt.getStringExtra("cover");
        boolean availability = Objects.equals(localIt.getStringExtra("availability"), "1");
        String requirementsLoan = localIt.getStringExtra("requirementsLoan");

        book = new Book(cover, bookId, title, author, genre, summary, requirementsLoan, availability);

        binding.title.setText(book.getTitle());
        binding.author.setText(book.getAuthor());
        binding.summary.setText(book.getSummary());
        binding.genre.setText(book.getGenre());
        binding.requirements.setText(book.getRequirementsLoan());
        binding.avaliability.setChecked(book.isAvailability());

        // Remove o uso do Picasso para carregar a imagem do QR Code e gera localmente
        generateAndSetQRCode(String.valueOf(bookId));

        binding.backBtn1.setOnClickListener(v -> finish());
        binding.backBtn2.setOnClickListener(v -> finish());
        binding.backBtn3.setOnClickListener(v -> finish());

        binding.saveBook.setOnClickListener(v -> updateBook());

        binding.insertCover.setOnClickListener(v -> showImageSourceDialog());

        binding.deletarBook.setOnClickListener(v -> deleteBook());


        generateAndSetQRCode(String.valueOf(bookId));

        // Listener para o botão de download do QR Code
        binding.downloadQrcode.setOnClickListener(v -> {
            if (qrCodeBitmap != null) {
                saveQRCodeDirectly(qrCodeBitmap);
            } else {
                qrCodeBitmap = generateQRCode("Book ID: " + bookId);
                if (qrCodeBitmap != null) {
                    saveQRCodeDirectly(qrCodeBitmap);
                } else {
                    Toast.makeText(EditBookActivity.this, "Erro ao gerar QR Code.", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void deleteBook() {
        Executor executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            Book.deleteBookById(bookId, EditBookActivity.this, new Book.ResponseCallback() {
                @Override
                public void onSuccess(String message) {
                    runOnUiThread(() -> {
                        Toast.makeText(EditBookActivity.this, message, Toast.LENGTH_SHORT).show();

                        Intent intent = new Intent(EditBookActivity.this, HomeActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(intent);

                        finish();
                    });
                }

                @Override
                public void onError(String error) {
                    runOnUiThread(() -> Toast.makeText(EditBookActivity.this, error, Toast.LENGTH_SHORT).show());
                }
            });
        });
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
        if (requestCode == STORAGE_PERMISSION_REQUEST_CODE) {
            // Tentar salvar novamente após permissões concedidas
            generateAndSetQRCode(String.valueOf(bookId));
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == CREATE_FILE && resultCode == RESULT_OK) {
            if (data != null && data.getData() != null) {
                Uri uri = data.getData();

                try (OutputStream outputStream = getContentResolver().openOutputStream(uri)) {
                    qrCodeBitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
                    Toast.makeText(this, "QR Code salvo com sucesso.", Toast.LENGTH_LONG).show();
                } catch (Exception e) {
                    Toast.makeText(this, "Erro ao salvar QR Code: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        }

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
                }
            }
        }).start();
    }

    private Bitmap generateQRCode(String text) {
        QRCodeWriter writer = new QRCodeWriter();
        try {
            BitMatrix bitMatrix = writer.encode(text, BarcodeFormat.QR_CODE, 512, 512);
            int width = bitMatrix.getWidth();
            int height = bitMatrix.getHeight();
            Bitmap bmp = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565);
            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    bmp.setPixel(x, y, bitMatrix.get(x, y) ? Color.BLACK : Color.WHITE);
                }
            }
            qrCodeBitmap = bmp; // Atualiza a referência ao bitmap do QR Code
            return bmp;
        } catch (WriterException e) {
            Log.e("QRCodeGenerator", "Could not generate QR Code", e);
            return null;
        }
    }

    private void generateAndSetQRCode(String bookId) {
        Bitmap qrCodeBitmap = generateQRCode("Book Flow: " + bookId);
        if (qrCodeBitmap != null) {
            ImageView qrImage = findViewById(R.id.qr_code);
            qrImage.setImageBitmap(qrCodeBitmap);
        } else {
            Log.e("EditBookActivity", "Error generating QR Code");
        }
    }

    private void saveQRCodeDirectly(Bitmap bitmap) {
        this.qrCodeBitmap = bitmap;

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("image/png");
        // Sugere um nome para o arquivo a ser salvo
        intent.putExtra(Intent.EXTRA_TITLE, "QRCode_IdLivro_" + bookId + ".png");

        startActivityForResult(intent, CREATE_FILE);
    }
}

