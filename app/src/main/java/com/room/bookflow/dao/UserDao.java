package com.room.bookflow.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Embedded;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.room.bookflow.models.Address;
import com.room.bookflow.models.User;

import java.util.List;

@Dao
public interface UserDao {
    @Query("SELECT user_table.*, address_table.* FROM user_table LEFT JOIN address_table ON user_table.address_id = address_table.id")
    public List<User> getAllUsers();

    @Query("SELECT * FROM user_table WHERE is_autenticated=1 LIMIT 1;\n")
    public User getAutenticated();

    @Query("Select * FROM user_table WHERE id==:id")
    public User getById(long id);

    @Query("Select * FROM user_table WHERE username==:username")
    public User getByUsername(String username);

    @Insert
    public long insert(User user);

    @Delete
    public void delete(User user);

    @Query("DELETE FROM user_table WHERE 1")
    public void delAll();

    @Query("UPDATE user_table SET is_autenticated=0 WHERE 1")
    public void setAllUnautenticated();

    @Query("UPDATE user_table SET is_autenticated=1 WHERE id=:id")
    public void setAutenticated(int id);
    @Update
    public void update(User user);

}
