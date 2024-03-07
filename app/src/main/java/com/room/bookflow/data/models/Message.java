package com.room.bookflow.data.models;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.PrimaryKey;

import java.util.List;

@Entity(tableName="message_table", foreignKeys = {
        @ForeignKey(
                entity = Chat.class,
                parentColumns = {"id"},
                childColumns = {"chat_id"},
                onDelete = ForeignKey.CASCADE,
                onUpdate = ForeignKey.CASCADE
        )
})
public class Message {
    @NonNull
    @PrimaryKey(autoGenerate = true)
    private int id;
    @NonNull
    private int chat_id;
    private String message;
    private int status;
    private Chat chat;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getChat_id() {
        return chat_id;
    }

    public void setChat_id(int chat_id) {
        this.chat_id = chat_id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    static boolean sendMessages(Context context, List<Message> messages) {
        return false;
    }
}
