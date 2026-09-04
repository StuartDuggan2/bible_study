// Timeline of major biblical historical events.
// Dates and framing follow the historical chronologies in The New Oxford Annotated Bible (5th ed.),
// esp. its "Historical and Chronological Table" and the introductions to the historical books.
// Events prior to c. 1000 BCE are legendary/traditional; NOAB flags them as such.

export type Era =
  | "Primeval & Ancestral"
  | "Exodus & Wilderness"
  | "Settlement & Judges"
  | "United Monarchy"
  | "Divided Kingdom"
  | "Exile"
  | "Persian Period"
  | "Hellenistic Period"
  | "Roman Period"
  | "Early Church";

export interface TimelineEvent {
  id: string;
  year: number; // approximate BCE (negative) / CE (positive) for sorting; use midpoint for ranges
  displayDate: string;
  title: string;
  era: Era;
  description: string;
  relatedBooks: string[]; // book ids
  isLegendary?: boolean;
}

export const TIMELINE: TimelineEvent[] = [
  // Primeval / ancestral (framed by NOAB as traditional, not historical)
  {
    id: "abraham",
    year: -1800,
    displayDate: "c. 1800 BCE (traditional)",
    title: "Ancestral period: Abraham, Isaac, Jacob",
    era: "Primeval & Ancestral",
    description:
      "Traditional setting for the patriarchal and matriarchal narratives of Genesis. NOAB stresses that these stories reflect later Israelite memory and identity rather than verifiable history.",
    relatedBooks: ["genesis"],
    isLegendary: true,
  },
  {
    id: "joseph",
    year: -1700,
    displayDate: "c. 1700 BCE (traditional)",
    title: "Joseph in Egypt",
    era: "Primeval & Ancestral",
    description:
      "The Joseph novella (Gen 37–50) explains how Jacob's family ended up in Egypt. Historians debate any underlying event; NOAB treats it as literary theology.",
    relatedBooks: ["genesis"],
    isLegendary: true,
  },

  // Exodus / Wilderness (traditional dating)
  {
    id: "exodus",
    year: -1250,
    displayDate: "c. 1250 BCE (traditional)",
    title: "Exodus from Egypt",
    era: "Exodus & Wilderness",
    description:
      "Traditional setting under Pharaoh Ramesses II. Archaeologically contested. NOAB treats it as a foundational memory, historically opaque, theologically decisive.",
    relatedBooks: ["exodus", "leviticus", "numbers", "deuteronomy"],
    isLegendary: true,
  },
  {
    id: "sinai",
    year: -1240,
    displayDate: "c. 1240 BCE (traditional)",
    title: "Sinai covenant and Torah",
    era: "Exodus & Wilderness",
    description:
      "Israel receives the Decalogue and covenant at Sinai (Ex 19–24) and, in the priestly framing, the instructions for the tabernacle. The theological birth of Israel.",
    relatedBooks: ["exodus", "leviticus", "numbers"],
    isLegendary: true,
  },

  // Settlement & Judges
  {
    id: "settlement",
    year: -1200,
    displayDate: "c. 1200 BCE",
    title: "Israel emerges in Canaan",
    era: "Settlement & Judges",
    description:
      "The earliest extrabiblical mention of Israel is the Merneptah Stele (c. 1207 BCE). Archaeologically, Israelite village culture emerges in the highlands of Canaan.",
    relatedBooks: ["joshua", "judges"],
  },
  {
    id: "judges",
    year: -1100,
    displayDate: "c. 1200–1020 BCE",
    title: "Period of the Judges",
    era: "Settlement & Judges",
    description:
      "Loose tribal confederation under charismatic 'judges' like Deborah, Gideon, and Samson. NOAB treats the biblical narrative as theologically shaped memory of a pre-state period.",
    relatedBooks: ["judges", "ruth", "1samuel"],
  },

  // United Monarchy
  {
    id: "saul",
    year: -1020,
    displayDate: "c. 1020 BCE",
    title: "Saul anointed as first king",
    era: "United Monarchy",
    description:
      "The prophet Samuel anoints Saul as Israel's first king in response to popular demand (1 Sam 8–10).",
    relatedBooks: ["1samuel"],
  },
  {
    id: "david",
    year: -1000,
    displayDate: "c. 1000 BCE",
    title: "David becomes king",
    era: "United Monarchy",
    description:
      "David unifies the tribes, captures Jerusalem, brings the ark to the city, and receives an eternal dynastic promise (2 Sam 7). NOAB regards a historical David as plausible; the Tel Dan inscription (9th c. BCE) references the 'house of David.'",
    relatedBooks: ["1samuel", "2samuel", "1chronicles", "psalms"],
  },
  {
    id: "solomon",
    year: -960,
    displayDate: "c. 970–930 BCE",
    title: "Solomon builds the First Temple",
    era: "United Monarchy",
    description:
      "Solomon consolidates the kingdom, expands trade, and (in biblical memory) builds the temple in Jerusalem. NOAB notes the archaeological difficulties around the scale of Solomonic building.",
    relatedBooks: ["1kings", "2chronicles", "proverbs", "ecclesiastes", "songofsongs"],
  },

  // Divided Kingdom
  {
    id: "schism",
    year: -930,
    displayDate: "c. 930 BCE",
    title: "Kingdom divides: Israel and Judah",
    era: "Divided Kingdom",
    description:
      "After Solomon's death, ten northern tribes secede under Jeroboam, forming the northern kingdom of Israel; Judah remains under Rehoboam in Jerusalem.",
    relatedBooks: ["1kings", "2chronicles"],
  },
  {
    id: "elijah",
    year: -860,
    displayDate: "c. 870–850 BCE",
    title: "Elijah confronts Ahab",
    era: "Divided Kingdom",
    description:
      "The Elijah cycle in the northern kingdom under King Ahab and Queen Jezebel. Prophecy emerges as a check on royal power.",
    relatedBooks: ["1kings", "2kings"],
  },
  {
    id: "amos_hosea",
    year: -760,
    displayDate: "c. 760–740 BCE",
    title: "Amos and Hosea in the north",
    era: "Divided Kingdom",
    description:
      "The earliest 'writing prophets' denounce social injustice and religious infidelity in the prosperous northern kingdom just before its collapse.",
    relatedBooks: ["amos", "hosea"],
  },
  {
    id: "isaiah_micah",
    year: -735,
    displayDate: "c. 740–700 BCE",
    title: "Isaiah and Micah in Judah",
    era: "Divided Kingdom",
    description:
      "First Isaiah and Micah address the Assyrian crisis under kings Ahaz and Hezekiah in Judah.",
    relatedBooks: ["isaiah", "micah"],
  },
  {
    id: "samaria",
    year: -722,
    displayDate: "722 BCE",
    title: "Assyria destroys Samaria",
    era: "Divided Kingdom",
    description:
      "Sargon II of Assyria conquers the northern kingdom. Its population is deported; the 'ten lost tribes' pass out of history. Judah alone survives (2 Kings 17).",
    relatedBooks: ["2kings", "isaiah", "hosea", "amos"],
  },
  {
    id: "josiah",
    year: -622,
    displayDate: "622 BCE",
    title: "Josiah's reform in Judah",
    era: "Divided Kingdom",
    description:
      "During temple repairs, a 'book of the law' (likely a core of Deuteronomy) is found. King Josiah launches a sweeping centralizing reform (2 Kings 22–23). NOAB sees this as the pivot of the Deuteronomistic History.",
    relatedBooks: ["deuteronomy", "2kings", "jeremiah", "zephaniah", "nahum"],
  },
  {
    id: "jerusalem_falls",
    year: -586,
    displayDate: "586 BCE",
    title: "Babylonians destroy Jerusalem and the temple",
    era: "Divided Kingdom",
    description:
      "Nebuchadnezzar sacks Jerusalem, burns the First Temple, and deports the Judahite elite. The Davidic monarchy ends. The theological and literary crisis reshapes all of Israel's scriptures.",
    relatedBooks: ["2kings", "jeremiah", "lamentations", "ezekiel", "psalms"],
  },

  // Exile
  {
    id: "exile",
    year: -560,
    displayDate: "586–539 BCE",
    title: "Babylonian exile",
    era: "Exile",
    description:
      "The Judahite elite live as exiles in Babylon. Ezekiel prophesies among them; Second Isaiah proclaims comfort. Much of the Torah receives its final Priestly edition here.",
    relatedBooks: ["ezekiel", "isaiah", "jeremiah", "lamentations", "psalms"],
  },
  {
    id: "cyrus",
    year: -539,
    displayDate: "539 BCE",
    title: "Cyrus of Persia conquers Babylon",
    era: "Persian Period",
    description:
      "Cyrus's decree permits exiles to return to their homelands and rebuild temples (2 Chron 36; Ezra 1). Second Isaiah calls him 'YHWH's anointed' (Isa 45).",
    relatedBooks: ["isaiah", "ezra", "2chronicles"],
  },

  // Persian Period
  {
    id: "second_temple",
    year: -515,
    displayDate: "515 BCE",
    title: "Second Temple dedicated",
    era: "Persian Period",
    description:
      "Under Zerubbabel and the prophetic urging of Haggai and Zechariah, the rebuilt Jerusalem temple is dedicated. NOAB dates the era of 'Second Temple Judaism' from here.",
    relatedBooks: ["ezra", "haggai", "zechariah"],
  },
  {
    id: "ezra_nehemiah",
    year: -450,
    displayDate: "mid-5th c. BCE",
    title: "Ezra and Nehemiah reforms",
    era: "Persian Period",
    description:
      "Ezra reintroduces public Torah reading; Nehemiah rebuilds Jerusalem's walls and enacts civic and religious reforms. The community's boundaries and identity are hotly contested.",
    relatedBooks: ["ezra", "nehemiah", "malachi"],
  },

  // Hellenistic Period
  {
    id: "alexander",
    year: -333,
    displayDate: "333 BCE",
    title: "Alexander the Great conquers the Levant",
    era: "Hellenistic Period",
    description:
      "Alexander's conquests spread Greek language and culture across the Near East, setting the stage for Hellenistic Judaism and the Septuagint.",
    relatedBooks: ["daniel", "ecclesiastes", "1maccabees"],
  },
  {
    id: "septuagint",
    year: -250,
    displayDate: "c. 3rd–2nd c. BCE",
    title: "Septuagint translation begins",
    era: "Hellenistic Period",
    description:
      "Alexandrian Jews begin translating the Hebrew scriptures into Greek. This translation becomes the Bible of most early Christians and shapes New Testament citation.",
    relatedBooks: ["wisdom", "sirach"],
  },
  {
    id: "maccabees",
    year: -167,
    displayDate: "167–164 BCE",
    title: "Maccabean revolt",
    era: "Hellenistic Period",
    description:
      "Antiochus IV desecrates the Jerusalem temple; the Maccabees lead a revolt, rededicate the temple (origin of Hanukkah), and found the Hasmonean dynasty. Daniel is composed in this crisis.",
    relatedBooks: ["daniel", "1maccabees", "2maccabees"],
  },

  // Roman Period
  {
    id: "pompey",
    year: -63,
    displayDate: "63 BCE",
    title: "Pompey takes Jerusalem",
    era: "Roman Period",
    description:
      "Rome absorbs Judea. The Hasmonean state ends; Herodian client kingship follows.",
    relatedBooks: [],
  },
  {
    id: "jesus_birth",
    year: -4,
    displayDate: "c. 6–4 BCE",
    title: "Birth of Jesus of Nazareth",
    era: "Roman Period",
    description:
      "NOAB dates Jesus's birth to the last years of Herod the Great (d. 4 BCE). The traditional calendar's offset of a few years stems from a 6th-century miscalculation.",
    relatedBooks: ["matthew", "luke"],
  },
  {
    id: "jesus_ministry",
    year: 28,
    displayDate: "c. 28–30 CE",
    title: "Public ministry of Jesus",
    era: "Roman Period",
    description:
      "Jesus's Galilean and Judean ministry under the Roman prefect Pontius Pilate (26–36 CE) and the tetrarch Herod Antipas.",
    relatedBooks: ["matthew", "mark", "luke", "john"],
  },
  {
    id: "crucifixion",
    year: 30,
    displayDate: "c. 30 CE",
    title: "Crucifixion and resurrection accounts",
    era: "Roman Period",
    description:
      "Jesus is executed in Jerusalem under Pilate. Early Christian tradition proclaims his resurrection 'on the third day.' NOAB dates his death to c. 30 (or 33) CE.",
    relatedBooks: ["matthew", "mark", "luke", "john", "1corinthians"],
  },

  // Early Church
  {
    id: "pentecost",
    year: 30,
    displayDate: "c. 30 CE",
    title: "Pentecost and the early Jerusalem community",
    era: "Early Church",
    description:
      "Acts 2 narrates the outpouring of the Spirit and the formation of a Jesus movement in Jerusalem under Peter, James, and John.",
    relatedBooks: ["acts"],
  },
  {
    id: "paul_conversion",
    year: 34,
    displayDate: "c. 33–35 CE",
    title: "Paul's Damascus experience",
    era: "Early Church",
    description:
      "Saul of Tarsus, a persecutor of the Jesus movement, undergoes a call/conversion (Gal 1; Acts 9). He becomes the leading missionary to Gentiles.",
    relatedBooks: ["acts", "galatians"],
  },
  {
    id: "jerusalem_council",
    year: 49,
    displayDate: "c. 49 CE",
    title: "Jerusalem council on Gentile inclusion",
    era: "Early Church",
    description:
      "Acts 15 (paralleling Gal 2) narrates the decision not to require Gentile converts to be circumcised. The Jesus movement crosses ethnic boundaries.",
    relatedBooks: ["acts", "galatians"],
  },
  {
    id: "paul_letters",
    year: 55,
    displayDate: "c. 50–58 CE",
    title: "Paul's undisputed letters written",
    era: "Early Church",
    description:
      "Paul writes 1 Thessalonians, Galatians, 1–2 Corinthians, Philippians, Philemon, and Romans. NOAB dates 1 Thessalonians as the earliest surviving Christian document.",
    relatedBooks: ["1thessalonians", "galatians", "1corinthians", "2corinthians", "philippians", "philemon", "romans"],
  },
  {
    id: "jewish_war",
    year: 70,
    displayDate: "66–70 CE",
    title: "Jewish war and destruction of the Second Temple",
    era: "Early Church",
    description:
      "Rome, under Vespasian and Titus, crushes the Jewish revolt and destroys the Jerusalem temple in 70 CE. The catastrophe reshapes both Judaism (toward rabbinic forms) and the Jesus movement.",
    relatedBooks: ["mark", "matthew", "hebrews", "revelation"],
  },
  {
    id: "gospels",
    year: 80,
    displayDate: "c. 65–100 CE",
    title: "Gospels composed",
    era: "Early Church",
    description:
      "Mark (c. 65–70), Matthew and Luke–Acts (c. 80–90), and John (c. 90–110) are written. NOAB emphasizes their post-70 CE contexts and community-shaped theology.",
    relatedBooks: ["mark", "matthew", "luke", "john", "acts"],
  },
  {
    id: "revelation_written",
    year: 95,
    displayDate: "c. 90–96 CE",
    title: "Revelation written under Domitian",
    era: "Early Church",
    description:
      "John of Patmos writes an apocalyptic critique of Roman imperial worship for seven churches in Asia Minor.",
    relatedBooks: ["revelation"],
  },
  {
    id: "later_nt",
    year: 110,
    displayDate: "c. 90–130 CE",
    title: "Later New Testament writings",
    era: "Early Church",
    description:
      "Pastoral Epistles, 2 Peter, and Johannine letters are composed. The New Testament canon begins to take recognizable shape, though it is not finalized for centuries.",
    relatedBooks: ["1timothy", "2timothy", "titus", "2peter", "1john", "2john", "3john"],
  },
];
