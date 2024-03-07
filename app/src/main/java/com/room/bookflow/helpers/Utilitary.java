package com.room.bookflow.helpers;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Environment;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.NoConnectionError;
import com.android.volley.ServerError;
import com.android.volley.TimeoutError;
import com.android.volley.VolleyError;
import com.bumptech.glide.Glide;
import com.room.bookflow.R;
import com.room.bookflow.activities.ListBooksActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.Objects;
import java.util.concurrent.CountDownLatch;
import java.util.function.Consumer;

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

    public static Boolean isNetworkAvailable(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();

        if (networkInfo != null && networkInfo.isConnected()) return true;
        else return false;
    }

    public static void showToast(Context context, String message) {
        ((Activity) context).runOnUiThread(() -> Toast.makeText(context, message, Toast.LENGTH_SHORT).show());
    }

    public static void handleErrorResponse(VolleyError error, Context context) {
        if (error instanceof NoConnectionError) {
            showToast(context, "Sem conexão de internet");
        } else if (error instanceof TimeoutError) {
            showToast(context, "Tempo de espera excedido");
        } else if (error instanceof ServerError || error instanceof AuthFailureError) {
            NetworkResponse networkResponse = error.networkResponse;
            if (networkResponse != null && networkResponse.data != null) {
                String responseBody = new String(networkResponse.data, Charset.defaultCharset());
                try {
                    JSONObject data = new JSONObject(responseBody);
                    StringBuilder message = new StringBuilder();
                    Iterator<String> keys = data.keys();

                    while (keys.hasNext()) {
                        String key = keys.next();
                        Object value = data.get(key);

                        message.append(key).append(": ");

                        if (value instanceof String) {
                            message.append(value);
                        } else if (value instanceof JSONArray) {
                            JSONArray jsonArray = (JSONArray) value;
                            for (int i = 0; i < jsonArray.length(); i++) {
                                message.append("\n");
                                message.append(" - ").append(jsonArray.getString(i));
                            }
                        }
                        message.append("\n");
                    }

                    popUp("Erro", message.toString(), context);
                } catch (JSONException e) {
                    showToast(context ,e.getMessage());
                    e.printStackTrace();
                }
            }
        } else {
            showToast(context, "Erro desconhecido");
        }
    }

    public static File convertBitmapToFile(Context context, Bitmap bitmap, String fileName) {
        if (isExternalStorageWritable()) {
            File directory = new File(context.getExternalFilesDir(Environment.DIRECTORY_PICTURES), "temp");
            if (!directory.exists()) {
                directory.mkdirs();
            }

            File file = new File(directory, fileName);

            try {
                FileOutputStream outputStream = new FileOutputStream(file);
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
                outputStream.flush();
                outputStream.close();

                return file;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return null;
    }

    private static boolean isExternalStorageWritable() {
        String state = Environment.getExternalStorageState();
        return Environment.MEDIA_MOUNTED.equals(state);
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

    public static void showInputDialog(Context context, String title, String searchCamp, Consumer<String> positiveClickListener) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.dialog_input, null);

        final EditText editText = view.findViewById(R.id.editText);
        editText.setText(searchCamp);

        builder.setView(view)
                .setTitle(title)
                .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss())
                .setPositiveButton("OK", (dialog, which) -> {
                    String userInput = editText.getText().toString();
                    positiveClickListener.accept(userInput);
                });

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
