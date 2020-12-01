const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

router.get('/:barcode', (req, res) => {
    console.log('API')
    const barcode = req.params.barcode;
    console.log('Request');
    const getData = async (barcode) => {
            try {
                const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
                const fetchData = await res.json();

                const siegel = new Array ('de:Eier aus Bodenhaltung','MSC','ASC');

                /* Barcodes:
                ASC= 4006451000367 Lachs
                MSC=4250073450639 Thunfisch 
                Nicht hachnaltig= 8000500310427 Nutella
                */

                console.log(fetchData.product.labels)
                console.log(fetchData.product.product_name)

                for (i=0;i<siegel.length;i++) {
                    if (fetchData.product.labels.match(siegel[i])) {
                        console.log(fetchData.product.product_name + ' der Marke ' + fetchData.product.brands + ' wurde hinzugefügt')
                        break;
                    } if (i==siegel.length && fetchData.product.labels != siegel[i]) {
                        console.log(fetchData.product.product_name + ' der Marke ' + fetchData.product.brands + ' ist nicht nachhaltig')
                    } if (fetchData.product.labels == '') {
                        console.log(fetchData.product.product_name + ' der Marke ' + fetchData.product.brands + ' ist nicht nachhaltig')
                        break;
                    }



                   
                }

            } catch (error) {
                console.log(error);
            }
        } 
    getData(barcode);  
})

module.exports = router