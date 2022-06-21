# Format Library

Format Library is a public resource for learning about the Yu-Gi-Oh! Trading Card Game and its competitive history in the West, which dates from 2002 to the present. Please note: trademarked artwork and card text is used for informational purposes under U.S. fair use copyright policy, and this website is not affiliated with 4K Media or Konami Digital Entertainment, who own said copyrights.

This website is built on extensive coverage of events, players, and deck lists, spanning the history of different Yu-Gi-Oh! "formats" (eras). Additionally, the website maintains a complete card database that is updated nightly. These databases (Cards, Decks, Events, Formats, and Players) provide a complete picture of the game's extensive history. These data are all related to each other, and one of my main goals with this project is to facilitate the natural connections between them. 

As a former competitive player, I constantly ask myself "What tools do I wish I had to do my own research on the game?". I try to be creative and bold with my answers, basing them not on what is currently available from other apps, but rather what I can imagine. When I work on the code and framework of this project, I try my best to translate these ideals into realities.

This app was built with React and Material-UI (front-end framework), Express and Morgan (server), Chart.js (plotting charts), Axios (fetching external data), PostgreSQL (internal database), Sequelize (interacting with internal database), and Webpack (web bundler). Much of the internal data on tournaments and players is generated via RetroBot: https://github.com/danielmcnelis/retrobot.

Main website: https://formatlibrary.com<br/>
Discord community server: https://discord.com/invite/formatlibrary

![Home](/public/screenshots/Home.jpg)

# Card Database

Format Libary maintains a continuously updated, user-friendly Card Database.<br/>
The following search options are available:<br/>
• **String matches** in Card Name or Card Text<br/>
• **Historic Availability by Format** i.e. All, Goat, Edison, HAT, etc.<br/>
• **Card Categories** i.e. All, Monsters, Spells, or Traps<br/>
• **Spell and Trap Categories** i.e. Continuous, Counter, Equip, Field, Normal, Quick-Play, or Ritual<br/>
• **Monster Attributes** i.e. DARK, DIVINE, EARTH, FIRE, LIGHT, WATER, or WIND<br/>
• **Monster Types** i.e. Aqua, Beast, Beast-Warrior, Cyberse, Dinosaur, Dragon, Fairy, etc.<br/>
• **Primary Monster Categories** i.e. Normal, Effect, Ritual, Pendulum, Fusion, Synchro, Xyz, or Link<br/>
• **Secondary Monster Categories** i.e. Flip, Gemini, Spirit, Toon, Tuner, or Union<br/>
• **Monster Level** (1-12), **ATK** (0-5000), and **DEF** (0-5000)<br/>
• **Historic Availability by Release Date** (Day, Month, Year)<br/>

![Card-Database-Search](/public/screenshots/Card-Database-Search.jpg)

Results can be displayed as either:<br/>
**(1) Easy-to-read Spoilers (a Table) with important facts, icons, and small card images.**

![Card-Database-Results-Table](/public/screenshots/Card-Database-Results-Table.jpg)

**(2) A Gallery of full-size card images.**

![Card-Database-Results-Gallery](/public/screenshots/Card-Database-Results-Gallery.jpg)

• Results can be sorted by Card Name, Release Date, ATK, DEF, or Level.<br/>
• Results are paginated and the quantity displayed can be changed.<br/>
• Results link to Single Card details.

# Single Card Details

Single Card pages are seemlessly linked throughout the website from:<br>
• The Card Database<br>
• Single Decks<br>
• Ban Lists

![Single-Card-Details](/public/screenshots/Single-Card-Details.jpg)

Single Card pages display:<br>
• A full-size, high quality rendering of the card.<br>
• All information displayed on the actual card.<br>
• A status summary bar that links to Ban Lists.<br>
• A list of prints with links to a 3rd party retailer.

# Deck Database

Format Libary features a unique and highly informative Deck Database.<br/>
The following search options are available:<br/>
• **String matches** in Deck Type, Builder's Name, or Event Name<br/>
• **Event Format** ie. All, Goat, Edison, HAT, etc.<br/>
• **Deck Categories** i.e. All, Aggro, Combo, Control, or Lockdown<br/>

Results can be displayed as either:<br/>
**(1) A Table with important facts, player profile pictures, and community logos.**

![Deck-Database-Results-Table](/public/screenshots/Deck-Database-Results-Table.jpg)

