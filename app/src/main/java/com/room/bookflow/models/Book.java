package com.room.bookflow.models;

import static com.room.bookflow.components.Utilitary.handleErrorResponse;
import static com.room.bookflow.components.Utilitary.popUp;
import static com.room.bookflow.components.Utilitary.showToast;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import androidx.room.ColumnInfo;
import androidx.room.Embedded;
import androidx.room.Entity;
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
import com.room.bookflow.components.Utilitary;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.Url;

import java.io.File;

@Entity(tableName = "book_table")
public class Book {
    @ColumnInfo(name = "book_id")
    @PrimaryKey(autoGenerate = true)
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
    @Ignore
    private int ownerId = -1;
    @Embedded
    private User owner;

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Book() {
    }

    public Book(String cover, int id, String title, String author, String genre, String summary, String requirementsLoan, boolean availability) {
        this.id = id;
        this.ownerId = -1;
        this.cover = cover;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.summary = summary;
        this.requirementsLoan = requirementsLoan;
        this.availability = availability;
    }

    public Book(String cover, String title, String author, String genre, String summary, String requirementsLoan, boolean availability, int ownerId) {
        this.id = -1;
        this.ownerId = -1;
        this.cover = cover;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.summary = summary;
        this.requirementsLoan = requirementsLoan;
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

    public static List<Book> getAllBooks(Context context) {
        return Book.getAllBooks(context, null);
    }

    public static List<Book> getAllBooks(Context context, String filter) {
        return getAllBooks(context, filter, null);
    }

    public static List<Book> getAllBooks(Context context, String filter, String search) {
        String url = context.getString(R.string.api_url) + "/api/book/";

        if ("SEARCH".equals(filter)){
            url += "?search=" + search;
        } else {
            url += "user/" + User.getAuthenticatedUser(context).getId() + "?filter=" + (filter == null ? "ALL" : filter);
        }

        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String authToken = User.getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(context, LoginActivity.class);
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
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }

    public static Book getBookById(Context context, int id) {
        String url = context.getString(R.string.api_url) + "/api/book/" + id + "/";

        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String authToken = User.getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(context, LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            showToast(context, "Login expirado!");
            ((Activity) context).startActivity(intent);
            return null;
        }

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + authToken);
        List<Book> list = new ArrayList<>();
        BlockingQueue<Book> bookQueue = new LinkedBlockingQueue<>();

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
                    Book book = new Book().setByJSONObject(response, context);
                    bookQueue.add(book);
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
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
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
            this.ownerId = response.has("owner") ? response.getInt("owner") : -1;

            User u = new User();
            u.setId(this.ownerId);
            this.owner = u;

        } catch (JSONException e) {
            Log.e("error getting book", Objects.requireNonNull(e.getMessage()));
        }

