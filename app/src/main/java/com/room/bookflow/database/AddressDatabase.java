package com.room.bookflow.database;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.room.bookflow.dao.AddressDao;
import com.room.bookflow.dao.UserDao;
import com.room.bookflow.models.Address;
import com.room.bookflow.models.User;

@Database(entities = {Address.class, User.class}, version = 1)
public abstract class AddressDatabase extends RoomDatabase {
    public abstract AddressDao getDao();
    private static volatile AddressDatabase INSTANCE;

    public static AddressDatabase getDatabase(final Context context) {
        if (INSTANCE == null) {
            synchronized (AddressDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    AddressDatabase.class, "book_flow")
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}
