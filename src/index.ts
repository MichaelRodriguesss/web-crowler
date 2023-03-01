import axios from 'axios'
import { JSDOM } from 'jsdom'
import { writeFileSync } from 'fs'

interface IPageInfo {
  title: string
  url: string
}

const page = 'desenvolvedor de software em são paulo'

const url = `https://pt.wikipedia.org/w/index.php?search=${page}&title=Especial:Pesquisar&profile=advanced&fulltext=1&ns0=1`

axios.get(url)
  .then(axiosResponse => {
    const html = axiosResponse.data

    const { window } = new JSDOM(html)
    const { document } = window

    const listItems: Element[] = [...document.getElementsByClassName('mw-search-result') as any]

    const pageInfos: IPageInfo[] = listItems.map(listItem => {
      const aElement = listItem.getElementsByTagName('a')[0]

      const title = aElement.textContent

      const path = aElement.getAttribute('href')
      const url = `https://pt.wikipedia.org${path}`

      const pageInfo: IPageInfo = {
        title,
        url
      }

      return pageInfo
    })

    console.log(pageInfos)
    writeFileSync('result.json', JSON.stringify(pageInfos))
  })