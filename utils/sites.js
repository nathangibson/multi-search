export const MODES = [
  {
    "id": "art-objects",
    "name": "Art & Objects"
  },
  {
    "id": "bibliography",
    "name": "Bibliography"
  },
  {
    "id": "images",
    "name": "Images"
  },
  {
    "id": "manuscripts",
    "name": "Manuscripts"
  },
  {
    "id": "shopping",
    "name": "Shopping"
  }
];

export const DEFAULT_SITES = [
  {
    "id": "worldcat",
    "name": "WorldCat",
    "baseUrl": "https://search.worldcat.org/",
    "searchTemplate": "https://search.worldcat.org/search?q={query}",
    "enabled": true,
    "order": 0
  },
  {
    "id": "archive-org",
    "name": "Internet Archive",
    "baseUrl": "https://archive.org/",
    "searchTemplate": "https://archive.org/search.php?query={query}",
    "enabled": true,
    "order": 1
  },
  {
    "id": "google-scholar-de",
    "name": "Google Scholar (DE)",
    "baseUrl": "https://scholar.google.de/",
    "searchTemplate": "https://scholar.google.de/scholar?q={query}",
    "enabled": true,
    "order": 2
  },
  {
    "id": "google-books-de",
    "name": "Google Books (DE)",
    "baseUrl": "https://books.google.de/",
    "searchTemplate": "https://books.google.de/books?q={query}",
    "enabled": true,
    "order": 3
  },
  {
    "id": "ixtheo",
    "name": "IxTheo",
    "baseUrl": "https://ixtheo.de/",
    "searchTemplate": "https://ixtheo.de/Search/Results?lookfor={query}",
    "enabled": true,
    "order": 4
  },
  {
    "id": "nli-rambi",
    "name": "NLI Rambi",
    "baseUrl": "https://merhav.nli.org.il/primo-explore/search",
    "searchTemplate": "https://merhav.nli.org.il/primo-explore/search?query=any,contains,{query}&vid=NLI_Rambi&lang=en_US",
    "enabled": true,
    "order": 5
  }
];

