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

getFamilyData()
    .then(data => {
        //console.log(data)
        let transformed = new ObjectsToCsv(data)
        return transformed.toDisk("./familyData.csv");
    })
    .then(() => {
        console.log("Scrape Completed!");
      })
    .catch(error => {
        console.log(error)
    })