        return this;
    }

    public Book registerBook(Context context) {
        try {
            return Book.registerBook(this, context);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static Book registerBook(Book book, Context context) throws IOException {
        return Book.registerBook(book, null, context);
    }
    
    public Book registerBook(File imageFile, Context context) {
        return Book.registerBook(this, imageFile, context);
    }

    public static Book registerBook(Book book, File image, Context context) {
        String authToken = User.getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(((Activity) context), LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            ((Activity) context).runOnUiThread(() -> Toast.makeText(context, "Login expirado!", Toast.LENGTH_SHORT).show());
            context.startActivity(intent);
            return null;
        }

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(context.getString(R.string.api_url))
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        BookApi bookApi = retrofit.create(BookApi.class);

        RequestBody tituloBody = createRequestBody(book.title);
        RequestBody autorBody = createRequestBody(book.author);
        int ownerId = User.getAuthenticatedUser(context).getId();
        RequestBody ownerBody = createRequestBody(String.valueOf(ownerId));
        RequestBody genreBody = createRequestBody(book.genre);
        RequestBody summaryBody = createRequestBody(book.summary);
        RequestBody requirementsLoanBody = createRequestBody(book.requirementsLoan);

        BlockingQueue<Book> bookQueue = new LinkedBlockingQueue<>();

        RequestBody imagemBody;
        Call<ResponseBody> call;
        if(image != null) {
            imagemBody = RequestBody.create(MediaType.parse("image/*"), image);
            MultipartBody.Part coverPart = MultipartBody.Part.createFormData("cover", image.getName(), imagemBody);
            call = bookApi.registerBook("Bearer " + authToken, tituloBody, autorBody, genreBody, summaryBody, requirementsLoanBody, ownerBody, coverPart);
        } else {
            call = bookApi.registerBook("Bearer " + authToken, tituloBody, autorBody, genreBody, summaryBody, requirementsLoanBody, ownerBody);
        }
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String json = response.body().string();

                        bookQueue.add(new Book().setByJSONObject(new JSONObject(json), context));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }

                    popUp("Sucesso!", "Livro cadastrado com sucesso", context);
                } else {
                    Log.e("RegisteringBook", response.toString());
                    popUp("Falha!", "Erro no servidor, tente novamente mais tarde!", context);
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.e("RegisteringBook", t.getMessage());
            }
        });

        try {
            return bookQueue.poll(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            e.printStackTrace();
            return null;
        }
    }

    public static Book updateBook(Book book, Context context) throws IOException {
        return Book.updateBook(book, null, context);
    }

    public Book updateBook(File imageFile, Context context) {
        return Book.updateBook(this, imageFile, context);
    }

    public static Book updateBook(Book book, File image, Context context) {
        String authToken = User.getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(((Activity) context), LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            ((Activity) context).runOnUiThread(() -> Toast.makeText(context, "Login expirado!", Toast.LENGTH_SHORT).show());
            context.startActivity(intent);
            return null;
        }

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(context.getString(R.string.api_url))
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        BookApi bookApi = retrofit.create(BookApi.class);

        RequestBody tituloBody = createRequestBody(book.title);
        RequestBody autorBody = createRequestBody(book.author);
        int ownerId = User.getAuthenticatedUser(context).getId();
        RequestBody ownerBody = createRequestBody(String.valueOf(ownerId));
        RequestBody genreBody = createRequestBody(book.genre);
        RequestBody summaryBody = createRequestBody(book.summary);
        RequestBody availabilityBody = createRequestBody(String.valueOf(book.availability));
        RequestBody requirementsLoanBody = createRequestBody(book.requirementsLoan);

        BlockingQueue<Book> bookQueue = new LinkedBlockingQueue<>();

        RequestBody imagemBody;
        Call<ResponseBody> call;
        if(image != null) {
            imagemBody = RequestBody.create(MediaType.parse("image/*"), image);
            MultipartBody.Part coverPart = MultipartBody.Part.createFormData("cover", image.getName(), imagemBody);
            call = bookApi.updateBook("api/book/" + book.id + "/","Bearer " + authToken, tituloBody, autorBody, genreBody, summaryBody, requirementsLoanBody, ownerBody, availabilityBody, coverPart);
        } else {
            call = bookApi.updateBook("api/book/" + book.id + "/", "Bearer " + authToken, tituloBody, autorBody, genreBody, summaryBody, requirementsLoanBody, ownerBody, availabilityBody);
        }
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String json = response.body().string();

                        bookQueue.add(new Book().setByJSONObject(new JSONObject(json), context));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }

                    popUp("Sucesso!", "Livro cadastrado com sucesso", context);
                } else {
                    try {
                        String errorBody = response.errorBody().string();
                        Log.e("RegisteringBook", errorBody);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                    popUp("Falha!", "Erro no servidor, tente novamente mais tarde!", context);
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.e("RegisteringBook", t.getMessage());
            }
        });

        try {
            return bookQueue.poll(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            e.printStackTrace();
            return null;
        }
    }

    private static RequestBody createRequestBody(String value) {
        return RequestBody.create(MediaType.parse("text/plain"), value);
    }
    private String bitmapToBase64(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        byte[] imageBytes = byteArrayOutputStream.toByteArray();
        return Base64.encodeToString(imageBytes, Base64.DEFAULT);
    }
}

interface BookApi {
    @Multipart
    @POST("api/book/")
    Call<ResponseBody> registerBook(
            @Header("Authorization") String authorizationHeader,
            @Part("title") RequestBody title,
            @Part("author") RequestBody author,
            @Part("genre") RequestBody genre,
            @Part("summary") RequestBody summary,
            @Part("requirements_loan") RequestBody requirements_loan,
            @Part("owner") RequestBody owner,
            @Part MultipartBody.Part cover
    );

    @Multipart
    @POST("api/book/")
    Call<ResponseBody> registerBook(
            @Header("Authorization") String authorizationHeader,
            @Part("title") RequestBody title,
            @Part("author") RequestBody author,
            @Part("genre") RequestBody genre,
            @Part("summary") RequestBody summary,
            @Part("requirements_loan") RequestBody requirements_loan,
            @Part("owner") RequestBody owner
    );

    @Multipart
    @PUT
    Call<ResponseBody> updateBook(
            @Url String url,
            @Header("Authorization") String authorizationHeader,
            @Part("title") RequestBody title,
            @Part("author") RequestBody author,
            @Part("genre") RequestBody genre,
            @Part("summary") RequestBody summary,
            @Part("requirements_loan") RequestBody requirements_loan,
            @Part("owner") RequestBody owner,
            @Part("availability") RequestBody availability,
            @Part MultipartBody.Part cover
    );

    @Multipart
    @PUT
    Call<ResponseBody> updateBook(
            @Url String url,
            @Header("Authorization") String authorizationHeader,
            @Part("title") RequestBody title,
            @Part("author") RequestBody author,
            @Part("genre") RequestBody genre,
            @Part("summary") RequestBody summary,
            @Part("requirements_loan") RequestBody requirements_loan,
            @Part("owner") RequestBody owner,
            @Part("availability") RequestBody availability
    );
}