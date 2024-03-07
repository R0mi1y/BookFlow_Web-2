package com.room.bookflow.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.room.bookflow.models.User;

import java.util.List;

@Dao
public interface UserDao {
    @Query("SELECT user_table.*, address_table.* FROM user_table LEFT JOIN address_table ON user_table.address_id = address_table.id")
    public List<User> getAllUsers();

    @Query("SELECT * FROM user_table ORDER BY id LIMIT 1;\n")
    public User getFirst();

    @Query("Select * FROM user_table WHERE id==:id")
    public User getById(long id);

    @Insert
    public long insert(User user);

    @Delete
    public void delete(User user);

    @Query("DELETE FROM user_table WHERE 1")
    public void delAll();
    @Update
    public void update(User user);
}
