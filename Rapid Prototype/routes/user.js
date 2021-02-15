const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const User = require('../models/user')
var moment = require('moment')

router.get('/', async (req, res) => {
    try {
        const user = await User.find()
        res.json(user)
    } catch(error) {
        console.log(error)
    }
})

router.get('/:id', getUser, async(req, res) => {
    res.json(res.user)
})

router.put('/:id', getUser, async (req, res) => {

    try {
        if(req.body.kassenbons != null) {
          Array.prototype.push.apply(res.user.kassenbons,req.body.kassenbons)
        }
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch(err) {
        res.status(400).json({ message: err.message})
    }
})

router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({  message: 'User wurde gelöscht' })
    } catch(err) {
        res.status(500).json({ message: err.message})
    }
})



async function getUser(req, res, next) {
    let user
    try {
        user = await User.findOne({userId: req.params.id})
        if (user == null) {
            return res.status(404).json({ message: 'Kein User gefunden!'})
        }
    } catch(err) {
        return res.status(500).json({ message: err.message})
    }

    res.user = user
    next()
}

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
                              if (code != 1) {
                                  produkte.push(code)
                                  console.log(produkte)
                              }
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
      var date = moment().format('DD.MM.YYYY')
      const user = new User ({
          userId: req.body.userId,
          kassenbons: {products: produkte, createdAt: date}
          })
           try {
              const newUser = await user.save()
              res.status(201).json(newUser)
          } catch (err) {
              res.status(400).json({ message: err.message })
          }
  })

  function checkBioSiegel(array, json) {
      for (i=0;i<array.length;) {
          if (json.product.labels.match(array[i])) {
              console.log(json.product.product_name_de + ' der Marke ' + json.product.brands + ' ist nachhaltig, kommt aus Deutschland und wurde hinzugefügt.')
              //Name etc. holen
              function getValues() {
                return {name: json.product.product_name_de, marke: json.product.brands, Siegel:json.product.labels, barcode: json.code}
              }

              const produkt = getValues()
              return produkt
          }
          if (json.product.labels != array[i]) {
              i++;
          }
          if (i==array.length && json.product.labels != array[i]) {
              console.log(json.product.product_name_de + ' der Marke ' + json.product.brands + ' kommt aus Deutschland, ist aber nicht nachhaltig.')
              return 1;
          }
      }
  }
})

module.exports = router
