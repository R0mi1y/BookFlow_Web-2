package com.room.bookflow.models;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.PrimaryKey;

import com.android.volley.AuthFailureError;
import com.android.volley.NoConnectionError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.ServerError;
import com.android.volley.TimeoutError;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.room.bookflow.R;
import com.room.bookflow.activities.LoginActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

public class Book {
    private int id = -1;

    private String cover;
    private String title;
    private String author;
    private String genre;
    private String summary;
    private String requirementsLoan;
    private boolean isInWishlist;
    private double rating;
    private boolean availability;
    private int ownerId = -1;

    public Book() {
    }

    public Book(String cover, String title, String author, String genre, String summary, String requirementsLoan, boolean isInWishlist, double rating, boolean availability, int ownerId) {
        this.cover = cover;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.summary = summary;
        this.requirementsLoan = requirementsLoan;
        this.isInWishlist = isInWishlist;
        this.rating = rating;
        this.availability = availability;
        this.ownerId = ownerId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getRequirementsLoan() {
        return requirementsLoan;
    }

    public void setRequirementsLoan(String requirementsLoan) {
        this.requirementsLoan = requirementsLoan;
    }

    public boolean isInWishlist() {
        return isInWishlist;
    }

    public void setInWishlist(boolean inWishlist) {
        isInWishlist = inWishlist;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public boolean isAvailability() {
        return availability;
    }

    public void setAvailability(boolean availability) {
        this.availability = availability;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public Book getBookById(Context context) {
        if (this.id == -1) return null;
        return this.getBookById(this.id, context);
    }

    public Book getBookById(int id, Context context) {
        String url = context.getString(R.string.api_url) + "/api/book/" + Integer.toString(id) + "/";
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String authToken = User.getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(((Activity) context), LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            showToast(context, "Login expirado!");
            ((Activity) context).startActivity(intent);
            return null;
        }

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + authToken);

        BlockingQueue<Book> bookQueue = new LinkedBlockingQueue<>();

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
                    if (response.has("id")) {
                        Book book = new Book();
                        this.setByJSONObject(response, context);
                        bookQueue.add(book);
                    } else {
                        showToast(context, "Erro buscando livro!");
                        Log.e("Getting book", "Erro buscando usuário!");
                    }
                },
                error -> handleErrorResponse(error, context)) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                return headers;
            }
        };
        requestQueue.add(request);

        try {
            return bookQueue.poll(30, TimeUnit.SECONDS); // Ajuste o tempo limite conforme necessário
        } catch (InterruptedException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Book> getAllBooks(Context context) {
        String url = context.getString(R.string.api_url) + "/api/book/";
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String authToken = User.getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(((Activity) context), LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            showToast(context, "Login expirado!");
            ((Activity) context).startActivity(intent);
            return null;
        }

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + authToken);
        List<Book> list = new ArrayList<>();
        BlockingQueue<List<Book>> bookQueue = new LinkedBlockingQueue<>();

        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, url, null,
                response -> {
                    for (int i = 0; i < response.length(); i++) {
                        try {
                            JSONObject jsonObject = response.getJSONObject(i);
                            Book book = new Book().setByJSONObject(jsonObject, context);
                            list.add(book);
                        } catch (JSONException e) {
                            Log.e("Error getting book", Objects.requireNonNull(e.getMessage()));
                        }
                    }
                    bookQueue.add(list);
                },
                error -> {
                    handleErrorResponse(error, context);
                }) {
            @Override
            public Map<String, String> getHeaders() {
                return headers;
            }
        };
        requestQueue.add(request);
        try {
            return bookQueue.poll(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Preserve a interrupção status
            throw new RuntimeException(e);
        }
    }

    private void handleErrorResponse(VolleyError error, Context context) {
        if (error instanceof NoConnectionError) {
            showToast(context, "Sem conexão de internet");
        } else if (error instanceof TimeoutError) {
            showToast(context, "Tempo de espera excedido");
        } else if (error instanceof ServerError) {
            showToast(context, "Erro no servidor");
        } else {
            showToast(context, "Erro desconhecido");
        }
    }

    private void showToast(Context context, String message) {
        ((Activity) context).runOnUiThread(() -> Toast.makeText(context, message, Toast.LENGTH_SHORT).show());
    }

    public Book setByJSONObject(JSONObject response, Context context){
        try {
            this.id = response.has("id") ? response.getInt("id") : -1;
            this.cover = response.has("cover") ? response.getString("cover") : null;
            this.title = response.has("title") ? response.getString("title") : null;
            this.author = response.has("author") ? response.getString("author") : null;
            this.genre = response.has("genre") ? response.getString("genre") : null;
            this.summary = response.has("summary") ? response.getString("summary") : null;
            this.requirementsLoan = response.has("requirements_loan") ? response.getString("requirements_loan") : null;
            this.isInWishlist = response.has("is_in_wishlist") && response.getBoolean("is_in_wishlist");
            this.rating = response.has("rating") ? Double.parseDouble(response.getString("rating")) : -1;
            this.availability = response.has("availability") && response.getBoolean("availability");
            this.ownerId = response.has("account_type") ? response.getInt("account_type") : -1;
        } catch (JSONException e) {
            Log.e("error getting book", Objects.requireNonNull(e.getMessage()));
        }

        return this;
    }

    public User getOwner(Context context) {
        if (this.ownerId > -1) {
            return new User().getUserById(this.ownerId, context);
        }
        return null;
    }
}
