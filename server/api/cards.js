/* eslint-disable max-statements */
/* eslint-disable complexity */
const router = require('express').Router()
const {Card} = require('../db/models')
const {Op} = require('sequelize')

module.exports = router

router.get('/all', async (req, res, next) => {
  try {
    const cards = await Card.findAll({
      order: [['name', 'ASC']]
    })
    res.json(cards)
  } catch (err) {
    next(err)
  }
})

router.get('/some', async (req, res, next) => {
  try {
    console.log('route hit')
    console.log('req.query', req.query)

    let date

    if (req.query.day || req.query.month || req.query.year) {
      date = `${req.query.year || '2020'}-${req.query.month || '12'}-${req.query
        .day || '31'}`
    }

    console.log('date', date)

    const filters = {
      [Op.and]: [
        {attribute: {[Op.or]: []}},
        {type: {[Op.or]: []}},
        {
          [Op.or]: [
            {category: {[Op.or]: []}},
            {class: {[Op.or]: []}},
            {subclass: {[Op.or]: []}}
          ]
        }
      ]
    }

    const $attribute = JSON.parse(req.query.attribute)
    const $type = JSON.parse(req.query.type)
    const $category = JSON.parse(req.query.category)
    const $class = JSON.parse(req.query.class)

    console.log('$category', $category)
    console.log('$class', $class)
    console.log('$attribute', $attribute)
    console.log('$type', $type)

    if ($attribute.dark)
      filters[Op.and][0] = {
        attribute: {[Op.or]: [...filters[Op.and][0].attribute[Op.or], 'Dark']}
      }
    if ($attribute.light)
      filters[Op.and][0] = {
        attribute: {[Op.or]: [...filters[Op.and][0].attribute[Op.or], 'Light']}
      }
    if ($attribute.earth)
      filters[Op.and][0] = {
        attribute: {[Op.or]: [...filters[Op.and][0].attribute[Op.or], 'Earth']}
      }
    if ($attribute.wind)
      filters[Op.and][0] = {
        attribute: {[Op.or]: [...filters[Op.and][0].attribute[Op.or], 'Wind']}
      }
    if ($attribute.water)
      filters[Op.and][0] = {
        attribute: {[Op.or]: [...filters[Op.and][0].attribute[Op.or], 'Water']}
      }
    if ($attribute.fire)
      filters[Op.and][0] = {
        attribute: {[Op.or]: [...filters[Op.and][0].attribute[Op.or], 'Fire']}
      }
    if ($attribute.divine)
      filters[Op.and][0] = {
        attribute: {[Op.or]: [...filters[Op.and][0].attribute[Op.or], 'Divine']}
      }

    console.log('filters after attr', filters)

    if ($type.aqua)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Aqua']}
      }
    if ($type.beast)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Beast']}
      }
    if ($type.beastWarrior)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Beast-Warrior']}
      }
    if ($type.cyberse)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Cyberse']}
      }
    if ($type.dinosaur)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Dinosaur']}
      }
    if ($type.divineBeast)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Divine-Beast']}
      }
    if ($type.dragon)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Dragon']}
      }
    if ($type.fairy)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Fairy']}
      }
    if ($type.fiend)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Fiend']}
      }
    if ($type.fish)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Fish']}
      }
    if ($type.insect)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Insect']}
      }
    if ($type.machine)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Machine']}
      }
    if ($type.plant)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Plant']}
      }
    if ($type.psychic)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Psychic']}
      }
    if ($type.pyro)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Pyro']}
      }
    if ($type.reptile)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Reptile']}
      }
    if ($type.rock)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Rock']}
      }
    if ($type.seaSerpent)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Sea Serpent']}
      }
    if ($type.spellcaster)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Spellcaster']}
      }
    if ($type.thunder)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Thunder']}
      }
    if ($type.warrior)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Warrior']}
      }
    if ($type.wingedBeast)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Winged Beast']}
      }
    if ($type.wyrm)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Wyrm']}
      }
    if ($type.zombie)
      filters[Op.and][1] = {
        type: {[Op.or]: [...filters[Op.and][1].type[Op.or], 'Zombie']}
      }

    console.log('filters after type', filters)

    if ($category.continuous)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [
            ...filters[Op.and][2][Op.or][0].category[Op.or],
            'Continuous'
          ]
        }
      }
    if ($category.counter)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Counter']
        }
      }
    if ($category.equip)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Equip']
        }
      }
    if ($category.field)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Field']
        }
      }
    if ($category.fusion)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Fusion']
        }
      }
    if ($category.link)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Link']
        }
      }
    if ($category.quickPlay)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [
            ...filters[Op.and][2][Op.or][0].category[Op.or],
            'Quick-Play'
          ]
        }
      }
    if ($category.synchro)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Synchro']
        }
      }
    if ($category.xyz)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Xyz']
        }
      }

    if ($category.normal && $category.normalMonster)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Normal']
        }
      }
    if ($category.normal && $category.normalMonster)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Normal']
        }
      }

    if (!$category.normal && $category.normalMonster) {
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{card: 'Monster'}, {category: 'Normal'}]
      })
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{card: 'Monster'}, {class: 'Normal'}]
      })
    }

    if ($category.normal && !$category.normalMonster) {
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{category: 'Normal'}, {[Op.not]: {card: 'Monster'}}]
      })
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{class: 'Normal'}, {[Op.not]: {card: 'Monster'}}]
      })
    }

    if ($category.ritual && $category.ritualMonster)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Ritual']
        }
      }

    if (!$category.ritual && $category.ritualMonster) {
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{card: 'Monster'}, {category: 'Ritual'}]
      })
    }

    if ($category.ritual && !$category.ritualMonster) {
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{category: 'Ritual'}, {[Op.not]: {card: 'Monster'}}]
      })
    }

    if ($category.pendulum)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Pendulum']
        }
      }
    if ($category.pendulum)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Pendulum']
        }
      }

    if ($category.effect)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Effect']
        }
      }
    if ($category.effect)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Effect']
        }
      }
    if ($category.effect)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Effect']
        }
      }

    if ($class.gemini)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Gemini']
        }
      }
    if ($class.gemini)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Gemini']
        }
      }

    if ($class.toon)
      filters[Op.and][2][Op.or][1] = {
        class: {[Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Toon']}
      }
    if ($class.toon)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Toon']
        }
      }

    if ($class.flip)
      filters[Op.and][2][Op.or][1] = {
        class: {[Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Flip']}
      }
    if ($class.flip)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Flip']
        }
      }

    if ($class.spirit)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Spirit']
        }
      }
    if ($class.spirit)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Spirit']
        }
      }

    if ($class.tuner)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Tuner']
        }
      }
    if ($class.tuner)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Tuner']
        }
      }

    if ($class.union)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Union']
        }
      }
    if ($class.union)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Union']
        }
      }

    console.log('filters after cats', filters)

    console.log(
      'filters[Op.and][2][Op.or][0].category[Op.or]',
      filters[Op.and][2][Op.or][0].category[Op.or]
    )
    console.log(
      'filters[Op.and][2][Op.or][1].class[Op.or]',
      filters[Op.and][2][Op.or][1].class[Op.or]
    )
    console.log(
      'filters[Op.and][2][Op.or][2].subclass[Op.or]',
      filters[Op.and][2][Op.or][2].subclass[Op.or]
    )
    console.log('filters[Op.and][2][Op.or][3]', filters[Op.and][2][Op.or][3])
    console.log('filters[Op.and][2][Op.or][4]', filters[Op.and][2][Op.or][4])
    console.log('filters[Op.and][2][Op.or][5]', filters[Op.and][2][Op.or][5])
    console.log('filters[Op.and][2][Op.or][6]', filters[Op.and][2][Op.or][6])

    if (
      !filters[Op.and][2][Op.or][0].category[Op.or].length &&
      !filters[Op.and][2][Op.or][1].class[Op.or].length &&
      !filters[Op.and][2][Op.or][2].subclass[Op.or].length &&
      !filters[Op.and][2][Op.or][3] &&
      !filters[Op.and][2][Op.or][4] &&
      !filters[Op.and][2][Op.or][5] &&
      !filters[Op.and][2][Op.or][6]
    ) {
      filters[Op.and] = filters[Op.and].slice(0, 2)
    }

    if (req.query.card)
      filters[Op.and] = [...filters[Op.and], {card: req.query.card}]
    if (req.query.name)
      filters[Op.and] = [
        ...filters[Op.and],
        {name: {[Op.iLike]: `%${req.query.name}%`}}
      ]
    if (req.query.description)
      filters[Op.and] = [
        ...filters[Op.and],
        {description: {[Op.iLike]: `%${req.query.description}%`}}
      ]
    if (req.query.level)
      filters[Op.and] = [
        ...filters[Op.and],
        {
          level: {
            [Op.lte]: Number(req.query.level[1]),
            [Op.gte]: Number(req.query.level[0])
          }
        }
      ]
    if (req.query.atk)
      filters[Op.and] = [
        ...filters[Op.and],
        {
          atk: {
            [Op.lte]: Number(req.query.atk[1]),
            [Op.gte]: Number(req.query.atk[0])
          }
        }
      ]
    if (req.query.def)
      filters[Op.and] = [
        ...filters[Op.and],
        {
          def: {
            [Op.lte]: Number(req.query.def[1]),
            [Op.gte]: Number(req.query.def[0])
          }
        }
      ]
    if (date) filters[Op.and] = [...filters[Op.and], {date: {[Op.lte]: date}}]

    console.log('filters', filters)

    console.log('filters[Op.and][0]', filters[Op.and][0])

    console.log('filters[Op.and][1]', filters[Op.and][1])

    console.log('filters[Op.and][2]', filters[Op.and][2])

    console.log('filters[Op.and][3]', filters[Op.and][3])

    console.log('filters[Op.and][4]', filters[Op.and][4])

    const cards = await Card.findAll({where: filters})
    res.json(cards)
  } catch (err) {
    next(err)
  }
})

router.get('/first/:x', async (req, res, next) => {
  try {
    const cards = await Card.findAll({
      limit: req.params.x,
      order: [['name', 'ASC']]
    })
    res.json(cards)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const card = await Card.findOne({
      where: {
        id: req.params.id
      }
    })
    res.json(card)
  } catch (err) {
    next(err)
  }
})
