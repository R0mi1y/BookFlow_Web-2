package com.room.bookflow.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.room.bookflow.models.Address;
import com.room.bookflow.models.Book;

import java.util.List;

@Dao
public interface BookDao {
    @Query("SELECT * FROM book_table")
    public List<Book> getAllBooks();

    @Query("Select * FROM book_table WHERE book_id==:id")
    public Book getById(long id);

    @Query("DELETE FROM book_table WHERE 1")
    public void delAll();

    @Insert
    public long insert(Book book);

    @Delete
    public void delete(Book book);

    @Update
    public void update(Book book);
}
