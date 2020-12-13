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

                const siegel = new Array ('Demeter','Bioland','Naturland');

                for (i=0;i<siegel.length;){
                    if (fetchData.product.labels.match('Hergestellt in Deutschland')) {
                        if (fetchData.product.labels.match(siegel[i])) {
                            console.log(fetchData.product.product_name_de + ' der Marke ' + fetchData.product.brands + ' ist nachhaltig, kommt aus Deutschland und wurde hinzugefügt.')
                            break
                        }
                        if (fetchData.product.labels != siegel[i]) {
                            i++;
                        }
                        if (i==siegel.length && fetchData.product.labels != siegel[i]) {
                            console.log(fetchData.product.product_name_de + ' der Marke ' + fetchData.product.brands + ' kommt aus Deutschland, ist aber nicht nachhaltig.')
                            break
                        } 
                    }
                    else {
                        console.log(fetchData.product.product_name_de + ' der Marke ' + fetchData.product.brands + ' kommt nicht aus Deutschland.')
                        break
                    }
        
                }
            } catch (error) {
                console.log(error);
            }
        } 
    getData(barcode);  
})

module.exports = router