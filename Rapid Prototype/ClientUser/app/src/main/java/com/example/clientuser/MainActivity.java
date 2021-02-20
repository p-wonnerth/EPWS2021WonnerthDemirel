package com.example.clientuser;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.journeyapps.barcodescanner.BarcodeEncoder;

public class MainActivity extends Installation {


    private TextView mTextViewResult;
    private ImageView qrImageView;
    private RequestQueue mQueue;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mTextViewResult = findViewById(R.id.welcomeText);
        mTextViewResult.setMovementMethod(new ScrollingMovementMethod());
        qrImageView = findViewById(R.id.sID);
        Button btnSpenden = findViewById(R.id.btn_spenden);
        Button btnVerifizierung = findViewById(R.id.btn_verifizierung);
        mQueue = Volley.newRequestQueue(this);

        btnSpenden.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                spendenAnzeigenUndWaehlen();
            }
        });

        btnVerifizierung.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //get Installations ID
                String sID = id(getBaseContext());
                // create MultiFormatWriter
                MultiFormatWriter writer = new MultiFormatWriter();
                try {
                    // create bit matrix
                    BitMatrix matrix = writer.encode(sID, BarcodeFormat.QR_CODE
                                , 350,350);
                    // barcode encoder
                    BarcodeEncoder encoder = new BarcodeEncoder();
                    // bit map
                    Bitmap bitmap = encoder.createBitmap(matrix);
                    // bitmap on image view
                    qrImageView.setImageBitmap(bitmap);

                } catch (WriterException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void spendenAnzeigenUndWaehlen() {
        Intent intent = new Intent(MainActivity.this, Spenden.class);
        startActivity(intent);
    }
}