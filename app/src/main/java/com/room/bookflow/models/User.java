package com.room.bookflow.models;

import static com.room.bookflow.components.Utilitary.hideLoadingScreen;
import static com.room.bookflow.components.Utilitary.popUp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.Toast;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.security.Signature;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Scanner;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import androidx.core.util.Consumer;
import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
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
import com.room.bookflow.activities.HomeActivity;
import com.room.bookflow.activities.LoginActivity;
import com.room.bookflow.activities.SignUpActivity;

import org.json.JSONArray;

import org.json.JSONException;
import org.json.JSONObject;

@Entity(tableName = "user_table")
public class User {
    @PrimaryKey(autoGenerate = true)
    private int id = -1;
    private String refreshToken  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcwNzg4NDY5MiwiaWF0IjoxNzA3Nzk4MjkyLCJqdGkiOiI4ZmY0MjdhNzExOTU0MmQ5ODljOWFjYTJkZTg3YmE3ZiIsInVzZXJfaWQiOjV9.W5vHgDGCh9YsFWgMpAYXmJ6fVLiRmQwD5L0jBJ7n0OE";
    private String username;
    private String firstName;
    private String photo;
    private String lastName;
    private String phone;
    private String accountType;
    private boolean active;
    private String email;
    private String biography;
    private String dateJoined;
    private String password;
    private List<Book> wishlist;
    private Address address;

    public User(){
        this.wishlist = new ArrayList<Book>();
    }

    public User getUserById(Context context) {
        if (this.id == -1) return null;
        return this.getUserById(this.id, context);
    }

    public static User getAuthenticatedUser(){
        return new User();
    }

    public User getUserById(int id, Context context) {
        String url = context.getString(R.string.api_url) + "/api/user/" + Integer.toString(id) + "/";
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

        BlockingQueue<User> userQueue = new LinkedBlockingQueue<>();

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
                    if (response.has("id")) {
                        User user = new User();
                        user.setByJSONObject(response, context);
                        userQueue.add(user);
                    } else {
                        showToast(context, "Erro buscando usuário!");
                        Log.e("Getting user", "Erro buscando usuário!");
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
            return userQueue.poll(30, TimeUnit.SECONDS); // Ajuste o tempo limite conforme necessário
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            e.printStackTrace();
            return null;
        }
    }

    public List<User> getAllUsers(Context context) {
        ((Activity) context).runOnUiThread(() -> Toast.makeText(context, "Starting", Toast.LENGTH_SHORT).show());

        String url = context.getString(R.string.api_url) + "/api/user/";
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String authToken = User.getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(((Activity) context), LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            ((Activity) context).runOnUiThread(() -> Toast.makeText(context, "Login expirado!", Toast.LENGTH_SHORT).show());
            ((Activity) context).startActivity(intent);
            return null;
        }

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + authToken);
        List<User> list = new ArrayList<>();
        BlockingQueue<List<User>> userQueue = new LinkedBlockingQueue<>();

        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, url, null,
                response -> {
                    ((Activity) context).runOnUiThread(() -> Toast.makeText(context, "Requisited", Toast.LENGTH_SHORT).show());
                    for (int i = 0; i < response.length(); i++) {
                        try {
                            JSONObject jsonObject = response.getJSONObject(i);
                            User user = new User().setByJSONObject(jsonObject, context);
                            list.add(user);
                        } catch (JSONException e) {
                            Log.e("Error getting user", e.getMessage());
                        }
                    }
                    userQueue.add(list);
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
            return userQueue.poll(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            Thread.currentThread().interrupt(); // Preserve a interrupção status
            throw new RuntimeException(e);
        }
    }

