package com.room.bookflow.workers;

import static com.room.bookflow.helpers.Utilitary.isNetworkAvailable;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Handler;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;
import com.room.bookflow.activities.SplashActivity;
import com.room.bookflow.models.Chat;
import com.room.bookflow.models.User;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class NotificationWorker extends Worker {
    private BookFlowDatabase bookFlowDatabase;
    private Context context;
    public NotificationWorker(
            @NonNull Context context,
            @NonNull WorkerParameters params) {
        super(context, params);
        bookFlowDatabase = BookFlowDatabase.getDatabase(context);
    }

    @NonNull
    @Override
    public Result doWork() {
        new Thread(() -> {
            while (true) {
                try {
                    verificarNotificacoesDoServidor();
                    Thread.sleep(5000);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();

        return Result.success();
    }

    private void verificarNotificacoesDoServidor() {
        if (!isNetworkAvailable(this.getApplicationContext())) return;
        try {
            User ua = User.getAuthenticatedUser(getApplicationContext());
            if (ua == null || ua.getId() == -1) return;

            String url = this.getApplicationContext().getString(R.string.api_url) + "/api/user/" + User.getAuthenticatedUser(getApplicationContext()).getId() + "/notifications";
            RequestQueue requestQueue = Volley.newRequestQueue(this.getApplicationContext());

            for (Chat chat: bookFlowDatabase.chatDao().getAllChat()) {
                chat.updateChat(this.getApplicationContext(), chat.getId());
            }

            String authToken = User.getAccessToken(getApplicationContext(), false);

            Map<String, String> headers = new HashMap<>();
            headers.put("Authorization", "Bearer " + authToken);

            JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(
                    Request.Method.GET,
                    url,
                    null,
                    notificationsArray -> {
                        Log.e("title", Integer.toString(notificationsArray.length()));

                        for (int i = 0; i < notificationsArray.length(); i++) {
                            Log.e("title", "title");
                            try {
                                JSONObject notificationObject = notificationsArray.getJSONObject(i);

                                String from = notificationObject.getString("from_field");
                                String message = notificationObject.getString("message");
                                String title = notificationObject.getString("title");
                                String description = notificationObject.getString("description");
                                int id = notificationObject.getInt("id");
                                makeNotification(from, message, title, description, id);

                                Log.e("title", title);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    },
                    error -> Log.e("Requisição GET", "Erro: " + error.toString())
            ) {
                @Override
                public Map<String, String> getHeaders() {
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

        NotificationManager notificationManager = (NotificationManager) this.getApplicationContext().getSystemService(this.getApplicationContext().NOTIFICATION_SERVICE);

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