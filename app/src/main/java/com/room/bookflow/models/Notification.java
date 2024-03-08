package com.room.bookflow.models;


import static com.room.bookflow.helpers.Utilitary.handleErrorResponse;
import static com.room.bookflow.helpers.Utilitary.showToast;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.room.bookflow.R;
import com.room.bookflow.activities.LoginActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

public class Notification {
    int id;
    int user_id;
    boolean visualized;
    String message;
    String title;
    String description;
    String from;

    public boolean isVisualized() {
        return visualized;
    }

    public void setVisualized(boolean visualized) {
        this.visualized = visualized;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public static List<Notification> getAllNotifications(Context context) {
        String url = context.getString(R.string.api_url) + "/api/user/" + User.getAuthenticatedUser(context).getId() + "/notifications_all/";
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String authToken = User.getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(context, LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            ((Activity) context).runOnUiThread(() -> Toast.makeText(context, "Login expirado!", Toast.LENGTH_SHORT).show());
            context.startActivity(intent);
            return new ArrayList<>();
        }

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + authToken);
        List<Notification> list = new ArrayList<>();
        BlockingQueue<List<Notification>> notificationQueue = new LinkedBlockingQueue<>();

        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, url, null,
                response -> {
                    ((Activity) context).runOnUiThread(() -> Toast.makeText(context, "Requisited", Toast.LENGTH_SHORT).show());
                    for (int i = 0; i < response.length(); i++) {
                        try {
                            JSONObject jsonObject = response.getJSONObject(i);
                            Notification notification = new Notification().setByJSONObject(jsonObject, context);
                            if (notification != null) list.add(notification);
                        } catch (JSONException e) {
                            Log.e("Error getting user", e.getMessage());
                        }
                    }
                    notificationQueue.add(list);
                },
                error -> {
                    handleErrorResponse(error, context);
                    notificationQueue.add(new ArrayList<>());
                }) {
            @Override
            public Map<String, String> getHeaders() {
                return headers;
            }
        };
        requestQueue.add(request);
        try {
            return notificationQueue.poll(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            Thread.currentThread().interrupt(); // Preserve a interrupção status
            return new ArrayList<>();
        }
    }

    public Notification setByJSONObject(JSONObject response, Context context) {
        try {
            this.id = response.has("id") ? response.getInt("id") : -1;
            this.title = response.has("title") ? response.getString("title") : null;
            this.description = response.has("description") ? response.getString("description") : null;
            this.from = response.has("from_field") ? response.getString("from_field") : null;
            this.message = response.has("message") ? response.getString("message") : null;
            this.user_id = response.has("user") ? response.getInt("user") : null;
            this.visualized = response.has("visualized") ? response.getBoolean("visualized") : null;
        } catch (JSONException e) {
            return null;
        }

        return this;
    }
}
