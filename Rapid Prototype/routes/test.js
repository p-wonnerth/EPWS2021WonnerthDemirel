const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')



router.get('/', (req, res) => {
    var barcode = new Array('4027400069556', '4003160036519', '4000417650108', '4014400910773', '5000159418539', '4003035007002',
        '9011900139616', '4306188343141', '4001242033678', '4051379094707', '9783893930746', '0661799794657',
        '4026963017905', '4030800514090', '4009249002536', '4305615183879', '8032790561876', '4305615181646',
        '4051379063123', '8710449000104', '3441260005973', '4250389394221', '7622300617844', '4008230201507',
        '4036303121889', '4051379187157', '4008095008204', '4012200032947', '4260162897801', '4250507500510',
        '4260221112487', '4001724819509', '4012448372355', '4388844118263', '4388844020115', '3165950580860',
        '4311501623695', '4311501356838', '4101530002154', '7640104959557', '8719200041219', '4001686301265',
        '4061458004244', '8690723112306', '4104420139947', '4388844021242', '4388840216932', '5038862238137',
        '4031655002329', '4005500087113', '4260311980286', '4017194009418', '4058172079382', ' 4010355511447')

    for (var u = 0; u < barcode.length; u++) {
        const getData = async () => {
            try {
                const res = await fetch(`https://de.openfoodfacts.org/api/v0/product/` + barcode[u] + `.json`)
                const fetchData = await res.json()

                const siegel = new Array('Demeter', 'Bioland', 'Naturland')
                
                if (fetchData.status == 1) {
                    if (fetchData.product.labels.match('Hergestellt in Deutschland')) {
                        checkBioSiegel(siegel, fetchData);
                    }
                    if ( !fetchData.product.labels.match('Hergestellt in Deutschland')) {
                        console.log(fetchData.product.product_name_de + ' der Marke ' + fetchData.product.brands + ' kommt nicht aus Deutschland.')
                    }
                }
                else {
                    console.log('Produkt wurde nicht gefunden!')
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        getData();
    }
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

module.exports = router;