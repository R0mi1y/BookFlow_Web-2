package com.room.bookflow.adapters;

import static com.room.bookflow.helpers.Utilitary.isNetworkAvailable;
import static com.room.bookflow.helpers.Utilitary.popUp;

import android.app.Activity;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;
import com.room.bookflow.activities.DetailBook;
import com.room.bookflow.models.Notification;

import java.util.List;

public class NotificationAdapter extends RecyclerView.Adapter<NotificationAdapter.ViewHolder> {

    private List<Notification> notificationList;
    private Activity context;
    private int itemLayoutId;
    BookFlowDatabase db;

    public NotificationAdapter(List<Notification> notificationList, int itemLayoutId, Activity context) {
        this.notificationList = notificationList;
        this.context = context;
        this.itemLayoutId = itemLayoutId;
        this.db = BookFlowDatabase.getDatabase(context);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(itemLayoutId, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Notification notification = notificationList.get(position);

        holder.title.setText(notification.getTitle());
        holder.message.setText(notification.getMessage());

        if (notification.isVisualized()) {
            holder.title.setTextColor(context.getColor(R.color.dark_color_begie));
            holder.message.setTextColor(context.getColor(R.color.dark_color_begie));
            holder.line.setBackground(context.getDrawable(R.color.dark_color_begie));
        }

        if (notification.getFrom().contains("bookPage")) {
            holder.layoutBook.setOnClickListener(v -> {
                if(isNetworkAvailable(context)) {
                    Intent intent = new Intent(context, DetailBook.class);
                    intent.putExtra("bookId", notification.getFrom().split("::")[1]);
                    context.startActivity(intent);
                } else {
                    popUp("Erro", "Você precisa ter conexão com a internet para acessar os detalhes desse livro!", context);
                }
            });
        } else if (notification.getFrom().contains("chatPage")) {
            holder.layoutBook.setOnClickListener(v -> {
                new Thread(() -> {
                    Intent intent = new Intent(context, DetailBook.class);
                    int reciver_id = Integer.parseInt(notification.getFrom().split("::")[1]);
                    int chat_id = db.chatDao().getByReciver(reciver_id).getId();

                    intent.putExtra("chatId", chat_id);
                    context.startActivity(intent);
                }).start();
            });
        }
    }

    @Override
    public int getItemCount() {
        return notificationList.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView title, message;
        public LinearLayout layoutBook;
        public View line;

        public ViewHolder(View view) {
            super(view);
            line = view.findViewById(R.id.line);
            title = view.findViewById(R.id.title);
            message = view.findViewById(R.id.message);
            layoutBook = view.findViewById(R.id.layoutCard);
        }
    }
}
