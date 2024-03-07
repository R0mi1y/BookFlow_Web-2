package com.room.bookflow.adapters;

import android.app.Activity;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.room.bookflow.R;
import com.room.bookflow.activities.DetailBook;
import com.room.bookflow.helpers.Utilitary;
import com.room.bookflow.models.Book;
import com.squareup.picasso.Picasso;

import java.util.List;

public class CardSideBookAdapter extends RecyclerView.Adapter<CardSideBookAdapter.ViewHolder> {

    private List<Book> bookList;
    private Activity context;
    private int adapter_view_id;

    public CardSideBookAdapter(List<Book> bookList, int adapter_view_id, Activity context) {
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
        Book book = bookList.get(position);
        holder.title.setText(Utilitary.getTextReduced(book.getTitle(), 30));
        holder.genre.setText(Utilitary.getTextReduced(book.getGenre(), 30));
        holder.avaliabilityIcon.setImageResource(book.isAvailability() ? R.drawable.avalible_bookmark : R.drawable.unvalible_bookmark);
        holder.favoriteIcon.setImageResource(book.isInWishlist() ? R.drawable.solarstarfilled : R.drawable.solarstaroutline);
        if (!(book.getCover() == null || book.getCover().equals("null"))) Picasso.get()
                .load(book.getCover().contains("http") ? book.getCover() : context.getString(R.string.api_url) + book.getCover())
                .into(holder.cover);
        holder.layoutBook.setOnClickListener(view -> {
            Intent intent = new Intent(context, DetailBook.class);
            intent.putExtra("bookId", String.valueOf(book.getId()));

            context.runOnUiThread(() -> {
                context.startActivity(intent);
            });

        });
    }

    @Override
    public int getItemCount() {
        return bookList.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView title, genre;
        public ImageView cover, avaliabilityIcon, favoriteIcon;
        public LinearLayout layoutBook;

        public ViewHolder(View view) {
            super(view);
            title = view.findViewById(R.id.title);
            genre = view.findViewById(R.id.genro);
            cover = view.findViewById(R.id.cover);
            layoutBook = view.findViewById(R.id.layoutCard);
            avaliabilityIcon = view.findViewById(R.id.avaliability_icon);
            favoriteIcon = view.findViewById(R.id.favorite_icon);
        }
    }
}
