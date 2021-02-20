package com.example.clientuser;

import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Spenden extends Installation {

    private TextView textViewSpenden;
    private RequestQueue sQueue;
    String serverAdresse = "http://192.168.2.104:3000/user/";
    final JSONObject spendenorganisation = new JSONObject();

    JSONArray sosArray = new JSONArray();
    JSONArray bundArray = new JSONArray();
    JSONArray albertSchweitzerArray = new JSONArray();



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_spenden);
        String sID = id(getBaseContext());


        Button btnSpenden = findViewById(R.id.btn_spenden);
        Button btnSpendengruppeBerechnen = findViewById(R.id.btn_spendengruppe_berechnen);
        Button btnSpendenWaehlen = findViewById(R.id.btn_spende_waehlen);
        textViewSpenden = findViewById(R.id.spenden);
        textViewSpenden.setMovementMethod(new ScrollingMovementMethod());
        sQueue = Volley.newRequestQueue(this);

        btnSpenden.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                textViewSpenden.setText("");
                spendenAnzeigen(sID);
            }
        });

        btnSpendengruppeBerechnen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                textViewSpenden.setText("");
                spendenGruppeBerechnen(sID);

            }
        });

        btnSpendenWaehlen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //setSpendenorganisation(sID);
            }
        });

    }

    private void setSpendenorganisation(String sID){

        String url = serverAdresse + sID+"/spendenorganisation";
        JSONObject obj = new JSONObject();

        try {
            obj.put("spendenorganisation",spendenorganisation);
        } catch(JSONException e){
            e.printStackTrace();
        }


        JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, url, obj,
                new Response.Listener<JSONObject>(){
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONObject aktuelleSpendenorganisation = response.getJSONObject("spendenorganisation");
                            String name = aktuelleSpendenorganisation.getString("name");
                            String website = aktuelleSpendenorganisation.getString("website");

                            textViewSpenden.append("Aktuell kommt das Geld " + name + " zu Gute!\n Mehr Infos zur Organisation unter " + website);

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

        sQueue.add(request);
    }

    private void spendenGruppeBerechnen(String sID){

        String url = serverAdresse + sID;




        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray jsonArrayKassenbons = response.getJSONArray("kassenbons");
                            for(int k = 0;k < jsonArrayKassenbons.length(); k++) {
                                Integer kassenbonNr = k;
                                //textViewSpenden.append("Kassenbon: " + kassenbonNr + "\n");
                                JSONArray jsonArrayProdukte = response.getJSONArray("kassenbons").getJSONObject(k).getJSONArray("products");
                                for (int i = 0; i < jsonArrayProdukte.length(); i++) {

                                    JSONObject produkte = jsonArrayProdukte.getJSONObject(i);
                                    String kategorie = produkte.getString("kategorie");

                                    if(kategorie.equals("Milchprodukte")||kategorie.equals("Fleischprodukte")){
                                        bundArray.put(produkte.getString("name"));
                                    }
                                    if(kategorie.equals("Fruchtbasierte Lebensmittel")){
                                        sosArray.put(produkte.getString("name"));
                                    }
                                    if(kategorie.equals("Getreideprodukte")){
                                        albertSchweitzerArray.put(produkte.getString("name"));
                                    }

                                }
                            }


                                if(sosArray.length()<albertSchweitzerArray.length() &&
                                        bundArray.length()<albertSchweitzerArray.length()){
                                    spendenorganisation.put("name","Albert Schweitzer Stiftung für unsere Mitwelt");
                                    spendenorganisation.put("website","albert-schweitzer-stiftung.de");
                                }
                                if(sosArray.length()<bundArray.length() &&
                                        albertSchweitzerArray.length()<bundArray.length()){
                                    spendenorganisation.put("name","Bund");
                                    spendenorganisation.put("website","bund.net");
                                }
                                if(bundArray.length()<sosArray.length() &&
                                        albertSchweitzerArray.length()<sosArray.length()){
                                    spendenorganisation.put("name","Save Our Seeds (SOS)");
                                    spendenorganisation.put("website","saveourseeds.org");
                                }

                                setSpendenorganisation(sID);
                                //textViewSpenden.append(spendenorganisation.toString());


                            /*textViewSpenden.append(sosArray.toString());
                            textViewSpenden.append(albertSchweitzerArray.toString());
                            textViewSpenden.append(bundArray.toString());
                            textViewSpenden.append(String.valueOf(albertSchweitzerArray.length()));*/
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


        sQueue.add(request);






    }




    private void spendenAnzeigen(String sID) {

        String url = serverAdresse + sID;

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray jsonArrayKassenbons = response.getJSONArray("kassenbons");
                            for(int k = 0;k < jsonArrayKassenbons.length(); k++) {
                                JSONObject kassenbon = jsonArrayKassenbons.getJSONObject(k);
                                Integer kassenbonNr = k + 1;
                                String date = kassenbon.getString("createdAt");
                                Integer gesamtPreis = kassenbon.getInt("gesamtPreis");
                                String spende = kassenbon.getString("spende");
                                textViewSpenden.append("Kassenbon: " + kassenbonNr + "\n" + "Datum: " + date + "\n" + "Gesamt Preis: " + gesamtPreis + "\n" + "Spende: " + spende + "\n");
                                JSONArray jsonArrayProdukte = response.getJSONArray("kassenbons").getJSONObject(k).getJSONArray("products");
                                for (int i = 0; i < jsonArrayProdukte.length(); i++) {
                                    JSONObject produkte = jsonArrayProdukte.getJSONObject(i);

                                    String name = produkte.getString("name");
                                    String marke = produkte.getString("marke");
                                    String siegel = produkte.getString("Siegel");
                                    String barcode = produkte.getString("barcode");

                                    textViewSpenden.setVisibility(View.VISIBLE);
                                    textViewSpenden.append("Name: " + name + "\n" + "Marke: " + marke + "\n" + "Siegel: " + siegel + "\n" + "Barcode: " + barcode + "\n\n");

                                }
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

        sQueue.add(request);
    }


}