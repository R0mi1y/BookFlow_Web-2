package com.room.bookflow;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.room.bookflow.dao.AddressDao;
import com.room.bookflow.dao.BookDao;
import com.room.bookflow.dao.ChatDao;
import com.room.bookflow.dao.MessageDao;
import com.room.bookflow.dao.UserDao;
import com.room.bookflow.models.Address;
import com.room.bookflow.models.Book;
import com.room.bookflow.models.Chat;
import com.room.bookflow.models.Message;
import com.room.bookflow.models.User;

@Database(entities={Address.class, User.class, Chat.class, Message.class, Book.class}, version=2)
public abstract class BookFlowDatabase extends RoomDatabase {
    public abstract MessageDao messageDao();
    public abstract UserDao userDao();
    public abstract AddressDao addressDao();
    public abstract BookDao bookDao();
    public abstract ChatDao chatDao();

    private static volatile BookFlowDatabase INSTANCE;

    public static BookFlowDatabase getDatabase(final Context context) {
        if (INSTANCE == null) {
            synchronized (BookFlowDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    BookFlowDatabase.class, "book_flow")
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}
