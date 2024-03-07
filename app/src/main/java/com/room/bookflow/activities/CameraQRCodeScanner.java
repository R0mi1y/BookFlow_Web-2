package com.room.bookflow.activities;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.ChecksumException;
import com.google.zxing.FormatException;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.NotFoundException;
import com.google.zxing.RGBLuminanceSource;
import com.google.zxing.Reader;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;

import java.io.IOException;

public class CameraQRCodeScanner extends AppCompatActivity implements SurfaceHolder.Callback {

    private static final int CAMERA_PERMISSION_REQUEST_CODE = 100;
    private SurfaceView surfaceView;
    private SurfaceHolder surfaceHolder;
    private boolean hasSurface;
    private final String TAG = "CameraQRCodeScanner";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scan_qr_code);

        surfaceView = findViewById(R.id.surfaceView);
        surfaceHolder = surfaceView.getHolder();
        surfaceHolder.addCallback(this);
        hasSurface = false;
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.CAMERA},
                    CAMERA_PERMISSION_REQUEST_CODE);
        } else {
            if (hasSurface) {
                initCamera(surfaceHolder);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                if (hasSurface) {
                    initCamera(surfaceHolder);
                }
            } else {
                Toast.makeText(this, "Permissão da câmera negada. Não é possível escanear.", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void initCamera(SurfaceHolder surfaceHolder) {
        try {
            CameraManager.get().openDriver(surfaceHolder);
        } catch (IOException ioe) {
            Log.w(TAG, ioe);
        } catch (RuntimeException e) {
            Log.w(TAG, "Unexpected error initializing camera", e);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        CameraManager.get().closeDriver();
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        if (!hasSurface) {
            hasSurface = true;
            initCamera(holder);
        }
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        hasSurface = false;
    }

    public void handleDecode(Result rawResult) {
        // Aqui você lida com o resultado do escaneamento
        Log.d(TAG, "Resultado do escaneamento: " + rawResult.getText());
        String scannedData = rawResult.getText();
        // Exemplo de como abrir uma nova atividade passando os dados escaneados
        Intent intent = new Intent(this, ResultActivity.class);
        intent.putExtra("scanned_data", scannedData);
        startActivity(intent);
    }
}
