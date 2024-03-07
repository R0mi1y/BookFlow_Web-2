package com.room.bookflow.data.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.room.bookflow.data.models.Address;

import java.util.List;

@Dao
public interface AddressDao {
    @Query("SELECT * FROM address_table")
    public List<Address> getAllAddress();

    @Query("Select * FROM address_table WHERE id==:id")
    public Address getById(long id);

    @Query("DELETE FROM address_table WHERE 1")
    public void delAll();

    @Insert
    public long insert(Address address);

    @Delete
    public void delete(Address address);

    @Update
    public void update(Address address);
}
