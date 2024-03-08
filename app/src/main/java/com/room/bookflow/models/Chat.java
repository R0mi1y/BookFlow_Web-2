package com.room.bookflow.models;

import static com.room.bookflow.helpers.Utilitary.handleErrorResponse;
import static com.room.bookflow.helpers.Utilitary.popUp;
import static com.room.bookflow.helpers.Utilitary.showToast;
import static com.room.bookflow.helpers.Utilitary.isNetworkAvailable;

import android.content.Context;
import android.content.Intent;
import android.util.Log;


import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.room.bookflow.R;
import com.room.bookflow.activities.LoginActivity;
import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.helpers.DateConverter;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

@Entity(tableName = "chat_table")
@TypeConverters(DateConverter.class)
public class Chat {
    @NonNull
    @PrimaryKey(autoGenerate = true)
    private int id;
    private int receiver_id;
    @Ignore
    private User receiver;
    @Ignore
    private List<Message> messages;

    public Chat() {
    }

    public Chat(int receiver_id) {
        this.receiver_id = receiver_id;
        this.receiver = new User();
        this.receiver.setId(receiver_id);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public int getReceiver_id() {
        return receiver_id;
    }

    public void setReceiver_id(int receiver_id) {
        this.receiver_id = receiver_id;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public boolean startChat(Context context, int reciver_id) {
        BookFlowDatabase db = BookFlowDatabase.getDatabase(context);
        if (!isNetworkAvailable(context)) {
            Log.w("CHAT", "Conexão perdida!");
            popUp("Error", "Conexão perdida!", context);
            return false;
        }
        this.receiver = new User();
        this.receiver = this.receiver.getUserById(reciver_id, context).removeId();

        User user1 = db.userDao().getByUsername(this.receiver.getUsername());

        if (user1 == null){
            long addressId = db.addressDao().insert(this.receiver.getAddress());
            this.receiver.setAddress_id(addressId);
            this.receiver.setIs_autenticated(false);
            long userId = db.userDao().insert(this.receiver);
        }

        return true;
    }

    public boolean sentMessage(Context context, int reciver_id) {
        String url = context.getString(R.string.api_url) + "/api/message/";
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String authToken = User.getAccessToken(context);

        if (authToken == null) {
            Intent intent = new Intent(context, LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            showToast(context, "Login expirado!");
            context.startActivity(intent);
            return false;
        }

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + authToken);

        BlockingQueue<Boolean> chatQueue = new LinkedBlockingQueue<>();

        JSONObject jsonBody = new JSONObject();

        try {
            jsonBody.put("reciver", reciver_id > -1 ? reciver_id : JSONObject.NULL);
            jsonBody.put("sender", User.getAuthenticatedUser(context).getId() != -1 ? User.getAuthenticatedUser(context).getId() : JSONObject.NULL);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonBody,
                response -> {
                    if (response.has("id")) {
                        chatQueue.add(true);
                    } else {
                        showToast(context, "Erro requisitando chat!");
                        Log.e("Getting user", "Erro requisitando chat!");
                    }
                },
                error -> {
                    handleErrorResponse(error, context);
                    chatQueue.add(false);
                }) {
            @Override
            public Map<String, String> getHeaders() {
                return headers;
            }
        };
        requestQueue.add(request);

        try {
            return chatQueue.poll(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            e.printStackTrace();
            return false;
        }
    }

    public List<Message> updateChat(Context context, long chat_id) {
        if (!isNetworkAvailable(context)) {
            Log.w("CHAT", "Conexão perdida!");
            return null;
        }

        BookFlowDatabase database = BookFlowDatabase.getDatabase(context);
        Chat chat = database.chatDao().getById(chat_id);

        List<Message> unsentMessages = database.messageDao().getMessageByChatIdStatus(chat_id, Message.STATUS_ERROR_SENT);

        if (unsentMessages.size() > 0) {
            if (Message.sendMessages(context, unsentMessages)){
                for (Message message : unsentMessages) {
                    database.messageDao().markAsSent(message.getId());
                }
            }
        }

        unsentMessages = database.messageDao().getMessageByChatIdStatus(chat_id, Message.STATUS_UNSENT);
        if (unsentMessages.size() > 0) {
            if (Message.sendMessages(context, unsentMessages)){
                for (Message message : unsentMessages) {
                    database.messageDao().markAsSent(message.getId());
                }
            }
        }

        List<Message> recived = Message.getMessagesSentToMe(context, chat.receiver_id);

        for(Message messageRecived : recived) {
            messageRecived.setStatus(Message.STATUS_RECIVED);
            messageRecived.setChat_id((int) chat_id);
            database.messageDao().insert(messageRecived);
        }

        return recived;
    }

}

