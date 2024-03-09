package com.room.bookflow.models;

import static com.room.bookflow.helpers.Utilitary.handleErrorResponse;
import static com.room.bookflow.helpers.Utilitary.showToast;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.room.bookflow.R;
import com.room.bookflow.activities.LoginActivity;
import com.room.bookflow.helpers.DateConverter;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

@Entity(tableName="message_table", foreignKeys = {
        @ForeignKey(
                entity = Chat.class,
                parentColumns = {"id"},
                childColumns = {"chat_id"},
                onDelete = ForeignKey.CASCADE,
                onUpdate = ForeignKey.CASCADE
        )
})
@TypeConverters(DateConverter.class)
public class Message {
    @NonNull
    @PrimaryKey(autoGenerate = true)
    private int id;
    @NonNull
    private int chat_id;
    private String message;
    private int status;
    @Ignore
    private Chat chat;

    @Ignore
    public static final int STATUS_RECIVED = -2;
    @Ignore
    public static final int STATUS_SENT = 1;
    @Ignore
    public static final int STATUS_UNSENT = -1;
    @Ignore
    public static final int STATUS_ERROR_SENT = 0;

    public Message() {
    }

    public Message(int chat_id, String message, int status) {
        this.chat_id = chat_id;
        this.message = message;
        this.status = status;
        this.chat = new Chat();
        this.chat.setId(chat_id);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getChat_id() {
        return chat_id;
    }

    public void setChat_id(int chat_id) {
        this.chat_id = chat_id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    static boolean sendMessages(Context context, List<Message> messages) {
        return false;
    }

    public static List<Message> getMessagesSentToMe(Context context, int reciver_id){
        String url = context.getString(R.string.api_url) + "/api/user/" + reciver_id + "/messageboxes/";
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String authToken = User.getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(context, LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            showToast(context, "Login expirado!");
            context.startActivity(intent);
            return new ArrayList<>();
        }

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + authToken);

        BlockingQueue<List<Message>> queue = new LinkedBlockingQueue<>();

        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, url, null,
                response -> {
                    if (response.length() > 0) {
                        List<Message> messages = new ArrayList<>();
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                JSONObject jsonObject = response.getJSONObject(i);
                                Message message1 = new Message().setByJSONObject(jsonObject, context);
                                if (message1 != null) messages.add(message1);
                            } catch (JSONException e) {
                                Log.e("Error getting user", e.getMessage());
                            }
                        }
                        queue.add(messages);
                    } else {
                        Log.e("Getting user", "Nenhuma mensagem encontrada!");
                        queue.add(new ArrayList<>());
                    }
                },
                error -> {
                    handleErrorResponse(error, context);
                    queue.add(new ArrayList<Message>());
                }) {
            @Override
            public Map<String, String> getHeaders() {
                return headers;
            }
        };
        requestQueue.add(request);

        try {
            return queue.poll(30, TimeUnit.SECONDS); // Ajuste o tempo limite conforme necessário
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private Message setByJSONObject(JSONObject response, Context context) {
        try {
            this.status = response.has("status") ? response.getInt("status") : -1;
            this.message = response.has("message") ? response.getString("message") : null;
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        return this;
    }

}
