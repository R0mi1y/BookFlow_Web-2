package com.room.bookflow.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.room.bookflow.models.Chat;

import java.util.List;

@Dao
public interface ChatDao {
    @Query("SELECT * FROM chat_table WHERE receiver_id=:reciver_id")
    public Chat getByReciver(int reciver_id);

    @Query("SELECT * FROM chat_table")
    public List<Chat> getAllChat();

    @Query("SELECT message FROM message_table WHERE chat_id=:chat_id ORDER BY id DESC LIMIT 1")
    public String getLastMessage(int chat_id);

    @Query("Select * FROM chat_table WHERE id==:id LIMIT 1")
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
