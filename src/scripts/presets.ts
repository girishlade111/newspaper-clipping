export interface NewspaperPreset {
  id: string;
  name: string;
  category: string;
  newspaperName: string;
  tagline: string;
  date: string;
  issue: string;
  price: string;
  weatherLeft: string;
  weatherRight: string;
  headline: string;
  subheadline: string;
  author: string;
  columns: 1 | 2 | 3;
  body: string;
  dropCap: boolean;
  paperStyle: '1920' | '1950' | 'burnt' | 'clean';
  agingLevel: number;
  tornEdges: boolean;
  creaseLines: boolean;
  coffeeStain: boolean;
  fontStyle: 'gothic' | 'serif' | 'headline' | 'tabloid' | 'typewriter';
  filter: 'halftone' | 'sepia' | 'contrast' | 'grain' | 'none';
  photoCaption: string;
}

export const PRESETS: NewspaperPreset[] = [
  {
    id: 'breaking-1920',
    name: '1920s Broadsheet Scoop',
    category: 'Historical',
    newspaperName: 'The Daily Chronicle',
    tagline: 'The Voice of the Nation • Established 1892',
    date: 'Friday, October 24, 1929',
    issue: 'Vol. XXXVIII No. 14,892',
    price: 'Two Cents • London Edition',
    weatherLeft: 'Weather: Heavy Fog & Drizzle',
    weatherRight: 'Special Late City Edition',
    headline: 'MYSTERIOUS EXPEDITION UNCOVERS FORBIDDEN RELICS IN VALLEY',
    subheadline: 'Archaeologists Stunned by Subterranean Chamber Sealed for Three Millennia',
    author: 'By Arthur Sterling, Special Correspondent to Cairo',
    columns: 2,
    body: 'In what scholars are already calling the archaeological discovery of the century, the British antiquities expedition led by Lord Alistair Vance broke through the second sealed stone doorway at dawn yesterday.\n\nWithin the subterranean vaulted chamber, lanterns illuminated dozens of untouched gilded caskets and inscribed papyrus scrolls believed to date back to the Fourth Dynasty. Eyewitnesses described a chilling, breathless hush falling over the dig site as the final mortar fell away.\n\n"We stood before craftsmanship that defies modern understanding," remarked Vance during an exclusive telegraph dispatch. "The walls are etched with celestial star maps unmatched in any recorded archive." Local authorities have placed an armed guard around the perimeter as museum curators prepare specialized preservation crates.',
    dropCap: true,
    paperStyle: '1920',
    agingLevel: 70,
    tornEdges: true,
    creaseLines: true,
    coffeeStain: true,
    fontStyle: 'gothic',
    filter: 'halftone',
    photoCaption: 'Excavation team preparing lanterns outside the tomb entrance yesterday morning.',
  },
  {
    id: 'wanted-wild-west',
    name: 'Wild West Outlaw Bulletin',
    category: 'Wanted Poster',
    newspaperName: 'The Tombstone Gazette',
    tagline: 'Truth, Justice, and Territory Law • Arizona Territory',
    date: 'Saturday, August 14, 1881',
    issue: 'Vol. IV No. 209',
    price: '5 Cents • Territory Dispatch',
    weatherLeft: 'Weather: Blistering Heat 104°',
    weatherRight: 'REWARD $5,000 IN GOLD',
    headline: 'DESPERADO GANG ESCAPES TERRITORIAL MARSHAL AT RED GULCH',
    subheadline: 'Citizens Urged to Exercise Extreme Vigilance Along Northern Stagecoach Trail',
    author: 'By J. H. Holliday, Senior Editor',
    columns: 2,
    body: 'A heavily armed posse returning from the Black Hills confirmed late last night that the notorious Blackwood syndicate managed to slip through the canyon pass under the cover of a fierce dust storm.\n\nThe territorial governor has doubled the bounty on all five members of the outfit, dead or alive. Stage lines operating between Tombstone and Tucson have temporarily suspended overnight runs until federal cavalry detachments arrive.\n\nSheriff Hawkins stated firmly: "Every rancher in Cochise County has been deputized. This lawlessness will not stand upon our frontier."',
    dropCap: true,
    paperStyle: '1920',
    agingLevel: 85,
    tornEdges: true,
    creaseLines: true,
    coffeeStain: false,
    fontStyle: 'headline',
    filter: 'contrast',
    photoCaption: 'Artist lithograph of the suspect identified near Red Gulch pass.',
  },
  {
    id: 'moon-landing-1969',
    name: '1969 Space Milestone',
    category: 'Celebration',
    newspaperName: 'The World Herald',
    tagline: 'First with the Global News • Extra Edition',
    date: 'Monday, July 21, 1969',
    issue: 'Vol. LXXV No. 27,411',
    price: '10 Cents • Final Late Extra',
    weatherLeft: 'Weather: Clear Skies Worldwide',
    weatherRight: 'Historic World Extra',
    headline: 'MAN WALKS ON THE MOON: "ONE GIANT LEAP FOR MANKIND"',
    subheadline: 'Apollo Astronauts Plant Flag on Lunar Surface in Triumph of Human Courage',
    author: 'By Eleanor Vance, Science Editor in Houston',
    columns: 3,
    body: 'Human beings have set foot upon another celestial world. At precisely 10:56 p.m. EDT, Neil Armstrong stepped down from the lunar module Eagle onto the powdery surface of the Sea of Tranquility.\n\nMillions of television viewers across all seven continents watched with bated breath through glowing cathode screens as the grainy black-and-white broadcast beamed across a quarter-million miles of void.\n\nPresidential messages and congratulatory telegrams have flooded Mission Control from every sovereign capital, celebrating this crowning achievement of exploration and scientific endeavor.',
    dropCap: true,
    paperStyle: '1950',
    agingLevel: 45,
    tornEdges: false,
    creaseLines: true,
    coffeeStain: false,
    fontStyle: 'tabloid',
    filter: 'grain',
    photoCaption: 'Historic transmission received at telemetry station in Goldstone.',
  },
  {
    id: 'wedding-extra',
    name: 'High Society Wedding',
    category: 'Events & Gifts',
    newspaperName: 'The Mayfair Gazette & Courier',
    tagline: 'Chronicle of High Society & Cultural Affairs',
    date: 'Saturday, June 18, 1938',
    issue: 'Special Matrimonial Edition',
    price: 'Complimentary Commemorative Copy',
    weatherLeft: 'Weather: Radiant Sunshine 74°',
    weatherRight: 'Society Nuptials Extra',
    headline: 'TWO SOULS UNITED IN MAGNIFICENT CATHEDRAL CELEBRATION',
    subheadline: 'Hundreds Gather as Bells Ring Out for the Season’s Most Enchanting Union',
    author: 'By Lady Penelope Vance, Society Correspondent',
    columns: 2,
    body: 'Beneath the stained-glass arches of St. Jude Cathedral, vows of eternal devotion were exchanged in what society insiders have heralded as the wedding of the decade.\n\nThe bride arrived in an exquisite vintage lace gown, accompanied by a joyous choir of fifty voices. Following the grand ceremony, guests convened at the grand ballroom for an evening of champagne toasts, orchestral waltzes, and celebration under crystal chandeliers that lasted well past midnight.\n\nThe newlyweds departed amidst a shower of rose petals, embarking on their voyage across the Mediterranean.',
    dropCap: true,
    paperStyle: 'clean',
    agingLevel: 30,
    tornEdges: true,
    creaseLines: false,
    coffeeStain: false,
    fontStyle: 'serif',
    filter: 'sepia',
    photoCaption: 'The radiant couple pictured as bells chimed across the city square.',
  },
  {
    id: 'tabloid-ufo',
    name: '1950s Sci-Fi Tabloid',
    category: 'Fun & Parody',
    newspaperName: 'The Daily Inquirer',
    tagline: 'The Sensational Truth That Cannot Be Silenced!',
    date: 'Thursday, July 8, 1947',
    issue: 'No. 8,402 • All-Star Scoop',
    price: '7 Cents • Coast to Coast',
    weatherLeft: 'Weather: Ominous Green Clouds',
    weatherRight: 'Classified Secret Report',
    headline: 'FLYING SAUCER CRASHES IN NEW MEXICO DESERT!',
    subheadline: 'Military Cordon Surrounds Glowing Wreckage as Radar Operators Stunned',
    author: 'By Frank "Scoop" Miller',
    columns: 2,
    body: 'Sensational reports sweeping across telegraph wires this afternoon confirm that a metallic disc of otherworldly origin crashed into a remote ranch thirty miles northwest of the army airfield.\n\nEyewitnesses describe strange hieroglyphic markings along the titanium-like hull that resist blowtorches and chemical analysis. Top military scientists are currently in emergency conference under total secrecy.\n\nLocal ranchers report radio transmissions filled with pulsating static since 3:00 AM.',
    dropCap: false,
    paperStyle: '1950',
    agingLevel: 60,
    tornEdges: true,
    creaseLines: true,
    coffeeStain: true,
    fontStyle: 'tabloid',
    filter: 'halftone',
    photoCaption: 'Radar tower staff monitoring the anomalous signals over the desert horizon.',
  }
];
