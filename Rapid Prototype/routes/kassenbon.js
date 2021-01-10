const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const Kassenbon = require('../models/kassenbons')

//Alle aktuell vorhandenen Kassenbons
router.get('/', async (req, res) => {
    try {
        const kassenbon = await Kassenbon.find()
        res.json(kassenbon)
    } catch(error) {
        console.log(error)
    }
})

 router.post('/', async (req, res) => {

    async function speicherNachhaltigeProdukte() {

        let promises = [];
        let produkte = [];
    
        for (var u = 0; u <= req.body.barcode.length; u++) {

            const getData = async () => {
                try {
                    const res = await fetch(`https://de.openfoodfacts.org/api/v0/product/` + req.body.barcode[u] + `.json`)
                    const fetchData = await res.json()
    
                    const siegel = new Array('Demeter', 'Bioland', 'Naturland')
                    
                    
    
                    
                    
                    if (fetchData.status == 1) {
                        if (fetchData.product.labels.match('Hergestellt in Deutschland')) {
                            if (checkBioSiegel != 1) {                            
                                var code =  await checkBioSiegel(siegel, fetchData);
                                produkte.push(code);
                                //console.log(produkte)                       
                            }
                            if (checkBioSiegel == 1) {
                                console.log('Produkte wurden nicht gepostet')
                            }
                        }
                        if ( !fetchData.product.labels.match('Hergestellt in Deutschland')) {
                            console.log(fetchData.product.product_name_de + " der Marke " + fetchData.product.brands + " kommt nicht aus Deutschland.")
                        }
                    } 
                    if (fetchData.status == 0) {
                        console.log("Produkt wurde nicht gefunden!")
                    }  
                                
                }
                catch (error) {
                    console.log(error);
                }
            }
            
            promises.push(getData())

    
        }
        
        return Promise.all(promises).then( () => produkte)
    }

    speicherNachhaltigeProdukte().then(async function (produkte) {

        const kassenbon = new Kassenbon ({
            userId: req.body.userId,
            produkte: produkte
            })
             try {      
                const newKassenbon = await kassenbon.save()
                res.status(201).json(newKassenbon)
            } catch (err) {
                res.status(400).json({ message: err.message })
            }
    })

    
}) 


function checkBioSiegel(array, json) {
    for (i=0;i<array.length;) {
        if (json.product.labels.match(array[i])) {
            console.log(json.product.product_name_de + ' der Marke ' + json.product.brands + ' ist nachhaltig, kommt aus Deutschland und wurde hinzugefügt.')
            return json.code
        }
        if (json.product.labels != array[i]) {
            i++;
        }
        if (i==array.length && json.product.labels != array[i]) {
            console.log(json.product.product_name_de + ' der Marke ' + json.product.brands + ' kommt aus Deutschland, ist aber nicht nachhaltig.')
            return 1
        }
    } 
}

router.delete('/:id', getKassenbon, async (req, res) => {
    try {
        await res.kassenbon.remove()
        res.json({  message: 'Kassebon wurde gelöscht' })
    } catch(err) {
        res.status(500).json({ message: err.message})
    }
})

async function getKassenbon(req, res, next) {
    let kassenbon
    try {
        kassenbon = await Kassenbon.findById(req.params.id)
        if (kassenbon == null) {
            return res.status(404).json({ message: 'Keinen Kassenbon gefunden!'})
        }
    } catch(err) {
        return res.status(500).json({ message: err.message})
    }
    
    res.kassenbon = kassenbon
    next()
}

module.exports = router