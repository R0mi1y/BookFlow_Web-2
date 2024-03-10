package com.room.bookflow.adapters;

import android.app.Activity;
import android.content.Intent;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.room.bookflow.BookFlowDatabase;
import com.room.bookflow.R;
import com.room.bookflow.activities.ChatActivity;
import com.room.bookflow.models.Chat;
import com.room.bookflow.models.Message;
import com.room.bookflow.models.User;
import com.squareup.picasso.Picasso;

import java.util.List;

public class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.ViewHolder>{
    private List<Chat> chatList;
    private Activity context;
    private BookFlowDatabase db;
    private int adapter_view_id;

    public ChatAdapter(List<Chat> chatList, int adapter_view_id, Activity context) {
        this.chatList = chatList;
        this.context = context;
        this.adapter_view_id = adapter_view_id;
        this.db = BookFlowDatabase.getDatabase(context);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(this.context).inflate(adapter_view_id, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        new Thread(() -> {
            Chat chat = chatList.get(position);
            String lastMessage = db.chatDao().getLastMessage(chat.getId());
            User reciver = db.userDao().getById(chat.getReceiver_id());
            context.runOnUiThread(() -> {
                //if (reciver != null) Picasso.get().load(reciver.getPhoto()).into(holder.perfil);
                holder.message.setText(lastMessage != null ? lastMessage : "");
                if (reciver != null) holder.username.setText(reciver.getUsername() != null ? reciver.getUsername() : "");
                holder.layout_foreground.setOnClickListener(v -> {
                    Intent intent = new Intent(context, ChatActivity.class);
                    intent.putExtra("chatId", chat.getId());
                    context.runOnUiThread(() -> context.startActivity(intent));
                });
            });
        }).start();
    }

    @Override
    public int getItemCount() {
        if (chatList != null) return chatList.size();
        else return 0;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView message, username;
        public ImageView perfil;
        public LinearLayout layout_foreground;

        public ViewHolder(View view) {
            super(view);
            message = view.findViewById(R.id.message_chat);
            username = view.findViewById(R.id.title_perfil);
            layout_foreground = view.findViewById(R.id.layout_card);
            // perfil = view.findViewById(R.id.image_perfil);
        }
    }
}
