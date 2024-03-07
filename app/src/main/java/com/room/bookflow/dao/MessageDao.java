package com.room.bookflow.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.room.bookflow.models.Message;

import java.util.List;


@Dao
public interface MessageDao {
    @Insert
    public long insert(Message message);

    @Delete
    public void delete(Message message);

    @Update
    public void update(Message message);
    @Query("SELECT * FROM message_table")
    public List<Message> getAllMessage();

    @Query("UPDATE message_table SET status = 1 WHERE id = :message_id")
    public void markAsSent(int message_id);

    @Query("SELECT * FROM message_table WHERE chat_id=:id")
    public LiveData<List<Message>> getMessageByChatId(long id);

    @Query("SELECT * FROM message_table WHERE chat_id=:id and status=:status")
    public List<Message> getMessageByChatIdStatus(long id, int status);

    @Query("Select * FROM message_table WHERE id==:id")
    public Message getById(long id);

    @Query("DELETE FROM message_table WHERE 1")
    public void delAll();
}
