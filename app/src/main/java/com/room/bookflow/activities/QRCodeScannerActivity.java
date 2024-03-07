package com.room.bookflow.activities;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

public class QRCodeScannerActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        IntentIntegrator integrator = new IntentIntegrator(this);
        integrator.setOrientationLocked(true);
        integrator.setPrompt("Scaneie o QRCODE");
        integrator.initiateScan();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        if (result != null) {
            if (result.getContents() == null) {
                Toast.makeText(this, "Cancelado", Toast.LENGTH_LONG).show();
                finish();
            } else {
                Toast.makeText(this, "Scaneado: " + result.getContents(), Toast.LENGTH_LONG).show();
                String bookId = extractBookId(result.getContents());
                Intent intent = new Intent(this, DetailBook.class);
                intent.putExtra("bookId", bookId); // Certifique-se que é "bookId" aqui
                startActivity(intent);
                finish();
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
            finish();
        }
    }

    private String extractBookId(String qrContents) {
        // Define o prefixo esperado no QR Code
        String expectedPrefix = "Book Flow: ";

        // Verifica se o conteúdo do QR Code começa com o prefixo esperado
        if (qrContents.startsWith(expectedPrefix)) {
            // Extrai o ID do livro removendo o prefixo
            return qrContents.substring(expectedPrefix.length());
        } else {
            // Retorna null ou lança uma exceção se o QR Code não for reconhecido
            return null; // Ou considere lançar uma exceção
        }
    }
}
