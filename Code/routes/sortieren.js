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

                console.log(fetchData.product.labels)

                if(fetchData.product.labels.match('MSC')){
                    console.log('Hinzugefügt')
                } else {
                    console.log('Nicht nachhaltig')
                }

            } catch (error) {
                console.log(error);
            }
        } 
    getData(barcode);  
})

module.exports = router