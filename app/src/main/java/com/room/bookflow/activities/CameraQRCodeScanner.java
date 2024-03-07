package com.room.bookflow.activities;

import android.os.Bundle;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import androidx.appcompat.app.AppCompatActivity;

import com.room.bookflow.R;


public class CameraQRCodeScanner extends AppCompatActivity {

    private static final int CAMERA_PERMISSION_REQUEST_CODE = 100;
    private SurfaceView surfaceView;
    private SurfaceHolder surfaceHolder;
    private boolean hasSurface;
    private final String TAG = "CameraQRCodeScanner";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scanqrcode);
    }
}
