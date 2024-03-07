package com.room.bookflow.data.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.room.bookflow.data.models.Address;
import com.room.bookflow.data.models.Chat;

import java.util.List;

@Dao
public interface ChatDao {
    @Query("SELECT * FROM chat_table")
    public List<Chat> getAllChat();

    @Query("Select * FROM chat_table WHERE id==:id")
    public Chat getById(long id);

    @Query("DELETE FROM chat_table WHERE 1")
    public void delAll();

    @Insert
    public long insert(Chat chat);

    @Delete
    public void delete(Chat chat);

    @Update
    public void update(Chat chat);
}
