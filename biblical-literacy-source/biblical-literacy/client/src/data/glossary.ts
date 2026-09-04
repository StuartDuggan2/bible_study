// Glossary of technical scholarship terms as they appear in the NOAB (5th ed.):
// its glossary, essays ("The Interpretation of the Bible" section), and book introductions.
// Definitions are paraphrased from NOAB usage and standard biblical-studies reference works
// (Oxford Companion to the Bible; Anchor Bible Dictionary) to avoid direct copying.

export type GlossaryCategory =
  | "Source & redaction"
  | "Textual criticism"
  | "Historical & literary criticism"
  | "Theology & concepts"
  | "Ancient languages & terms"
  | "Genre & form"
  | "Canon & manuscripts"
  | "Interpretive methods";

export interface GlossaryEntry {
  id: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
  crossReferences: {
    label: string;
    bookId: string; // book id from books.ts
    passage?: string;
  }[];
  seeAlso?: string[]; // other glossary ids
}

export const GLOSSARY: GlossaryEntry[] = [
  // ================= SOURCE & REDACTION =================
  {
    id: "documentary_hypothesis",
    term: "Documentary Hypothesis",
    category: "Source & redaction",
    definition:
      "The theory, classically formulated by Julius Wellhausen (1878), that the Pentateuch was compiled from four originally independent sources — J (Yahwist), E (Elohist), D (Deuteronomist), and P (Priestly). The NOAB works with a modified version of this model, recognizing more complex editorial layers.",
    crossReferences: [
      { label: "Two creation accounts (J + P)", bookId: "genesis", passage: "Gen 1:1–2:4a; 2:4b–25" },
      { label: "Flood narrative (J + P interwoven)", bookId: "genesis", passage: "Gen 6–9" },
      { label: "Priestly framework of the Torah", bookId: "leviticus" },
    ],
    seeAlso: ["j_source", "e_source", "d_source", "p_source", "redaction_criticism"],
  },
  {
    id: "j_source",
    term: "J (Yahwist) source",
    category: "Source & redaction",
    definition:
      "The Pentateuchal source that consistently uses the divine name YHWH (in older German transliteration, 'Jahwe'). Typically dated to the 10th–9th c. BCE in southern Judah. Narrates vividly, with anthropomorphic imagery of God.",
    crossReferences: [
      { label: "Second creation account", bookId: "genesis", passage: "Gen 2:4b–3:24" },
      { label: "Cain and Abel", bookId: "genesis", passage: "Gen 4" },
    ],
    seeAlso: ["documentary_hypothesis", "e_source", "p_source"],
  },
  {
    id: "e_source",
    term: "E (Elohist) source",
    category: "Source & redaction",
    definition:
      "The Pentateuchal source that refers to God as Elohim before the revelation of the divine name in Exodus 3. Traditionally located in the northern kingdom, 9th–8th c. BCE. Prone to dream and angelic revelation.",
    crossReferences: [
      { label: "Binding of Isaac (largely E)", bookId: "genesis", passage: "Gen 22" },
      { label: "Jacob's ladder", bookId: "genesis", passage: "Gen 28" },
    ],
    seeAlso: ["documentary_hypothesis", "j_source"],
  },
  {
    id: "d_source",
    term: "D (Deuteronomist) source",
    category: "Source & redaction",
    definition:
      "The source associated with the book of Deuteronomy and the Deuteronomistic History (Joshua–2 Kings). Characterized by sermonic style, covenant theology, and insistence on centralized worship. Core likely reflects the 'book of the law' found under King Josiah (622 BCE).",
    crossReferences: [
      { label: "Deuteronomistic law core", bookId: "deuteronomy", passage: "Deut 12–26" },
      { label: "'Book of the law' found in temple", bookId: "2kings", passage: "2 Kgs 22" },
    ],
    seeAlso: ["deuteronomistic_history", "documentary_hypothesis"],
  },
  {
    id: "p_source",
    term: "P (Priestly) source",
    category: "Source & redaction",
    definition:
      "The Pentateuchal source most concerned with cult, priesthood, purity, and sacred time. Provides the framing narrative of the Torah in its final form. Typically dated to the exilic or early post-exilic period.",
    crossReferences: [
      { label: "First creation account", bookId: "genesis", passage: "Gen 1:1–2:4a" },
      { label: "Tabernacle instructions", bookId: "exodus", passage: "Ex 25–31; 35–40" },
      { label: "Holiness Code", bookId: "leviticus", passage: "Lev 17–26" },
    ],
    seeAlso: ["documentary_hypothesis", "holiness_code"],
  },
  {
    id: "holiness_code",
    term: "Holiness Code (H)",
    category: "Source & redaction",
    definition:
      "A distinct legal-cultic block within Leviticus 17–26, emphasizing 'You shall be holy, for I the LORD your God am holy.' NOAB treats it as a stratum related to but distinct from P.",
    crossReferences: [
      { label: "Holiness formula", bookId: "leviticus", passage: "Lev 19:2" },
      { label: "Sabbath and jubilee laws", bookId: "leviticus", passage: "Lev 25" },
    ],
    seeAlso: ["p_source"],
  },
  {
    id: "deuteronomistic_history",
    term: "Deuteronomistic History (DtrH)",
    category: "Source & redaction",
    definition:
      "The extended narrative from Deuteronomy through 2 Kings, understood by many scholars as a unified theological history shaped by Deuteronomistic editors, most likely finalized in the exile (6th c. BCE). It evaluates kings and events by covenant fidelity.",
    crossReferences: [
      { label: "Programmatic sermon", bookId: "deuteronomy", passage: "Deut 4; 30" },
      { label: "Formulaic evaluations of kings", bookId: "1kings" },
      { label: "Theological climax at exile", bookId: "2kings", passage: "2 Kgs 17; 25" },
    ],
    seeAlso: ["d_source", "chronicler"],
  },
  {
    id: "chronicler",
    term: "Chronicler",
    category: "Source & redaction",
    definition:
      "The anonymous post-exilic author(s) of 1–2 Chronicles (often extended to include Ezra–Nehemiah). Rewrites the history of Israel with heavy focus on the Davidic dynasty, the temple, and priesthood. Reflects the theology of the restored Jerusalem community.",
    crossReferences: [
      { label: "Genealogical prologue", bookId: "1chronicles", passage: "1 Chron 1–9" },
      { label: "David's temple preparations", bookId: "1chronicles", passage: "1 Chron 22–29" },
    ],
    seeAlso: ["deuteronomistic_history"],
  },
  {
    id: "redaction_criticism",
    term: "Redaction criticism",
    category: "Source & redaction",
    definition:
      "A method that studies how editors ('redactors') shaped, combined, and reframed earlier sources to convey their own theological purposes. NOAB frequently invokes redaction to explain the final shape of biblical books.",
    crossReferences: [
      { label: "Priestly framing of Genesis", bookId: "genesis" },
      { label: "Deuteronomistic editing of Kings", bookId: "1kings" },
    ],
    seeAlso: ["documentary_hypothesis", "form_criticism"],
  },
  {
    id: "form_criticism",
    term: "Form criticism",
    category: "Source & redaction",
    definition:
      "A method (Hermann Gunkel, early 20th c.) that identifies the literary form ('Gattung') and original life-setting ('Sitz im Leben') of small units of tradition — e.g., psalms of lament, prophetic oracles, miracle stories.",
    crossReferences: [
      { label: "Psalm types (hymn, lament, thanksgiving)", bookId: "psalms" },
      { label: "Miracle stories in Mark", bookId: "mark" },
    ],
    seeAlso: ["redaction_criticism"],
  },

  // ================= SYNOPTIC / GOSPEL SOURCES =================
  {
    id: "synoptic_problem",
    term: "Synoptic Problem",
    category: "Source & redaction",
    definition:
      "The question of the literary relationships among Matthew, Mark, and Luke, which share large amounts of material. The most widely held solution (the 'Two-Source' hypothesis) holds that Mark was written first and that Matthew and Luke independently used Mark plus a lost sayings source called Q.",
    crossReferences: [
      { label: "Mark as earliest gospel", bookId: "mark" },
      { label: "Matthew's use of Mark", bookId: "matthew" },
      { label: "Luke's preface acknowledging sources", bookId: "luke", passage: "Luke 1:1–4" },
    ],
    seeAlso: ["q_source"],
  },
  {
    id: "q_source",
    term: "Q source",
    category: "Source & redaction",
    definition:
      "A hypothetical sayings source (from German Quelle, 'source') posited to explain material shared by Matthew and Luke but absent from Mark. Never physically found, but reconstructed from the shared passages.",
    crossReferences: [
      { label: "Sermon on the Mount (Q material)", bookId: "matthew", passage: "Matt 5–7" },
      { label: "Sermon on the Plain (Q material)", bookId: "luke", passage: "Luke 6:20–49" },
    ],
    seeAlso: ["synoptic_problem"],
  },

  // ================= TEXTUAL CRITICISM & MANUSCRIPTS =================
  {
    id: "textual_criticism",
    term: "Textual criticism",
    category: "Textual criticism",
    definition:
      "The scholarly discipline of comparing manuscripts to reconstruct the earliest recoverable form of a text and to explain variants. NOAB's footnotes frequently cite Hebrew, Greek, Syriac, and Latin witnesses.",
    crossReferences: [
      { label: "Text-critical footnotes throughout", bookId: "isaiah" },
      { label: "Longer/shorter endings of Mark", bookId: "mark", passage: "Mark 16:9–20" },
    ],
    seeAlso: ["masoretic_text", "septuagint", "dead_sea_scrolls"],
  },
  {
    id: "masoretic_text",
    term: "Masoretic Text (MT)",
    category: "Canon & manuscripts",
    definition:
      "The authoritative Hebrew and Aramaic text of the Jewish scriptures as fixed by the Masoretes (Jewish scribes, roughly 7th–10th c. CE), who added vowel points and marginal notes to a consonantal text with much older roots. NOAB's Old Testament translation is based on the MT.",
    crossReferences: [{ label: "Base text for the NRSV Old Testament", bookId: "genesis" }],
    seeAlso: ["septuagint", "dead_sea_scrolls", "textual_criticism"],
  },
  {
    id: "septuagint",
    term: "Septuagint (LXX)",
    category: "Canon & manuscripts",
    definition:
      "The Greek translation of the Hebrew scriptures produced in Alexandria beginning in the 3rd c. BCE. It includes several books not in the Hebrew canon (the Apocrypha/Deuterocanon). The LXX was the Bible for most early Christians and is often cited in the New Testament.",
    crossReferences: [
      { label: "NT quotations often follow LXX wording", bookId: "hebrews" },
      { label: "Deuterocanonical books included", bookId: "wisdom" },
    ],
    seeAlso: ["masoretic_text", "apocrypha", "canon"],
  },
  {
    id: "dead_sea_scrolls",
    term: "Dead Sea Scrolls",
    category: "Canon & manuscripts",
    definition:
      "A collection of Jewish manuscripts (c. 250 BCE–70 CE) discovered near Qumran from 1947 onward. They include the oldest surviving copies of many Hebrew Bible books, sectarian rule-books, and biblical interpretations, revolutionizing textual criticism.",
    crossReferences: [
      { label: "Great Isaiah Scroll (1QIsaᵃ)", bookId: "isaiah" },
      { label: "Multiple text-types attested", bookId: "jeremiah" },
    ],
    seeAlso: ["textual_criticism", "masoretic_text", "septuagint"],
  },
  {
    id: "vulgate",
    term: "Vulgate",
    category: "Canon & manuscripts",
    definition:
      "Jerome's late 4th-century Latin translation of the Bible, which became the standard Latin Bible of the Western Church and, at the Council of Trent (1546), the official Roman Catholic version.",
    crossReferences: [
      { label: "Latin tradition of the Psalms", bookId: "psalms" },
      { label: "Latin ordering of the Apocrypha", bookId: "tobit" },
    ],
    seeAlso: ["masoretic_text", "septuagint"],
  },
  {
    id: "canon",
    term: "Canon",
    category: "Canon & manuscripts",
    definition:
      "The authoritative list of books recognized as scripture by a given community. Jewish, Protestant, Catholic, and Orthodox canons differ, especially in whether they include the deuterocanonical books.",
    crossReferences: [
      { label: "Jewish canon closed by 2nd c. CE", bookId: "esther" },
      { label: "NT canon takes shape 2nd–4th c. CE", bookId: "revelation" },
    ],
    seeAlso: ["apocrypha", "deuterocanonical"],
  },
  {
    id: "apocrypha",
    term: "Apocrypha",
    category: "Canon & manuscripts",
    definition:
      "In Protestant usage, the books included in the Septuagint (and the Vulgate) but not in the Hebrew Bible. Roman Catholic and Orthodox traditions include most of them in their Old Testament canon, calling them 'deuterocanonical.' NOAB prints them as a distinct section.",
    crossReferences: [
      { label: "Tobit", bookId: "tobit" },
      { label: "Wisdom of Solomon", bookId: "wisdom" },
      { label: "1–2 Maccabees", bookId: "1maccabees" },
    ],
    seeAlso: ["deuterocanonical", "septuagint", "canon"],
  },
  {
    id: "deuterocanonical",
    term: "Deuterocanonical",
    category: "Canon & manuscripts",
    definition:
      "Literally 'second canon.' Catholic and Orthodox term for books that Protestants call 'Apocrypha.' Recognized as scripture by Catholic and Orthodox traditions but with a secondary historical status.",
    crossReferences: [{ label: "Sirach", bookId: "sirach" }],
    seeAlso: ["apocrypha", "canon"],
  },
  {
    id: "pseudepigrapha",
    term: "Pseudepigrapha",
    category: "Canon & manuscripts",
    definition:
      "Jewish and Christian writings, mostly from c. 200 BCE–200 CE, attributed to biblical figures (Enoch, Ezra, Baruch, etc.) but not accepted into most canons. Some (e.g., 1 Enoch) are cited by New Testament books such as Jude.",
    crossReferences: [{ label: "Jude cites 1 Enoch", bookId: "jude", passage: "Jude 14–15" }],
    seeAlso: ["canon", "apocalyptic"],
  },

  // ================= HISTORICAL & LITERARY CRITICISM =================
  {
    id: "historical_critical",
    term: "Historical-critical method",
    category: "Historical & literary criticism",
    definition:
      "The umbrella term for methods that read biblical texts in their original historical, linguistic, and cultural contexts — including source, form, redaction, and tradition criticism. The dominant academic paradigm reflected throughout NOAB.",
    crossReferences: [
      { label: "Applied to Pentateuchal sources", bookId: "genesis" },
      { label: "Applied to Synoptic Gospels", bookId: "mark" },
    ],
    seeAlso: ["documentary_hypothesis", "form_criticism", "redaction_criticism", "synoptic_problem"],
  },
  {
    id: "pseudonymity",
    term: "Pseudonymity",
    category: "Historical & literary criticism",
    definition:
      "The ancient literary practice of writing under the name of a revered figure of the past. Common in apocalyptic literature and applied by NOAB, with varying confidence, to books such as Daniel, 2 Peter, and the Pastoral Epistles.",
    crossReferences: [
      { label: "Daniel written centuries after its setting", bookId: "daniel" },
      { label: "Pastoral Epistles", bookId: "1timothy" },
      { label: "2 Peter as late pseudonymous letter", bookId: "2peter" },
    ],
    seeAlso: ["pseudepigrapha", "apocalyptic"],
  },
  {
    id: "etiology",
    term: "Etiology",
    category: "Historical & literary criticism",
    definition:
      "A narrative that explains the origin of a name, custom, place, or ritual. Genesis, Exodus, and Judges include many etiological stories that explain why a place is named a certain way or why a ritual is practiced.",
    crossReferences: [
      { label: "Naming of Babel", bookId: "genesis", passage: "Gen 11" },
      { label: "Institution of Passover", bookId: "exodus", passage: "Ex 12" },
    ],
  },
  {
    id: "aniconism",
    term: "Aniconism",
    category: "Historical & literary criticism",
    definition:
      "The prohibition or avoidance of images of the divine. A defining feature of Israelite religion in the Decalogue and the Deuteronomistic critique of idolatry.",
    crossReferences: [
      { label: "Second commandment", bookId: "exodus", passage: "Ex 20:4–6" },
      { label: "Deuteronomistic anti-idol polemic", bookId: "deuteronomy", passage: "Deut 4:15–20" },
    ],
    seeAlso: ["monotheism"],
  },

  // ================= THEOLOGY & CONCEPTS =================
  {
    id: "covenant",
    term: "Covenant (berit)",
    category: "Theology & concepts",
    definition:
      "A formal binding agreement between parties. In the Hebrew Bible, covenants structure God's relationships with Noah, Abraham, Israel at Sinai, and David. NOAB treats covenant as the central organizing category of biblical theology.",
    crossReferences: [
      { label: "Noahic covenant", bookId: "genesis", passage: "Gen 9" },
      { label: "Abrahamic covenant", bookId: "genesis", passage: "Gen 15; 17" },
      { label: "Sinai covenant", bookId: "exodus", passage: "Ex 19–24" },
      { label: "Davidic covenant", bookId: "2samuel", passage: "2 Sam 7" },
      { label: "New covenant", bookId: "jeremiah", passage: "Jer 31:31–34" },
    ],
    seeAlso: ["hesed", "torah"],
  },
  {
    id: "monotheism",
    term: "Monotheism",
    category: "Theology & concepts",
    definition:
      "Belief in one God. NOAB traces a development in Israelite religion from monolatry (worship of one God among others) to explicit monotheism (denial of other gods' existence), fully articulated by Second Isaiah in the exile.",
    crossReferences: [
      { label: "Shema", bookId: "deuteronomy", passage: "Deut 6:4" },
      { label: "'I am God, there is no other'", bookId: "isaiah", passage: "Isa 45:5–7" },
    ],
    seeAlso: ["aniconism", "covenant"],
  },
  {
    id: "torah",
    term: "Torah",
    category: "Theology & concepts",
    definition:
      "Hebrew for 'instruction' or 'teaching.' Refers narrowly to the first five books of the Bible (the Pentateuch) and broadly to divine instruction in general. Central to Jewish identity and to Second Temple and rabbinic Judaism.",
    crossReferences: [
      { label: "Torah as instruction", bookId: "deuteronomy", passage: "Deut 4:44" },
      { label: "Wisdom identified with Torah", bookId: "sirach", passage: "Sir 24" },
    ],
    seeAlso: ["pentateuch", "covenant", "law"],
  },
  {
    id: "pentateuch",
    term: "Pentateuch",
    category: "Theology & concepts",
    definition:
      "Greek for 'five scrolls.' The first five books of the Bible — Genesis, Exodus, Leviticus, Numbers, Deuteronomy — corresponding to the Hebrew Torah.",
    crossReferences: [
      { label: "First book", bookId: "genesis" },
      { label: "Last book", bookId: "deuteronomy" },
    ],
    seeAlso: ["torah", "documentary_hypothesis"],
  },
  {
    id: "shema",
    term: "Shema",
    category: "Theology & concepts",
    definition:
      "Named for its first Hebrew word ('Hear'). Deuteronomy 6:4–5 declares 'Hear, O Israel: the LORD our God, the LORD is one.' The foundational confession of Jewish faith, echoed by Jesus (Mark 12:29–30).",
    crossReferences: [
      { label: "Shema itself", bookId: "deuteronomy", passage: "Deut 6:4–9" },
      { label: "Jesus cites the Shema", bookId: "mark", passage: "Mark 12:29–30" },
    ],
    seeAlso: ["monotheism", "covenant"],
  },
  {
    id: "hesed",
    term: "Hesed",
    category: "Ancient languages & terms",
    definition:
      "Hebrew for 'steadfast love,' 'loyalty,' or 'kindness within a covenant relationship.' A defining attribute of God in the Hebrew Bible and a virtue expected of covenant partners.",
    crossReferences: [
      { label: "God's hesed formula", bookId: "exodus", passage: "Ex 34:6–7" },
      { label: "Hesed as narrative theme", bookId: "ruth" },
      { label: "'His steadfast love endures forever'", bookId: "psalms", passage: "Ps 136" },
    ],
    seeAlso: ["covenant"],
  },
  {
    id: "kabod",
    term: "Kabod (glory)",
    category: "Ancient languages & terms",
    definition:
      "Hebrew for 'weight,' 'honor,' or 'glory.' In Priestly and Ezekelian texts, kabod names the visible manifestation of God's presence, often as fire, cloud, or radiant light.",
    crossReferences: [
      { label: "Glory fills the tabernacle", bookId: "exodus", passage: "Ex 40:34–38" },
      { label: "Ezekiel's throne vision", bookId: "ezekiel", passage: "Ezek 1" },
      { label: "Glory departs the temple", bookId: "ezekiel", passage: "Ezek 10" },
    ],
    seeAlso: ["theophany", "shekinah"],
  },
  {
    id: "shekinah",
    term: "Shekinah",
    category: "Ancient languages & terms",
    definition:
      "A post-biblical Hebrew term ('dwelling') used in later Jewish tradition for the indwelling presence of God, often associated with the tabernacle and temple. Not itself in the Hebrew Bible but useful for interpreting biblical texts about divine presence.",
    crossReferences: [
      { label: "Tabernacle: God dwells among Israel", bookId: "exodus", passage: "Ex 25:8" },
      { label: "Temple as dwelling place", bookId: "1kings", passage: "1 Kgs 8" },
    ],
    seeAlso: ["kabod", "theophany"],
  },
  {
    id: "theophany",
    term: "Theophany",
    category: "Theology & concepts",
    definition:
      "A visible or audible manifestation of God to a human being, often accompanied by fire, storm, cloud, or earthquake. Classic examples include Sinai, Ezekiel's chariot vision, and the Transfiguration.",
    crossReferences: [
      { label: "Sinai theophany", bookId: "exodus", passage: "Ex 19" },
      { label: "Whirlwind speeches", bookId: "job", passage: "Job 38–41" },
      { label: "Transfiguration", bookId: "mark", passage: "Mark 9:2–8" },
    ],
    seeAlso: ["kabod", "shekinah"],
  },
  {
    id: "messiah",
    term: "Messiah / Christ",
    category: "Theology & concepts",
    definition:
      "Hebrew mashiach and Greek christos both mean 'anointed one.' Originally referred to anointed kings, priests, or prophets. By the late Second Temple period, some Jews expected a future royal (or priestly) messianic figure. Applied by early Christians to Jesus.",
    crossReferences: [
      { label: "Davidic promise", bookId: "2samuel", passage: "2 Sam 7" },
      { label: "Cyrus as YHWH's 'anointed'", bookId: "isaiah", passage: "Isa 45:1" },
      { label: "Peter's confession", bookId: "mark", passage: "Mark 8:29" },
    ],
    seeAlso: ["kingdom_of_god", "son_of_man"],
  },
  {
    id: "kingdom_of_god",
    term: "Kingdom of God / Heaven",
    category: "Theology & concepts",
    definition:
      "The dynamic reign of God, understood as both a present reality and a future consummation. Central to Jesus's preaching in the Synoptic Gospels. Matthew, out of Jewish reverence, prefers 'kingdom of heaven.'",
    crossReferences: [
      { label: "Jesus's programmatic announcement", bookId: "mark", passage: "Mark 1:14–15" },
      { label: "Kingdom parables", bookId: "matthew", passage: "Matt 13" },
    ],
    seeAlso: ["messiah", "parousia"],
  },
  {
    id: "son_of_man",
    term: "Son of Man",
    category: "Theology & concepts",
    definition:
      "In Ezekiel and Psalms, an idiom for 'human being.' In Daniel 7, a heavenly figure who receives everlasting dominion. Jesus's favored self-designation in the Gospels, drawing on both usages.",
    crossReferences: [
      { label: "Daniel's heavenly son of man", bookId: "daniel", passage: "Dan 7:13–14" },
      { label: "Jesus's self-designation", bookId: "mark", passage: "Mark 8:31; 14:62" },
    ],
    seeAlso: ["messiah", "apocalyptic"],
  },
  {
    id: "logos",
    term: "Logos",
    category: "Ancient languages & terms",
    definition:
      "Greek for 'word,' 'reason,' or 'discourse.' In Stoic and Hellenistic Jewish philosophy (Philo), a cosmic principle mediating between God and the world. John's Gospel opens by identifying the Logos with the pre-existent Christ, incarnate in Jesus.",
    crossReferences: [{ label: "'In the beginning was the Word'", bookId: "john", passage: "John 1:1–18" }],
    seeAlso: ["wisdom_personified"],
  },
  {
    id: "wisdom_personified",
    term: "Wisdom (personified)",
    category: "Theology & concepts",
    definition:
      "A poetic figure — Hebrew Hokmah, Greek Sophia — depicted as a woman who was present with God at creation and who calls out to humans. Central to Proverbs 8, Sirach 24, and Wisdom of Solomon 7. Influences early Christian Christology.",
    crossReferences: [
      { label: "Wisdom at creation", bookId: "proverbs", passage: "Prov 8:22–31" },
      { label: "Wisdom identified with Torah", bookId: "sirach", passage: "Sir 24" },
      { label: "Wisdom as pure emanation of God", bookId: "wisdom", passage: "Wis 7:22–8:1" },
    ],
    seeAlso: ["logos"],
  },
  {
    id: "parousia",
    term: "Parousia",
    category: "Theology & concepts",
    definition:
      "Greek for 'presence' or 'arrival,' often referring to the visit of a king. In the New Testament, the anticipated return ('second coming') of Christ.",
    crossReferences: [
      { label: "Christ's coming with the dead in Christ", bookId: "1thessalonians", passage: "1 Thess 4:13–18" },
      { label: "Scoffers at the delay of the parousia", bookId: "2peter", passage: "2 Pet 3:3–13" },
    ],
    seeAlso: ["apocalyptic", "eschatology"],
  },
  {
    id: "eschatology",
    term: "Eschatology",
    category: "Theology & concepts",
    definition:
      "From Greek eschaton, 'last thing.' The study of biblical teaching about the end — the Day of the LORD, resurrection, final judgment, and the new creation.",
    crossReferences: [
      { label: "Day of the LORD", bookId: "amos", passage: "Amos 5:18–20" },
      { label: "Resurrection", bookId: "daniel", passage: "Dan 12:1–3" },
      { label: "New heavens and new earth", bookId: "revelation", passage: "Rev 21–22" },
    ],
    seeAlso: ["apocalyptic", "parousia"],
  },

  // ================= GENRE & FORM =================
  {
    id: "apocalyptic",
    term: "Apocalyptic literature",
    category: "Genre & form",
    definition:
      "A genre of visionary, symbolic literature (c. 250 BCE–100 CE) that unveils heavenly realities and coming divine intervention, typically in coded form, often written pseudonymously and in times of political crisis. Daniel and Revelation are the canonical exemplars.",
    crossReferences: [
      { label: "Beasts and Son of Man", bookId: "daniel", passage: "Dan 7" },
      { label: "Beast and Lamb", bookId: "revelation", passage: "Rev 13; 5" },
    ],
    seeAlso: ["eschatology", "pseudonymity", "pseudepigrapha"],
  },
  {
    id: "prophecy",
    term: "Prophecy",
    category: "Genre & form",
    definition:
      "Speech and writing understood to convey God's word through a chosen human mediator. Biblical prophecy is less about prediction than about calling covenant partners back to fidelity, denouncing injustice, and interpreting historical crises theologically.",
    crossReferences: [
      { label: "Prophetic call", bookId: "isaiah", passage: "Isa 6" },
      { label: "Justice as prophetic norm", bookId: "amos", passage: "Amos 5:24" },
    ],
    seeAlso: ["apocalyptic"],
  },
  {
    id: "wisdom_literature",
    term: "Wisdom literature",
    category: "Genre & form",
    definition:
      "A category of biblical literature concerned with practical, ethical, and existential reflection rather than covenant history or prophecy. Includes Proverbs, Job, Ecclesiastes, and, in the Apocrypha, Sirach and Wisdom of Solomon.",
    crossReferences: [
      { label: "Practical proverbs", bookId: "proverbs" },
      { label: "Skeptical wisdom", bookId: "ecclesiastes" },
      { label: "Wisdom challenged by suffering", bookId: "job" },
    ],
    seeAlso: ["wisdom_personified"],
  },
  {
    id: "psalm_types",
    term: "Psalm types (Gattungen)",
    category: "Genre & form",
    definition:
      "Form-critical categories for psalms, chiefly hymns of praise, individual and communal laments, thanksgivings, royal psalms, wisdom psalms, and pilgrimage songs. NOAB's Psalms introduction uses this typology throughout.",
    crossReferences: [
      { label: "Hymn (Ps 8, 104, 150)", bookId: "psalms" },
      { label: "Lament (Ps 22, 88)", bookId: "psalms" },
    ],
    seeAlso: ["form_criticism"],
  },
  {
    id: "parable",
    term: "Parable",
    category: "Genre & form",
    definition:
      "A short narrative or comparison using everyday imagery to open up a theological point, often with a surprising twist. Central to Jesus's teaching in the Synoptic Gospels; also present in the Hebrew Bible (e.g., Nathan's parable to David).",
    crossReferences: [
      { label: "Nathan's parable", bookId: "2samuel", passage: "2 Sam 12" },
      { label: "Parables collection", bookId: "matthew", passage: "Matt 13" },
      { label: "Prodigal son", bookId: "luke", passage: "Luke 15" },
    ],
  },
  {
    id: "epistle",
    term: "Epistle / Letter",
    category: "Genre & form",
    definition:
      "A formal letter following Greco-Roman conventions (opening, thanksgiving, body, closing). Paul's letters adapt this form to communal instruction. Some New Testament 'letters' (Hebrews, 1 John) are more like sermons in letter form.",
    crossReferences: [
      { label: "Paul's letter format", bookId: "romans" },
      { label: "Sermon in letter form", bookId: "hebrews" },
    ],
  },
  {
    id: "gospel",
    term: "Gospel (genre)",
    category: "Genre & form",
    definition:
      "From Greek euangelion, 'good news.' Both a message (the announcement of God's saving act in Christ) and a literary genre — the narrative accounts of Jesus's life, death, and resurrection produced by early Christian communities.",
    crossReferences: [
      { label: "Mark opens with 'the beginning of the gospel'", bookId: "mark", passage: "Mark 1:1" },
      { label: "Paul on the gospel he received", bookId: "1corinthians", passage: "1 Cor 15:1–8" },
    ],
    seeAlso: ["synoptic_problem"],
  },

  // ================= ANCIENT LANGUAGES / TERMS =================
  {
    id: "torah_law",
    term: "Law (Greek nomos)",
    category: "Ancient languages & terms",
    definition:
      "Greek nomos translates Hebrew torah in the Septuagint. In Paul's letters, nomos often refers specifically to the Mosaic Law — including its ritual boundary markers (circumcision, food laws, Sabbath) as well as its ethical content.",
    crossReferences: [
      { label: "'Works of the law'", bookId: "galatians", passage: "Gal 2:16" },
      { label: "'The law is holy'", bookId: "romans", passage: "Rom 7:12" },
    ],
    seeAlso: ["torah"],
  },
  {
    id: "yhwh",
    term: "YHWH (Tetragrammaton)",
    category: "Ancient languages & terms",
    definition:
      "The four-letter personal name of the God of Israel, disclosed in Exodus 3. In Jewish practice, the name is not pronounced; 'Adonai' (Lord) is read instead. In English Bibles including NOAB, it is typically rendered 'LORD' in small capitals.",
    crossReferences: [
      { label: "Revelation of the name", bookId: "exodus", passage: "Ex 3:13–15" },
      { label: "Second Isaiah's monotheism", bookId: "isaiah", passage: "Isa 45" },
    ],
    seeAlso: ["monotheism", "j_source"],
  },
  {
    id: "elohim",
    term: "Elohim",
    category: "Ancient languages & terms",
    definition:
      "Hebrew plural noun ('gods' or 'god') used with singular verbs for the God of Israel. Also a general word for 'god' or 'divine being.' Its use is one clue in source criticism (see E source).",
    crossReferences: [
      { label: "Priestly creation account", bookId: "genesis", passage: "Gen 1" },
      { label: "Job's prologue", bookId: "job", passage: "Job 1" },
    ],
    seeAlso: ["yhwh", "e_source"],
  },
  {
    id: "hebel",
    term: "Hebel",
    category: "Ancient languages & terms",
    definition:
      "Hebrew for 'breath' or 'vapor.' The keyword of Ecclesiastes, traditionally translated 'vanity.' NOAB and recent scholarship prefer 'vapor' or 'fleeting' to capture the transience Qohelet observes.",
    crossReferences: [{ label: "'All is hebel'", bookId: "ecclesiastes", passage: "Eccl 1:2; 12:8" }],
  },
  {
    id: "sitz_im_leben",
    term: "Sitz im Leben",
    category: "Historical & literary criticism",
    definition:
      "German for 'setting in life.' In form criticism, the original social, cultic, or institutional context in which a genre of biblical material was used — e.g., temple liturgy for hymns, court schools for wisdom sayings.",
    crossReferences: [
      { label: "Cultic setting of psalms", bookId: "psalms" },
      { label: "Wisdom in royal court", bookId: "proverbs" },
    ],
    seeAlso: ["form_criticism"],
  },

  // ================= INTERPRETIVE METHODS =================
  {
    id: "typology",
    term: "Typology",
    category: "Interpretive methods",
    definition:
      "A mode of interpretation in which persons, events, or institutions in the Hebrew Bible ('types') are read as prefiguring later realities ('antitypes'), especially in Christ. Ancient and widespread in New Testament and patristic exegesis.",
    crossReferences: [
      { label: "Adam and Christ", bookId: "romans", passage: "Rom 5:12–21" },
      { label: "Melchizedek and Christ", bookId: "hebrews", passage: "Heb 7" },
    ],
    seeAlso: ["allegory"],
  },
  {
    id: "allegory",
    term: "Allegory",
    category: "Interpretive methods",
    definition:
      "An interpretive method that treats the literal sense of a text as a symbol for a deeper spiritual, moral, or theological meaning. Prominent in Philo, Origen, and much medieval exegesis; deployed by Paul explicitly in Galatians 4.",
    crossReferences: [
      { label: "Paul reads Sarah and Hagar allegorically", bookId: "galatians", passage: "Gal 4:21–31" },
      { label: "Song of Songs read allegorically", bookId: "songofsongs" },
    ],
    seeAlso: ["typology"],
  },
  {
    id: "midrash",
    term: "Midrash",
    category: "Interpretive methods",
    definition:
      "Jewish interpretive tradition (esp. rabbinic, c. 200 CE onward) that expounds scripture through story, legal reasoning, and creative reading. NOAB frequently cites midrashic patterns to illuminate ancient Jewish readings of biblical texts.",
    crossReferences: [
      { label: "Rabbinic expansions of Genesis", bookId: "genesis" },
      { label: "Midrashic style in Matthew's infancy narratives", bookId: "matthew" },
    ],
  },
  {
    id: "pesher",
    term: "Pesher",
    category: "Interpretive methods",
    definition:
      "Hebrew for 'interpretation.' A distinctive form of biblical interpretation practiced at Qumran, treating prophetic texts as coded predictions of the interpreter's own community and time.",
    crossReferences: [
      { label: "Habakkuk Pesher (1QpHab)", bookId: "habakkuk" },
    ],
    seeAlso: ["dead_sea_scrolls"],
  },
  {
    id: "canonical_criticism",
    term: "Canonical criticism",
    category: "Interpretive methods",
    definition:
      "An approach (associated with Brevard Childs and James Sanders) that reads biblical texts in their final canonical form and in relation to the whole canon, rather than dissecting them into hypothetical earlier sources. Complements historical-critical work.",
    crossReferences: [
      { label: "Final shape of the Psalter as five books", bookId: "psalms" },
      { label: "Torah as canonical whole", bookId: "genesis" },
    ],
    seeAlso: ["historical_critical", "redaction_criticism"],
  },
  {
    id: "law",
    term: "Law (biblical)",
    category: "Theology & concepts",
    definition:
      "Legal material within the Pentateuch, classified by scholars into: the Decalogue (Ex 20; Deut 5), the Covenant Code (Ex 21–23), the Priestly Code (much of Leviticus), the Holiness Code (Lev 17–26), and the Deuteronomic Code (Deut 12–26).",
    crossReferences: [
      { label: "Decalogue", bookId: "exodus", passage: "Ex 20" },
      { label: "Covenant Code", bookId: "exodus", passage: "Ex 21–23" },
      { label: "Deuteronomic Code", bookId: "deuteronomy", passage: "Deut 12–26" },
    ],
    seeAlso: ["torah", "torah_law", "holiness_code", "d_source"],
  },
];
