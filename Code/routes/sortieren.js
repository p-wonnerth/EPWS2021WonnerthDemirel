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

                if (fetchData.product.labels.match('Hergestellt in Deutschland')) {
                        checkBioSiegel(siegel, fetchData)
                    }
                    else {
                        console.log(fetchData.product.product_name_de + ' der Marke ' + fetchData.product.brands + ' kommt nicht aus Deutschland.')
                    }
            } catch (error) {
                console.log(error);
            }
        } 
    getData(barcode);  
})

function checkBioSiegel(array, json) {
    for (i=0;i<array.length;) {
        if (json.product.labels.match(array[i])) {
        console.log(json.product.product_name_de + ' der Marke ' + json.product.brands + ' ist nachhaltig, kommt aus Deutschland und wurde hinzugefügt.')
        break
        }
        if (json.product.labels != array[i]) {
        i++;
        }
        if (i==array.length && json.product.labels != array[i]) {
        console.log(json.product.product_name_de + ' der Marke ' + json.product.brands + ' kommt aus Deutschland, ist aber nicht nachhaltig.')
        break
        }
    } 
}



module.exports = router