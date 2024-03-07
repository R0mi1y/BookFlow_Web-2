package com.room.bookflow.models;

import static com.room.bookflow.helpers.Utilitary.handleErrorResponse;
import static com.room.bookflow.helpers.Utilitary.showToast;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.room.bookflow.R;
import com.room.bookflow.activities.HomeActivity;
import com.room.bookflow.activities.LoginActivity;
import com.room.bookflow.BookFlowDatabase;

import org.json.JSONArray;

import org.json.JSONException;
import org.json.JSONObject;

@Entity(tableName = "user_table", foreignKeys = { @ForeignKey(
        entity = Address.class,
        parentColumns = {"id"},
        childColumns = {"address_id"},
        onDelete = ForeignKey.CASCADE,
        onUpdate = ForeignKey.CASCADE
)})
public class User {
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "id")
    private int id = -1;

    private String refreshToken;
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
    @NonNull
    private long address_id;

    @Ignore
    private List<Integer> abstract_wishlist;

    @Ignore
    private List<Book> wishlist;
    @Ignore
    private Address address;

    public User(){
        this.wishlist = new ArrayList<>();
    }

    public User getUserById(Context context) {
        if (this.id == -1) return null;
        return this.getUserById(this.id, context);
    }

    public static User getAuthenticatedUser(Context context){
        BookFlowDatabase userDatabase = BookFlowDatabase.getDatabase(context);
        User user = userDatabase.userDao().getFirst();
        return user;
    }

    public User getUserById(int id, Context context) {
        String url = context.getString(R.string.api_url) + "/api/user/" + id + "/";
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String authToken = User.getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(context, LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            showToast(context, "Login expirado!");
            context.startActivity(intent);
            return null;
        }

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + authToken);

        BlockingQueue<User> userQueue = new LinkedBlockingQueue<>();

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
                    if (response.has("id")) {
                        this.setByJSONObject(response, context);
                        userQueue.add(this);
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
            this.refreshToken = response.has("refresh_token") && !response.isNull("refresh_token") ? response.getString("refresh_token") : null;

            JSONArray wishlistArray = response.getJSONArray("wishlist");
            List<Integer> abstractWishlist = new ArrayList<>();

            for (int i = 0; i < wishlistArray.length(); i++) {
                abstractWishlist.add(wishlistArray.getInt(i));
            }

            this.address = new Address(
                    response.has("street") ? response.optString("street", null) : null,
                    response.has("city") ? response.optString("city", null) : null,
                    response.has("district") ? response.optString("district", null) : null,
                    response.has("house_number") ? response.optString("house_number", null) : null,
                    response.has("state") ? response.optString("state", null) : null,
                    response.has("postal_code") ? response.optString("postal_code", null) : null,
                    response.has("lat") ? response.optString("lat", null) : null,
                    response.has("lon") ? response.optString("lon", null) : null
            );

            List<Book> wishlistList = new ArrayList<>();

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
            jsonBody.put("refresh", User.getAuthenticatedUser(context).getRefreshToken());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonBody,
                response -> {
                    try {
                        if (response.has("access")) {
                            tokenQueue.add(response.getString("access"));
                        } else {
                            Intent intent = new Intent(context, LoginActivity.class);
                            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                            showToast(context, "Login expirado!");
                            showToast(context, response.toString());
                            context.startActivity(intent);
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

    public long getAddress_id() {
        return address_id;
    }

    public void setAddress_id(long address_id) {
        this.address_id = address_id;
    }

    public List<Integer> getAbstract_wishlist() {
        return abstract_wishlist;
    }

    public void setAbstract_wishlist(List<Integer> abstract_wishlist) {
        this.abstract_wishlist = abstract_wishlist;
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

    public void update(int id, User user, Context context, UpdateUserCallback callback) {
        if (id < 0) {
            showToast(context, "Usuário não definido!");
            if (callback != null) {
                callback.onError();
            }
            return;
        }

        String url = context.getString(R.string.api_url) + "/api/user/" + id + "/";
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String authToken = getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(context, LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            showToast(context, "Login expirado!");
            context.startActivity(intent);
            if (callback != null) {
                callback.onError();
            }
            return;
        }

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + authToken);

        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("username", user.getUsername());
            jsonBody.put("phone", user.getPhone());
            jsonBody.put("email", user.getEmail());
            jsonBody.put("biography", user.getBiography());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, url, jsonBody,
                response -> {
                    if (response.has("id")) {
                        // Atualização bem-sucedida
                        if (callback != null) {
                            callback.onSuccess(new User().setByJSONObject(response,context));

                        }
                    } else {
                        // Erro ao atualizar usuário
                        showToast(context, "Erro atualizando usuário!");
                        Log.e("Updating user", "Erro atualizando usuário!");
                        if (callback != null) {
                            callback.onError();
                        }
                    }
                },
                error -> {
                    // Erro na solicitação
                    handleErrorResponse(error, context);
                    if (callback != null) {
                        callback.onError();
                    }
                }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                return headers;
            }
        };
        requestQueue.add(request);
    }

    // Interface para lidar com callbacks de atualização do usuário
    public interface UpdateUserCallback {
        void onSuccess(User updatedUser);
        void onError();
    }

    // Método update sem callback
    public User update(User user, Context context) {
        if (this.id < 0) {
            showToast(context, "Usuário não definido!");
            return null;
        }
        // Chamando o método com callback, mas ignorando o callback aqui
        update(this.id, user, context, null);
        return user;
    }


    public void updateLocate(int id, User user, Context context, UpdateUserLocateCallback callback) {
        if (id < 0) {
            showToast(context, "Usuário não definido!");
            if (callback != null) {
                callback.onError();
            }
            return;
        }

        String url = context.getString(R.string.api_url) + "/api/user/" + id + "/";
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String authToken = getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(context, LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            showToast(context, "Login expirado!");
            context.startActivity(intent);
            if (callback != null) {
                callback.onError();
            }
            return;
        }

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + authToken);

        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("street", user.getAddress().getStreet());
            jsonBody.put("house_number", user.getAddress().getHouseNumber());
            jsonBody.put("city", user.getAddress().getCity());
            jsonBody.put("district", user.getAddress().getDistrict());
            jsonBody.put("state", user.getAddress().getState());
            jsonBody.put("postal_code", user.getAddress().getPostalCode());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, url, jsonBody,
                response -> {
                    if (response.has("id")) {
                        // Atualização bem-sucedida
                        if (callback != null) {
                            callback.onSuccess(new User().setByJSONObject(response,context));
                        }
                    } else {
                        // Erro ao atualizar usuário
                        showToast(context, "Erro atualizando usuário!");
                        Log.e("Updating user", "Erro atualizando usuário!");
                        if (callback != null) {
                            callback.onError();
                        }
                    }
                },
                error -> {
                    // Erro na solicitação
                    handleErrorResponse(error, context);
                    if (callback != null) {
                        callback.onError();
                    }
                }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                return headers;
            }
        };
        requestQueue.add(request);
    }

    // Interface para lidar com callbacks de atualização do usuário
    public interface UpdateUserLocateCallback {
        void onSuccess(User updatedUser);
        void onError();
    }

    // Método update sem callback
    public User updateLocate(User user, Context context) {
        if (this.id < 0) {
            showToast(context, "Usuário não definido!");
            return null;
        }
        // Chamando o método com callback, mas ignorando o callback aqui
        update(this.id, user, context, null);
        return user;
    }




    //    public User update(int id, User user, Context context) {
