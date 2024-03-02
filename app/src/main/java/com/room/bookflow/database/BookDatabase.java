package com.room.bookflow.database;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.room.bookflow.dao.BookDao;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.User;

@Database(entities = {Book.class, User.class}, version = 1)
public abstract class BookDatabase extends RoomDatabase {
    public abstract BookDao getDao();
    private static volatile BookDatabase INSTANCE;

    public static BookDatabase getDatabase(final Context context) {
        if (INSTANCE == null) {
            synchronized (BookDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    BookDatabase.class, "book_flow")
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}