    private static void handleErrorResponse(VolleyError error, Context context) {
        if (error instanceof NoConnectionError) {
            showToast(context, "Sem conexão de internet");
        } else if (error instanceof TimeoutError) {
            showToast(context, "Tempo de espera excedido");
        } else if (error instanceof ServerError) {
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

    private static void showToast(Context context, String message) {
        ((Activity) context).runOnUiThread(() -> Toast.makeText(context, message, Toast.LENGTH_SHORT).show());
    }

    public User setByJSONObject(JSONObject response, Context context) {
        try {
            this.id = response.has("id") ? response.getInt("id") : -1;
            this.username = response.has("username") ? response.getString("username") : null;
            this.lastName = response.has("last_name") ? response.getString("last_name") : null;
            this.firstName = response.has("first_name") ? response.getString("first_name") : null;
            this.active = response.has("is_active") && response.getBoolean("is_active");
            this.dateJoined = response.has("date_joined") ? response.getString("date_joined") : null;
            this.photo = response.has("photo") ? response.getString("photo") : response.getString("photo_url");
            this.phone = response.has("phone") ? response.getString("phone") : null;
            this.email = response.has("email") ? response.getString("email") : null;
            this.accountType = response.has("account_type") ? response.getString("account_type") : null;
            this.biography = response.has("biography") && !response.isNull("biography") ? response.getString("biography") : null;

            JSONObject addressJson = response.optJSONObject("address");
            this.address = new Address(
                    addressJson != null ? addressJson.optString("street", null) : null,
                    addressJson != null ? addressJson.optString("city", null) : null,
                    addressJson != null ? addressJson.optString("district", null) : null,
                    addressJson != null ? addressJson.optString("house_number", null) : null,
                    addressJson != null ? addressJson.optString("state", null) : null,
                    addressJson != null ? addressJson.optString("postal_code", null) : null,
                    addressJson != null ? addressJson.optString("lat", null) : null,
                    addressJson != null ? addressJson.optString("lon", null) : null
            );

            List<Book> wishlistList = new ArrayList<>();
            JSONArray wishlistArray = response.optJSONArray("wishlist");

            if (wishlistArray != null) {
                for (int i = 0; i < wishlistArray.length(); i++) {
                    Book book = new Book();
                    book.setId(wishlistArray.optInt(i));
                    wishlistList.add(book);
                }
            }

            this.setWishlist(wishlistList);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        return this;
    }

    public static String getAccessToken(Context context) {
        String url = context.getString(R.string.api_url) + "/api/token/refresh/";
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        BlockingQueue<String> tokenQueue = new LinkedBlockingQueue<>();
        JSONObject jsonBody = new JSONObject();

        try {
            jsonBody.put("refresh", User.getAuthenticatedUser().getRefreshToken());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonBody,
                response -> {
                    try {
                        if (response.has("access")) {
                            tokenQueue.add(response.getString("access"));
                        } else {
                            Intent intent = new Intent(((Activity) context), LoginActivity.class);
                            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                            showToast(context, "Login expirado!");
                            showToast(context, response.toString());
                            ((Activity) context).startActivity(intent);
                            tokenQueue.add(null);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                },
                error -> handleErrorResponse(error, context)) {
        };
        requestQueue.add(request);

        try {
            return tokenQueue.poll(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            e.printStackTrace();
            return null;
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public List<Book> getWishlist(Context context) {
        for (Book book : this.wishlist) {
            book.getBookById(context);
        }
        return this.wishlist;
    }

    public User update(User user, Context context) {
        if (this.id < 0) {
            showToast(context, "Usuário não definido!");
            return null;
        }
        return this.update(this.id, user, context);
    }

    public User update(int id, User user, Context context) {
        this.username = user.username != null ? user.username : this.username;
        this.lastName = user.lastName != null ? user.lastName : this.lastName;
        this.firstName = user.firstName != null ? user.firstName : this.firstName;
        /* this.photo = user.photo != null ? user.photo : this.photo; */
        this.phone = user.phone != null ? user.phone : this.phone;
        this.email = user.email != null ? user.email : this.email;
        this.biography = user.biography != null ? user.biography : this.biography;

        this.address = new Address(
                user.getAddress() != null && user.getAddress().getStreet() != null ? user.getAddress().getStreet() : this.getAddress().getStreet(),
                user.getAddress() != null && user.getAddress().getCity() != null ? user.getAddress().getCity() : this.getAddress().getCity(),
                user.getAddress() != null && user.getAddress().getDistrict() != null ? user.getAddress().getDistrict() : this.getAddress().getDistrict(),
                user.getAddress() != null && user.getAddress().getHouseNumber() != null ? user.getAddress().getHouseNumber() : this.getAddress().getHouseNumber(),
                user.getAddress() != null && user.getAddress().getState() != null ? user.getAddress().getState() : this.getAddress().getState(),
                user.getAddress() != null && user.getAddress().getPostalCode() != null ? user.getAddress().getPostalCode() : this.getAddress().getPostalCode(),
                user.getAddress() != null && user.getAddress().getLat() != null ? user.getAddress().getLat() : this.getAddress().getLat(),
                user.getAddress() != null && user.getAddress().getLon() != null ? user.getAddress().getLon() : this.getAddress().getLon()
        );

        String url = context.getString(R.string.api_url) + "/api/user/" + Integer.toString(id) + "/";
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

        BlockingQueue<User> userQueue = new LinkedBlockingQueue<>();
        JSONObject jsonBody = new JSONObject();

        try {
            jsonBody.put("username", user.getUsername() != null ? user.getUsername() : JSONObject.NULL);
            jsonBody.put("last_name", user.getLastName() != null ? user.getLastName() : JSONObject.NULL);
            jsonBody.put("first_name", user.getFirstName() != null ? user.getFirstName() : JSONObject.NULL);
            /*jsonBody.put("photo", user.getPhoto() != null ? user.getPhoto() : JSONObject.NULL);*/
            jsonBody.put("phone", user.getPhone() != null ? user.getPhone() : JSONObject.NULL);
            jsonBody.put("email", user.getEmail() != null ? user.getEmail() : JSONObject.NULL);
            jsonBody.put("biography", user.getBiography() != null ? user.getBiography() : JSONObject.NULL);
            jsonBody.put("street", user.getAddress() != null && user.getAddress().getStreet() != null ? user.getAddress().getStreet() : JSONObject.NULL);
            jsonBody.put("city", user.getAddress() != null && user.getAddress().getCity() != null ? user.getAddress().getCity() : JSONObject.NULL);
            jsonBody.put("district", user.getAddress() != null && user.getAddress().getDistrict() != null ? user.getAddress().getDistrict() : JSONObject.NULL);
            jsonBody.put("house_number", user.getAddress() != null && user.getAddress().getHouseNumber() != null ? user.getAddress().getHouseNumber() : JSONObject.NULL);
            jsonBody.put("state", user.getAddress() != null && user.getAddress().getState() != null ? user.getAddress().getState() : JSONObject.NULL);
            jsonBody.put("postal_code", user.getAddress() != null && user.getAddress().getPostalCode() != null ? user.getAddress().getPostalCode() : JSONObject.NULL);
            jsonBody.put("lat", user.getAddress() != null && user.getAddress().getLat() != null ? user.getAddress().getLat() : JSONObject.NULL);
            jsonBody.put("lon", user.getAddress() != null && user.getAddress().getLon() != null ? user.getAddress().getLon() : JSONObject.NULL);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, url, jsonBody,
                response -> {
                    if (response.has("id")) {
                        userQueue.add(user);
                    } else {
                        showToast(context, "Erro atualizando usuário!");
                        Log.e("Getting user", "Erro atualizando usuário!");
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
            return userQueue.poll(30, TimeUnit.SECONDS); // Ajuste o tempo limite conforme necessário
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            e.printStackTrace();
            return null;
        }
    }
    public User save(Context context) {
        return User.save(this, context);
    }

    public static User save(User user, Context context) {
        String url = context.getString(R.string.api_url) + "/api/user/";
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        BlockingQueue<User> userQueue = new LinkedBlockingQueue<>();
        JSONObject jsonBody = new JSONObject();

        try {
            jsonBody.put("email", user.email);
            jsonBody.put("username", user.username);
            jsonBody.put("password", user.password);
            jsonBody.put("first_name", user.firstName);
            jsonBody.put("last_name", user.lastName);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonBody,
                response -> {
                    if (response.has("id")) {
                        Intent intent = new Intent(((Activity) context), HomeActivity.class);
                        intent.putExtra("user", response.toString());
                        ((Activity) context).startActivity(intent);
                    }
                },
                error -> handleErrorResponse(error, context));
        requestQueue.add(request);

        try {
            return userQueue.poll(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            e.printStackTrace();
            return null;
        }
    }

    public List<Book> getWishlist() {
        return wishlist;
    }

    public void setWishlist(List<Book> wishlist) {
        this.wishlist = wishlist;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDateJoined() {
        return dateJoined;
    }

    public void setDateJoined(String dateJoined) {
        this.dateJoined = dateJoined;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
