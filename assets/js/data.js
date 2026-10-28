/* Uncovered — catalogue data.
   Placeholder catalogue: artists and albums are fictional so the site can be
   demoed without licensing artwork. Replace with the real catalogue (or load
   it from a commerce backend) when ready. */
(function () {
  const albums = [
    {
      id: 'low-tide-hymns', type: 'vinyl', title: 'Low Tide Hymns', artist: 'Marlowe Vance',
      genre: 'Folk', year: 2026, label: 'Saltmarsh Records', price: 32, status: 'instock',
      tags: ['new'], released: '2026-10-03', code: 'LTH-1026',
      art: { pattern: 'waves', bg: '#1F3B4D', fg: '#E9E4D4', accent: '#D98E04', label: '#D98E04' },
      blurb: 'Hushed guitar and a salt-worn voice. A folk record written over one long winter in a lighthouse keeper\'s cottage.',
      tracks: [['A1', 'Harbour Lights', '3:58'], ['A2', "The Ferryman's Daughter", '4:21'], ['A3', 'Low Tide Hymn', '5:02'], ['A4', 'Rope & Tar', '3:12'], ['B1', 'Sea Glass', '4:05'], ['B2', 'What the Gulls Know', '3:47'], ['B3', 'Lantern Season', '4:40'], ['B4', 'Home by Morning', '6:01']],
      extras: {
        interview: [
          ['You wrote this in a lighthouse cottage. Why there?', 'I needed a place where the only schedule was the tide. Twice a day the sea left, twice a day it came back. The songs started to follow that rhythm.'],
          ['The record sounds very close, almost in the room.', 'One microphone, one guitar, the stove ticking in the background. Listen to "Sea Glass" on headphones and you can hear the kettle.'],
          ['What should people listen for?', 'The silence between songs. We cut the gaps longer on purpose for the vinyl.']
        ],
        lyrics: [{ track: 'Low Tide Hymn', lines: ['The water folds its hands and leaves', 'the harbour bare as Sunday sleeves,', 'I count the boats that lean like friends', 'on mud that waits for tide to mend.', '', 'Oh low tide, hymn me home,', 'every rope I tie comes loose.', 'Oh low tide, hymn me home,', 'I was never built for truce.'] }],
        live: { venue: "St. Brigid's Chapel", city: 'Galway', date: '2026-08-14', setlist: ['Harbour Lights', 'Sea Glass', 'Lantern Season', 'Home by Morning'], note: 'Recorded in one take in front of forty people and a lot of candles.' },
        story: ['In January 2025 Marlowe Vance rented a keeper\'s cottage on the west coast. It had no internet and a stove that took an hour to light. The plan was to rest. Instead, twelve songs arrived in eight weeks.', 'The album was recorded in the same cottage that spring with producer Anna Keogh, who brought a single ribbon microphone and a reel-to-reel machine. Nothing was overdubbed, and the vinyl was cut at half speed to keep the quiet passages quiet.']
      }
    },
    {
      id: 'concrete-bloom', type: 'vinyl', title: 'Concrete Bloom', artist: 'The Quiet Arcade',
      genre: 'Indie Rock', year: 2026, label: 'Northern Grey', price: 29, status: 'instock',
      tags: ['new'], released: '2026-10-17', code: 'CBL-1026',
      art: { pattern: 'bauhaus', bg: '#E8D9C0', fg: '#1B1B1B', accent: '#D2452B', label: '#D2452B' },
      blurb: 'Strip lights, last buses and the odd tenderness of a city at 4 a.m. Recorded live in an abandoned print works.',
      tracks: [['A1', 'Overpass', '3:31'], ['A2', 'Concrete Bloom', '4:02'], ['A3', 'Strip-Light Romance', '3:44'], ['A4', 'Kerosene', '2:58'], ['A5', 'Rooftop Weather', '4:15'], ['B1', 'Tram Lines', '3:39'], ['B2', 'Night Bus Sermon', '4:48'], ['B3', 'Pigeons & Prophets', '3:20'], ['B4', 'The Last Shift', '5:26']],
      extras: {
        interview: [
          ['The title sounds like a contradiction.', 'It\'s the weeds coming up through the car park. That\'s the city we grew up in: ugly and beautiful in the same square metre.'],
          ['How was it recorded?', 'Live in a disused print works. Four of us facing each other, no headphones.'],
          ['Favourite moment on the record?', 'The end of "Night Bus Sermon". The tape ran out two seconds after the last chord.']
        ],
        lyrics: [{ track: 'Concrete Bloom', lines: ['Grey on grey on grey again,', 'the rain is writing on the pane,', 'but something green is pushing through', 'the crack that I was saving you.', '', 'Concrete bloom, concrete bloom,', 'there\'s a garden in this room.', 'Every wall we never knew', 'is a place for something new.'] }],
        live: { venue: 'The Print Works', city: 'Leeds', date: '2026-06-21', setlist: ['Overpass', 'Kerosene', 'Tram Lines', 'Night Bus Sermon'], note: 'Filmed in the room where the album was made.' },
        story: ['The Quiet Arcade met working night shifts at the same sorting depot. Concrete Bloom is the record of those years.', 'The band tracked it live over six days in an abandoned print works, using the long concrete hall as a natural echo chamber. It is pressed on recycled black vinyl.']
      }
    },
    {
      id: 'midnight-ledger', type: 'vinyl', title: 'Midnight Ledger', artist: 'Odessa Kray Quartet',
      genre: 'Jazz', year: 2026, label: 'Blue Lantern', price: 36, status: 'instock',
      tags: ['reco', 'new'], released: '2026-09-26', code: 'MDL-0926',
      art: { pattern: 'rings', bg: '#0F1A2B', fg: '#D9C9A3', accent: '#C2471B', label: '#C2471B' },
      blurb: 'Six pieces, one night. A pianoless quartet playing tunes found in the margins of a night accountant\'s ledgers.',
      liner: 'Odessa Kray (tenor saxophone), Jun Arai (vibraphone), Mathis Oyelaran (double bass), Clem Fournier (drums). Recorded in a single night session, mastered for vinyl from analogue tape.',
      tracks: [['A1', 'Ledger (Opening Balance)', '6:12'], ['A2', 'Night Clerk', '7:40'], ['A3', 'Ink on Velvet', '5:55'], ['B1', 'Carried Forward', '8:03'], ['B2', 'Small Hours Waltz', '6:27'], ['B3', 'Closing Balance', '7:18']],
      extras: {
        interview: [
          ['Why name a jazz record after a ledger?', 'My father was a night accountant. He\'d come home at dawn humming. I always wondered which tunes lived between the numbers.'],
          ['The quartet plays without a piano.', 'Leaving out the piano leaves room. Saxophone, vibes, bass, drums: everyone has to listen harder.'],
          ['Best way to hear it?', 'Late, lights low, side A straight through. It\'s written as one night.']
        ],
        lyrics: [],
        live: { venue: 'Le Caveau des Heures', city: 'Paris', date: '2026-05-09', setlist: ['Night Clerk', 'Small Hours Waltz', 'Carried Forward'], note: 'Two sets in a vaulted cellar club, recorded direct to two-track.' },
        story: ['Odessa Kray started writing Midnight Ledger after finding her father\'s old account books, their margins full of pencilled melodies. Each piece takes a line from those notebooks as its starting point.', 'It is our Current Reco because it rewards exactly the kind of listening a turntable invites: start to finish, no skipping.']
      }
    },
    {
      id: 'velvet-static', type: 'vinyl', title: 'Velvet Static', artist: 'Nia Okafor',
      genre: 'Soul', year: 2026, label: 'Halcyon House', price: 31, status: 'low', stock: 3,
      tags: ['bestseller'], released: '2026-04-10', code: 'VST-0426',
      art: { pattern: 'arches', bg: '#5B1E2D', fg: '#F2D7C4', accent: '#E8A13A', label: '#E8A13A' },
      blurb: 'Warm horns, live strings and the hiss of her mother\'s old 45s, sampled before the needle reaches the music.',
      tracks: [['A1', 'Velvet Static', '4:11'], ['A2', 'Call Me Sunday', '3:49'], ['A3', 'Radio in the Kitchen', '4:26'], ['A4', 'Slow Burn', '5:03'], ['B1', 'Gold Tooth Grin', '3:37'], ['B2', "Your Mother's Records", '4:44'], ['B3', 'Honey, Hold', '3:58'], ['B4', 'Static Fades', '5:15']],
      extras: {
        interview: [
          ['There\'s crackle all over this record. On purpose?', 'Every bit of it. I sampled my mum\'s soul 45s, just the silence before the music starts. That hiss is my childhood.'],
          ['Who plays on it?', 'A horn section from Lagos, a string quartet from Bristol, and my aunt singing backing vocals on "Honey, Hold".'],
          ['Why vinyl?', 'Because the record is about records. It would be strange anywhere else.']
        ],
        lyrics: [{ track: 'Call Me Sunday', lines: ['Call me Sunday, call me slow,', 'call me anything but go.', 'Leave the radio on low,', 'let the velvet static grow.', '', 'I\'ve got nowhere else to be', 'than this kitchen, you and me.', 'Let the kettle sing its key,', 'let the morning set us free.'] }],
        live: { venue: 'Halcyon House, Studio A', city: 'Bristol', date: '2026-07-02', setlist: ['Velvet Static', 'Call Me Sunday', "Your Mother's Records", 'Honey, Hold'], note: 'A ten-piece band, strings included, in a live room built in 1971.' },
        story: ['Velvet Static began as a box of 45s. When Nia Okafor inherited her mother\'s soul collection, she started sampling the quiet run-in grooves, the warm hiss before each song, and writing over them.', 'The finished album layers that hiss under live horns and strings. The connected sleeve includes the original 45s that inspired each song.']
      }
    },
    {
      id: 'pale-machines', type: 'vinyl', title: 'Pale Machines', artist: 'HALVARD',
      genre: 'Electronic', year: 2026, label: 'Polar Signal', price: 33, status: 'instock',
      tags: ['bestseller'], released: '2026-03-13', code: 'PLM-0326',
      art: { pattern: 'bars', bg: '#D6DCDF', fg: '#14181B', accent: '#2F5BFF', label: '#2F5BFF' },
      blurb: 'Modular synths powered by a fjord\'s hydro line. Side A is for the body, side B is for the walk home.',
      liner: 'Built on modular synthesizers in a converted boathouse, powered by the local hydro-electric line.',
      tracks: [['A1', 'Boot Sequence', '5:20'], ['A2', 'Pale Machines', '6:44'], ['A3', 'Fjord Logic', '5:57'], ['B1', 'Cold Start', '6:10'], ['B2', 'Heat Sink', '7:02'], ['B3', 'Shutdown (Slowly)', '8:15']],
      extras: {
        interview: [
          ['You recorded in a boathouse?', 'On a fjord, powered by the local hydro line. When the water ran fast the voltage wobbled. You can hear it detune on "Fjord Logic".'],
          ['Is this dance music?', 'Side A is for the body. Side B is for the walk home.'],
          ['Why vinyl?', 'Bass. A properly cut record moves air in a way a stream just doesn\'t.']
        ],
        lyrics: [],
        live: { venue: 'Kraftverket Hall', city: 'Bergen', date: '2026-03-28', setlist: ['Boot Sequence', 'Fjord Logic', 'Heat Sink'], note: 'A 40-minute continuous set filmed in a disused power station.' },
        story: ['HALVARD spent a winter in a boathouse on a Norwegian fjord with a wall of modular synthesizers and no plan beyond "make something cold that feels warm".', 'Every sound on the record was played by hand; there are no loops. The connected sleeve includes patch diagrams for each track.']
      }
    },
    {
      id: 'saint-ouen-sessions', type: 'vinyl', title: 'Saint-Ouen Sessions', artist: 'Les Fils du Marché',
      genre: 'Jazz', year: 2025, label: 'Puces Disques', price: 34, status: 'instock',
      tags: ['bestseller'], released: '2025-11-07', code: 'SOS-1125',
      art: { pattern: 'sun', bg: '#E9DCC2', fg: '#2A1E14', accent: '#C2471B', label: '#C2471B' },
      blurb: 'Gypsy jazz recorded at stall 117 of the Saint-Ouen flea market at seven on a Sunday morning, before the crowds arrived.',
      liner: 'Two guitars, violin and double bass, recorded on two microphones among the stalls of Marché Vernaison.',
      tracks: [['A1', 'Rue des Rosiers', '4:30'], ['A2', 'Marché Vernaison', '5:12'], ['A3', 'La Valse du Brocanteur', '3:58'], ['A4', 'Dimanche Matin', '4:47'], ['B1', 'Manouche Café', '3:39'], ['B2', 'Le Disquaire', '5:25'], ['B3', 'Porte de Clignancourt', '4:16'], ['B4', 'Fin de Marché', '6:02']],
      extras: {
        interview: [
          ['You played in the flea market for years.', 'Every Sunday for nine years, between a lamp seller and a man who only sold doorknobs. That\'s where these tunes were tested.'],
          ['Why record there?', 'We set up two microphones at stall 117 at seven in the morning. You can hear the shutters going up.'],
          ['Who is "Le Disquaire"?', 'Michel, who sold us our first records and let us practise behind his stall.']
        ],
        lyrics: [],
        live: { venue: 'Marché Vernaison, Allée 7', city: 'Saint-Ouen', date: '2025-09-14', setlist: ['Rue des Rosiers', 'Manouche Café', 'Le Disquaire', 'Fin de Marché'], note: 'Recorded among the stalls on a Sunday morning, passers-by included.' },
        story: ['Les Fils du Marché are four friends who busked the Saint-Ouen flea market every Sunday for nine years.', 'Saint-Ouen Sessions is the sound of that market waking up. It has been our best-selling record since it came out.']
      }
    },
    {
      id: 'gold-teeth-silver-tongue', type: 'vinyl', title: 'Gold Teeth, Silver Tongue', artist: 'Rook & Rhyme',
      genre: 'Hip-hop', year: 2026, label: 'Backroom Cuts', price: 30, status: 'instock',
      tags: ['new'], released: '2026-10-10', code: 'GTS-1026',
      art: { pattern: 'letter', bg: '#111111', fg: '#E5C452', accent: '#E9E4D4', label: '#E5C452', ink: '#E9E4D4' },
      blurb: 'A producer and an MC who met behind a record-shop counter. Every sample comes from a record bought for under five pounds.',
      tracks: [['A1', 'Intro (Needle Drop)', '1:42'], ['A2', 'Gold Teeth', '3:36'], ['A3', 'Silver Tongue', '3:21'], ['A4', 'Corner Shop Philosophy', '4:05'], ['A5', 'Dusty Fingers', '3:48'], ['B1', 'Crate Diggers Anthem', '3:55'], ['B2', 'Two Turntables & a Grudge', '4:12'], ['B3', 'Mother Tongue', '4:33'], ['B4', 'Outro (Run-Out Groove)', '2:10']],
      extras: {
        interview: [
          ['Every sample cost under five pounds?', 'That was the rule. If it came from the expensive crate, it didn\'t make the record.'],
          ['What\'s in the connected sleeve?', 'Every track mapped to the record it sampled, with the story of where we found it.'],
          ['Favourite find?', 'A gospel LP with a coffee ring on it. It became "Mother Tongue".']
        ],
        lyrics: [{ track: 'Crate Diggers Anthem', lines: ['Saturday morning with a pocket full of change,', 'flicking through the crates, every sleeve a different page.', 'Found a one-pound soul record with a coffee-ring stain,', 'flipped it, chopped it, made it sing again.', '', 'Dig, dig, dig till your fingers turn grey,', 'every lost record had something to say.', 'Dig, dig, dig, put the needle down slow,', 'the best breaks live where nobody goes.'] }],
        live: { venue: 'Backroom Cuts shop floor', city: 'Manchester', date: '2026-04-18', setlist: ['Gold Teeth', 'Dusty Fingers', 'Crate Diggers Anthem', 'Mother Tongue'], note: 'Performed between the record racks, two turntables and a mic.' },
        story: ['Rook & Rhyme met behind the counter of a second-hand record shop in Manchester. One priced the records, the other played them too loud.', 'Gold Teeth, Silver Tongue is built entirely from bargain-bin samples.']
      }
    },
    {
      id: 'glass-orchard', type: 'vinyl', title: 'Glass Orchard', artist: 'Ines Morrow',
      genre: 'Indie Pop', year: 2026, label: 'Lantern & Loom', price: 32, status: 'preorder',
      tags: ['preorder', 'new'], released: '2026-11-21', code: 'GLO-1126',
      art: { pattern: 'moon', bg: '#B9C7B0', fg: '#1E2A22', accent: '#F2EFE6', label: '#1E2A22' },
      blurb: 'A second album recorded in a Victorian glasshouse. The rain on the glass is on every track. Ships on release day.',
      tracks: [['A1', 'Glass Orchard', '3:44'], ['A2', 'Apple Weather', '3:12'], ['A3', 'Greenhouse Girl', '3:58'], ['A4', 'Frost Warning', '4:20'], ['B1', 'Grafting', '3:35'], ['B2', 'Cider Light', '4:01'], ['B3', 'The Long Pick', '4:47'], ['B4', 'Windfall', '5:30']],
      extras: {
        interview: [
          ['You recorded in a greenhouse?', 'A Victorian glasshouse in my grandmother\'s village. The rain on the glass is on every track.'],
          ['What do pre-order sleeves unlock?', 'A demo version of every song, the way it sounded on my phone the night I wrote it.'],
          ['Release-day plans?', 'A listening party in the orchard, if it doesn\'t snow.']
        ],
        lyrics: [{ track: 'Apple Weather', lines: ['There\'s apple weather in the hall,', 'your coat still hanging on the wall.', 'The light comes slanted, gold and thin,', 'it asks me if I\'ll let it in,', '', 'and I say yes, and I say yes', 'to every season I have left.', 'The orchard glass, the frost, the fall,', 'I want to feel it, want it all.'] }],
        live: { venue: 'The Glasshouse', city: 'Herefordshire', date: '2026-09-30', setlist: ['Glass Orchard', 'Apple Weather', 'Windfall'], note: 'The first performance of the new songs, filmed at golden hour.' },
        story: ['After two years of touring, Ines Morrow went back to her grandmother\'s village and borrowed the glasshouse at the bottom of the orchard.', 'Glass Orchard was recorded there through autumn, with the doors open and the rain on the roof.']
      }
    },
    {
      id: 'nocturnes-for-a-rented-room', type: 'vinyl', title: 'Nocturnes for a Rented Room', artist: 'Elsa Brandt',
      genre: 'Classical', year: 2026, label: 'Kammer Editions', price: 35, status: 'instock',
      tags: [], released: '2026-02-20', code: 'NRR-0226',
      art: { pattern: 'keys', bg: '#F1EEE6', fg: '#121212', accent: '#9C2B23', label: '#9C2B23' },
      blurb: 'Six solo piano nocturnes, each written for one of the flats she rented, and each played on the piano that came with it.',
      liner: 'Elsa Brandt, solo piano. Six pianos, six rooms, recorded between 2019 and 2025.',
      tracks: [['A1', 'Nocturne No. 1 "Landlord\'s Piano"', '5:40'], ['A2', 'Nocturne No. 2 "Radiator"', '4:55'], ['A3', 'Nocturne No. 3 "Neighbour\'s Light"', '6:20'], ['B1', 'Nocturne No. 4 "Moving Boxes"', '5:15'], ['B2', 'Nocturne No. 5 "Last Rent"', '7:02'], ['B3', 'Nocturne No. 6 "Keys on the Table"', '6:48']],
      extras: {
        interview: [
          ['Why a rented room?', 'Six flats in eight years. Each nocturne is for one of them, recorded on whatever piano came with the room.'],
          ['Isn\'t an out-of-tune piano a problem?', 'It\'s a character. The piano for No. 2 had a sticky key, so I wrote around it.'],
          ['How should we listen?', 'In the dark, honestly.']
        ],
        lyrics: [],
        live: { venue: 'Kleiner Saal, Funkhaus', city: 'Berlin', date: '2026-02-11', setlist: ['Nocturne No. 1', 'Nocturne No. 3', 'Nocturne No. 6'], note: 'One piano, one lamp, one hundred and twenty people holding their breath.' },
        story: ['Elsa Brandt moved six times in eight years, and every flat came with a piano someone had left behind.', 'Nocturnes for a Rented Room is her portrait of those rooms.']
      }
    },
    {
      id: 'northbound', type: 'vinyl', title: 'Northbound', artist: 'Cody Lark & The Long Night',
      genre: 'Rock', year: 2025, label: 'Highway Nine', price: 26, oldPrice: 34, status: 'instock',
      tags: ['sale'], released: '2025-06-06', code: 'NTB-0625',
      art: { pattern: 'stripes', bg: '#C9A66B', fg: '#2B1A10', accent: '#8C2F1B', label: '#8C2F1B' },
      blurb: 'Big-sky rock written across 4,000 miles of night driving. Diesel, motel ice and one very long chorus.',
      tracks: [['A1', 'Northbound', '4:10'], ['A2', 'Diesel Hymnal', '3:52'], ['A3', 'Motel Ice', '3:28'], ['A4', 'Ghost Exit', '4:33'], ['B1', 'Rearview', '3:47'], ['B2', 'Truckstop Saints', '4:09'], ['B3', 'County Line', '3:56'], ['B4', 'The Long Night', '6:18']],
      extras: {
        interview: [
          ['Where was this written?', 'Behind the wheel, mostly. I\'d sing into my phone at red lights.'],
          ['The band name?', 'We only ever rehearsed after midnight. It stuck.'],
          ['The closing track runs over six minutes.', 'It\'s the drive home. You don\'t rush the drive home.']
        ],
        lyrics: [{ track: 'Northbound', lines: ['Headlights cutting through the pines,', 'I\'m counting mile-markers, not signs.', 'The radio\'s down to static and prayer', 'and I don\'t know yet, but I\'m going there.', '', 'Northbound, northbound,', 'nothing but the engine sound.', 'Every town I leave behind', 'is one less ghost inside my mind.'] }],
        live: { venue: 'Highway Nine Roadhouse', city: 'Austin', date: '2025-10-03', setlist: ['Northbound', 'Motel Ice', 'Truckstop Saints', 'The Long Night'], note: 'A full-band set on a roadhouse stage built from old barn wood.' },
        story: ['Cody Lark wrote Northbound across one winter of night driving, from the Gulf to the Canadian border.', 'The Long Night recorded it in nine days in a converted barn.']
      }
    },
    {
      id: 'soft-architecture', type: 'vinyl', title: 'Soft Architecture', artist: 'Komorebi Club',
      genre: 'Ambient', year: 2026, label: 'Polar Signal', price: 34, status: 'preorder',
      tags: ['preorder'], released: '2026-12-05', code: 'SAR-1226',
      art: { pattern: 'dots', bg: '#EDE6DA', fg: '#7F8F81', accent: '#D97757', label: '#7F8F81' },
      blurb: 'Five long ambient pieces about light moving through rooms. Made for rainy afternoons and slow mornings.',
      liner: 'Field recordings, tape loops and a borrowed harmonium, made in a 1960s modernist house.',
      tracks: [['A1', 'Floor Plan', '7:30'], ['A2', 'Light Well', '8:12'], ['A3', 'Paper Walls', '6:45'], ['B1', 'Courtyard', '9:02'], ['B2', 'Soft Architecture', '11:20']],
      extras: {
        interview: [
          ['What is "soft architecture"?', 'The part of a building you can\'t draw: how the light moves, how the floor creaks, how sound travels between rooms.'],
          ['Where was it made?', 'In a modernist house. We recorded each room\'s silence and built the music from that.'],
          ['Best way to listen?', 'Quietly, while doing something else. It\'s meant to sit in the room with you.']
        ],
        lyrics: [],
        live: { venue: 'Casa Luz', city: 'Lisbon', date: '2026-10-12', setlist: ['Light Well', 'Courtyard'], note: 'A daylight performance that follows the sun across the courtyard.' },
        story: ['Komorebi Club is two architects who make music on weekends.', 'Soft Architecture maps a single day in one house, from first light to last.']
      }
    },
    {
      id: 'heatwave-radio', type: 'vinyl', title: 'Heatwave Radio', artist: 'Sol Dakota',
      genre: 'Funk', year: 2025, label: 'Sunday Best Sound', price: 24, oldPrice: 32, status: 'instock',
      tags: ['sale'], released: '2025-07-18', code: 'HWR-0725',
      art: { pattern: 'rays', bg: '#F2B33D', fg: '#3A1A0E', accent: '#E2522A', label: '#3A1A0E' },
      blurb: 'Block-party funk for the hottest day of the year. Tight horns, loose clavinet and a bassline you\'ll feel in your teeth.',
      tracks: [['A1', 'Heatwave Radio', '4:02'], ['A2', 'Ice Cream Truck Breakdown', '3:45'], ['A3', 'Pool Party Politics', '4:18'], ['A4', 'Sprinkler Dance', '3:30'], ['B1', 'Block Party', '4:40'], ['B2', 'Shade', '3:55'], ['B3', 'Fan on High', '4:12'], ['B4', 'Sundown Station', '5:20']],
      extras: {
        interview: [
          ['Was it really recorded in a heatwave?', 'Thirty-eight degrees, no air conditioning. You can hear the fan on "Fan on High". It\'s in the key of the song.'],
          ['Who\'s on horns?', 'The Sunday Best brass: three cousins and a neighbour.'],
          ['The record for?', 'Barbecues. Open windows. Turning it up when the neighbours complain.']
        ],
        lyrics: [{ track: 'Heatwave Radio', lines: ['Ninety-eight degrees and the dial is stuck', 'on a station playing nothing but good luck.', 'The tar is soft, the hydrant\'s loose,', 'the whole block\'s dancing, what\'s the use', '', 'of staying in? Turn it up, turn it up,', 'heatwave radio, fill my cup.', 'Turn it up till the sun goes down,', 'heatwave radio, take this town.'] }],
        live: { venue: 'Rooftop at Sunday Best', city: 'Marseille', date: '2025-08-15', setlist: ['Heatwave Radio', 'Block Party', 'Sundown Station'], note: 'A sunset rooftop show, nine musicians and one very hot generator.' },
        story: ['Sol Dakota recorded Heatwave Radio during the hottest week on record in Marseille, with every window open.', 'It is a party record first, but listen closely to side B: it slows down with the sunset.']
      }
    }
  ];

  const players = [
    {
      id: 'uncovered-one', type: 'player', title: 'Uncovered One', artist: 'Uncovered', genre: 'Record player',
      price: 249, status: 'instock', tags: ['bestseller'], finish: 'Walnut',
      art: { plinth: '#6B4A2F', plinth2: '#7B573A', label: '#C2471B' },
      blurb: 'Our best-selling belt-drive turntable. Quiet, warm and ready to play in five minutes, with a built-in switchable preamp.',
      features: ['Belt drive keeps motor noise away from the record', 'Built-in phono preamp: plug straight into powered speakers', 'Moving-magnet cartridge, pre-mounted and aligned', 'Adjustable counterweight and anti-skate'],
      specs: [['Drive', 'Belt drive'], ['Speeds', '33⅓ / 45 RPM'], ['Cartridge', 'Moving magnet, pre-mounted'], ['Phono preamp', 'Built-in, switchable'], ['Outputs', 'RCA (phono / line)'], ['Platter', 'Die-cast aluminium, felt mat'], ['Tonearm', 'Straight, adjustable counterweight & anti-skate'], ['Dimensions', '42 × 35 × 12 cm'], ['Weight', '5.2 kg']],
      box: ['Dust cover', 'Felt mat', '45 RPM adapter', 'RCA cable', 'Power supply']
    },
    {
      id: 'uncovered-one-bt', type: 'player', title: 'Uncovered One BT', artist: 'Uncovered', genre: 'Record player',
      price: 299, status: 'instock', tags: ['new'], finish: 'Matte black',
      art: { plinth: '#1C1C1C', plinth2: '#2A2A2A', label: '#E9E4D4' },
      blurb: 'Everything we love about the One, plus Bluetooth. Play your records through wireless speakers or headphones.',
      features: ['Bluetooth 5.3 output to speakers and headphones', 'Wired RCA output with built-in preamp', 'Belt drive, aluminium platter', 'Pre-aligned moving-magnet cartridge'],
      specs: [['Drive', 'Belt drive'], ['Speeds', '33⅓ / 45 RPM'], ['Cartridge', 'Moving magnet, pre-mounted'], ['Phono preamp', 'Built-in, switchable'], ['Wireless', 'Bluetooth 5.3'], ['Outputs', 'RCA (phono / line), Bluetooth'], ['Platter', 'Die-cast aluminium'], ['Dimensions', '42 × 35 × 12 cm'], ['Weight', '5.3 kg']],
      box: ['Dust cover', 'Felt mat', '45 RPM adapter', 'RCA cable', 'Power supply']
    },
    {
      id: 'uncovered-studio', type: 'player', title: 'Uncovered Studio', artist: 'Uncovered', genre: 'Record player',
      price: 449, status: 'preorder', tags: ['preorder', 'new'], released: '2026-11-28', finish: 'Stone grey',
      art: { plinth: '#B9B6AD', plinth2: '#C9C6BD', label: '#121212' },
      blurb: 'A direct-drive deck with pitch control and 78 RPM, for collectors and DJs. Pre-order now, ships 28 November.',
      features: ['Quartz-locked direct drive for instant, steady speed', 'Plays 33⅓, 45 and 78 RPM', 'Pitch control ±8%', 'S-shaped tonearm with detachable headshell'],
      specs: [['Drive', 'Direct drive, quartz-locked'], ['Speeds', '33⅓ / 45 / 78 RPM'], ['Pitch', '±8%'], ['Cartridge', 'Moving magnet on detachable headshell'], ['Phono preamp', 'Built-in, switchable'], ['Outputs', 'RCA (phono / line), USB-C'], ['Platter', 'Aluminium with rubber mat'], ['Dimensions', '45 × 35 × 14 cm'], ['Weight', '8.1 kg']],
      box: ['Dust cover', 'Rubber mat', 'Headshell & cartridge', '45 RPM adapter', 'RCA & USB-C cables', 'Power cable']
    },
    {
      id: 'uncovered-reference', type: 'player', title: 'Uncovered Reference', artist: 'Uncovered', genre: 'Record player',
      price: 690, oldPrice: 790, status: 'instock', tags: ['sale'], finish: 'Chalk white',
      art: { plinth: '#EFEDE6', plinth2: '#E2DFD6', label: '#C2471B' },
      blurb: 'Our flagship. Acrylic platter, carbon-fibre tonearm and a decoupled motor. Made for a dedicated hi-fi system.',
      features: ['10 mm acrylic platter damps resonance', 'Carbon-fibre tonearm, low mass, very rigid', 'Motor decoupled from the plinth', 'No built-in preamp: pair with a dedicated phono stage'],
      specs: [['Drive', 'Belt drive, decoupled motor'], ['Speeds', '33⅓ / 45 RPM (electronic switch)'], ['Cartridge', 'High-output moving magnet'], ['Phono preamp', 'Not included'], ['Outputs', 'Gold-plated RCA, ground terminal'], ['Platter', '10 mm acrylic'], ['Tonearm', 'Carbon fibre, 8.6"'], ['Dimensions', '44 × 34 × 12 cm'], ['Weight', '7.4 kg']],
      box: ['Dust cover', 'Belt', 'Shielded RCA cable', 'Power supply', 'Alignment protractor']
    }
  ];

  const packs = [
    {
      id: 'starter-pack', type: 'pack', title: 'The Starter Pack', artist: 'Uncovered', genre: 'Pack',
      price: 329, oldPrice: 360, status: 'instock', tags: ['pack'],
      includes: 'uncovered-one', choose: 3, extras: ['Carbon-fibre record brush', 'Cleaning solution, 100 ml', '3 anti-static inner sleeves'],
      art: { plinth: '#6B4A2F', plinth2: '#7B573A', label: '#C2471B' },
      blurb: 'The Uncovered One turntable, three connected records of your choice and a cleaning kit. Everything you need for the first night.',
      features: ['Uncovered One turntable (worth €249)', '3 connected-sleeve records of your choice', 'Cleaning kit: brush, solution and anti-static sleeves', 'Free delivery']
    },
    {
      id: 'listening-room-pack', type: 'pack', title: 'Listening Room Pack', artist: 'Uncovered', genre: 'Pack',
      price: 579, oldPrice: 619, status: 'preorder', released: '2026-11-28', tags: ['pack', 'preorder'],
      includes: 'uncovered-studio', choose: 5, extras: ['Carbon-fibre record brush', '5 anti-static inner sleeves'],
      art: { plinth: '#B9B6AD', plinth2: '#C9C6BD', label: '#121212' },
      blurb: 'The new Uncovered Studio deck with five connected records of your choice. Ships with the first Studio units on 28 November.',
      features: ['Uncovered Studio turntable (worth €449)', '5 connected-sleeve records of your choice', 'Carbon-fibre brush and anti-static sleeves', 'Free delivery']
    }
  ];

  const all = [...albums, ...players, ...packs];
  const byId = Object.fromEntries(all.map(p => [p.id, p]));

  window.UNCOVERED = {
    albums, players, packs, all,
    get: id => byId[id],
    categories: {
      new: { label: "What's new", test: p => p.tags.includes('new') },
      preorder: { label: 'Pre-order', test: p => p.status === 'preorder' },
      vinyl: { label: 'Vinyl', test: p => p.type === 'vinyl' },
      players: { label: 'Record players', test: p => p.type === 'player' },
      sale: { label: 'Special sales', test: p => !!p.oldPrice },
      packs: { label: 'Packs', test: p => p.type === 'pack' }
    }
  };
})();
