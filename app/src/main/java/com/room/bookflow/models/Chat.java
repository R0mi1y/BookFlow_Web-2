package com.room.bookflow.models;

import static com.room.bookflow.helpers.Utilitary.handleErrorResponse;
import static com.room.bookflow.helpers.Utilitary.popUp;
import static com.room.bookflow.helpers.Utilitary.showToast;
import static com.room.bookflow.helpers.Utilitary.isNetworkAvailable;

import android.app.Activity;
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
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.room.bookflow.R;
import com.room.bookflow.activities.LoginActivity;
import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.activities.SplashActivity;
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

    public static boolean recoveryChats(Activity context) {
        User ua = User.getAuthenticatedUser(context);
        BookFlowDatabase db = BookFlowDatabase.getDatabase(context);

        String url = context.getString(R.string.api_url) + "/api/user/all_messages/";
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

        BlockingQueue<Boolean> messageQueue = new LinkedBlockingQueue<>();

        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, url, null,
                response -> {
                    if (response.length() > 0) {
                        new Thread(() -> {
                            for (int i = 0; i < response.length(); i++) {
                                try {
                                    JSONObject jsonObject = response.getJSONObject(i);
                                    int user_id;
                                    if (jsonObject.has("sender") && jsonObject.getInt("sender") == ua.getId()) {
                                        user_id = jsonObject.getInt("reciever");
                                    } else {
                                        user_id = jsonObject.getInt("sender");
                                    }

                                    User receiver = db.userDao().getById(user_id);
                                    if (receiver == null) {
                                        receiver = new User().getUserById(user_id, context);
                                        receiver.setAddress_id(db.addressDao().insert(receiver.getAddress()));
                                        db.userDao().insert(receiver);
                                    }

                                    Chat chat = db.chatDao().getByReciver(user_id);

                                    if (chat == null) {
                                        chat = new Chat(user_id);
                                        int chat_id = (int) db.chatDao().insert(chat);
                                    }
                                    chat.recoveryMessages(chat, context);
                                } catch (Exception e) {
                                    Log.e("Error getting user", e.getMessage());
                                }
                            }
                        }).start();
                        messageQueue.add(true);
                    } else {
                        Log.e("Getting user", "Nenhuma mensagem encontrada!");
                        messageQueue.add(false);
                    }
                },
                error -> {
                    handleErrorResponse(error, context);
                    messageQueue.add(false);
                }) {
            @Override
            public Map<String, String> getHeaders() {
                return headers;
            }
        };
        requestQueue.add(request);

        try {
            return messageQueue.poll(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            e.printStackTrace();
            return false;
        }
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
        this.receiver.setId(reciver_id);

        User user1 = db.userDao().getById(reciver_id);

        if (user1 == null){
            this.receiver.getUserById(context);
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
            return new ArrayList<>();
        }

        BookFlowDatabase database = BookFlowDatabase.getDatabase(context);
        Chat chat = database.chatDao().getById(chat_id);

        User reciver = database.userDao().getById(chat.getReceiver_id());
        if (reciver == null) {
            reciver = new User().getUserById(chat.getReceiver_id(), context);
            if (reciver != null) {
                int address_id = (int) database.addressDao().insert(reciver.getAddress());
                reciver.setAddress_id(address_id);
                database.userDao().insert(reciver);
            }
        }

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

    public void recoveryMessages(Chat chat, Context context) {
        new Thread(() -> {
            List<Message> messages1 = chat.getAllMessages(context, chat.getReceiver_id());
            BookFlowDatabase db = BookFlowDatabase.getDatabase(context);

            for (Message message : messages1) {
                try {
                    message.setChat_id(chat.getId());
                    db.messageDao().insert(message);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    private List<Message> getAllMessages(Context context, int receiver_id) {
        User ua = User.getAuthenticatedUser(context);

        String url = context.getString(R.string.api_url) + "/api/user/" + receiver_id + "/messages/";
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

        BlockingQueue<List<Message>> messageQueue = new LinkedBlockingQueue<>();

        JSONObject jsonBody = new JSONObject();

        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, url, null,
                response -> {
                    if (response.length() > 0) {
                        List<Message> messages = new ArrayList<>();
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                JSONObject jsonObject = response.getJSONObject(i);
                                Message message1 = new Message().setByJSONObject(jsonObject, ua, context);
                                if (message1 != null) messages.add(message1);
                            } catch (JSONException e) {
                                Log.e("Error getting user", e.getMessage());
                            }
                        }
                        messageQueue.add(messages);
                    } else {
                        Log.e("Getting user", "Nenhuma mensagem encontrada!");
                        messageQueue.add(new ArrayList<>());
                    }
                },
                error -> {
                    handleErrorResponse(error, context);
                    messageQueue.add(new ArrayList<>());
                }) {
            @Override
            public Map<String, String> getHeaders() {
                return headers;
            }
        };
        requestQueue.add(request);

        try {
            return messageQueue.poll(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            showToast(context, "Conexão perdida!");
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}