export const DEFAULT_SITES_BY_MODE = {
  "manuscripts": [
    {
      "id": "qalamos",
      "name": "Qalamos",
      "baseUrl": "",
      "searchTemplate": "https://qalamos.net/servlets/solr/select?q=%2BobjectType%3A%22manuscript%22+-mymss_mssStatus%3A%22STAT0005%22+%2B%28allMeta%3A{query}+mymss_allmeta_diacr%3A{query}%29&fl=id%2CreturnId%2CobjectType%2Cscore%2Cstate&sort=objectType+asc%2Cmymss_mssInventWithOwner+asc&rows=50&version=4.5",
      "enabled": true,
      "order": 0
    },
    {
      "id": "fihrist",
      "name": "Fihrist",
      "baseUrl": "",
      "searchTemplate": "https://www.fihrist.org.uk/?q={query}",
      "enabled": true,
      "order": 1
    },
    {
      "id": "cambridge-university-digital-library",
      "name": "Cambridge University Digital Library",
      "baseUrl": "",
      "searchTemplate": "https://cudl.lib.cam.ac.uk/search?FacetCollection=&author=&keyword={query}&language=&location=&page=1&place=&shelfLocator=&subject=&title=",
      "enabled": true,
      "order": 2
    },
    {
      "id": "sinai",
      "name": "Sinai",
      "baseUrl": "",
      "searchTemplate": "https://sinaimanuscripts.library.ucla.edu/catalog?utf8=%E2%9C%93&search_field=all_fields&q={query}",
      "enabled": true,
      "order": 3
    },
    {
      "id": "vatican",
      "name": "Vatican",
      "baseUrl": "",
      "searchTemplate": "https://digi.vatlib.it/search?k_f=0&k_v={query}",
      "enabled": true,
      "order": 4
    },
    {
      "id": "gallica-bnf",
      "name": "Gallica BnF",
      "baseUrl": "",
      "searchTemplate": "https://gallica.bnf.fr/services/engine/search/sru?operation=searchRetrieve&version=1.2&query=%28gallica%20all%20%22{query}%22%29%20and%20dc.type%20all%20%22manuscrit%22&lang=en&suggest=0",
      "enabled": true,
      "order": 5
    },
    {
      "id": "kairawan",
      "name": "Kairawan",
      "baseUrl": "",
      "searchTemplate": "https://kairawan.org/search?q={query}",
      "enabled": true,
      "order": 6
    }
  ],
  "art-objects": [
    {
      "id": "europeana",
      "name": "Europeana",
      "baseUrl": "",
      "searchTemplate": "https://www.europeana.eu/en/search?page=1&view=grid&query={query}",
      "enabled": true,
      "order": 0
    },
    {
      "id": "british-museum",
      "name": "British Museum",
      "baseUrl": "",
      "searchTemplate": "https://www.britishmuseum.org/collection/search?keyword={query}",
      "enabled": true,
      "order": 1
    },
    {
      "id": "wikimedia-commons",
      "name": "Wikimedia Commons",
      "baseUrl": "",
      "searchTemplate": "https://commons.wikimedia.org/w/index.php?search={query}",
      "enabled": true,
      "order": 2
    },
    {
      "id": "metropolitan-museum",
      "name": "Metropolitan Museum",
      "baseUrl": "",
      "searchTemplate": "https://www.metmuseum.org/art/collection/search?q={query}",
      "enabled": true,
      "order": 3
    },
    {
      "id": "israel-museum",
      "name": "Israel Museum",
      "baseUrl": "",
      "searchTemplate": "https://duckduckgo.com/?t=ffab&q={query}+site%3Ahttps%3A%2F%2Fwww.imj.org.il%2Fen%2Fcollections&ia=web",
      "enabled": true,
      "order": 4
    }
  ],
  "bibliography": [
    {
      "id": "worldcat",
      "name": "WorldCat",
      "baseUrl": "https://search.worldcat.org/",
      "searchTemplate": "https://search.worldcat.org/search?q={query}",
      "enabled": true,
      "order": 0
    },
    {
      "id": "archive-org",
      "name": "Internet Archive",
      "baseUrl": "https://archive.org/",
      "searchTemplate": "https://archive.org/search.php?query={query}",
      "enabled": true,
      "order": 1
    },
    {
      "id": "google-scholar-de",
      "name": "Google Scholar (DE)",
      "baseUrl": "https://scholar.google.de/",
      "searchTemplate": "https://scholar.google.de/scholar?q={query}",
      "enabled": true,
      "order": 2
    },
    {
      "id": "google-books-de",
      "name": "Google Books (DE)",
      "baseUrl": "https://books.google.de/",
      "searchTemplate": "https://books.google.de/books?q={query}",
      "enabled": true,
      "order": 3
    },
    {
      "id": "ixtheo",
      "name": "IxTheo",
      "baseUrl": "https://ixtheo.de/",
      "searchTemplate": "https://ixtheo.de/Search/Results?lookfor={query}",
      "enabled": true,
      "order": 4
    },
    {
      "id": "nli-rambi",
      "name": "NLI Rambi",
      "baseUrl": "https://merhav.nli.org.il/primo-explore/search",
      "searchTemplate": "https://merhav.nli.org.il/primo-explore/search?query=any,contains,{query}&vid=NLI_Rambi&lang=en_US",
      "enabled": true,
      "order": 5
    }
  ],
  "images": [
    {
      "id": "google-images-creative-commons",
      "name": "Google Images Creative Commons",
      "baseUrl": "",
      "searchTemplate": "https://www.google.com/search?q={query}&sca_esv=f3003becd8d45770&udm=2&source=lnt&tbs=sur:cl&sa=X&ved=2ahUKEwjD3ZjX5t2UAxVe0QIHHffdFNMQpwV6BAgGEB0&biw=1139&bih=881&dpr=2",
      "enabled": true,
      "order": 0
    },
    {
      "id": "unsplash",
      "name": "Unsplash",
      "baseUrl": "",
      "searchTemplate": "https://unsplash.com/s/photos/{query}",
      "enabled": true,
      "order": 1
    },
    {
      "id": "pixabay",
      "name": "Pixabay",
      "baseUrl": "",
      "searchTemplate": "https://pixabay.com/images/search/{query}/",
      "enabled": true,
      "order": 2
    },
    {
      "id": "wikimedia-commons",
      "name": "Wikimedia Commons",
      "baseUrl": "",
      "searchTemplate": "https://commons.wikimedia.org/w/index.php?search={query}",
      "enabled": true,
      "order": 3
    },
    {
      "id": "flickr-creative-commons",
      "name": "Flickr Creative Commons",
      "baseUrl": "",
      "searchTemplate": "https://www.flickr.com/search/?text={query}&license=1%2C2%2C3%2C4%2C5%2C6%2C9%2C11%2C12%2C13%2C14%2C15%2C16",
      "enabled": true,
      "order": 4
    },
    {
      "id": "duckduckgo-creative-commons",
      "name": "DuckDuckGo Creative Commons",
      "baseUrl": "",
      "searchTemplate": "https://duckduckgo.com/?q={query}&ia=images&iax=images&iaf=license%3AAny",
      "enabled": true,
      "order": 5
    },
    {
      "id": "openverse",
      "name": "Openverse",
      "baseUrl": "",
      "searchTemplate": "https://openverse.org/search/?q={query}&license_type=commercial,modification",
      "enabled": true,
      "order": 6
    },
    {
      "id": "open-clip-art",
      "name": "Open Clip Art",
      "baseUrl": "",
      "searchTemplate": "https://openclipart.org/search/?query={query}",
      "enabled": true,
      "order": 7
    },
    {
      "id": "clker",
      "name": "Clker",
      "baseUrl": "",
      "searchTemplate": "http://www.clker.com/search/{query}/1",
      "enabled": true,
      "order": 8
    }
  ],
  "shopping": [
    {
      "id": "google-shopping",
      "name": "Google Shopping",
      "baseUrl": "",
      "searchTemplate": "https://www.google.com/search?q={query}&udm=28&source=hp&iflsig=AFdpzrgAAAAAah_A7yO3wvyYpMr09Up9hjb8imYtX_cJ",
      "enabled": true,
      "order": 0
    },
    {
      "id": "amazon-de",
      "name": "Amazon.de",
      "baseUrl": "",
      "searchTemplate": "https://www.amazon.de/s?k={query}",
      "enabled": true,
      "order": 1
    }
  ]
};