//        this.username = user.username != null ? user.username : this.username;
////        this.lastName = user.lastName != null ? user.lastName : this.lastName;
////        this.firstName = user.firstName != null ? user.firstName : this.firstName;
//        /* this.photo = user.photo != null ? user.photo : this.photo; */
//        this.phone = user.phone != null ? user.phone : this.phone;
//        this.email = user.email != null ? user.email : this.email;
//        this.biography = user.biography != null ? user.biography : this.biography;
//
////        if (user.getAddress() != null) {
////            if (this.address == null) {
////                this.address = new Address();
////            }
////
////            this.address.setStreet(user.getAddress().getStreet() != null ? user.getAddress().getStreet() : this.address.getStreet());
////            this.address.setCity(user.getAddress().getCity() != null ? user.getAddress().getCity() : this.address.getCity());
////            this.address.setDistrict(user.getAddress().getDistrict() != null ? user.getAddress().getDistrict() : this.address.getDistrict());
////            this.address.setHouseNumber(user.getAddress().getHouseNumber() != null ? user.getAddress().getHouseNumber() : this.address.getHouseNumber());
////            this.address.setState(user.getAddress().getState() != null ? user.getAddress().getState() : this.address.getState());
////            this.address.setPostalCode(user.getAddress().getPostalCode() != null ? user.getAddress().getPostalCode() : this.address.getPostalCode());
////            this.address.setLat(user.getAddress().getLat() != null ? user.getAddress().getLat() : this.address.getLat());
////            this.address.setLon(user.getAddress().getLon() != null ? user.getAddress().getLon() : this.address.getLon());
////        }
//
//        String url = context.getString(R.string.api_url) + "/api/user/" + Integer.toString(id) + "/";
//        RequestQueue requestQueue = Volley.newRequestQueue(context);
//
//        String authToken = User.getAccessToken(context);
//
//        if (authToken == null) {
//            Intent intent = new Intent(((Activity) context), LoginActivity.class);
//            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
//            showToast(context, "Login expirado!");
//            ((Activity) context).startActivity(intent);
//            return null;
//        }
//
//        Map<String, String> headers = new HashMap<>();
//        headers.put("Authorization", "Bearer " + authToken);
//
//        BlockingQueue<User> userQueue = new LinkedBlockingQueue<>();
//        JSONObject jsonBody = new JSONObject();
//
//        try {
//            jsonBody.put("username", user.getUsername() != null ? user.getUsername() : JSONObject.NULL);
////            jsonBody.put("last_name", user.getLastName() != null ? user.getLastName() : JSONObject.NULL);
////            jsonBody.put("first_name", user.getFirstName() != null ? user.getFirstName() : JSONObject.NULL);
//            /*jsonBody.put("photo", user.getPhoto() != null ? user.getPhoto() : JSONObject.NULL);*/
//            jsonBody.put("phone", user.getPhone() != null ? user.getPhone() : JSONObject.NULL);
//            jsonBody.put("email", user.getEmail() != null ? user.getEmail() : JSONObject.NULL);
//            jsonBody.put("biography", user.getBiography() != null ? user.getBiography() : JSONObject.NULL);
////            jsonBody.put("street", user.getAddress() != null && user.getAddress().getStreet() != null ? user.getAddress().getStreet() : JSONObject.NULL);
////            jsonBody.put("city", user.getAddress() != null && user.getAddress().getCity() != null ? user.getAddress().getCity() : JSONObject.NULL);
////            jsonBody.put("district", user.getAddress() != null && user.getAddress().getDistrict() != null ? user.getAddress().getDistrict() : JSONObject.NULL);
////            jsonBody.put("house_number", user.getAddress() != null && user.getAddress().getHouseNumber() != null ? user.getAddress().getHouseNumber() : JSONObject.NULL);
////            jsonBody.put("state", user.getAddress() != null && user.getAddress().getState() != null ? user.getAddress().getState() : JSONObject.NULL);
////            jsonBody.put("postal_code", user.getAddress() != null && user.getAddress().getPostalCode() != null ? user.getAddress().getPostalCode() : JSONObject.NULL);
////            jsonBody.put("lat", user.getAddress() != null && user.getAddress().getLat() != null ? user.getAddress().getLat() : JSONObject.NULL);
////            jsonBody.put("lon", user.getAddress() != null && user.getAddress().getLon() != null ? user.getAddress().getLon() : JSONObject.NULL);
//        } catch (JSONException e) {
//            e.printStackTrace();
//        }
//
//        JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, url, jsonBody,
//                response -> {
//                    if (response.has("id")) {
//                        userQueue.add(user);
//                    } else {
//                        showToast(context, "Erro atualizando usuário!");
//                        Log.e("Getting user", "Erro atualizando usuário!");
//                    }
//                },
//                error -> handleErrorResponse(error, context)) {
//            @Override
//            public Map<String, String> getHeaders() throws AuthFailureError {
//                return headers;
//            }
//        };
//        requestQueue.add(request);
//
//        try {
//            return userQueue.poll(30, TimeUnit.SECONDS); // Ajuste o tempo limite conforme necessário
//        } catch (InterruptedException e) {
//            showToast(context, "Conexão perdida!");
//            e.printStackTrace();
//            return null;
//        }
//    }
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
                        Intent intent = new Intent(context, HomeActivity.class);
                        intent.putExtra("user", response.toString());
                        context.startActivity(intent);
                        userQueue.add(user);
                    }
                },
                error -> {
                    handleErrorResponse(error, context);
                    userQueue.add(new User());
                });
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
