package com.room.bookflow.helpers;

public class BookSuggestion {
    String title;
    String authors;
    String categories;
    String description;
    String imageUrl;

    // Construtor, getters e setters
    public BookSuggestion(String title, String authors, String categories, String description, String imageUrl) {
        this.title = title;
        this.authors = authors;
        this.categories = categories;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthors() {
        return authors;
    }

    public void setAuthors(String authors) {
        this.authors = authors;
    }

    public String getCategories() {
        return categories;
    }

    public void setCategories(String categories) {
        this.categories = categories;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return this.title; // Para garantir que o ArrayAdapter mostre o título no AutoCompleteTextView
    }

}