export const DEFAULT_GROUPS_BY_MODE = {
  "manuscripts": [],
  "art-objects": [],
  "bibliography": [
    {
      "id": "digital-access",
      "name": "Digital access",
      "siteIds": [
        "archive-org",
        "google-scholar-de",
        "google-books-de"
      ]
    },
    {
      "id": "metadata",
      "name": "Metadata",
      "siteIds": [
        "worldcat",
        "google-scholar-de",
        "ixtheo",
        "nli-rambi"
      ]
    }
  ],
  "images": [
    {
      "id": "creative-commons",
      "name": "Creative Commons",
      "siteIds": [
        "google-images-creative-commons",
        "wikimedia-commons",
        "flickr-creative-commons",
        "duckduckgo-creative-commons",
        "openverse"
      ]
    },
    {
      "id": "free-license",
      "name": "Free license",
      "siteIds": [
        "unsplash",
        "pixabay",
        "open-clip-art",
        "clker"
      ]
    },
    {
      "id": "photos",
      "name": "Photos",
      "siteIds": [
        "google-images-creative-commons",
        "unsplash",
        "pixabay",
        "wikimedia-commons",
        "flickr-creative-commons",
        "duckduckgo-creative-commons",
        "openverse"
      ]
    },
    {
      "id": "clip-art",
      "name": "Clip art",
      "siteIds": [
        "open-clip-art",
        "clker"
      ]
    }
  ],
  "shopping": []
};