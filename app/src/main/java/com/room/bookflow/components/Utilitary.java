package com.room.bookflow.components;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.view.View;
import android.widget.ImageView;

import androidx.appcompat.app.AlertDialog;

import com.bumptech.glide.Glide;
import com.room.bookflow.R;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Objects;
import java.util.concurrent.CountDownLatch;

public class Utilitary {

    public static void showLoadingScreen(ImageView gif, Context context, Runnable runnable) {
        showLoadingScreen(gif, context);
        runnable.run();
    }

    public static void showLoadingScreen(ImageView gif, Context context) {
        ((Activity) context).runOnUiThread(() -> {
            gif.setVisibility(View.VISIBLE);
            Glide.with(context)
                    .asGif()
                    .load(R.drawable.book)
                    .into(gif);
        });
    }

    public static void popUp(String title, String message, Context context) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle(title)
                .setMessage(message);

        builder.setPositiveButton("OK", (dialogInterface, i) -> dialogInterface.dismiss());

        AlertDialog alertDialog = builder.create();
        Objects.requireNonNull(alertDialog.getWindow()).setBackgroundDrawableResource(R.drawable.dialog_border);

        alertDialog.show();
    }

    public static String getTextReduced(String originalText, int size) {
        if (originalText.length() > size) {
            return originalText.substring(0, size) + "...";
        } else {
            return originalText;
        }
    }

    public static byte[] convertBitmapToBytes(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
    }

    public static byte[] convertImageToBytes(File imageFile) throws IOException {
        FileInputStream fileInputStream = new FileInputStream(imageFile);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        byte[] buffer = new byte[1024];
        int bytesRead;

        while ((bytesRead = fileInputStream.read(buffer)) != -1) {
            byteArrayOutputStream.write(buffer, 0, bytesRead);
        }

        fileInputStream.close();

        return byteArrayOutputStream.toByteArray();
    }

    public static void hideLoadingScreen(ImageView gif) {
        gif.setVisibility(View.GONE);
    }
}
