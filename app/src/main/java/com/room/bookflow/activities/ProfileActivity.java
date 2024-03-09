package com.room.bookflow.activities;

import androidx.activity.result.ActivityResultLauncher;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.widget.ImageView;
import android.widget.Toast;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;
import com.room.bookflow.databinding.ActivityProfileBinding;
import com.room.bookflow.models.User;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Objects;

import pub.devrel.easypermissions.EasyPermissions;

public class ProfileActivity extends AppCompatActivity {

    private ActivityResultLauncher<String> galleryLauncher;
    ActivityProfileBinding binding;

    private Uri imageUri;
    private Bitmap imageBitMap;
    private Boolean hasImage = false;
    private static final int PICK_IMAGE_REQUEST = 1;
    private static final int REQUEST_IMAGE_CAPTURE = 2;
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 123;


    private File convertBitmapToFile(Context context, Bitmap bitmap, String fileName) {

        if (bitmap == null) {
            return null;
        }
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
        binding = ActivityProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        //Botão de Voltar
        binding.backBtn.setOnClickListener(v -> {
            Intent intent = new Intent(ProfileActivity.this, HomeActivity.class);
            startActivity(intent);
        });
        binding.btnEditLoc.setOnClickListener(v -> {
            Intent intent = new Intent(ProfileActivity.this, RegisterLocationActivity.class);
            startActivity(intent);
        });

        binding.cameraIcon.setOnClickListener(v -> showImageSourceDialog());

        new Thread(() -> {
            User userProfile = User.getAuthenticatedUser(this);

            // Verificar se o perfil do usuário e o ID são válidos
            if (userProfile.getId() >= 0) {
                int userId = userProfile.getId();

                runOnUiThread(() -> {
                    binding.editTextName.setText(userProfile.getFirstName());
                    binding.editTextLastname.setText(userProfile.getLastName());
                    binding.editTextUsername.setText(userProfile.getUsername());
                    binding.editTextEmail.setText(userProfile.getEmail());
                    binding.editTextPhone.setText(userProfile.getPhone());
                    binding.editTextBiography.setText(userProfile.getBiography());
                    ImageView profileImage = binding.profileImage;
                    Picasso.get().load(userProfile.getPhoto()).into(profileImage);

                    binding.btnSalvChanges.setOnClickListener(v -> {
                        // Obter os dados dos campos de edição
                        String updatedName = binding.editTextName.getText().toString();
                        String updatedLastName = binding.editTextLastname.getText().toString();
                        String updatedUserName = binding.editTextUsername.getText().toString();
                        String updatedEmail = binding.editTextEmail.getText().toString();
                        String updatedPhone = binding.editTextPhone.getText().toString();
                        String updatedBiography = binding.editTextBiography.getText().toString();

                        // Criar um objeto User com as alterações
                        User updatedUser = new User();
                        updatedUser.setFirstName(updatedName);
                        updatedUser.setLastName(updatedLastName);
                        updatedUser.setUsername(updatedUserName);
                        updatedUser.setEmail(updatedEmail);
                        updatedUser.setPhone(updatedPhone);
                        updatedUser.setBiography(updatedBiography);

                        new Thread(() -> {
                            File imageFile = convertBitmapToFile(this, imageBitMap, "photo.png");
                            updatedUser.update(userId, updatedUser, imageFile, ProfileActivity.this);
                            updatedUser.setIs_autenticated(true);
                            updatedUser.setAddress_id(userProfile.getAddress_id());
                            changeUser(updatedUser);
                        }).start();
                    });
                });
            } else {
                // Usuário não autenticado corretamente
                runOnUiThread(() -> showToast("Usuário não definido!"));
            }
        }).start();

        binding.backBtn.setOnClickListener(v -> finish());

    }

    private void showToast(String message) {
        Toast.makeText(ProfileActivity.this, message, Toast.LENGTH_SHORT).show();
    }

    public void changeUser(User user) {
        new Thread(() -> {
            try {
                BookFlowDatabase bookFlowDatabase = BookFlowDatabase.getDatabase(getApplicationContext());

                bookFlowDatabase.userDao().update(user);

                runOnUiThread(() -> {
                    Toast.makeText(ProfileActivity.this, user.getUsername() + " inserida com sucesso", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(ProfileActivity.this, HomeActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
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
                        binding.profileImage.setImageBitmap(photo);
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
            binding.profileImage.setImageBitmap(bitmap);
            hasImage = true;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
