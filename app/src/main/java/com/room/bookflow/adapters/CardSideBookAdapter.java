package com.room.bookflow.adapters;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.room.bookflow.R;
import com.room.bookflow.components.Utilitary;
import com.room.bookflow.models.Book;
import com.squareup.picasso.Picasso;

import java.util.List;

public class CardSideBookAdapter extends RecyclerView.Adapter<CardSideBookAdapter.ViewHolder> {

    private List<Book> bookList;
    private Context context;
    private int adapter_view_id;

    public CardSideBookAdapter(List<Book> bookList, int adapter_view_id, Context context) {
        this.bookList = bookList;
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
        Book item = bookList.get(position);
        holder.title.setText(Utilitary.getTextReduced(item.getTitle(), 30));
        holder.genre.setText(Utilitary.getTextReduced(item.getGenre(), 30));
        Picasso.get()
                .load(item.getCover().contains("http") ? item.getCover() : context.getString(R.string.api_url) + item.getCover())
                .into(holder.cover);

    }

    @Override
    public int getItemCount() {
        return bookList.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView title, genre;
        public ImageView cover;

        public ViewHolder(View view) {
            super(view);
            title = view.findViewById(R.id.title);
            genre = view.findViewById(R.id.genro);
            cover = view.findViewById(R.id.cover);
        }
    }
}
