/*!
* Start Bootstrap - Freelancer v7.0.4 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
//

async function get_clip() {
  var elID = event.target.id;
  target_el = elID.replace('-button','')
  var RSS_URL = document.getElementById(target_el).value;

  console.log(RSS_URL)
  var RSS_URL2 = `https://feeds.buzzsprout.com/126848.rss`;

// for a random element
//const randomElement = array[Math.floor(Math.random() * array.length)];
// then I send that link to the server to give me a clip
const episodes = [];

fetch(RSS_URL)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    console.log(data);

    //console.log(data.querySelector("channel"))
    //console.log(data.querySelector("channel").querySelector("title"))
    //console.log(data.querySelector("channel").querySelector("description"))
    const items = data.querySelector("channel").querySelectorAll("item");

    items.forEach(el => {
      //console.log(el.querySelector("title"))
      //console.log(el.querySelector("enclosure").getAttribute('url'))
      episodes.push(el.querySelector("enclosure").getAttribute('url'))
      console.log(el.querySelector("enclosure").getAttribute('url'))
      //console.log(el.querySelector("podcast: transcript").url)
        }
      )
    })

    let sel = episodes[Math.floor(Math.random() * episodes.length)]
    console.log(sel)
    clip_url = await request_clip(sel)
    // then I need to pull up that clip!
  }


async function request_clip(download_url) {

  console.log(download_url)
  let clip_url = ''
  let form = new FormData();
  form.append('episode_url',download_url);

  fetch('https://harvesting.ninja/process_rss', {
      method: 'POST',
      body: form
  })
      .then(function(response) {
          return response.text()
      } )
      .catch(error => console.log(error)
      )
      .then(function (text) {
        console.log(text)
        clip_url= text.replace(/\"/g, "")
        console.log(clip_url)

      }).then(function () {
        window.open(clip_url, '_blank')
      })


  return clip_url
}

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 50,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
