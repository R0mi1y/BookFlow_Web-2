package com.room.bookflow.data;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.room.bookflow.data.dao.AddressDao;
import com.room.bookflow.data.dao.BookDao;
import com.room.bookflow.data.dao.ChatDao;
import com.room.bookflow.data.dao.UserDao;
import com.room.bookflow.data.models.Address;
import com.room.bookflow.data.models.User;

@Database(entities = {Address.class, User.class}, version = 2)
public abstract class BookFlowDatabase extends RoomDatabase {
    /*public abstract MessageDao messageDao();*/
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
