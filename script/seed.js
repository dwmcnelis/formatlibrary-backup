'use strict'

const db = require('../server/db')
const {User, Comment, Sighting, Species} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      firstName: 'Blue',
      lastName: 'Ghost',
      email: 'blue@gmail.com',
      password: '123',
      imageUrl: 'https://i.imgur.com/zhBKT0q.png'
    }),
    User.create({
      firstName: 'Pink',
      lastName: 'Ghost',
      email: 'pink@gmail.com',
      password: '123',
      imageUrl: 'https://i.imgur.com/HENTupr.png'
    }),
    User.create({
      firstName: 'Orange',
      lastName: 'Ghost',
      email: 'orange@gmail.com',
      password: '123',
      imageUrl: 'https://i.imgur.com/fO5EXxD.png'
    }),
    User.create({
      firstName: 'Purple',
      lastName: 'Ghost',
      email: 'purple@gmail.com',
      password: '123',
      imageUrl: 'https://i.imgur.com/FTJk5rI.png'
    }),
    User.create({
      firstName: 'Red',
      lastName: 'Ghost',
      email: 'red@gmail.com',
      password: '123',
      imageUrl: 'https://i.imgur.com/gzhGxcv.png'
    }),
    User.create({
      firstName: 'Daniel',
      lastName: 'McNelis',
      email: 'dan@gmail.com',
      password: '123',
      isAdmin: 'true'
    })
  ])

  const species = await Promise.all([
    Species.create({
      id: 1,
      commonName: 'Bald Eagle',
      scientificName: 'Haliaeetus leucocephalus',
      category: 'Bird',
      kingdom: 'Animal',
      description: `The bald eagle is a bird of prey found in North America. A sea eagle, it has two known subspecies and forms a species pair with the white-tailed eagle. It is found near large bodies of open water with an abundant food supply and old-growth trees for nesting.`,
      diet: 'Everything',
      habitat: 'North America',
      isEndangered: false,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/About_to_Launch_%2826075320352%29.jpg/220px-About_to_Launch_%2826075320352%29.jpg'
    }),
    Species.create({
      id: 2,
      commonName: 'American Goldfinch',
      scientificName: 'Spinus tristis',
      category: 'Bird',
      kingdom: 'Animal',
      description: `The American goldfinch is a small North American bird in the finch family. It is migratory, ranging from mid-Alberta to North Carolina during the breeding season, and from just south of the Canada–United States border to Mexico during the winter.`,
      diet: 'Bugs',
      habitat: 'North America',
      isEndangered: false,
      imageUrl:
        'https://www.allaboutbirds.org/guide/assets/photo/124706471-480px.jpg'
    }),
    Species.create({
      id: 3,
      commonName: 'Black Bear',
      scientificName: 'Urus americanus',
      category: 'Mammal',
      kingdom: 'Animal',
      description: `The American black bear is a medium-sized bear native to North America. American black bears are omnivores, with their diets varying greatly depending on season and location. They typically live in largely forested areas, but do leave forests in search of food.`,
      diet: 'Everything',
      habitat: 'North America',
      isEndangered: false,
      imageUrl:
        'https://i.insider.com/5422d9e5ecad0495540c1bf8?width=909&format=jpeg'
    }),
    Species.create({
      id: 4,
      commonName: 'American Chestnut',
      scientificName: 'Castanea dentata',
      category: 'Flowering Tree',
      kingdom: 'Plant',
      description: `The American chestnut is a large, monoecious deciduous tree of the beech family. It was once one of the most common forest trees in North America. However, the species was devastated by chestnut blight, a fungal disease that came from introduced chestnut trees from East Asia.`,
      diet: 'Sunlight, Water, Soil',
      habitat: 'North America',
      isEndangered: true,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/American_Chestnut.JPG/220px-American_Chestnut.JPG'
    }),
    Species.create({
      id: 5,
      commonName: 'Japanese Cherry',
      scientificName: 'Prunus serrulata',
      category: 'Flowering Tree',
      kingdom: 'Plant',
      description: `Japanese cherry, also called hill cherry, oriental cherry, East Asian cherry, is a species of cherry native to China, Japan and Korea, and is used for its spring cherry blossom displays and festivals.`,
      diet: 'Sunlight, Water, Soil',
      habitat: 'Asia, Europe, North America',
      isEndangered: false,
      imageUrl:
        'https://cdn.shopify.com/s/files/1/0062/8532/8445/products/Kwanzan_Cherry_Tree_BB_600x600_41258c9c-bfba-4669-be55-511d9f20fc0f_grande.jpg?v=1567798626'
    }),
    Species.create({
      id: 6,
      commonName: 'Mossy Maze Polypore',
      scientificName: 'Cerrena unicolor',
      category: 'Agaricomycetes',
      kingdom: 'Fungus',
      description: `The mossy maze polypore is a species of poroid fungus in the genus Cerrena. This saprobic fungus causes white rot.`,
      diet: 'Plants',
      habitat: 'Asia, Europe, North America, South America',
      isEndangered: false,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Cerrena_unicolor_45687.jpg/220px-Cerrena_unicolor_45687.jpg'
    }),
    Species.create({
      id: 7,
      commonName: 'Woolybear',
      scientificName: 'Pyrrharctia isabella',
      category: 'Lepidoptera',
      kingdom: 'Animal',
      description: `These tiger moth larvae are usually covered with brown hair in their mid-regions and black hair in their anterior and posterior areas. In direct sunlight, the brown hair looks bright reddish brown.`,
      diet: 'Everything',
      habitat: 'North America',
      isEndangered: false,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Pyrrharctia_isabella_-_Caterpillar_-_Devonian_Fossil_Gorge_-_Iowa_City_-_2014-10-15_-_image_1.jpg/220px-Pyrrharctia_isabella_-_Caterpillar_-_Devonian_Fossil_Gorge_-_Iowa_City_-_2014-10-15_-_image_1.jpg'
    }),
    Species.create({
      id: 8,
      commonName: 'American Bullfrog',
      scientificName: 'Lithobates catesbeianus',
      category: 'Amphibian',
      kingdom: 'Animal',
      description: `The American bullfrog is an amphibious frog. The male bullfrog defends a territory during the breeding season. His call is reminiscent of the roar of a bull, which gives the frog its common name.`,
      diet: 'Fish, Bugs',
      habitat: 'Asia, Europe, North America, South America',
      isEndangered: false,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/North-American-bullfrog1.jpg/220px-North-American-bullfrog1.jpg'
    })
  ])

  const sightings = await Promise.all([
    Sighting.create({
      imageUrl:
        'https://image.shutterstock.com/image-photo/frog-hole-tree-trunk-260nw-1397669852.jpg',
      latitude: 41.40214,
      longitude: -73.193264,
      description:
        'Found this guy at the bottom of a hole in a log at Lake Zoar',
      speciesId: 8,
      userId: 1
    }),
    Sighting.create({
      imageUrl: 'https://www.kimballstock.com/pix/FRG/01/FRG-01-GR0006-01P.JPG',
      latitude: 41.3083,
      longitude: -72.9279,
      description: 'Found this guy in a pond in New Haven.',
      speciesId: 8,
      userId: 2
    }),
    Sighting.create({
      imageUrl:
        'https://media.istockphoto.com/photos/young-north-american-bullfrog-by-a-stream-picture-id182111032?k=6&m=182111032&s=170667a&w=0&h=hLzE7k2guQHL5_7nlw4VEIgLLrnYUx8uOzG7_0zWTZc=',
      latitude: 41.3526,
      longitude: -73.0084,
      description: 'Found this guy in a stream in Woodbridge.',
      speciesId: 8,
      userId: 2
    }),
    Sighting.create({
      imageUrl:
        'https://chestnuthilltreefarm.americommerce.com/Shared/1upload/CT%20trees.jpg',
      latitude: 41.327161,
      longitude: -72.998983,
      description: 'Woodbridge public golf course, 15th hole',
      speciesId: 4,
      userId: 2
    }),
    Sighting.create({
      imageUrl: 'https://www.glaucus.org.uk/Chestnut_7090.jpg',
      latitude: 41.307791,
      longitude: -72.92584,
      description: 'New Haven Green',
      speciesId: 4,
      userId: 2
    }),
    Sighting.create({
      imageUrl:
        'https://s.hdnux.com/photos/01/11/40/55/19270525/3/rawImage.jpg',
      latitude: 41.307791,
      longitude: -72.92584,
      description: 'New Haven Green',
      speciesId: 5,
      userId: 2
    }),
    Sighting.create({
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/3/3f/RedKite_Soaring_Oxfordshire.jpg',
      latitude: 41.369072,
      longitude: -72.971409,
      description:
        'West Rock, Woodbridge. There were at least 3 of them flying together.',
      speciesId: 1,
      userId: 3
    }),
    Sighting.create({
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRWZlGOTN6XeN9UXpGiVWZ81ecnAOF_ZyBiNoJrY0FUYBh0l1eZ&usqp=CAU',
      latitude: 41.358032,
      longitude: -72.964521,
      description: 'West Rock, Hamden',
      speciesId: 1,
      userId: 4
    }),
    Sighting.create({
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSUJmZrVlgaPJYhT5iwz_m8AP4mOT1xQ5_L3c8uhMsK_lh51SrY&usqp=CAU',
      latitude: 41.358759,
      longitude: -73.029717,
      description: 'Hickory Road, Woodbridge',
      speciesId: 1,
      userId: 2
    }),
    Sighting.create({
      imageUrl:
        'https://www.almanac.com/sites/default/files/styles/primary_image_in_article/public/image_nodes/woolly-bear-caterpillar-winter.jpg?itok=EYPjYNUJ',
      latitude: 41.358759,
      longitude: -73.029717,
      description: 'Crawling along the side of the road in the sun',
      speciesId: 7,
      userId: 2
    }),
    Sighting.create({
      imageUrl:
        'https://ssl.c.photoshelter.com/img-get/I0000XcOgLF_HYOI/s/750/750/apple-blossoms-goldfinch-0520180041.jpg',
      latitude: 41.327161,
      longitude: -72.998983,
      description: 'Woodbridge public golf course, 9th hole by the club house',
      speciesId: 2,
      userId: 2
    })
  ])

  const comments = await Promise.all([
    Comment.create({
      sightingId: 1,
      userId: 2,
      body: `Wow that's so cool!!!`
    }),
    Comment.create({
      sightingId: 1,
      userId: 1,
      body: `Thanks dude :^)`
    }),
    Comment.create({
      sightingId: 4,
      userId: 3,
      body: `Did it have any noticeable blight? I'm collecting data on chestnut trees.`
    }),
    Comment.create({
      sightingId: 10,
      userId: 2,
      body: `That's so friggin' cute omg. I don't even like bugs`
    }),
    Comment.create({
      sightingId: 11,
      userId: 2,
      body: `What a gorgeous bird!`
    })
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${comments.length} comments`)
  console.log(`seeded ${species.length} species`)
  console.log(`seeded ${sightings.length} sightings`)
  console.log(`seeded successfully`)
}

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

if (module === require.main) {
  runSeed()
}

module.exports = seed
