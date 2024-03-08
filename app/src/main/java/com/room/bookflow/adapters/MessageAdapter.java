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
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.lifecycle.LiveData;
import androidx.recyclerview.widget.RecyclerView;

import com.room.bookflow.R;
import com.room.bookflow.activities.DetailBook;
import com.room.bookflow.helpers.Utilitary;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.Message;
import com.squareup.picasso.Picasso;

import java.util.List;

public class MessageAdapter extends RecyclerView.Adapter<MessageAdapter.ViewHolder>{
    private List<Message> messageList;
    private Activity context;
    private int adapter_view_id;

    public MessageAdapter(List<Message> bookList, int adapter_view_id, Activity context) {
        this.messageList = bookList;
        this.context = context;
        this.adapter_view_id = adapter_view_id;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(this.context).inflate(adapter_view_id, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Message message = messageList.get(position);
        holder.message.setText(message.getMessage());

        if (message.getStatus() == -2) {
            holder.layout_foreground.setGravity(Gravity.LEFT);
            holder.layout_foreground.setPadding(25, position == 0 ? 500 : 0 ,150, 10);
            holder.layout.setBackground(context.getDrawable(R.drawable.default_border_orange));
        } else {
            holder.layout_foreground.setGravity(Gravity.RIGHT);
            holder.layout_foreground.setPadding(150, 0 ,25, 10);
            holder.layout.setBackground(context.getDrawable(R.drawable.default_border_yellow));
        }
    }

    @Override
    public int getItemCount() {
        if (messageList != null) return messageList.size();
        else return 0;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView message;
        public ConstraintLayout layout;
        public LinearLayout layout_foreground;

        public ViewHolder(View view) {
            super(view);
            message = view.findViewById(R.id.message);
            layout = view.findViewById(R.id.layout);
            layout_foreground = view.findViewById(R.id.layout_foreground);
        }
    }
}
