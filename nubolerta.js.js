const https = require('https')
const log = console.log

const getTotalPages = (url, callback) => {
  https.get(url, res => {
    let data = ''

    res.on('data', chunk => data += chunk)

    res.on('end', () => {
      return callback(null, JSON.parse(data).total_pages)
    })
  }).on('error', err => {
    return callback(err, null)
  })
}

const getMovieTitlesHelper = (urls, callback) => {
  let titles = new Array()
  let counter = 1

  urls.forEach(url => {
    https.get(url, res => {
      let data = ''

      res.on('data', chunk => data += chunk)

      res.on('end', () => {
        const movies = JSON.parse(data).data

        movies.forEach(movie => titles.push(movie.Title))

        if (counter === urls.length) {
          return callback(null, titles)
        }
        counter++
      })
    }).on('error', err => {
      return callback(err, null)
    })
  })
}

const getMovieTitles = substr => {
  if (substr === '') {
    return null
  }

  const url = `https://jsonmock.hackerrank.com/api/movies/search/?Title=${substr}`
  getTotalPages(url, (err, totalPages) => {
    if (err) {
      log('Error getting total number of available pages:', err)
    } else {
      const urls = new Array()
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        urls.push(`${url}&page=${pageNumber}`)
      }
      getMovieTitlesHelper(urls, (err, titles) => {
        if (err) {
          log('Error retrieving movies titles:', err)
        } else {
          titles.sort().forEach(title => log(title))
        }
      })
    }
  })
}

getMovieTitles('spiderman')