package com.room.bookflow.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.room.bookflow.R;
import com.room.bookflow.models.Book;

import java.util.List;

public class CardSideBookAdapter extends RecyclerView.Adapter<CardSideBookAdapter.ViewHolder> {

    private List<Book> bookList;
    private Context context;

    public CardSideBookAdapter(List<Book> bookList, Context context) {
        this.bookList = bookList;
        this.context = context;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(this.context).inflate(R.layout.book_card_side_adapter, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Book item = bookList.get(position);
        holder.textViewItem.setText(item.getTitle());
    }

    @Override
    public int getItemCount() {
        return bookList.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView textViewItem;

        public ViewHolder(View view) {
            super(view);
            textViewItem = view.findViewById(R.id.title);
        }
    }
}
