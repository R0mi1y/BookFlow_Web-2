package com.room.bookflow.activities;

import static com.room.bookflow.components.Utilitary.popUp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.Manifest;
import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import java.io.IOException;

import com.room.bookflow.databinding.ActivityRegisterBookBinding;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.User;

import pub.devrel.easypermissions.EasyPermissions;

public class RegisterBookActivity extends AppCompatActivity {
    private static final int PICK_IMAGE_REQUEST = 1;
    private static final int REQUEST_IMAGE_CAPTURE = 2;
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 123;
    private Uri imageUri;
    private Bitmap imageBitMap;
    private Boolean hasImage = false;
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

                if (hasImage){
                    book = book.uploadImage(book, imageBitMap, this);
                } else {
                    book = book.save(this);
                }

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

        binding.insertCover.setOnClickListener(v -> showImageSourceDialog());
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

        builder.show();
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