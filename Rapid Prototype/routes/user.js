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

router.get('/:userId', getUser, async(req, res) => {
    res.json(res.user)
})

router.delete('/:userId', getUser, async (req, res) => {
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
        user = await User.findOne({userId: req.params.userId})
        if (user == null) {
            return res.status(404).json({ message: 'Kein User gefunden!'})
        }
    } catch(err) {
        return res.status(500).json({ message: err.message})
    }

    res.user = user
    next()
}

router.post('/', postUser, async (req, res) => {
  postUser()
})

async function postUser(req, res, next) {

  try {
    const user = await User.findOneAndUpdate(
      {
        userId: req.body.userId
      },
      {
        userId: req.body.userId
      },
      {
        upsert: true,
        new: true
      }
    )
    console.log(user)
    res.status(201).json(user)
  } catch(err) {
    console.log(err.code)
    res.status(400).json({ message: err.message})
  }
}

router.put('/:userId/spendenorganisation', async (req, res) => {
  try {
      if(req.body.spendenorganisation != null) {
        console.log("hier")
        console.log(req.params.userId)
        console.log(req.body.spendenorganisation)


        //var obj = {spendenorganisation:

        //console.log(obj)

        const newUser = await User.findOneAndUpdate(
          {
            userId: req.params.userId
          },
          {
            spendenorganisation: req.body.spendenorganisation
          },
          {
            new: true
          }
        )
        res.status(201).json(newUser)
      }
  } catch(err) {
      res.status(400).json({ message: err.message})
  }

})

router.put('/:userId', async (req, res) => {

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



          try {
              if(req.body.barcode != null) {
                console.log("hier")
                console.log(req.params.userId)


                gesamtPreis = 0
                for (i=0;i < produkte.length;i++) {
                  gesamtPreis += produkte[i].preis
                }

                function percentage(num, per) {
                  return (num/100)*per;
                }

                spende = percentage(gesamtPreis, 5.00).toFixed(2)

                var obj = {products: produkte, createdAt: date, gesamtPreis: gesamtPreis, spende: spende}

                const newUser = await User.findOneAndUpdate(
                  {
                    userId: req.params.userId
                  },
                  {
                    $push: {kassenbons: obj}
                  },
                  {
                    upsert: true,
                    new: true
                  }
                )
                res.status(201).json(newUser)
              }
          } catch(err) {
              res.status(400).json({ message: err.message})
          }

  })



  function checkBioSiegel(array, json) {
      for (i=0;i<array.length;) {
          if (json.product.labels.match(array[i])) {
              console.log(json.product.product_name_de + ' der Marke ' + json.product.brands + ' ist nachhaltig, kommt aus Deutschland und wurde hinzugefügt.')
              //Name etc. holen
              function getValues() {
                return {name: json.product.product_name_de, marke: json.product.brands, Siegel:json.product.labels, kategorie: "Getreideprodukte", preis: 3, barcode: json.code}
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
