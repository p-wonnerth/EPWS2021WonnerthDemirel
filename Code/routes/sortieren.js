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

            const siegel = new Array('de:Eier aus Bodenhaltung', 'MSC');

            console.log(fetchData.product.labels)
            console.log(fetchData.product.product_name)
            console.log(fetchData.product.product_name)

            for (i = 0; i < siegel.length;) {
                if (fetchData.product.labels != siegel[i]) {
                    i++;
                } if (fetchData.product.labels.match(siegel[i])) {
                    console.log(fetchData.product.product_name + ' der Marke ' + fetchData.product.brands + ' wurde hinzugefügt')
                    break;
                } else {
                    console.log(fetchData.product.product_name + ' der Marke ' + fetchData.product.brands + ' ist nicht nachhaltig')
                }
            }
            /*if(fetchData.product.labels.match(siegel)){
                console.log(fetchData.product.generic_name_de + ' wurden hinzugefügt')
            } else {
                console.log(fetchData.product.generic_name_de + ' ist nicht nachhaltig')
            }*/

        } catch (error) {
            console.log(error);
        }
    }
    getData(barcode);
})

module.exports = router