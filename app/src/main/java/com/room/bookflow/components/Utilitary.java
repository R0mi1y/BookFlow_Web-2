package com.room.bookflow.components;

import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.widget.ImageView;

import androidx.appcompat.app.AlertDialog;

import com.bumptech.glide.Glide;
import com.room.bookflow.R;

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

    public static void hideLoadingScreen(ImageView gif) {
        gif.setVisibility(View.GONE);
    }
}
