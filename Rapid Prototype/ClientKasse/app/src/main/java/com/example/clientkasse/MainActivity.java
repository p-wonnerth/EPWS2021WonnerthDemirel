package com.example.clientkasse;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    Button scanBtn;
    private TextView mTextViewResult;
    private RequestQueue mQueue;
    JSONArray barcodeArray = new JSONArray();
    String serverAdresse = "http://192.168.2.104:3000/user/";
    String userId = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mTextViewResult = findViewById(R.id.result);
        mTextViewResult.setMovementMethod(new ScrollingMovementMethod());
        scanBtn = findViewById(R.id.scanBtn);
        scanBtn.setOnClickListener(this);
        mQueue = Volley.newRequestQueue(this);



    }

    @Override
    public void onClick(View v) {
        scanCode();
    }

    public void scanCode() {

        IntentIntegrator integrator = new IntentIntegrator(this);
        integrator.setCaptureActivity(CaptureAct.class);
        integrator.setOrientationLocked(false);
        integrator.setDesiredBarcodeFormats(IntentIntegrator.ALL_CODE_TYPES);
        integrator.setPrompt("Scanning");
        integrator.setBeepEnabled(false);
        integrator.initiateScan();
    }

    private void putKassenbon(){

        mTextViewResult.setVisibility(View.VISIBLE);


        JSONObject obj = new JSONObject();
        try {
            obj.put("barcode", barcodeArray);

        } catch (Exception e) {
            e.printStackTrace();
        }

        String url = serverAdresse + userId;

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, url, obj,
                new Response.Listener<JSONObject>(){
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray jsonArrayKassenbons = response.getJSONArray("kassenbons");
                                JSONObject kassenbon = jsonArrayKassenbons.getJSONObject(jsonArrayKassenbons.length()-1);
                                //Integer kassenbonNr = k;
                                String date = kassenbon.getString("createdAt");
                                Integer gesamtPreis = kassenbon.getInt("gesamtPreis");
                                String spende = kassenbon.getString("spende");
                                mTextViewResult.append("Kassenbon: " + "\n" + "Datum: " + date + "\n" + "Gesamt Preis: "+ gesamtPreis + "\n"+ "Spende: " + spende);
                                JSONArray jsonArrayProdukte = response.getJSONArray("kassenbons").getJSONObject(jsonArrayKassenbons.length()-1).getJSONArray("products");
                                for (int i = 0; i < jsonArrayProdukte.length(); i++) {
                                    JSONObject produkte = jsonArrayProdukte.getJSONObject(i);

                                    String name = produkte.getString("name");
                                    String marke = produkte.getString("marke");
                                    String siegel = produkte.getString("Siegel");
                                    String barcode = produkte.getString("barcode");

                                    mTextViewResult.append("Name: " + name + "\n" + "Marke: " + marke + "\n" + "Siegel: " + siegel + "\n" + "Barcode: " + barcode + "\n\n");
                                }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        });
        request.setRetryPolicy(new DefaultRetryPolicy(50000, 5, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        mQueue.add(request);

    }


    @Override
    protected  void onActivityResult (int reqCode, int resultCode, Intent data) {
        IntentResult result = IntentIntegrator.parseActivityResult(reqCode, resultCode, data);
        if (result != null) {
            if (result.getContents() != null) {
                if (result.getContents().length() > 15) {
                    userId = result.getContents();

                    AlertDialog.Builder builder = new AlertDialog.Builder(this);
                    builder.setMessage("Produkte scannen");
                    builder.setTitle("User erfolgreich verifiziert");
                    builder.setPositiveButton("Produkte scannen", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            scanCode();
                        }
                    }).setNegativeButton("finish", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {

                            putKassenbon();
                            JSONArray array = new JSONArray();
                            barcodeArray = array;
                            userId = "";

                        }
                    });
                    AlertDialog dialog = builder.create();
                    dialog.show();
                }

                else {

                    AlertDialog.Builder builder = new AlertDialog.Builder(this);

                String code = result.getContents();
                barcodeArray.put(code);

                builder.setMessage(barcodeArray.toString());
                builder.setTitle("Results");
                builder.setPositiveButton("Produkt scannen", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        scanCode();
                    }
                }).setNegativeButton("finish", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {

                        putKassenbon();
                        JSONArray array = new JSONArray();
                        barcodeArray = array;


                    }
                });
                AlertDialog dialog = builder.create();
                dialog.show();
            }

            }
            else {
                Toast.makeText(this, "NoResults", Toast.LENGTH_LONG).show();
            }
        }
        else {
            super.onActivityResult(reqCode, resultCode, data);
        }
    }
}