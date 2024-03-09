package com.room.bookflow.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.room.bookflow.models.Notification;

import java.util.List;

@Dao
public interface NotificationDao {
    @Query("SELECT * FROM notification_table ORDER BY id DESC")
    public List<Notification> getAllNotifications();

    @Query("Select * FROM notification_table WHERE id==:id")
    public Notification getById(long id);

    @Insert
    public long insert(Notification user);

    @Delete
    public void delete(Notification user);

    @Query("DELETE FROM notification_table WHERE 1")
    public void delAll();


    @Query("UPDATE notification_table SET visualized=1 WHERE id=:id")
    public void setRead(int id);
    @Update
    public void update(Notification user);}
