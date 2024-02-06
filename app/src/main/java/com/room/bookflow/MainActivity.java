package com.room.bookflow;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.room.bookflow.databinding.ActivityMainBinding;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.loginWithGoogle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                verificarNotificacoesDoServidor();
            }
        });

    }

    private void verificarNotificacoesDoServidor() {
        try {
            String url = getString(R.string.api_url) + "/api/user/5/notifications";
            RequestQueue requestQueue = Volley.newRequestQueue(this);

            String authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA3MTg0NDUxLCJpYXQiOjE3MDcxODA4NTEsImp0aSI6IjM4N2RhNzQxOWNhNjRmNjFiYzQ3YmQzYjc0OGFiYjBiIiwidXNlcl9pZCI6NX0.GR4rFJdwkA9FB5JaBwwF0mutzSIuHbdGB8PmDiJYRgc";

            Map<String, String> headers = new HashMap<>();
            headers.put("Authorization", "Bearer " + authToken);

            Log.w("Requisição", "Fazendo");

            JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(
                    Request.Method.GET,
                    url,
                    null,
                    new Response.Listener<JSONArray>() {
                        @Override
                        public void onResponse(JSONArray notificationsArray) {
                            for (int i = 0; i < notificationsArray.length(); i++) {
                                try {
                                    JSONObject notificationObject = notificationsArray.getJSONObject(i);

                                    String from = notificationObject.getString("from_field");
                                    String message = notificationObject.getString("message");
                                    String title = notificationObject.getString("title");
                                    String description = notificationObject.getString("description");
                                    int id = notificationObject.getInt("id");

                                    makeNotification(from, message, title, description, id);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.e("Requisição GET", "Erro: " + error.toString());
                        }
                    }
            ) {
                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    return headers;
                }
            };

            requestQueue.add(jsonArrayRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void makeNotification(String from, String message, String title, String description, int id) {
        String chanelID = "book_flow_notifications";
        NotificationCompat.Builder builder = new NotificationCompat.Builder(getApplicationContext(), chanelID);
        Intent intent = new Intent(getApplicationContext(), SplashActivity.class);
        intent.putExtra("from", from);

        PendingIntent pendingIntent = PendingIntent.getActivity(getApplicationContext(), 0, intent, PendingIntent.FLAG_MUTABLE);

        builder.setSmallIcon(R.drawable.logo)
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            NotificationChannel notificationChannel = notificationManager.getNotificationChannel(chanelID);

            if (notificationChannel == null) {
                int importance = NotificationManager.IMPORTANCE_HIGH;
                notificationChannel = new NotificationChannel(chanelID, description, importance);
                notificationChannel.setLightColor(Color.WHITE);
                notificationChannel.enableVibration(true);
                notificationManager.createNotificationChannel(notificationChannel);
            }
        }

        notificationManager.notify(id, builder.build());
    }
}