/* eslint-disable max-statements */
/* eslint-disable complexity */
const router = require('express').Router()
const {Card, Status} = require('../db/models')
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
    const day = req.query.day
      ? req.query.day.length === 1 ? `0${req.query.day}` : req.query.day
      : '31'
    const month = req.query.month
      ? req.query.month.length === 1 ? `0${req.query.month}` : req.query.month
      : '12'
    const year = req.query.year ? req.query.year : '2020'
    const date = `${year}-${month}-${day}`

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
        },
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
    const $monsterCategory = JSON.parse(req.query.monsterCategory)
    const $spelltrapCategory = JSON.parse(req.query.spelltrapCategory)
    const $class = JSON.parse(req.query.class)

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

    if ($spelltrapCategory.continuous)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [
            ...filters[Op.and][2][Op.or][0].category[Op.or],
            'Continuous'
          ]
        }
      }

    if ($spelltrapCategory.counter)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Counter']
        }
      }

    if ($monsterCategory.effect)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Effect']
        }
      }
    if ($monsterCategory.effect)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Effect']
        }
      }
    if ($monsterCategory.effect)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Effect']
        }
      }

    if ($spelltrapCategory.equip)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Equip']
        }
      }

    if ($spelltrapCategory.field)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Field']
        }
      }

    if ($monsterCategory.fusion)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Fusion']
        }
      }
    if ($monsterCategory.fusion)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Fusion']
        }
      }
    if ($monsterCategory.fusion)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Fusion']
        }
      }

    if ($monsterCategory.link)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Link']
        }
      }
    if ($monsterCategory.link)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Link']
        }
      }
    if ($monsterCategory.link)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Link']
        }
      }

    if ($spelltrapCategory.normal && $monsterCategory.normal)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Normal']
        }
      }

    if ($spelltrapCategory.normal && $monsterCategory.normal)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Normal']
        }
      }

    if ($spelltrapCategory.normal && $monsterCategory.normal)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Normal']
        }
      }

    if (!$spelltrapCategory.normal && $monsterCategory.normal) {
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{card: 'Monster'}, {category: 'Normal'}]
      })
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{card: 'Monster'}, {class: 'Normal'}]
      })
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{card: 'Monster'}, {subclass: 'Normal'}]
      })
    }

    if ($spelltrapCategory.normal && !$monsterCategory.normal) {
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{category: 'Normal'}, {[Op.not]: {card: 'Monster'}}]
      })
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{class: 'Normal'}, {[Op.not]: {card: 'Monster'}}]
      })
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{subclass: 'Normal'}, {[Op.not]: {card: 'Monster'}}]
      })
    }

    if ($monsterCategory.pendulum)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Pendulum']
        }
      }

    if ($monsterCategory.pendulum)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Pendulum']
        }
      }

    if ($monsterCategory.pendulum)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Pendulum']
        }
      }

    if ($spelltrapCategory.quickPlay)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [
            ...filters[Op.and][2][Op.or][0].category[Op.or],
            'Quick-Play'
          ]
        }
      }

    if ($spelltrapCategory.ritual && $monsterCategory.ritual)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Ritual']
        }
      }

    if ($spelltrapCategory.normal && $monsterCategory.ritual)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Ritual']
        }
      }

    if ($spelltrapCategory.normal && $monsterCategory.ritual)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Ritual']
        }
      }

    if (!$spelltrapCategory.ritual && $monsterCategory.ritual) {
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{card: 'Monster'}, {category: 'Ritual'}]
      })
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{card: 'Monster'}, {class: 'Ritual'}]
      })
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{card: 'Monster'}, {subclass: 'Ritual'}]
      })
    }

    if ($spelltrapCategory.ritual && !$monsterCategory.ritual) {
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{category: 'Ritual'}, {[Op.not]: {card: 'Monster'}}]
      })
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{class: 'Ritual'}, {[Op.not]: {card: 'Monster'}}]
      })
      filters[Op.and][2][Op.or].push({
        [Op.and]: [{subclass: 'Ritual'}, {[Op.not]: {card: 'Monster'}}]
      })
    }

    if ($monsterCategory.synchro)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Synchro']
        }
      }

    if ($monsterCategory.synchro)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Synchro']
        }
      }

    if ($monsterCategory.synchro)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Synchro']
        }
      }

    if ($monsterCategory.xyz)
      filters[Op.and][2][Op.or][0] = {
        category: {
          [Op.or]: [...filters[Op.and][2][Op.or][0].category[Op.or], 'Xyz']
        }
      }

    if ($monsterCategory.xyz)
      filters[Op.and][2][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][2][Op.or][1].class[Op.or], 'Xyz']
        }
      }

    if ($monsterCategory.xyz)
      filters[Op.and][2][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][2][Op.or][2].subclass[Op.or], 'Xyz']
        }
      }

    if ($class.gemini)
      filters[Op.and][3][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][3][Op.or][1].class[Op.or], 'Gemini']
        }
      }
    if ($class.gemini)
      filters[Op.and][3][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][3][Op.or][2].subclass[Op.or], 'Gemini']
        }
      }

    if ($class.toon)
      filters[Op.and][3][Op.or][1] = {
        class: {[Op.or]: [...filters[Op.and][3][Op.or][1].class[Op.or], 'Toon']}
      }
    if ($class.toon)
      filters[Op.and][3][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][3][Op.or][2].subclass[Op.or], 'Toon']
        }
      }

    if ($class.flip)
      filters[Op.and][3][Op.or][1] = {
        class: {[Op.or]: [...filters[Op.and][3][Op.or][1].class[Op.or], 'Flip']}
      }
    if ($class.flip)
      filters[Op.and][3][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][3][Op.or][2].subclass[Op.or], 'Flip']
        }
      }

    if ($class.spirit)
      filters[Op.and][3][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][3][Op.or][1].class[Op.or], 'Spirit']
        }
      }
    if ($class.spirit)
      filters[Op.and][3][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][3][Op.or][2].subclass[Op.or], 'Spirit']
        }
      }

    if ($class.tuner)
      filters[Op.and][3][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][3][Op.or][1].class[Op.or], 'Tuner']
        }
      }
    if ($class.tuner)
      filters[Op.and][3][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][3][Op.or][2].subclass[Op.or], 'Tuner']
        }
      }

    if ($class.union)
      filters[Op.and][3][Op.or][1] = {
        class: {
          [Op.or]: [...filters[Op.and][3][Op.or][1].class[Op.or], 'Union']
        }
      }
    if ($class.union)
      filters[Op.and][3][Op.or][2] = {
        subclass: {
          [Op.or]: [...filters[Op.and][3][Op.or][2].subclass[Op.or], 'Union']
        }
      }

    const OpAndElem2Filtered = filters[Op.and][2][Op.or].filter(function(
      elem,
      index
    ) {
      if (index < 3 && elem.category) {
        if (elem.category[Op.or].length) return elem
      } else if (index < 3 && elem.class) {
        if (elem.class[Op.or].length) return elem
      } else if (index < 3 && elem.subclass) {
        if (elem.subclass[Op.or].length) return elem
      } else if (index >= 3 && elem.length) return elem
    })

    const OpAndElem3Filtered = filters[Op.and][3][Op.or].filter(function(
      elem,
      index
    ) {
      if (index < 3 && elem.category) {
        if (elem.category[Op.or].length) return elem
      } else if (index < 3 && elem.class) {
        if (elem.class[Op.or].length) return elem
      } else if (index < 3 && elem.subclass) {
        if (elem.subclass[Op.or].length) return elem
      } else if (index >= 3 && elem.length) return elem
    })

    filters[Op.and][2][Op.or] = OpAndElem2Filtered
    filters[Op.and][3][Op.or] = OpAndElem3Filtered

    const OpAndFiltered = filters[Op.and].filter(function(elem) {
      if (elem.attribute || elem.type || elem[Op.or].length) return elem
    })

    filters[Op.and] = OpAndFiltered

    if (req.query.card !== 'all')
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

    const cards = await Card.findAll({
      where: filters,
      order: [['name', 'ASC']]
    })
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

    const status = await Status.findOne({
      where: {
        cardId: req.params.id
      }
    })

    const info = {
      card: card,
      status: status || null
    }

    res.json(info)
  } catch (err) {
    next(err)
  }
})
