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

                if (fetchData.status == 1) {

                    const siegel = new Array('Demeter', 'Bioland', 'Naturland')


                    for (i = 0; i < siegel.length;) {
                        if (fetchData.product.labels.match('Hergestellt in Deutschland')) {
                            if (fetchData.product.labels.match(siegel[i])) {
                                console.log(fetchData.product.product_name_de + ' der Marke ' + fetchData.product.brands + ' ist nachhaltig, kommt aus Deutschland und wurde hinzugefügt.')
                                break
                            }
                            if (fetchData.product.labels != siegel[i]) {
                                i++;
                            }
                            if (i == siegel.length && fetchData.product.labels != siegel[i]) {
                                console.log(fetchData.product.product_name_de + ' der Marke ' + fetchData.product.brands + ' kommt aus Deutschland, ist aber nicht nachhaltig.')
                                break
                            }
                        }
                        else {
                            console.log(fetchData.product.product_name_de + ' der Marke ' + fetchData.product.brands + ' kommt nicht aus Deutschland.')
                            break
                        }

                    }
                }

                if (fetchData.status == 0) {
                    console.log('Produkt nicht gefunden')
                }

            }
            catch (error) {
                console.log(error);
            }
        }
        getData();
    }
})

module.exports = router;