**(2) A Gallery of Node Canvas generated deck thumbnails.**

![Deck-Database-Results-Gallery](/public/screenshots/Deck-Database-Results-Gallery.jpg)

• Results can be sorted by Builder, Event, Format, Placement, Upload Date, etc.<br/>
• Results are paginated and the quantity displayed can be changed.<br/>
• Results link to Single Deck details.

# Deck Profiles

Deck Profile pages are seemlessly linked throughout the website from:<br>
• The Deck Database<br>
• Event Summaries<br>
• Blogposts

![Deck-Profile](/public/screenshots/Deck-Profile.jpg)

Deck Profile pages display:<br>
• Key information: Builder, Deck Category, Deck Name, Event, Placement, Upload Date.<br>
• A link to the Builder's Player Profile.<br>
• A link to the Event Summary page.<br>
• All the cards found in the deck, linking to Single Card pages.<br>
• Indicators of the deck's impact: Likes, Downloads, Views.<br>
• A button to download deck as a .YDK file (used by online Yu-Gi-Oh! platforms).

# Event Database

Format Libary features a unique and highly informative Event Database.<br/>
The following search options are available:<br/>
• **String matches** in Event's Name or Winning Player's Name<br/>
• **Event Format** i.e. All, Goat, Edison, HAT, etc.<br/>
• **Host Community** i.e. Format Library, EdisonFormat.com, GoatFormat.com, etc.<br/>

Results are displayed as a table:<br/>

![Event-Database-Table](/public/screenshots/Event-Database-Table.jpg)

• Results can be sorted by Date, Format, Name, Size, or Winner.<br/>
• Results are paginated and the quantity displayed can be changed.<br/>
• Results link to Event Summaries.

# Event Summaries

Event Summaries are seemlessly linked throughout the website from:<br>
• The Event Database<br>
• Deck Profiles<br>
• Format Overviews<br>
• Blogposts

![Event-Summary-1](/public/screenshots/Event-Summary-1.jpg)

![Event-Summary-2](/public/screenshots/Event-Summary-2.jpg)

![Event-Summary-3](/public/screenshots/Event-Summary-3.jpg)

Event Summaries display:<br>
• Key information about the event: Community, Date, Format, Size, Winner, Winning Deck.<br>
• A link to the Winner's Player Profile.<br>
• A link to the Winning Deck's Deck Profile.<br>
• A link to the tournament Format's Format Overview.<br>
• A screenshot of and a link to the externally hosted bracket.<br>
• Thumbnails of the top performing deck lists with Deck Profile links.<br>
• Graphical summaries of overall deck representation and card frequencies.

# Format Menu

Format Libary features a menu to browse various formats.<br/>

![Format-Menu](/public/screenshots/Format-Menu.jpg)

# Format Overviews

Format Overviews are seemlessly linked throughout the website from:<br>
• The Format Menu<br>
• Event Summaries<br>
• Deck Profiles<br>
• Format Overviews<br>
• Blogposts

![Format-Overview-1](/public/screenshots/Format-Overview-1.jpg)

![Format-Overview-2](/public/screenshots/Format-Overview-2.jpg)

Format Overviews display:<br>
• A brief description of the format.<br>
• Thumbnails representing Popular Decks, based on tournament entry frequency.<br>
• Thumbnails of Recent Events, with links to Event Summaries.<br>
• Top 10 Players from the format's live-updating Leaderboard (via RetroBot).<br>
• An array of cards representing the format's Ban List.

# Leaderboards

Leaderboards from Format Overviews can be opened as their own pages, expanding from 10 to up to 1000 players:

![Leaderboard](/public/screenshots/Leaderboard.jpg)

# Ban Lists

Ban Lists from Format Overviews can be opened as their own pages, primarily for the purpose of external linking:

![Ban-List](/public/screenshots/Ban-List.jpg)

# Player Profiles

Player Profiles are seemlessly linked throughout the website from:<br>
• Deck Profiles<br>
• Event Summaries<br>
• Leaderboards

![Player-Profile](/public/screenshots/Player-Profile.jpg)

Player Profiles display:<br>
• The player's current Discord profile picture.<br>
• The player's real name (pending consent).<br>
• The player's DuelingBook username (a popular online Yu-Gi-Oh! platform).<br>
• The player's medals, representing their Elo Rating, in various formats (via RetroBot).<br>
• Thumbnails representing their Favorite Decks, based on tournament entry frequency.