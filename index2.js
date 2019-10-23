const request = require("request-promise");
const cheerio = require("cheerio");
const ObjectsToCsv = require("objects-to-csv");

const url = "https://pl.wiktionary.org/wiki/Indeks:Angielski_-_Rodzina";


async function getFamilyData() {
    const html = await request(url)
    //console.log(html)

    const familyMembers = cheerio('tr > td > a', html)
        .map(async (index, element) => {
        //console.log(element.children[0].data)
        const member = element.children[0].data;
        return {member}
    })
    .get()

    return Promise.all(familyMembers)
}

async function getDescription(membersWithHeaders) {
    return await Promise.all(
        membersWithHeaders.map(async member => {
            try {
                const htmlResult = await request.get(member.url);
                const $ = await cheerio.load(htmlResult);
                member.description = $('dl').text();
                return {member};
            } catch(error) {
                console.error(error);
            }
        })
    )
}

async function createCsvFile(data) {
    console.log(typeof(data))
    let csv = new ObjectsToCsv(data);
  
    // Save to file:
    await csv.toDisk("./test.csv");
  }

async function scrapeWiki() {
    const membersWithHeaders = await getFamilyData()
    const membersFullData = await getDescription(membersWithHeaders)
    console.log(typeof(membersFullData))
    await createCsvFile(membersFullData)
}

scrapeWiki()